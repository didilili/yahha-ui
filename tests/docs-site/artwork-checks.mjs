import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

async function focused(page, control) {
  await page.waitForFunction(
    (element) => document.activeElement === element,
    await control.elementHandle(),
  );
}

async function imageReady(page, image) {
  await image.scrollIntoViewIfNeeded();
  await page.waitForFunction((element) => element.complete, await image.elementHandle());
  assert.ok(await image.evaluate((element) => element.naturalWidth > 0), 'SVG image must decode.');
}

async function healthy(page, example, baseURL) {
  for (const image of await example.locator('img:visible').all()) {
    await imageReady(page, image);
    const source = await image.evaluate((element) => element.currentSrc || element.src);
    assert.ok(source.startsWith(baseURL), `Artwork escaped the deployment prefix: ${source}`);
  }
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    `Artwork documentation overflows at ${page.viewportSize().width}px.`,
  );
}

async function verifySVGDocument(context, asset, reducedMotion) {
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  try {
    await page.goto(asset.href);
    await page.waitForFunction(() => document.documentElement.localName === 'svg');
    const mode = await page.evaluate(() => document.documentElement.getAttribute('data-motion'));
    assert.equal(
      mode,
      asset.mode,
      'The downloadable asset must expose its advertised motion mode.',
    );
    const moving = asset.mode === 'on' && !reducedMotion;
    await page.waitForFunction(
      (expected) =>
        document.getAnimations().some((animation) => animation.playState === 'running') ===
        expected,
      moving,
    );
    if (moving) {
      const advanced = await page.evaluate(async () => {
        const animations = document.getAnimations().filter((item) => item.playState === 'running');
        const before = animations.map((item) => item.currentTime);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return animations.some((item, index) => item.currentTime > before[index]);
      });
      assert.ok(advanced, 'The motion SVG must actually advance its animation timeline.');
      if (['collection-saved', 'load-error'].includes(asset.artwork)) {
        const timings = await page.evaluate(() =>
          document.getAnimations().map((animation) => animation.effect.getTiming()),
        );
        assert.ok(timings.length > 0, 'One-shot feedback must include a real animation.');
        assert.ok(
          timings.every(
            (timing) => timing.iterations === 1 && timing.delay + timing.duration <= 1200,
          ),
          'Success and failure feedback must finish once, without a repeating loop.',
        );
        await page.waitForFunction(
          () => document.getAnimations().every((animation) => animation.playState === 'finished'),
          undefined,
          { timeout: 2000 },
        );
        assert.ok(
          await page.evaluate(() =>
            document.getAnimations().every((animation) => {
              const target = animation.effect.target;
              const style = getComputedStyle(target);
              const transform =
                style.transform === 'none' ? new DOMMatrix() : new DOMMatrix(style.transform);
              const bounds = target.getBBox();
              return (
                Number(style.opacity) === 1 &&
                transform.isIdentity &&
                bounds.width > 0 &&
                bounds.height > 0
              );
            }),
          ),
          'Finished one-shot feedback must retain the complete, settled result.',
        );
      }
    }
    assert.ok(
      await page.evaluate(() =>
        [...document.querySelectorAll('path, circle, ellipse, rect, polygon, polyline')].some(
          (shape) => {
            const bounds = shape.getBBox();
            const style = getComputedStyle(shape);
            return (
              bounds.width > 0 &&
              bounds.height > 0 &&
              style.display !== 'none' &&
              style.visibility !== 'hidden' &&
              Number(style.opacity) > 0
            );
          },
        ),
      ),
      'The static or reduced-motion frame must retain visible vector artwork.',
    );
    if (['collection-saved', 'load-error'].includes(asset.artwork)) {
      const layer =
        asset.artwork === 'collection-saved' ? '.ld-state-saved-token' : '.ld-state-loose-corner';
      assert.ok(
        await page.locator(layer).evaluate((target) => {
          const style = getComputedStyle(target);
          const transform =
            style.transform === 'none' ? new DOMMatrix() : new DOMMatrix(style.transform);
          const bounds = target.getBBox();
          return (
            Number(style.opacity) === 1 &&
            transform.isIdentity &&
            bounds.width > 0 &&
            bounds.height > 0
          );
        }),
        'The paper token or corner must remain complete in static, finished and reduced-motion frames.',
      );
    }
  } finally {
    await page.close();
  }
}

