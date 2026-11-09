import assert from 'node:assert/strict';

export const searchDialog = (page) => page.getByRole('dialog', { name: '搜索文档', exact: true });

export const searchField = (page) =>
  searchDialog(page).getByRole('searchbox', { name: '搜索文档', exact: true });

export async function visibleSearchEntry(page, scope = page) {
  const entries = scope.getByRole('button', { name: '搜索文档', exact: true });
  await entries.first().waitFor({ state: 'attached' });
  for (const entry of await entries.all()) {
    if ((await entry.isVisible()) && !(await entry.evaluate((node) => !!node.closest('[inert]'))))
      return entry;
  }
  assert.fail('A visible search entry must open the dedicated 搜索文档 Dialog.');
}

export async function openSearchDialog(page, entry) {
  const dialog = searchDialog(page);
  // Exit animation leaves a visible, inert popup; only data-open can accept input.
  const activeDialog = dialog.and(page.locator('[data-open]'));
  if (!(await activeDialog.isVisible())) await (entry ?? (await visibleSearchEntry(page))).click();
  await activeDialog.waitFor();
  await searchField(page).waitFor();
  return dialog;
}

export async function closeSearchDialog(page) {
  await page.keyboard.press('Escape');
  await searchDialog(page).waitFor({ state: 'hidden' });
}
