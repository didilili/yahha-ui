import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { verifyCodeExpansionEntry } from './code-expansion-checks.mjs';

const clipboardSource = (page) => page.locator('.component-source').first();
const copyButton = (page) =>
  clipboardSource(page).getByRole('button', { name: '复制代码', exact: true });
const searchDialog = (page) => page.getByRole('dialog', { name: '搜索文档', exact: true });
const searchInput = (page) =>
  searchDialog(page).getByRole('searchbox', { name: '搜索文档', exact: true });

async function openSearch(page) {
  await page.getByRole('button', { name: '搜索文档', exact: true }).first().click();
  await searchDialog(page).waitFor();
  await searchInput(page).waitFor();
}

async function deferredClipboard(page) {
  await page.evaluate(() => {
    window.usabilityCopyRequests = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () =>
          new Promise((resolve, reject) => window.usabilityCopyRequests.push({ resolve, reject })),
      },
    });
  });
}

async function finishCopy(page, index, success = false) {
  await page.evaluate(
    ({ index, success }) => {
      const request = window.usabilityCopyRequests[index];
      if (success) request.resolve();
      else request.reject(new DOMException('Denied', 'NotAllowedError'));
    },
    { index, success },
  );
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function manualCopy(page, background = false) {
  // The search dialog correctly removes the underlying example from the accessibility tree.
  const manual = background
    ? clipboardSource(page).locator('.copy-fallback textarea')
    : clipboardSource(page).getByRole('textbox', { name: '手动复制代码', exact: true });
  await manual.waitFor({ state: background ? 'attached' : 'visible' });
  assert.equal(await manual.inputValue(), await clipboardSource(page).locator('pre').innerText());
  return manual;
}

/** Targeted browser checks for clipboard focus ownership and native search-link activation. */
export async function verifyDocsUsabilityInteractions(browser, baseURL) {
  const results = [];
  async function check(name, verify) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    try {
      await page.goto(`${baseURL}#/components/input`);
      await clipboardSource(page).waitFor();
      await verify(page, context);
      results.push({ name, passed: true });
    } catch (error) {
      results.push({ name, passed: false, error: error.message });
    } finally {
      await context.close();
    }
  }

  await check('delayed copy failure preserves a reader focus change', async (page) => {
    await deferredClipboard(page);
    await copyButton(page).click();
    await openSearch(page);
    await searchInput(page).fill('Button');
    await finishCopy(page, 0);
    await manualCopy(page, true);
    assert.equal(
      await searchInput(page).evaluate((node) => document.activeElement === node),
      true,
      'A delayed clipboard failure must leave focus in the search input.',
    );
    await searchInput(page).press('Escape');
    await searchDialog(page).waitFor({ state: 'hidden' });
    await manualCopy(page);
  });

  await check(
    'copy failure still selects the fallback while the reader stays on copy',
    async (page) => {
      await deferredClipboard(page);
      for (const index of [0, 1]) {
        await copyButton(page).click();
        await finishCopy(page, index);
        const manual = await manualCopy(page);
        assert.equal(await manual.evaluate((node) => document.activeElement === node), true);
        const length = (await manual.inputValue()).length;
        assert.deepEqual(
          await manual.evaluate((node) => [node.selectionStart, node.selectionEnd]),
          [0, length],
        );
      }
    },
  );

  await check('an older rejection cannot replace the latest successful copy', async (page) => {
    await deferredClipboard(page);
    await copyButton(page).click();
    await copyButton(page).click();
    await finishCopy(page, 1, true);
    await clipboardSource(page).getByText('已复制', { exact: true }).waitFor();
    await finishCopy(page, 0);
    assert.equal(await clipboardSource(page).locator('.copy-fallback').count(), 0);
    assert.equal(await clipboardSource(page).getByText('已复制', { exact: true }).count(), 1);
  });

  await check('an older success cannot hide the latest failed-copy fallback', async (page) => {
    await deferredClipboard(page);
    await copyButton(page).click();
    await copyButton(page).click();
    await finishCopy(page, 1);
    await manualCopy(page);
    await finishCopy(page, 0, true);
    assert.equal(await clipboardSource(page).locator('.copy-fallback').count(), 1);
    assert.equal(await clipboardSource(page).getByText('已复制', { exact: true }).count(), 0);
  });

  await check('an unmounted copy request cannot reopen a revisited page', async (page) => {
    await deferredClipboard(page);
    await copyButton(page).click();
    await page.goto(`${baseURL}#/components/button`);
    await page.getByRole('heading', { level: 1, name: 'Button 按钮', exact: true }).waitFor();
    await page.goto(`${baseURL}#/components/input`);
    await clipboardSource(page).waitFor();
    await finishCopy(page, 0);
    assert.equal(await clipboardSource(page).locator('.copy-fallback').count(), 0);
    await verifyCodeExpansionEntry(page);
  });

  for (const mode of ['meta', 'middle', 'blank-target']) {
    await check(
      `${mode} search activation preserves the original search`,
      async (page, context) => {
        await openSearch(page);
        await searchInput(page).fill('Button');
        const result = searchDialog(page).locator(
          '.doc-search-results a[href="#/components/button"]',
        );
        await result.waitFor();
        if (mode === 'blank-target') await result.evaluate((node) => (node.target = '_blank'));
        const opened = context.waitForEvent('page');
        await result.click(
          mode === 'meta'
            ? { modifiers: ['ControlOrMeta'] }
            : mode === 'middle'
              ? { button: 'middle' }
              : {},
        );
        await opened;
        assert.match(page.url(), /#\/components\/input$/);
        assert.equal(await searchDialog(page).isVisible(), true);
        assert.equal(await searchInput(page).inputValue(), 'Button');
      },
    );
  }

  for (const mode of ['mouse', 'keyboard']) {
    await check(`ordinary ${mode} search activation selects the current page`, async (page) => {
      await openSearch(page);
      await searchInput(page).fill('Button');
      const result = searchDialog(page).locator(
        '.doc-search-results a[href="#/components/button"]',
      );
      await result.waitFor();
      if (mode === 'keyboard') {
        await result.focus();
        await result.press('Enter');
      } else await result.click();
      await searchDialog(page).waitFor({ state: 'hidden' });
      await page.getByRole('heading', { level: 1, name: 'Button 按钮', exact: true }).waitFor();
      await openSearch(page);
      assert.equal(await searchInput(page).inputValue(), 'Button');
    });
  }

  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = await verifyDocsUsabilityInteractions(
      browser,
      process.argv[2] ?? 'http://127.0.0.1:4175/',
    );
    console.log(JSON.stringify(results, null, 2));
    if (results.some(({ passed }) => !passed)) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}