async function downloadableAssets(page, context, baseURL) {
  const downloads = await page
    .locator('#doc-content a[download]')
    .evaluateAll((links) => links.map((link) => ({ name: link.download, href: link.href })));
  // The welcome scene has dedicated native-SVG/pause tests in welcome-checks.mjs.
  const unique = [...new Map(downloads.map((asset) => [asset.name, asset])).values()].filter(
    ({ name }) => !['friends-welcome.svg', 'friends-welcome-motion.svg'].includes(name),
  );
  assert.equal(
    unique.length,
    12,
    'Both unchanged examples must have their twelve required SVG downloads.',
  );
  const assets = [];
  for (const asset of unique) {
    assert.ok(asset.href.startsWith(baseURL), 'Download URLs must support nested deployment.');
    const response = await context.request.get(asset.href);
    assert.equal(response.status(), 200, `Missing artwork download: ${asset.name}`);
    assert.match(response.headers()['content-type'], /image\/svg\+xml/);
    const markup = await response.text();
    const details = await page.evaluate((source) => {
      const document = new DOMParser().parseFromString(source, 'image/svg+xml');
      const root = document.documentElement;
      const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
      const localReferences = [...document.querySelectorAll('*')].flatMap((element) =>
        [...element.attributes]
          .filter((attribute) => attribute.localName === 'href' && attribute.value.startsWith('#'))
          .map((attribute) => attribute.value.slice(1)),
      );
      return {
        valid: root.localName === 'svg' && !document.querySelector('parsererror'),
        mode: root.getAttribute('data-motion'),
        artwork: root.getAttribute('data-artwork'),
        viewBox: root.getAttribute('viewBox'),
        uniqueIDs: new Set(ids).size === ids.length,
        localReferencesValid: localReferences.every((id) => ids.includes(id)),
        vectors: document.querySelectorAll('path, circle, ellipse, rect, polygon, polyline').length,
        rasterOrScript: !!document.querySelector('image, script, foreignObject'),
        externalReference: [...document.querySelectorAll('*')].some((element) =>
          [...element.attributes].some(
            (attribute) =>
              /^on/i.test(attribute.name) ||
              ((attribute.localName === 'href' || attribute.localName === 'src') &&
                !attribute.value.startsWith('#')),
          ),
        ),
      };
    }, markup);
    assert.ok(
      details.valid && details.vectors > 0,
      `${asset.name} must contain valid vector artwork.`,
    );
    assert.equal(
      details.rasterOrScript,
      false,
      'SVG downloads must not wrap raster images or scripts.',
    );
    assert.equal(
      details.externalReference,
      false,
      'SVG downloads must stand alone without remote resources.',
    );
    assert.ok(details.mode === 'off' || details.mode === 'on');
    assert.ok(
      details.uniqueIDs && details.localReferencesValid,
      'Standalone SVGs must resolve every local reference without duplicate IDs.',
    );
    assets.push({
      ...asset,
      mode: details.mode,
      artwork: details.artwork,
      viewBox: details.viewBox,
    });
  }
  const groups = new Map();
  for (const asset of assets) {
    if (!groups.has(asset.artwork)) groups.set(asset.artwork, []);
    groups.get(asset.artwork).push(asset.mode);
  }
  assert.deepEqual(
    [...groups.keys()].sort(),
    [
      'bookmark',
      'tea-cup',
      'page-wait',
      'empty-collection',
      'search-empty',
      'collection-saved',
      'load-error',
      'friends-lost',
    ].sort(),
    'Both batches must retain all eight kinds of artwork.',
  );
  assert.equal(assets.filter((asset) => asset.mode === 'on').length, 4);
  for (const modes of groups.values())
    if (modes.includes('on'))
      assert.ok(modes.includes('off'), 'Animated artwork needs a static file.');
  for (const kind of groups.keys()) {
    const views = new Set(
      assets.filter((asset) => asset.artwork === kind).map((asset) => asset.viewBox),
    );
    assert.equal(views.size, 1, `${kind} static and motion variants must share the same frame.`);
  }
  return assets;
}

