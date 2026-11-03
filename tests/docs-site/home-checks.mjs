import assert from 'node:assert/strict';
import { basename, extname } from 'node:path';

async function requireFocus(locator, message) {
  await locator
    .page()
    .waitForFunction(
      (element) => document.activeElement === element,
      await locator.elementHandle(),
      { timeout: 3000 },
    );
  assert.equal(
    await locator.evaluate((element) => document.activeElement === element),
    true,
    message,
  );
}

async function requireHome(page) {
  const heading = page.locator('main .home-title');
  await heading.waitFor();
  assert.equal(
    (await heading.innerText()).replace(/\s/g, ''),
    '一起做，全宇宙最可爱的UI组件库。',
    'The default entry must show the public homepage.',
  );
  assert.equal(await page.locator('main h1').count(), 1);
  assert.doesNotMatch(await page.locator('main').innerText(), /研究|历史|撤回|候选/);
  return heading;
}

async function verifyDeployedArtwork(page, images, baseURL, requiredExtension) {
  assert.ok((await images.count()) > 0, 'The public site must show its friends artwork.');
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element) => element.decode());
    const source = await image.evaluate((element) => element.currentSrc);
    assert.ok(source.startsWith(baseURL), 'Artwork must resolve within the nested deployment.');
    const response = await page.request.get(source);
    assert.equal(response.ok(), true, 'The deployed artwork must be retrievable.');
    const extension = extname(new URL(source).pathname).toLowerCase();
    const expectedMime = { '.svg': 'image/svg+xml', '.png': 'image/png' }[extension];
    assert.ok(expectedMime, `Artwork must use a known SVG or PNG source: ${source}`);
    if (requiredExtension) assert.equal(extension, requiredExtension);
    assert.equal(
      (response.headers()['content-type'] ?? '').split(';')[0].trim(),
      expectedMime,
      'The server must return the actual image format rather than an HTML fallback.',
    );
    assert.equal(
      await image.evaluate((element) => element.naturalWidth > 0 && element.naturalHeight > 0),
      true,
      'Artwork must decode as an image, rather than only return a successful response.',
    );
  }
}

async function verifyReadingControls(page, main) {
  const tabs = main.getByRole('tablist', { name: '手记内容', exact: true });
  const body = tabs.getByRole('tab', { name: '正文', exact: true });
  const afterword = tabs.getByRole('tab', { name: '后记', exact: true });
  assert.equal(await body.getAttribute('aria-selected'), 'true');
  await body.focus();
  await page.keyboard.press('ArrowRight');
  await requireFocus(afterword, 'Arrow keys must move between the real homepage tabs.');
  await page.keyboard.press('Enter');
  await page.waitForFunction(
    (element) => element.getAttribute('aria-selected') === 'true',
    await afterword.elementHandle(),
  );
  await main.getByRole('tabpanel', { name: '后记', exact: true }).waitFor();
  await main.getByRole('tabpanel', { name: '正文', exact: true }).waitFor({ state: 'hidden' });
  assert.equal(await main.getByRole('tabpanel', { name: '正文', exact: true }).isVisible(), false);
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await main.getByRole('tabpanel', { name: '正文', exact: true }).waitFor();
  await main.getByRole('tabpanel', { name: '后记', exact: true }).waitFor({ state: 'hidden' });
  assert.equal(await main.getByRole('tabpanel').count(), 1);

  const trigger = main.getByRole('button', { name: '阅读说明', exact: true });
  await trigger.click();
  const popup = page.getByRole('dialog', { name: '示例说明', exact: true });
  await popup.waitFor();
  assert.equal(await popup.evaluate((node) => node.closest('main') === null), true);
  await page.keyboard.press('Escape');
  await popup.waitFor({ state: 'hidden' });
  await requireFocus(trigger, 'Escape must return focus to the reading explanation trigger.');
}

