import assert from 'node:assert/strict';
import { apiRowAnchor } from '../../playground/src/docs/api-anchor.ts';
import {
  closeSearchDialog,
  openSearchDialog,
  searchField,
  visibleSearchEntry,
} from './search-dialog-helpers.mjs';

/** A document search is a separate modal and never replaces the component directory. */
export async function verifySearchDialogStructure(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const report = [];
  const focused = async (locator) =>
    page.waitForFunction((node) => document.activeElement === node, await locator.elementHandle());
  try {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
      await page.goto(`${baseURL}#/components/button`);
      await page.getByRole('heading', { level: 1, name: 'Button 按钮', exact: true }).waitFor();
      const directory = page.locator('.docs-sidebar .nav-group a');
      const destinations = await directory.evaluateAll((links) =>
        links.map((link) => link.getAttribute('href')),
      );
      const entry = await visibleSearchEntry(page, page.locator('.docs-header'));
      const dialog = await openSearchDialog(page, entry);
      const input = searchField(page);
      await focused(input);
      for (const [query, href] of [
        ['Input', '#/components/input'],
        ['Modal', '#/components/dialog'],
      ]) {
        await input.fill(query);
        const first = dialog.locator('.doc-search-results > li > a').first();
        await first.waitFor();
        assert.equal(
          await first.getAttribute('href'),
          href,
          `${query}: the component alias ranks first.`,
        );
      }
      await searchField(page).fill('123');
      const empty = dialog.getByText('没有匹配的文档，试试其他关键词。', { exact: true });
      await empty.waitFor();
      assert.deepEqual(
        await directory.evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
        destinations,
        'An empty global search keeps the original navigation tree mounted and unchanged.',
      );
      assert.equal(await dialog.getByRole('button', { name: '返回目录', exact: true }).count(), 0);
      assert.equal(
        await dialog.getByRole('img').count(),
        0,
        'Empty search remains a short text result.',
      );
      await closeSearchDialog(page);
      await focused(entry);
      for (const close of ['button', 'backdrop']) {
        await openSearchDialog(page, entry);
        assert.equal(await input.inputValue(), '123', 'Closing and reopening retains the query.');
        if (close === 'button')
          await dialog.getByRole('button', { name: '关闭搜索', exact: true }).click();
        else await page.mouse.click(2, 2);
        await dialog.waitFor({ state: 'hidden' });
        await focused(entry);
      }
      if (width === 390) {
        await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
        const directoryEntry = await visibleSearchEntry(page, page.locator('.docs-sidebar'));
        await openSearchDialog(page, directoryEntry);
        assert.equal(
          await page
            .locator('.docs-sidebar')
            .evaluate((node) => node.classList.contains('is-open')),
          false,
          'The mobile directory closes before search opens.',
        );
        assert.equal(
          await page.getByRole('dialog').count(),
          1,
          'Mobile search has only one active modal.',
        );
        await closeSearchDialog(page);
        await focused(page.getByRole('button', { name: '打开文档目录', exact: true }));
        await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
        await page.keyboard.press('Control+k');
        await focused(input);
        assert.deepEqual(
          await input.evaluate((node) => [node.value, node.selectionStart, node.selectionEnd]),
          ['123', 0, 3],
          'The shortcut also selects the retained query when opened from the mobile directory.',
        );
        await closeSearchDialog(page);
      }
      await openSearchDialog(page, entry);
      await input.fill('className');
      const results = dialog.locator('.doc-search-results > li > a');
      await results.nth(1).waitFor();
      await input.focus();
      const originalHash = new URL(page.url()).hash;
      for (const key of ['ArrowDown', 'Enter']) {
        for (const flags of [{ isComposing: true }, { keyCode: 229 }]) {
          await input.dispatchEvent('keydown', { key, bubbles: true, cancelable: true, ...flags });
          await focused(input);
          assert.equal(
            new URL(page.url()).hash,
            originalHash,
            'IME confirmation does not activate a result.',
          );
          assert.equal(await dialog.isVisible(), true);
        }
      }
      await input.press('ArrowDown');
      await focused(results.first());
      await page.keyboard.press('ArrowDown');
      await focused(results.nth(1));
      await page.keyboard.press('ArrowUp');
      await focused(results.first());
      await page.keyboard.press('ArrowUp');
      await focused(input);
      const destination = await results.first().getAttribute('href');
      await input.press('Enter');
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(new URL(page.url()).hash, destination);
      const row = new URLSearchParams(destination.split('?')[1]).get('section');
      await page.waitForFunction((id) => document.activeElement?.id === id, row);
      assert.equal(await page.evaluate(() => document.activeElement?.tagName), 'TR');
      await page.goto(`${baseURL}#/`);
      await page.locator('main h1').waitFor();
      const homeEntry = await visibleSearchEntry(page, page.locator('.docs-header'));
      await openSearchDialog(page, homeEntry);
      await focused(input);
      await closeSearchDialog(page);
      await focused(homeEntry);
      report.push({
        width,
        directoryRetained: true,
        lightweightEmpty: true,
        queryRetained: true,
        closeFocus: ['Escape', 'button', 'backdrop'],
        keyboardResults: true,
        imeProtected: true,
        inputModalAliases: true,
        homepageEntry: true,
      });
    }
    return report;
  } finally {
    await context.close();
  }
}

