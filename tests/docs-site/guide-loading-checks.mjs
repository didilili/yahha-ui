import assert from 'node:assert/strict';

export async function waitForGuideReady(page, title) {
  const heading = page.getByRole('heading', { level: 1, name: title, exact: true });
  await heading.waitFor();
  // Guide metadata renders before its module; sections also cover guides without examples.
  await page
    .locator('main > article')
    .filter({ has: heading })
    .locator('.doc-section')
    .first()
    .waitFor();
}

async function verifyPendingGuideBodies(browser, baseURL) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  let release = () => {};
  try {
    await page.goto(`${baseURL}#/`);
    await page.locator('.home-title').waitFor();
    for (const [id, title, examples] of [
      ['getting-started', '开始使用', 1],
      ['styling', '使用与定制', 0],
      ['reading', '阅读与收藏', 1],
    ]) {
      const gate = Promise.withResolvers();
      release = gate.resolve;
      const module = (url) =>
        url.pathname === `/src/docs/guides/${id}.tsx` ||
        new RegExp(`/assets/${id}-[^/]+\\.js$`).test(url.pathname);
      await page.route(module, async (route) => {
        await gate.promise;
        await route.continue();
      });
      const request = page.waitForRequest((request) => module(new URL(request.url())));
      await page.goto(`${baseURL}#/guides/${id}`);
      await request;
      let ready = false;
      const pending = waitForGuideReady(page, title).then(() => {
        ready = true;
      });
      pending.catch(() => {});
      await page.getByRole('heading', { level: 1, name: title, exact: true }).waitFor();
      await page.locator('.doc-loading').waitFor();
      // The title can settle across browser paints while the body module is still blocked.
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
      );
      assert.equal(ready, false, `${id}: a metadata title must not mark the guide body ready.`);
      release();
      await pending;
      assert.equal(await page.locator('.doc-loading').count(), 0, `${id}: loading has finished.`);
      assert.equal(
        await page.locator('.example-block').count(),
        examples,
        `${id}: loaded examples.`,
      );
      await page.unroute(module);
    }
  } finally {
    release();
    await context.close();
  }
}

/** Guides should load on demand and recover from a failed page module like component docs. */
export async function verifyGuideLoading(browser, baseURL) {
  await verifyPendingGuideBodies(browser, baseURL);
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