async function stateArtworkJourney(page, baseURL) {
  const example = page.locator('#little-days-states-example .example-preview');
  await example.getByRole('region', { name: '小日常状态交互示例', exact: true }).waitFor();
  const picture = example.getByRole('region', { name: '小日常状态画面', exact: true });
  const image = picture.locator('img');
  const status = example.getByRole('status');
  const once = example.getByRole('checkbox', { name: '使用单次动效', exact: true });
  const replay = example.getByRole('button', { name: '重播当前动效', exact: true });
  const complete = example.getByRole('button', { name: '演示完成结果', exact: true });
  assert.equal(await once.isChecked(), false);
  assert.equal(await replay.isDisabled(), true);
  await picture.getByRole('heading', { name: '未找到相关手记', exact: true }).waitFor();
  assert.match(await picture.innerText(), /试试其他关键词.*清空筛选/);
  assert.match(await image.getAttribute('src'), /search-empty[^/]*\.svg/);
  await healthy(page, example, baseURL);

  await example.getByRole('radio', { name: '收藏成功', exact: true }).check();
  await picture.getByRole('heading', { name: '收藏成功', exact: true }).waitFor();
  const savedStatic = await image.getAttribute('src');
  assert.match(savedStatic, /collection-saved[^/]*\.svg/);
  assert.doesNotMatch(savedStatic, /collection-saved-motion/);
  await once.check();
  await status.getByText(/当前预览：收藏成功。/).waitFor();
  await imageReady(page, image);
  assert.match(await image.getAttribute('src'), /collection-saved-motion/);
  assert.equal(await replay.isEnabled(), true);
  const beforeReplay = await image.elementHandle();
  await replay.click();
  await focused(page, replay);
  await page.waitForFunction((before) => !before.isConnected, beforeReplay);
  await imageReady(page, image);
  assert.match(await image.getAttribute('src'), /collection-saved-motion/);

  await example.getByRole('radio', { name: '加载失败', exact: true }).check();
  await picture.getByRole('heading', { name: '加载失败', exact: true }).waitFor();
  assert.match(await picture.innerText(), /内容仍然保留.*重新尝试/s);
  assert.match(await image.getAttribute('src'), /load-error-motion/);
  const beforeRetryReplay = await image.elementHandle();
  await replay.click();
  await focused(page, replay);
  await page.waitForFunction((before) => !before.isConnected, beforeRetryReplay);
  await imageReady(page, image);
  await once.uncheck();
  assert.equal(await replay.isDisabled(), true);
  assert.doesNotMatch(await image.getAttribute('src'), /load-error-motion/);

  await example.getByRole('radio', { name: '页面未找到（404）', exact: true }).check();
  await picture.getByRole('heading', { name: '页面未找到', exact: true }).waitFor();
  assert.match(await picture.innerText(), /从首页或目录重新出发/);
  assert.match(await image.getAttribute('src'), /friends-lost[^/]*\.svg/);
  assert.equal(await image.getAttribute('width'), '480');
  assert.equal(await image.getAttribute('height'), '320');
  assert.equal(await replay.isDisabled(), true);
  await healthy(page, example, baseURL);

  await complete.click();
  await focused(page, complete);
  assert.equal(
    await example.getByRole('radio', { name: '收藏成功', exact: true }).isChecked(),
    true,
  );
  await status.getByText(/当前预览：收藏成功。/).waitFor();
  assert.equal(
    await example
      .getByRole('link', { name: '查看完整加载与恢复流程 →', exact: true })
      .getAttribute('href'),
    '#/guides/states?section=loading',
  );
  assert.equal(
    await example.getByRole('link', { name: '看看归档与搜索 →', exact: true }).getAttribute('href'),
    '#/guides/states?section=archive',
  );
  await healthy(page, example, baseURL);
}

