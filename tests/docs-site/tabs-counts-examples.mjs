import assert from 'node:assert/strict';
import { openInteractionExample, revealExample } from './reveal-example.mjs';

/** Badge counts describe the actual lists and do not replace tab selection or names. */
export async function verifyTabsCounts(
  page,
  scopeOrBaseURL = page.locator('#counts .example-preview'),
) {
  if (typeof scopeOrBaseURL === 'string') {
    await page.goto(`${scopeOrBaseURL}#/components/tabs`);
    await verifyTabsLabelCounts(page);
    await openInteractionExample(page, 'counts');
  }
  const scope =
    typeof scopeOrBaseURL === 'string' ? page.locator('#counts .example-preview') : scopeOrBaseURL;
  await revealExample(scope);
  const pending = scope.getByRole('tab', { name: /^待整理\s*3$/, exact: true });
  const archived = scope.getByRole('tab', { name: /^已归档\s*0$/, exact: true });
  await pending.waitFor();
  assert.equal(await pending.getAttribute('aria-selected'), 'true');
  await pending.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await archived.evaluate((node) => node === document.activeElement), true);
  assert.equal(await archived.getAttribute('aria-selected'), 'false');
  await page.keyboard.press('Enter');
  await scope.getByText('还没有归档的手记。', { exact: true }).waitFor();
  await pending.click();
  const titles = ['雨天的读书笔记', '周末散步的小发现', '窗边的植物记录'];
  for (const [index, title] of titles.entries()) {
    const action = scope.getByRole('button', { name: `归档《${title}》`, exact: true });
    await action.focus();
    await action.press('Enter');
    assert.equal(await action.count(), 0);
    await scope.getByRole('tab', { name: new RegExp(`^待整理\\s*${2 - index}$`) }).waitFor();
    await scope.getByRole('tab', { name: new RegExp(`^已归档\\s*${index + 1}$`) }).waitFor();
    if (index < 2) {
      const next = scope.getByRole('button', { name: `归档《${titles[index + 1]}》`, exact: true });
      assert.equal(await next.evaluate((node) => node === document.activeElement), true);
    } else {
      const heading = scope.getByRole('heading', { name: '待整理手记', exact: true });
      assert.equal(await heading.evaluate((node) => node === document.activeElement), true);
      await scope.getByText('当前清单已整理完。', { exact: true }).waitFor();
    }
  }
  await scope.getByRole('tab', { name: /^已归档\s*3$/ }).click();
  assert.equal(await scope.getByRole('listitem').count(), 3);
  for (const title of titles)
    await scope.getByRole('listitem').filter({ hasText: title }).waitFor();
  const reset = scope.getByRole('button', { name: '恢复示例清单', exact: true });
  await reset.click();
  assert.equal(await reset.evaluate((node) => node === document.activeElement), true);
  await scope.getByRole('tab', { name: /^待整理\s*3$/ }).click();
  assert.equal(await scope.getByRole('listitem').count(), 3);
  assert.equal(await scope.getByRole('tab').locator('button,a,input').count(), 0);
  const geometry = await scope.evaluate((node) => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    client: node.clientWidth,
    scroll: node.scrollWidth,
  }));
  assert(geometry.document <= geometry.viewport + 1 && geometry.scroll <= geometry.client + 1);
  return geometry;
}

/** The component page teaches counts in labels with one reversible list change. */
export async function verifyTabsLabelCounts(
  page,
  scope = page.locator('#counts .example-preview'),
) {
  await revealExample(scope);
  const title = '雨天的读书笔记';
  await scope.getByRole('tab', { name: /^待整理\s*2$/ }).waitFor();
  await scope.getByRole('tab', { name: /^已归档\s*0$/ }).click();
  await scope.getByText('暂无手记。', { exact: true }).waitFor();
  await scope.getByRole('button', { name: `归档《${title}》`, exact: true }).click();
  await scope.getByRole('tab', { name: /^待整理\s*1$/ }).waitFor();
  await scope.getByRole('tab', { name: /^已归档\s*1$/ }).waitFor();
  assert.equal(await scope.getByRole('listitem').count(), 1);
  await scope.getByRole('listitem').getByText(title, { exact: true }).waitFor();
  await scope.getByRole('status').getByText(`已归档《${title}》。`, { exact: true }).waitFor();
  await scope.getByRole('button', { name: `恢复《${title}》`, exact: true }).click();
  await scope.getByRole('tab', { name: /^待整理\s*2$/ }).click();
  assert.equal(await scope.getByRole('listitem').count(), 2);
  assert.equal(await scope.getByRole('tab').locator('button,a,input').count(), 0);
}