async function accentBackground(locator) {
  // Default presets use hex tokens; wait for the real CSS background transition to finish.
  await locator.page().waitForFunction(
    (element) => {
      const style = getComputedStyle(element);
      const hex = style.getPropertyValue('--yahha-accent').trim();
      if (!/^#[0-9a-f]{6}$/i.test(hex)) return false;
      const rgb = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
      return style.backgroundColor === `rgb(${rgb.join(', ')})`;
    },
    await locator.elementHandle(),
  );
  return locator.evaluate((element) => ({
    accent: getComputedStyle(element).getPropertyValue('--yahha-accent').trim(),
    background: getComputedStyle(element).backgroundColor,
  }));
}

async function verifyThemePreview(page, main) {
  const theme = main.locator('.home-theme');
  const choices = theme.getByRole('group', { name: '示例配色', exact: true });
  const trigger = theme.getByRole('button', { name: '查看配色说明', exact: true });
  const saved = main.getByRole('button', { name: '收藏手记', exact: true });
  const originalSaved = await saved.getAttribute('aria-pressed');
  const hero = main.locator('.home-hero');
  const heroColors = () =>
    hero.evaluate((element) => ({
      accent: getComputedStyle(element).getPropertyValue('--yahha-accent').trim(),
      color: getComputedStyle(element).color,
      background: getComputedStyle(element.querySelector('.home-primary-link')).backgroundColor,
    }));
  const originalHero = await heroColors();
  const input = theme.getByRole('textbox');
  await input.fill('palette@example.com');
  const backgrounds = new Set();
  assert.equal(await choices.getByRole('radio', { name: '粉色', exact: true }).isChecked(), true);

  for (const [value, label] of [
    ['pink', '粉色'],
    ['blue', '浅蓝'],
    ['yellow', '浅黄'],
  ]) {
    await choices.getByRole('radio', { name: label, exact: true }).check();
    await page.waitForFunction(
      ({ element, themeName }) =>
        element.closest('[data-yahha-theme]')?.getAttribute('data-yahha-theme') === themeName,
      { element: await trigger.elementHandle(), themeName: value },
    );
    await page.mouse.move(0, 0);
    const buttonColors = await accentBackground(trigger);
    backgrounds.add(buttonColors.background);
    await trigger.click();
    const popup = page.getByRole('dialog', { name: '配色说明', exact: true });
    await popup.waitFor();
    assert.equal(await popup.evaluate((node) => node.closest('.home-theme') === null), true);
    const badge = popup.locator('[data-tone="accent"]');
    assert.deepEqual(
      await accentBackground(badge),
      buttonColors,
      'The portaled badge must use the same current accent as the themed Button.',
    );
    assert.equal(
      await popup.evaluate((node) =>
        getComputedStyle(node).getPropertyValue('--yahha-accent').trim(),
      ),
      buttonColors.accent,
    );
    await page.keyboard.press('Escape');
    await popup.waitFor({ state: 'hidden' });
    await requireFocus(trigger, 'Escape must restore the themed Popover trigger.');
    assert.equal(await input.inputValue(), 'palette@example.com');
    assert.equal(await saved.getAttribute('aria-pressed'), originalSaved);
    assert.deepEqual(await heroColors(), originalHero, 'Preview colors must remain local.');
  }
  assert.equal(backgrounds.size, 3, 'All three presets must visibly change the preview accent.');
}

async function verifySceneLinks(page) {
  const scenes = page.locator('.home-scenes');
  assert.equal(await scenes.locator('.home-scene img').count(), 3);
  for (const [name, href, target, imageName] of [
    ['阅读与收藏', '#/guides/reading?section=reading-example', 'reading-example', 'reading'],
    ['归档与搜索', '#/guides/states?section=scene-blog-archive', 'scene-blog-archive', 'archive'],
    [
      '文章编辑与保存',
      '#/guides/states?section=scene-article-actions',
      'scene-article-actions',
      'editing',
    ],
  ]) {
    const link = scenes.getByRole('link', { name, exact: true });
    assert.equal(await link.getAttribute('href'), href);
    await link.locator('img').scrollIntoViewIfNeeded();
    await link.locator('img').evaluate((image) => image.decode());
    const imagePath = await link
      .locator('img')
      .evaluate((image) => new URL(image.currentSrc).pathname);
    assert.match(basename(imagePath), new RegExp(`^${imageName}(?:-[^/]+)?\\.png$`));
    await link.click();
    await page.locator(`#${target}`).waitFor();
    await page.goBack();
    await requireHome(page);
  }
}

/** Exercise the real entry, live component sample and shared mobile documentation directory. */
export async function verifyHome(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    for (const suffix of ['', '#/']) {
      await page.goto(`${baseURL}${suffix}`);
      await requireHome(page);
    }
    const explore = page.getByRole('link', { name: '查看交互示例', exact: true });
    assert.equal(await explore.getAttribute('href'), '#/?section=home-little-site');
    await explore.click();
    await requireFocus(
      page.getByRole('heading', { name: '修改标题，试试收藏', exact: true }),
      'Homepage section navigation must continue at the live component sample heading.',
    );
    await requireHome(page);
    assert.equal(
      await page.locator('main .home-hero-stage svg[role="img"]').count(),
      1,
      'The welcome scene must remain real SVG artwork.',
    );
    await verifyDeployedArtwork(page, page.locator('main .site-home img'), baseURL);

    const main = page.locator('main');
    const name = main.getByRole('textbox', { name: '手记标题', exact: true });
    const date = main.getByText('生活记录 · 示例文章', { exact: true });
    const showDate = main.getByRole('checkbox', { name: '显示副标题', exact: true });
    assert.equal(await name.inputValue(), '给晚到的朋友留块饼干');
    await name.fill('窗边的小小手记');
    await main.getByRole('heading', { name: '窗边的小小手记', exact: true }).waitFor();
    await name.fill('   ');
    await main.getByRole('heading', { name: '未命名手记', exact: true }).waitFor();
    await name.fill('窗边的小小手记');
    assert.equal(await showDate.isChecked(), true);
    await date.waitFor();
    await showDate.uncheck();
    await date.waitFor({ state: 'hidden' });
    await main.getByRole('button', { name: '收藏手记', pressed: false, exact: true }).click();
    await main.getByRole('button', { name: '收藏手记', pressed: true, exact: true }).waitFor();
    await main.getByRole('status').getByText('已在当前示例中收藏。', { exact: true }).waitFor();
    await verifyReadingControls(page, main);
    await verifyThemePreview(page, main);
    await main.getByRole('button', { name: '收藏手记', pressed: true, exact: true }).waitFor();
    await page.reload();
    await requireHome(page);
    assert.equal(await name.inputValue(), '给晚到的朋友留块饼干');
    assert.equal(await showDate.isChecked(), true, 'Refreshing must reset this local sample.');
    await date.waitFor();
    await main.getByRole('button', { name: '收藏手记', pressed: false, exact: true }).waitFor();
    assert.equal(
      await main
        .locator('.home-theme')
        .getByRole('radio', { name: '粉色', exact: true })
        .isChecked(),
      true,
      'Refreshing must reset the local theme preview.',
    );
    await verifySceneLinks(page);

    const components = main
      .locator('.home-hero-actions')
      .getByRole('link', { name: '浏览组件', exact: true });
    assert.equal(await components.getAttribute('href'), '#/components');
    assert.equal(
      await main.getByRole('link', { name: '开始使用', exact: true }).getAttribute('href'),
      '#/guides/getting-started',
    );
    await components.click();
    await page.getByRole('heading', { level: 1, name: '组件总览', exact: true }).waitFor();
    await page.locator('[data-component-id="button"]').getByRole('link').click();
    await page.getByRole('heading', { level: 1, name: 'Button 按钮', exact: true }).waitFor();
    await page.locator('#api').waitFor();
    assert.ok((await page.locator('.example-block').count()) >= 4);
    assert.ok((await page.locator('.api-table tbody tr').count()) > 0);
    await verifyDeployedArtwork(
      page,
      page.locator('.doc-scene img.doc-scene-friends'),
      baseURL,
      '.svg',
    );
    const brand = page.locator('.docs-header .docs-brand');
    assert.equal(await brand.getAttribute('href'), '#/');
    await brand.click();
    await requireHome(page);

    // The introduction remains a real guide, separate from the public default entry.
    await page.goto(`${baseURL}#/guides/introduction`);
    await page.getByRole('heading', { level: 1, name: '项目介绍', exact: true }).waitFor();
    await page.locator('#components').waitFor();

    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${baseURL}#/`);
      await requireHome(page);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `The homepage must fit a ${width}px viewport.`,
      );
      const themeTrigger = page
        .locator('.home-theme')
        .getByRole('button', { name: '查看配色说明', exact: true });
      await themeTrigger.click();
      const themePopup = page.getByRole('dialog', { name: '配色说明', exact: true });
      await themePopup.waitFor();
      const popupBox = await themePopup.boundingBox();
      assert.ok(popupBox.x >= -1 && popupBox.x + popupBox.width <= width + 1);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
      );
      await page.keyboard.press('Escape');
      await themePopup.waitFor({ state: 'hidden' });
      await requireFocus(themeTrigger, 'Mobile Popover dismissal must return to its trigger.');
      const open = page.getByRole('button', { name: '打开文档目录', exact: true });
      await open.click();
      const search = page.getByRole('searchbox', { name: '搜索文档', exact: true });
      await requireFocus(search, 'Opening the homepage directory must focus document search.');
      await page.keyboard.press('Escape');
      assert.equal(await open.getAttribute('aria-expanded'), 'false');
      await requireFocus(open, 'Escape must return focus to the homepage directory trigger.');
      await open.click();
      await requireFocus(search, 'Reopening the homepage directory must restore search access.');
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator('.docs-sidebar').waitFor({ state: 'hidden' });
      await requireFocus(
        page.locator('main .home-title'),
        'Expanding an open homepage directory to desktop must move focus out of the hidden sidebar.',
      );
      await page.setViewportSize({ width, height: 844 });
      await open.click();
      await requireFocus(search, 'The directory must reopen after returning to mobile.');
      await search.fill('Select');
      await page
        .locator('.docs-sidebar')
        .getByRole('link', { name: 'Select 下拉选择器', exact: true })
        .click();
      const selectHeading = page.getByRole('heading', {
        level: 1,
        name: 'Select 下拉选择器',
        exact: true,
      });
      await selectHeading.waitFor();
      await requireFocus(selectHeading, 'Selecting a document must continue at its real heading.');
      assert.equal(await open.getAttribute('aria-expanded'), 'false');
      await page.locator('.example-block').first().waitFor();
    }
    assert.deepEqual(errors, [], 'The production homepage must not cause runtime exceptions.');
  } finally {
    await context.close();
  }
}
