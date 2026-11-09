import assert from 'node:assert/strict';
import { closeSearchDialog, searchDialog, searchField } from './search-dialog-helpers.mjs';

async function nextPaint(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function focused(page, locator) {
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await locator.elementHandle(),
  );
}

async function visibleInViewport(locator, message) {
  assert.equal(
    await locator.evaluate((node) => {
      const box = node.getBoundingClientRect();
      const header = document.querySelector('header')?.getBoundingClientRect();
      return box.top >= (header?.bottom ?? 0) - 1 && box.bottom <= innerHeight + 1;
    }),
    true,
    message,
  );
}

export async function verifyReadingHistory(page, baseURL, section = false) {
  const suffix = section ? '?section=api' : '';
  await page.goto(`${baseURL}#/components/dialog${suffix}`);
  await page.getByRole('heading', { level: 1, name: 'Dialog 弹窗', exact: true }).waitFor();
  if (section) await page.waitForFunction(() => document.activeElement?.id === 'api');
  await nextPaint(page);
  const source = page.locator('.component-source').first();
  if (!section) await source.getByRole('button', { name: '展开代码', exact: true }).click();
  const related = page.locator('main a[href="#/components/toast"]');
  await related.scrollIntoViewIfNeeded();
  await nextPaint(page);
  const dialogY = await page.evaluate(() => scrollY);
  assert(dialogY > 1000, 'The reader leaves Dialog from a real reading position.');
  await related.click();
  const toastHeading = page.getByRole('heading', { level: 1, name: 'Toast 提示消息', exact: true });
  await toastHeading.waitFor();
  await focused(page, toastHeading);
  await page.waitForFunction(() => scrollY === 0);
  await page.evaluate(() => scrollTo({ top: 700, behavior: 'instant' }));
  await nextPaint(page);
  const toastY = await page.evaluate(() => scrollY);
  await page.goBack();
  await page.getByRole('heading', { level: 1, name: 'Dialog 弹窗', exact: true }).waitFor();
  await nextPaint(page);
  await page.waitForFunction((expected) => Math.abs(scrollY - expected) <= 4, dialogY);
  await nextPaint(page);
  assert(
    Math.abs((await page.evaluate(() => scrollY)) - dialogY) <= 4,
    'Back restores the settled reading position.',
  );
  assert.equal(new URL(page.url()).hash, `#/components/dialog${suffix}`);
  if (!section) {
    await source.getByRole('button', { name: '收起代码', exact: true }).waitFor();
    assert.equal(
      await source.locator('pre').isVisible(),
      true,
      'Back preserves the open code the reader was comparing.',
    );
  }
  await page.goForward();
  await toastHeading.waitFor();
  await nextPaint(page);
  await page.waitForFunction((expected) => Math.abs(scrollY - expected) <= 4, toastY);
  await nextPaint(page);
  assert(
    Math.abs((await page.evaluate(() => scrollY)) - toastY) <= 4,
    'Forward restores the settled reading position.',
  );
  return { dialogY, toastY, sectionURL: !!section, backAndForward: true, newNavigationAtTop: true };
}

async function currentDirectoryEntryIsVisible(current) {
  return current.evaluate((node) => {
    let parent = node.parentElement;
    while (parent && !/(auto|scroll)/.test(getComputedStyle(parent).overflowY))
      parent = parent.parentElement;
    const item = node.getBoundingClientRect();
    const bounds = parent?.getBoundingClientRect();
    return bounds && item.top >= bounds.top - 1 && item.bottom <= bounds.bottom + 1;
  });
}