/** Exercise modal results, including batches and IDREFs from compound API names. */
export async function verifySearch(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  try {
    await page.goto(`${baseURL}#/components/button`);
    const sidebar = page.locator('.docs-sidebar');
    const dialog = await openSearchDialog(page);
    const search = searchField(page);
    const results = dialog.locator('.doc-search-results > li > a');
    const status = dialog.locator('.doc-search-count');
    const more = dialog.getByRole('button', { name: '查看更多', exact: true });
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
    const propertyAnchor = apiRowAnchor('DialogProps', 'className / style');
    const propertyHref = `#/components/dialog?section=${encodeURIComponent(propertyAnchor)}`;
    const compound = dialog.locator(`a[href="${propertyHref}"]`);
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
      'Dialog 弹窗 · API · DialogProps · className / style',
    );
    await compound.click();
    await page.waitForFunction((id) => document.activeElement?.id === id, propertyAnchor);
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(() => document.activeElement?.tagName), 'TR');
    assert.equal(new URL(page.url()).hash, propertyHref);
    await openSearchDialog(page);
    assert.equal(await search.inputValue(), 'Dialog className');
    // Selecting the same destination must still close search and return to the precise API row.
    await compound.click();
    await dialog.waitFor({ state: 'hidden' });
    await page.waitForFunction((id) => document.activeElement?.id === id, propertyAnchor);

    // Existing chapter links retain their heading destination independently of property search.
    await page.goto(`${baseURL}#/components/dialog?section=api`);
    await page.waitForFunction(() => document.activeElement?.id === 'api');
    assert.equal(new URL(page.url()).hash, '#/components/dialog?section=api');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}#/guides/recipes`);
    await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
    await openSearchDialog(page, await visibleSearchEntry(page, sidebar));
    assert.equal(
      await page.locator('.mobile-menu').getAttribute('aria-expanded'),
      'false',
      'Opening search from the mobile directory closes the directory first.',
    );
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
    await dialog.waitFor({ state: 'hidden' });
    await page.waitForFunction((id) => document.activeElement?.id === id, propertyAnchor);
    assert.equal(await page.evaluate(() => document.activeElement?.tagName), 'TR');
    assert.equal(new URL(page.url()).hash, propertyHref);
    assert.equal(await page.locator('main').getAttribute('inert'), null);
    assert.equal(await sidebar.locator('input[type="search"]').count(), 0);
    await openSearchDialog(page);
    assert.equal(await search.inputValue(), 'Dialog className');
    await closeSearchDialog(page);
  } finally {
    await context.close();
  }
}
