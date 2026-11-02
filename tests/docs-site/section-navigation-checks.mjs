import assert from 'node:assert/strict';

/** Verify the relationship between global sections, local directories and page content. */
export async function verifySectionNavigation(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const sidebar = page.locator('.docs-sidebar');
  const directory = sidebar.locator('.nav-group');
  const top = page.getByRole('navigation', { name: '快捷导航', exact: true });
  const currentTop = () => top.locator('a[aria-current="page"]');
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(`${baseURL}#/components`);
    await page.getByRole('heading', { level: 1, name: '组件总览', exact: true }).waitFor();
    assert.equal(
      await directory.locator('a[href^="#/guides/"]').count(),
      0,
      'The component directory must not expand guides from other sections.',
    );
    assert.equal(await directory.getByRole('link').first().getAttribute('href'), '#/components');
    assert.equal(await currentTop().getAttribute('href'), '#/components');

    await page.goto(`${baseURL}#/components/dialog`);
    await page.getByRole('heading', { level: 1, name: 'Dialog 弹窗', exact: true }).waitFor();
    await page.waitForFunction(() => {
      const selected = document.querySelector('.docs-sidebar .nav-group a[aria-current="page"]');
      const scroll = document.querySelector('.docs-sidebar-scroll');
      if (!selected || !scroll) return false;
      const item = selected.getBoundingClientRect(),
        panel = scroll.getBoundingClientRect();
      return item.top >= panel.top && item.bottom <= panel.bottom;
    });
    await top.getByRole('link', { name: '组合示例', exact: true }).click();
    await page.getByRole('heading', { level: 1, name: '场景总览', exact: true }).waitFor();
    assert.equal(await page.locator('.docs-toc, .mobile-doc-toc').count(), 0);
    assert.equal(await directory.locator('a[href^="#/components/"]').count(), 0);
    await directory.getByRole('link', { name: '文章编辑与保存', exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.id === 'scene-article-actions');
    await directory
      .locator('a[href="#/guides/states?section=scene-article-actions"][aria-current="page"]')
      .waitFor();
    const adjacent = page.getByRole('navigation', { name: '相邻文档', exact: true });
    assert.match(
      await adjacent.getByRole('link').last().getAttribute('href'),
      /states\?section=scene-loading$/,
    );
    await page.locator('#scene-empty').scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        document
          .querySelector('.docs-sidebar .nav-group a[aria-current="page"]')
          ?.getAttribute('href') === '#/guides/states?section=scene-empty',
    );
    assert.match(
      await adjacent.getByRole('link').first().getAttribute('href'),
      /states\?section=scene-loading$/,
    );

    const search = sidebar.getByRole('searchbox', { name: '搜索文档', exact: true });
    await search.fill('组件总览');
    const overview = sidebar.locator('.doc-search-results a[href="#/components"]');
    await overview.waitFor();
    assert.equal(
      await sidebar.locator('.doc-search-results a').first().getAttribute('href'),
      '#/components',
    );
    await overview.click();
    // A hash-link click can finish before React renders the destination and its scoped tree.
    await page.getByRole('heading', { level: 1, name: '组件总览', exact: true }).waitFor();
    await top.locator('a[href="#/components"][aria-current="page"]').waitFor();
    await directory.locator('a[href="#/components"][aria-current="page"]').waitFor();
    assert.equal(await currentTop().getAttribute('href'), '#/components');
    assert.equal(await directory.locator('a[href^="#/guides/"]').count(), 0);

    for (const [oldSection, newPage] of [
      ['reading-example', 'reading'],
      ['language', 'design-baseline'],
    ]) {
      await page.goto(`${baseURL}#/guides/styling?section=${oldSection}`);
      await page.waitForURL(`**#/guides/${newPage}?section=${oldSection}`);
      await page.waitForFunction((id) => document.activeElement?.id === id, oldSection);
      assert.equal(
        await currentTop().getAttribute('href'),
        newPage === 'reading' ? '#/guides/recipes' : '#/guides/design-baseline',
      );
    }
    await page.goto(`${baseURL}#/guides/styling?section=language`);
    await page.waitForURL('**#/guides/design-baseline?section=language');
    await page.goto(`${baseURL}#/guides/styling`);
    await page.getByRole('heading', { level: 1, name: '使用与定制', exact: true }).waitFor();
    assert.equal(await currentTop().getAttribute('href'), '#/guides/getting-started');
    assert.equal(await page.locator('.page-pagination a[href*="design-baseline"]').count(), 0);

    await page.goto(`${baseURL}#/guides/design-baseline`);
    await page.getByRole('heading', { level: 1, name: '设计规范', exact: true }).waitFor();
    const formDisclosure = page.locator('#controls').locator('..').locator('.doc-disclosure');
    assert.equal(await formDisclosure.getAttribute('open'), null);
    assert.equal(await page.locator('.docs-toc a[href$="section=design-controls"]').count(), 0);
    await page.goto(`${baseURL}#/guides/design-baseline?section=design-controls`);
    await page.waitForFunction(() => document.activeElement?.id === 'design-controls');
    assert.notEqual(await formDisclosure.getAttribute('open'), null);
    assert.ok((await page.locator('#design-controls').boundingBox()).y >= 72);
    await page.reload();
    await page.waitForFunction(() => document.activeElement?.id === 'design-controls');
    assert.notEqual(await formDisclosure.getAttribute('open'), null);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}#/guides/design-baseline?section=design-reading`);
    await page.waitForFunction(() => document.activeElement?.id === 'design-reading');
    assert.notEqual(
      await page.locator('#reading').locator('..').locator('.doc-disclosure').getAttribute('open'),
      null,
    );
    await page.goto(`${baseURL}#/components/button`);
    await page.getByRole('heading', { level: 1, name: 'Button 按钮', exact: true }).waitFor();
    await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
    const switcher = sidebar.getByRole('navigation', { name: '栏目切换', exact: true });
    await switcher.getByRole('link', { name: '设计与素材', exact: true }).click();
    await page.getByRole('heading', { level: 1, name: '设计规范', exact: true }).waitFor();
    assert.equal(
      await page
        .getByRole('button', { name: '打开文档目录', exact: true })
        .getAttribute('aria-expanded'),
      'false',
    );
    await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
    assert.equal(await directory.locator('a[href^="#/components/"]').count(), 0);
    await search.fill('initialFocus');
    const result = sidebar.locator('a[href="#/components/dialog?section=api"]');
    await result.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement?.id === 'api');
    await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
    assert.equal(
      await switcher.locator('a[aria-current="page"]').getAttribute('href'),
      '#/components',
    );
    assert.equal(await directory.locator('a[href^="#/guides/"]').count(), 0);
    assert.ok(
      (await switcher.boundingBox()).y >= 64,
      'Section switching stays visible when the component list scrolls to Dialog.',
    );
    assert.ok(
      (await search.boundingBox()).y >= 64,
      'Global search stays visible above the local scrolling directory.',
    );
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
}