export async function verifyArtwork(browser, baseURL) {
  let assets;
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.setDefaultTimeout(6000);
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    try {
      await page.goto(`${baseURL}#/guides/artwork`);
      const example = page.locator('#little-days-artwork-example .example-preview');
      await example.getByRole('region', { name: '小日常素材交互示例', exact: true }).waitFor();
      await healthy(page, example, baseURL);

      const bookmark = example.getByRole('button', { name: '收藏纸签', exact: true });
      assert.equal(await bookmark.getAttribute('aria-pressed'), 'false');
      await bookmark.click();
      assert.equal(await bookmark.getAttribute('aria-pressed'), 'true');
      await example.getByRole('status').getByText('这枚纸签已经收好。', { exact: true }).waitFor();
      await focused(page, bookmark);
      await bookmark.click();
      assert.equal(await bookmark.getAttribute('aria-pressed'), 'false');
      await example.getByRole('status').getByText('纸签还没有收藏。', { exact: true }).waitFor();

      const tea = example.getByRole('checkbox', { name: '播放热茶动效', exact: true });
      const teaImage = example.locator('img[src*="tea-cup"]');
      const staticTea = await teaImage.getAttribute('src');
      await tea.check();
      await page.waitForFunction(
        ({ source }) =>
          document
            .querySelector('#little-days-artwork-example img[src*="tea-cup"]')
            .getAttribute('src') !== source,
        { source: staticTea },
      );
      await imageReady(page, teaImage);
      await tea.uncheck();
      assert.equal(await teaImage.getAttribute('src'), staticTea);

      const waiting = example.getByRole('region', { name: '翻页等待演示', exact: true });
      const waitingImage = waiting.locator('img');
      const staticWaiting = await waitingImage.getAttribute('src');
      const toggle = example.getByRole('button', { name: /^(开始等待演示|结束等待)$/ });
      await toggle.click();
      assert.equal(await waiting.getAttribute('aria-busy'), 'true');
      await example.getByRole('status').getByText('等待演示进行中。', { exact: true }).waitFor();
      await focused(page, toggle);
      assert.notEqual(await waitingImage.getAttribute('src'), staticWaiting);
      await imageReady(page, waitingImage);
      await toggle.click();
      assert.equal(await waiting.getAttribute('aria-busy'), 'false');
      assert.equal(await waitingImage.getAttribute('src'), staticWaiting);
      await example
        .getByRole('status')
        .getByText('等待演示已结束，手记停在这一页。', { exact: true })
        .waitFor();
      await focused(page, toggle);
      await example.getByRole('heading', { name: '还没收进小口袋', exact: true }).waitFor();
      await healthy(page, example, baseURL);

      await stateArtworkJourney(page, baseURL);
      if (!assets) assets = await downloadableAssets(page, context, baseURL);
      assert.deepEqual(errors, [], `Artwork browser errors at ${viewport.width}px.`);
    } catch (error) {
      if (process.env.ARTWORK_ARTIFACT_DIR) {
        await mkdir(process.env.ARTWORK_ARTIFACT_DIR, { recursive: true });
        await page.screenshot({
          path: join(process.env.ARTWORK_ARTIFACT_DIR, `artwork-${viewport.width}-failure.png`),
          fullPage: true,
        });
      }
      throw new Error(`Artwork ${viewport.width}px: ${error.message}`, { cause: error });
    } finally {
      await context.close();
    }
  }

  for (const reducedMotion of [false, true]) {
    const context = await browser.newContext({
      reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
    });
    try {
      for (const asset of assets) await verifySVGDocument(context, asset, reducedMotion);
    } finally {
      await context.close();
    }
  }
  console.log(
    'Artwork passed: eight SVGs, twelve downloads, state controls and one-shot replay, focus, three viewports and real reduced-motion playback.',
  );
}
