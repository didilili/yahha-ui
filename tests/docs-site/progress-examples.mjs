import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

export async function verifyProgressExamples(page, baseURL) {
  await page.goto(`${baseURL}#/components/progress`);
  const basic = page.locator('#progress-basic .example-preview');
  const progress = basic.getByRole('progressbar', { name: '阅读进度', exact: true });
  assert.equal(await progress.getAttribute('aria-valuenow'), '40');
  assert.equal(await progress.getByText('40%', { exact: true }).isVisible(), true);
  assert.equal(await progress.getAttribute('tabindex'), null);
  const appearances = page.locator('#progress-appearance .example-preview');
  for (const amount of ['100', '0', '25']) {
    await appearances.getByRole('radio', { name: `${amount}%`, exact: true }).check();
    for (const bar of await appearances.getByRole('progressbar').all()) {
      await bar.getByText(`${amount}%`, { exact: true }).waitFor();
      assert.equal(await bar.getAttribute('aria-valuenow'), amount);
      assert.equal(await bar.getAttribute('data-state'), amount === '100' ? 'complete' : 'loading');
    }
  }
  const unknown = page.locator('#progress-states [data-state="indeterminate"]');
  assert.equal(await unknown.getAttribute('aria-valuenow'), null);
  assert.equal(await unknown.getAttribute('aria-valuetext'), '正在计算');
  assert.equal(await unknown.getByText('正在计算', { exact: true }).isVisible(), true);
  const checklist = page.locator('#progress-checklist .example-preview');
  await revealExample(checklist);
  const count = checklist.getByRole('progressbar', { name: '阅读清单', exact: true });
  assert.equal(await count.getAttribute('aria-valuenow'), '0');
  const items = checklist.getByRole('checkbox');
  for (let index = 0; index < 3; index++) {
    const item = items.nth(index);
    await item.focus();
    await page.keyboard.press('Space');
    await count.getByText(`${index + 1} / 3 篇`, { exact: true }).waitFor();
    assert.equal(await item.isChecked(), true);
    assert.equal(await item.evaluate((node) => node === document.activeElement), true);
    assert.equal(await count.getAttribute('aria-valuenow'), String(index + 1));
    assert.equal(await count.getAttribute('aria-valuemax'), '3');
    assert.equal(await count.getAttribute('aria-valuetext'), `${index + 1} / 3 篇`);
  }
  assert.equal(await count.getAttribute('data-state'), 'complete');
  await checklist.getByRole('button', { name: '重置已读标记', exact: true }).click();
  await count.getByText('0 / 3 篇', { exact: true }).waitFor();
  assert.equal(await count.getAttribute('aria-valuenow'), '0');
  for (const item of await items.all()) assert.equal(await item.isChecked(), false);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}
