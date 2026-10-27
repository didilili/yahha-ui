import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const sceneSelector = '.friends-welcome';
const svgSelector = 'svg[data-artwork="friends-welcome"]';

async function focusIs(page, control) {
  await page.waitForFunction(
    (element) => document.activeElement === element,
    await control.elementHandle(),
  );
}

async function positionScene(page, scene) {
  await page.evaluate(
    (element) => {
      const top = element.getBoundingClientRect().top + scrollY;
      scrollTo(0, Math.max(0, top - 90));
    },
    await scene.elementHandle(),
  );
}

async function requireRunning(page, scene, expected) {
  await page.waitForFunction(
    ({ element, expected }) => {
      const svg = element.querySelector('svg[data-artwork="friends-welcome"]');
      return (
        element.dataset.running === String(expected) &&
        svg
          ?.getAnimations({ subtree: true })
          .some((animation) => animation.playState === 'running') === expected
      );
    },
    { element: await scene.elementHandle(), expected },
  );
}

async function timelines(element) {
  return element.evaluate((node) =>
    node.getAnimations({ subtree: true }).map((animation) => ({
      time: animation.currentTime,
      state: animation.playState,
      duration: animation.effect.getTiming().duration,
      iterations: animation.effect.getTiming().iterations,
    })),
  );
}

async function advancing(element) {
  return element.evaluate(async (node) => {
    const animations = node.getAnimations({ subtree: true });
    await Promise.all(animations.map((animation) => animation.ready));
    const before = animations.map((animation) => animation.currentTime);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return animations.some((animation, index) => animation.currentTime > before[index]);
  });
}

async function visibleScene(svg) {
  const details = await svg.evaluate((root) => {
    const ids = [...root.querySelectorAll('[id]')].map((node) => node.id);
    if (root.id) ids.push(root.id);
    const references = [...root.querySelectorAll('*')].flatMap((node) =>
      [...node.attributes].flatMap((attribute) => {
        if (attribute.localName === 'href') return [attribute.value];
        return [...attribute.value.matchAll(/url\(["']?(#[^)"']+)["']?\)/g)].map(
          (match) => match[1],
        );
      }),
    );
    const bounds = root.getBoundingClientRect();
    const visiblePaths = [...root.querySelectorAll('path, ellipse, circle, rect, use')].filter(
      (node) => {
        if (node.closest('defs, mask, clipPath')) return false;
        const box = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return (
          box.width > 0 &&
          box.height > 0 &&
          style.visibility !== 'hidden' &&
          style.display !== 'none'
        );
      },
    ).length;
    return {
      ids,
      references,
      bounds: { width: bounds.width, height: bounds.height },
      visiblePaths,
      hasUnsafeContent: !!root.querySelector('script, image, foreignObject'),
    };
  });
  assert.equal(
    new Set(details.ids).size,
    details.ids.length,
    'A scene instance must keep SVG IDs unique.',
  );
  assert.ok(
    details.references.every(
      (reference) => reference.startsWith('#') && details.ids.includes(reference.slice(1)),
    ),
    'The native scene must resolve all vector references within its own ID namespace.',
  );
  assert.ok(
    details.bounds.width > 0 && details.bounds.height > 0 && details.visiblePaths > 0,
    'The complete static scene must remain visible.',
  );
  assert.equal(details.hasUnsafeContent, false, 'The scene must remain native vector artwork.');
}

async function controlBounds(page, scene) {
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    'Welcome motion must not introduce horizontal page overflow.',
  );
  const controls = scene.getByRole('button');
  assert.equal(
    await controls.count(),
    2,
    'Welcome motion has a pause control and a greeting replay control.',
  );
  for (const control of await controls.all()) {
    const bounds = await control.boundingBox();
    assert.ok(
      bounds && bounds.width >= 44 && bounds.height >= 44,
      'Motion controls must preserve a 44px touch target.',
    );
    assert.ok(
      bounds.x >= -1 && bounds.x + bounds.width <= page.viewportSize().width + 1,
      'Motion controls must remain within the narrow viewport.',
    );
  }
  const picture = await scene.locator('.friends-welcome-picture').boundingBox();
  for (const control of await controls.all()) {
    const bounds = await control.boundingBox();
    assert.ok(
      picture.y + picture.height <= bounds.y + 1,
      'Scene artwork must not cover its control labels or focus targets.',
    );
  }
}