export async function verifyDesktopReadingDirectory(page, baseURL) {
  await page.goto(`${baseURL}#/components/button?section=api`);
  await page.waitForFunction(() => document.activeElement?.id === 'api');
  const toc = page.getByRole('navigation', { name: '本页内容', exact: true });
  const current = toc.locator('a[aria-current="location"]');
  await page.waitForFunction(() =>
    document
      .querySelector('.docs-toc a[aria-current="location"]')
      ?.getAttribute('href')
      ?.endsWith('section=api'),
  );
  await nextPaint(page);
  assert.equal(
    await currentDirectoryEntryIsVisible(current),
    true,
    'The current API entry is visible inside the long page directory without scrolling the body.',
  );
  await page.setViewportSize({ width: 1190, height: 900 });
  await page.reload();
  await page.waitForFunction(() => document.activeElement?.id === 'api');
  await toc.waitFor({ state: 'hidden' });
  const beforeResizeHash = new URL(page.url()).hash;
  await page.setViewportSize({ width: 1440, height: 900 });
  await toc.waitFor();
  await nextPaint(page);
  assert.equal(
    await currentDirectoryEntryIsVisible(current),
    true,
    'Returning from the narrow directory layout reveals the unchanged current API entry.',
  );
  assert.equal(new URL(page.url()).hash, beforeResizeHash, 'Resizing does not navigate.');
  assert.equal(
    await page.evaluate(() => document.activeElement?.id),
    'api',
    'Revealing the desktop directory does not steal the reader’s focus.',
  );
  const beforeTopHash = new URL(page.url()).hash;
  await page.getByRole('button', { name: '返回顶部', exact: true }).click();
  await page.waitForFunction(() => scrollY === 0);
  await page.waitForFunction(() =>
    document
      .querySelector('.docs-toc a[aria-current="location"]')
      ?.getAttribute('href')
      ?.endsWith('section=usage'),
  );
  assert.equal(
    new URL(page.url()).hash,
    beforeTopHash,
    'Scroll tracking does not rewrite the URL.',
  );
  return {
    directAPI: true,
    currentEntryVisible: true,
    resizeEntryVisible: true,
    topSectionTracked: true,
  };
}

export async function verifyMobileReadingDirectory(page, baseURL) {
  await page.goto(`${baseURL}#/components/input`);
  await page.getByRole('heading', { level: 1, name: 'Input 输入框', exact: true }).waitFor();
  await nextPaint(page);
  await page.evaluate(() => scrollTo({ top: 2400, behavior: 'instant' }));
  await nextPaint(page);
  const entry = page.locator('summary').filter({ hasText: '本页内容' });
  await visibleInViewport(entry, 'A reader can reach the page directory while reading mid-page.');
  const readingY = await page.evaluate(() => scrollY);
  await entry.focus();
  await entry.press('Enter');
  const directory = page.getByRole('navigation', { name: '本页内容（窄屏）', exact: true });
  await directory.waitFor();
  const api = directory.getByRole('link', { name: 'API', exact: true });
  await api.focus();
  await api.press('Enter');
  await directory.waitFor({ state: 'hidden' });
  await page.waitForFunction(() => document.activeElement?.id === 'api');
  assert.equal(new URL(page.url()).hash, '#/components/input?section=api');
  assert(
    (await page.evaluate(() => scrollY)) > readingY,
    'The API jump reaches the later section.',
  );
  await visibleInViewport(entry, 'The page directory remains available after jumping to API.');

  await entry.focus();
  await entry.press('Enter');
  await directory.waitFor();
  await page.keyboard.press('Escape');
  await directory.waitFor({ state: 'hidden' });
  await focused(page, entry);
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');

  await entry.press('Enter');
  await directory.waitFor();
  await page.keyboard.press('Control+k');
  await searchDialog(page).waitFor();
  await focused(page, searchField(page));
  assert.equal(
    await directory.isVisible(),
    false,
    'Global search closes the local directory rather than stacking an open panel beneath it.',
  );
  await closeSearchDialog(page);
  await focused(page, entry);
  await entry.press('Enter');
  await directory.waitFor();
  await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
  await directory.waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: '关闭文档目录', exact: true }).waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '打开文档目录', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  return {
    width: page.viewportSize().width,
    midPageEntry: true,
    keyboardAPI: true,
    oneDirectoryAtATime: true,
  };
}

/** Reading position, section visibility and local/global navigation should cooperate. */
export async function verifyReadingNavigation(browser, baseURL, { throwOnFailure = true } = {}) {
  const checks = [];
  for (const [name, width, run] of [
    ['history-plain', 1440, (page) => verifyReadingHistory(page, baseURL, false)],
    ['history-section', 1440, (page) => verifyReadingHistory(page, baseURL, true)],
    ['desktop-directory', 1440, (page) => verifyDesktopReadingDirectory(page, baseURL)],
    ...[390, 320].map((width) => [
      `mobile-directory-${width}`,
      width,
      (page) => verifyMobileReadingDirectory(page, baseURL),
    ]),
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 1440 ? 900 : 844 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      const result = await run(page);
      assert.deepEqual(errors, [], 'Reading navigation has no runtime error.');
      checks.push({ name, passed: true, ...result });
    } catch (error) {
      checks.push({ name, passed: false, error: error.message, runtimeErrors: errors });
    } finally {
      await context.close();
    }
  }
  if (throwOnFailure)
    assert(
      checks.every(({ passed }) => passed),
      JSON.stringify(checks, null, 2),
    );
  return checks;
}
