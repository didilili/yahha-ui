import assert from 'node:assert/strict';

/** Exercise the actual sidebar results, including batches and IDREFs from compound API names. */
export async function verifySearch(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  try {
    await page.goto(`${baseURL}#/components/button`);
    const sidebar = page.locator('.docs-sidebar');
    const search = sidebar.getByRole('searchbox', { name: '搜索文档', exact: true });
    const results = sidebar.locator('.doc-search-results > li > a');
    const status = sidebar.locator('.doc-search-count');
    const more = sidebar.getByRole('button', { name: '查看更多', exact: true });
    await search.fill('className');
    await page.waitForFunction(() =>
      /共 \d+ 项匹配，已显示 12 项/.test(
        document.querySelector('.doc-search-count')?.textContent ?? '',
      ),
    );
    const total = Number((await status.innerText()).match(/共 (\d+) 项匹配/)[1]);
    assert(
      total > 24,
      'A common API query must expose enough results to exercise multiple batches.',
    );
    assert.equal(await results.count(), 12);
    const firstMetadata = await results.first().getAttribute('aria-describedby');
    await more.click();
    await page.waitForFunction(
      () => document.querySelectorAll('.doc-search-results > li').length === 24,
    );
    assert.match(await status.innerText(), /已显示 24 项/);
    assert.equal(
      await results.first().getAttribute('aria-describedby'),
      firstMetadata,
      'Appending results must preserve existing metadata IDs.',
    );
    assert.equal(
      await results.nth(12).evaluate((node) => node === document.activeElement),
      true,
      'Continue reading from the first newly shown result.',
    );
    let shown = 24;
    while (shown < total) {
      await more.click();
      shown = Math.min(shown + 12, total);
      await page.waitForFunction(
        (count) => document.querySelectorAll('.doc-search-results > li').length === count,
        shown,
      );
    }
    assert.match(await status.innerText(), new RegExp(`共 ${total} 项匹配，已显示 ${total} 项`));
    assert.equal(await more.count(), 0);
    assert.equal(
      await page.evaluate(() => !!document.activeElement?.closest('.doc-search-results')),
      true,
      'The final batch must not leave focus on an unmounted button.',
    );

    await search.fill('样式');
    await page.waitForFunction(
      () => document.querySelectorAll('.doc-search-results > li').length === 12,
    );
    await search.fill('className');
    await page.waitForFunction(
      () => document.querySelectorAll('.doc-search-results > li').length === 12,
    );
    assert.match(await status.innerText(), /已显示 12 项/);

    await search.fill('Dialog className');
    const compound = sidebar.locator('a[href="#/components/dialog?section=api"]');
    await compound.waitFor();
    const references = await results.evaluateAll((links) =>
      links.map((link) => {
        const value = link.getAttribute('aria-describedby') ?? '';
        return { value, missing: value.split(/\s+/).filter((id) => !document.getElementById(id)) };
      }),
    );
    assert(references.length > 0);
    assert(
      references.every(({ value, missing }) => value && !/\s/.test(value) && missing.length === 0),
      'Every result metadata IDREF must resolve, including API names with spaces and slashes.',
    );
    assert.equal(
      await compound.getAttribute('aria-label'),
      'Dialog 弹窗 · API · className / style',
    );
    await compound.click();
    await page.waitForFunction(() => document.activeElement?.id === 'api');
    assert.match(page.url(), /components\/dialog\?section=api/);
    assert.equal(await search.inputValue(), '');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}#/guides/recipes`);
    await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
    await search.fill('Dialog className');
    await compound.waitFor();
    assert.equal(
      await compound.evaluate((link) => {
        const id = link.getAttribute('aria-describedby');
        return !!id && !/\s/.test(id) && !!document.getElementById(id);
      }),
      true,
    );
    await compound.click();
    await page.waitForFunction(() => document.activeElement?.id === 'api');
    assert.equal(await page.locator('main').getAttribute('inert'), null);
    assert.equal(await sidebar.locator('input[type="search"]').inputValue(), '');
  } finally {
    await context.close();
  }
}