async function liveMotion(page, scene) {
  await positionScene(page, scene);
  await requireRunning(page, scene, true);
  const svg = scene.locator(svgSelector);
  await visibleScene(svg);
  await controlBounds(page, scene);

  const cloud = svg.locator('[data-part="cloud"]').first();
  const grass = svg.locator('[data-part="grass"]').first();
  assert.ok(await advancing(cloud), 'Cloud motion must advance its real animation timeline.');
  assert.ok(await advancing(grass), 'Grass motion must advance its real animation timeline.');

  const pause = scene.getByRole('button', { name: '暂停场景动效', exact: true });
  await pause.click();
  const resume = scene.getByRole('button', { name: '继续场景动效', exact: true });
  await focusIs(page, resume);
  await requireRunning(page, scene, false);
  await cloud.evaluate(async (node) => {
    await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.ready));
  });
  const before = await timelines(cloud);
  assert.ok(before.length > 0 && before.every((animation) => animation.state === 'paused'));
  const frozen = await cloud.evaluate(async (node) => {
    const animations = node.getAnimations({ subtree: true });
    const times = animations.map((animation) => animation.currentTime);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return animations.every(
      (animation, index) => Math.abs(animation.currentTime - times[index]) <= 1,
    );
  });
  assert.ok(
    frozen,
    'Pausing must freeze the current cloud frame, rather than replace it with a static image.',
  );
  await resume.click();
  await focusIs(page, pause);
  await requireRunning(page, scene, true);
  await page.waitForFunction(
    ({ node, time }) =>
      node.getAnimations({ subtree: true }).some((animation) => animation.currentTime > time + 5),
    { node: await cloud.elementHandle(), time: before[0].time },
  );

  const replay = scene.getByRole('button', { name: '再打个招呼', exact: true });
  const oldArm = await svg.locator('[data-part="wave-arm"]').elementHandle();
  const originalCloud = await cloud.elementHandle();
  const cloudTime = (await timelines(cloud))[0].time;
  await replay.click();
  await focusIs(page, replay);
  await page.waitForFunction((arm) => !arm.isConnected, oldArm);
  assert.ok(
    await originalCloud.evaluate((node) => node.isConnected),
    'Replaying the greeting must retain the existing cloud node.',
  );
  assert.ok(
    (await timelines(cloud))[0].time >= cloudTime,
    'Replaying the greeting must not restart the ambient animation timeline.',
  );
  const arm = svg.locator('[data-part="wave-arm"]');
  await page.waitForFunction(
    (node) =>
      node.getAnimations({ subtree: true }).some((animation) => animation.playState === 'running'),
    await arm.elementHandle(),
  );
  assert.ok(await advancing(arm), 'The replayed hand must actually move.');
  await page.waitForFunction(
    (node) => {
      const transform = getComputedStyle(node).transform;
      return transform !== 'none' && !new DOMMatrix(transform).isIdentity;
    },
    await arm.elementHandle(),
  );
  const armTiming = await timelines(arm);
  assert.ok(
    armTiming.length > 0 &&
      armTiming.every(
        (animation) =>
          animation.iterations === 1 && animation.duration > 0 && animation.duration <= 2200,
      ),
    'The greeting must finish once after two short waves.',
  );
  await page.waitForFunction(
    (node) =>
      node
        .getAnimations({ subtree: true })
        .every((animation) => animation.playState === 'finished'),
    await arm.elementHandle(),
    { timeout: 3000 },
  );
  await visibleScene(svg);

  // Exercise the real observer; a late guide example can leave the viewport above or below.
  await page.evaluate(
    (picture) => {
      const top = picture.getBoundingClientRect().top + scrollY;
      scrollTo(0, top >= innerHeight ? 0 : document.documentElement.scrollHeight);
    },
    await scene.locator('.friends-welcome-picture').elementHandle(),
  );
  await page.waitForFunction(
    (node) => {
      const bounds = node.getBoundingClientRect();
      return bounds.bottom <= 0 || bounds.top >= innerHeight;
    },
    await scene.locator('.friends-welcome-picture').elementHandle(),
  );
  await requireRunning(page, scene, false);
  await positionScene(page, scene);
  await requireRunning(page, scene, true);

  // Visibilitychange is simulated; scrolling above is the actual browser viewport check.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await requireRunning(page, scene, false);
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await requireRunning(page, scene, true);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(
    (node) => node.dataset.reducedMotion === 'true',
    await scene.elementHandle(),
  );
  await requireRunning(page, scene, false);
  assert.equal(
    await svg.evaluate((node) => node.getAnimations({ subtree: true }).length),
    0,
    'Changing the system preference must immediately stop SVG motion.',
  );
  await visibleScene(svg);
  assert.equal(
    await scene.getByRole('button', { name: '再打个招呼', exact: true }).isDisabled(),
    true,
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await requireRunning(page, scene, true);
}

