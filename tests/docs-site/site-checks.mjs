import assert from 'node:assert/strict';
import { closeSearchDialog, openSearchDialog, searchField } from './search-dialog-helpers.mjs';

export async function verifyResponsiveFocus(page, baseURL) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${baseURL}#/components/button`);
  const search = page
    .locator('.docs-sidebar')
    .getByRole('button', { name: '搜索文档', exact: true });
  await search.focus();
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole('button', { name: '打开文档目录', exact: true });
  await page.waitForFunction((node) => document.activeElement === node, await menu.elementHandle());
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await search.elementHandle(),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await menu.click();
  const closeMenu = page.getByRole('button', { name: '关闭文档目录', exact: true });
  await closeMenu.focus();
  await page.setViewportSize({ width: 961, height: 900 });
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await search.elementHandle(),
  );
  assert.equal(await closeMenu.isVisible(), false);
  assert.equal(await page.locator('.docs-sidebar').isVisible(), true);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page
    .getByRole('navigation', { name: '快捷导航', exact: true })
    .getByRole('link', { name: '开始使用', exact: true })
    .focus();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction((node) => document.activeElement === node, await menu.elementHandle());
  await page.setViewportSize({ width: 1280, height: 900 });
  const code = page.locator('.doc-heading pre');
  await code.focus();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await code.evaluate((node) => document.activeElement === node),
    true,
    'Resizing must preserve focus that is already in visible document content.',
  );
  await page.setViewportSize({ width: 1440, height: 900 });
}

export async function verifyTocResponsiveFocus(page, baseURL) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${baseURL}#/components/select`);
  await page.locator('#api').waitFor();
  const api = page
    .getByRole('navigation', { name: '本页内容', exact: true })
    .getByRole('link', { name: 'API', exact: true });
  await api.focus();
  await page.setViewportSize({ width: 1100, height: 900 });
  const current = page.locator('.docs-sidebar .nav-group a[aria-current="page"]');
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await current.elementHandle(),
  );
  await page.setViewportSize({ width: 1280, height: 900 });
  await openSearchDialog(page);
  await searchField(page).fill('Button');
  await closeSearchDialog(page);
  await api.focus();
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await current.elementHandle(),
  );
  assert.equal(
    await current.getAttribute('href'),
    '#/components/select',
    'A retained search query does not replace the selected document in the directory.',
  );
  await openSearchDialog(page);
  await searchField(page).fill('');
  await closeSearchDialog(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}#/components/button`);
  await page.locator('.example-block').first().waitFor();
}

export async function verifyRouteInteractionFocus(page, baseURL) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}#/components/select`);
  await page.locator('.example-block').first().waitFor();
  await page.goto(`${baseURL}#/components/button`);
  await page.locator('.example-block').first().waitFor();
  await page.evaluate(() => {
    const content = document.getElementById('doc-content');
    const observer = new MutationObserver(() => {
      if (!location.hash.startsWith('#/components/select')) return;
      const trigger = content.querySelector('.example-preview button[role="combobox"]');
      if (!trigger) return;
      observer.disconnect();
      trigger.focus();
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    });
    observer.observe(content, { childList: true, subtree: true });
    location.hash = '/components/select';
  });
  const listbox = page.getByRole('listbox');
  await listbox.waitFor();
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  assert.equal(
    await listbox.isVisible(),
    true,
    'A pending route-title focus must not close a selector the user has already opened.',
  );
  await page.keyboard.press('Escape');
  await listbox.waitFor({ state: 'hidden' });
  await page.goto(`${baseURL}#/components/button`);
  await page.locator('.example-block').first().waitFor();
}
