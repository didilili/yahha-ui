import assert from 'node:assert/strict';

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
    '和朋友们，搭一间小小的网站。',
    'The default entry must show the public homepage.',
  );
  assert.equal(await page.locator('main h1').count(), 1);
  assert.doesNotMatch(await page.locator('main').innerText(), /研究|历史|撤回|候选/);
  assert.equal(await page.locator('main a[href*="design-preview"]').count(), 0);
  return heading;
}

async function verifyDeployedArtwork(page, images, baseURL) {
  assert.ok((await images.count()) > 0, 'The public site must show its friends artwork.');
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element) => element.decode());
    const source = await image.evaluate((element) => element.currentSrc);
    assert.ok(source.startsWith(baseURL), 'Artwork must resolve within the nested deployment.');
    const response = await page.request.get(source);
    assert.equal(response.ok(), true, 'The deployed artwork must be retrievable.');
    assert.match(response.headers()['content-type'] ?? '', /^image\/svg\+xml(?:;|$)/);
    assert.equal(
      await image.evaluate((element) => element.naturalWidth > 0 && element.naturalHeight > 0),
      true,
      'Artwork must decode as an image, rather than only return a successful response.',
    );
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
    const explore = page.getByRole('link', { name: '往下逛逛', exact: true });
    assert.equal(await explore.getAttribute('href'), '#/?section=home-little-site');
    await explore.click();
    await requireFocus(
      page.getByRole('heading', { name: '小小的组件，认真地使用。', exact: true }),
      'Homepage section navigation must continue at the live component sample heading.',
    );
    await requireHome(page);
    await verifyDeployedArtwork(page, page.locator('main .site-home img'), baseURL);

    const main = page.locator('main');
    const name = main.getByRole('textbox', { name: '给小站起个名字', exact: true });
    const date = main.getByText('一个适合分享的晴天', { exact: true });
    const showDate = main.getByRole('checkbox', { name: '显示手记的日期说明', exact: true });
    assert.equal(await name.inputValue(), '小小的生活记录');
    await name.fill('窗边的小小手记');
    await main.getByRole('heading', { name: '窗边的小小手记', exact: true }).waitFor();
    await name.fill('   ');
    await main.getByRole('heading', { name: '还没起名字的小站', exact: true }).waitFor();
    await name.fill('窗边的小小手记');
    assert.equal(await showDate.isChecked(), true);
    await date.waitFor();
    await showDate.uncheck();
    await date.waitFor({ state: 'hidden' });
    await main.getByRole('button', { name: '收好这篇手记', pressed: false, exact: true }).click();
    await main.getByRole('button', { name: '已经收好啦', pressed: true, exact: true }).waitFor();
    await main
      .getByRole('status')
      .getByText('手记留在了这个示例的小小收藏里。', { exact: true })
      .waitFor();
    await page.reload();
    await requireHome(page);
    assert.equal(await name.inputValue(), '小小的生活记录');
    assert.equal(await showDate.isChecked(), true, 'Refreshing must reset this local sample.');
    await date.waitFor();
    await main.getByRole('button', { name: '收好这篇手记', pressed: false, exact: true }).waitFor();

    const components = main.getByRole('link', { name: '逛逛组件小屋', exact: true });
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
    await verifyDeployedArtwork(page, page.locator('.doc-scene img.doc-scene-friends'), baseURL);
    const brand = page.locator('.docs-header .docs-brand');
    assert.equal(await brand.getAttribute('href'), '#/');
    await brand.click();
    await requireHome(page);

    // The introduction remains a real guide, separate from the public default entry.
    await page.goto(`${baseURL}#/guides/introduction`);
    await page.getByRole('heading', { level: 1, name: 'Yahha UI', exact: true }).waitFor();
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
