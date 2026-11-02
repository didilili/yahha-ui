import assert from 'node:assert/strict';

/** Guides should load on demand and recover from a failed page module like component docs. */
export async function verifyGuideLoading(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const requested = [];
  page.on('request', (request) => requested.push(request.url()));
  try {
    await page.goto(`${baseURL}#/`);
    await page.locator('.home-title').waitFor();
    assert.equal(
      requested.some((url) => /\/src\/(?:docs\/guides\.tsx|examples\/ReadingExample)/.test(url)),
      false,
      'Opening the homepage must not load guide bodies and their example source.',
    );
    const module = (url) =>
      /\/(?:src\/docs\/guides\/getting-started\.tsx|assets\/getting-started-[^/]+\.js)$/.test(
        url.pathname,
      );
    await page.route(module, (route) => route.abort('failed'));
    await page.goto(`${baseURL}#/guides/getting-started`);
    const failure = page.getByRole('alert').filter({ hasText: '指南文档加载失败' });
    await failure.waitFor();
    assert.equal(await page.locator('.example-block').count(), 0);
    await page.unroute(module);
    await failure.getByRole('button', { name: '重新加载文档', exact: true }).click();
    await page.locator('#first-button').waitFor();
    await page.waitForFunction(() => document.activeElement?.classList.contains('doc-title'));
    assert.equal(await failure.count(), 0);

    const readingModule = (url) =>
      /\/(?:src\/docs\/guides\/reading\.tsx|assets\/reading-[^/]+\.js)$/.test(url.pathname);
    await page.route(readingModule, (route) => route.abort('failed'));
    await page.goto(`${baseURL}#/guides/reading?section=reading-example`);
    await failure.waitFor();
    await failure.getByRole('button', { name: '重新加载文档', exact: true }).focus();
    await page.keyboard.press('Enter');
    await failure.waitFor();
    await page.waitForFunction(
      () => document.activeElement === document.querySelector('.doc-title'),
    );
    assert.equal(await page.locator('.doc-title').isVisible(), true);
    assert.match(page.url(), /guides\/reading\?section=reading-example$/);

    await page.unroute(readingModule);
    await failure.getByRole('button', { name: '重新加载文档', exact: true }).focus();
    await page.keyboard.press('Enter');
    await page.locator('#reading-example').waitFor();
    await page.waitForFunction(() => document.activeElement?.id === 'reading-example');
    assert.equal(await failure.count(), 0);
  } finally {
    await context.close();
  }
}