async function checkDownloads(page, context, baseURL) {
  const assets = [];
  for (const [name, mode] of [
    ['friends-welcome.svg', 'off'],
    ['friends-welcome-motion.svg', 'on'],
  ]) {
    const link = page.locator(`a[download="${name}"]:visible`).first();
    await link.waitFor();
    const href = new URL(await link.getAttribute('href'), page.url()).href;
    assert.ok(href.startsWith(baseURL), 'Welcome SVG downloads must support a nested deployment.');
    const response = await context.request.get(href);
    assert.equal(response.status(), 200, `${name} must be downloadable.`);
    assert.match(response.headers()['content-type'], /^image\/svg\+xml(?:;|$)/);
    const markup = await response.text();
    const details = await page.evaluate((source) => {
      const document = new DOMParser().parseFromString(source, 'image/svg+xml');
      const root = document.documentElement;
      const ids = [...root.querySelectorAll('[id]')].map((node) => node.id);
      return {
        valid: root.localName === 'svg' && !root.querySelector('parsererror'),
        mode: root.getAttribute('data-motion'),
        viewBox: root.getAttribute('viewBox'),
        unsafe: !!root.querySelector('image, script, foreignObject'),
        local: [...root.querySelectorAll('[href]')].every((node) => {
          const reference = node.getAttribute('href');
          return reference.startsWith('#') && ids.includes(reference.slice(1));
        }),
        unique: new Set(ids).size === ids.length,
      };
    }, markup);
    assert.ok(
      details.valid && !details.unsafe && details.local && details.unique,
      `${name} must contain complete, self-contained vector artwork.`,
    );
    assert.equal(details.mode, mode);
    assets.push({ href, mode, viewBox: details.viewBox });
  }
  assert.equal(
    assets[0].viewBox,
    assets[1].viewBox,
    'Static and moving downloads must retain the same composition.',
  );
  for (const asset of assets) {
    const svgPage = await context.newPage();
    svgPage.setDefaultTimeout(6000);
    try {
      await svgPage.goto(asset.href);
      await svgPage.waitForFunction(() => document.documentElement.localName === 'svg');
      if (asset.mode === 'on') {
        await svgPage.waitForFunction(() =>
          document.getAnimations().some((animation) => animation.playState === 'running'),
        );
        const clock = await svgPage.evaluate(() => {
          document.documentElement.setAttribute('data-paused', 'true');
          return document.getAnimations().map((animation) => animation.currentTime);
        });
        await svgPage.waitForFunction(() =>
          document.getAnimations().every((animation) => animation.playState !== 'running'),
        );
        await svgPage.evaluate(async () => {
          await Promise.all(document.getAnimations().map((animation) => animation.ready));
        });
        const frozen = await svgPage.evaluate(async () => {
          const animations = document.getAnimations();
          const before = animations.map((animation) => animation.currentTime);
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
          return animations.every(
            (animation, index) => Math.abs(animation.currentTime - before[index]) <= 1,
          );
        });
        assert.ok(
          clock.length > 0 && frozen,
          'The downloadable SVG must support a true frame pause.',
        );
      } else {
        assert.equal(await svgPage.evaluate(() => document.getAnimations().length), 0);
      }
      await svgPage.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(
        await svgPage.evaluate(() => document.getAnimations().length),
        0,
        'The standalone SVG must honor the system motion preference.',
      );
      await visibleScene(svgPage.locator('svg'));
    } finally {
      await svgPage.close();
    }
  }
}

/** Actual frame/timeline checks for native SVG motion, its controls, and standalone downloads. */
export async function verifyWelcome(browser, baseURL) {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    page.setDefaultTimeout(6000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    try {
      await page.goto(`${baseURL}#/`);
      const scene = page.locator(`main ${sceneSelector}`);
      await scene.waitFor();
      await liveMotion(page, scene);
      if (viewport.width === 1280) {
        await page.goto(`${baseURL}#/guides/artwork?section=artwork-welcome`);
        const example = page.locator('#friends-welcome-example');
        await example.waitFor();
        await liveMotion(page, example.locator(sceneSelector));
        await checkDownloads(page, context, baseURL);
      }
      assert.deepEqual(errors, [], 'Welcome motion must not produce browser errors.');
    } catch (error) {
      if (process.env.WELCOME_ARTIFACT_DIR) {
        await mkdir(process.env.WELCOME_ARTIFACT_DIR, { recursive: true });
        await page.screenshot({
          path: join(process.env.WELCOME_ARTIFACT_DIR, `welcome-${viewport.width}-failure.png`),
          fullPage: true,
        });
      }
      throw new Error(`Welcome ${viewport.width}px: ${error.message}`, { cause: error });
    } finally {
      await context.close();
    }
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(6000);
    await page.goto(`${baseURL}#/`);
    const scene = page.locator(`main ${sceneSelector}`);
    await scene.waitFor();
    await positionScene(page, scene);
    await page.waitForFunction(
      (node) => node.dataset.reducedMotion === 'true',
      await scene.elementHandle(),
    );
    await requireRunning(page, scene, false);
    await visibleScene(scene.locator(svgSelector));
    assert.equal(
      await scene
        .locator(svgSelector)
        .evaluate((node) => node.getAnimations({ subtree: true }).length),
      0,
    );
    for (const button of await scene.getByRole('button').all())
      assert.equal(await button.isDisabled(), true);
  } finally {
    await context.close();
  }
  console.log(
    'Welcome passed: native cloud/grass timelines, finite hand wave, true pause/resume, replay focus, offscreen pause, simulated visibilitychange, reduced motion and SVG downloads.',
  );
}
