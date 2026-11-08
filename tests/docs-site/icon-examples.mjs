import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

export async function verifyIconExamples(page) {
  const gallery = page.locator('#icon-gallery .example-preview');
  assert.equal(await gallery.locator('svg').count(), 16);
  assert.equal(
    await gallery.getByRole('img').count(),
    0,
    'Labels already name decorative samples.',
  );
  const composition = page.locator('#icon-composition .example-preview');
  await revealExample(composition);
  const field = composition.getByRole('textbox', { name: '搜索手记', exact: true });
  const result = composition.getByRole('status');
  const clear = composition.getByRole('button', { name: '清空手记搜索', exact: true });
  assert.equal(await clear.isDisabled(), true);
  await field.fill('散步');
  await field.press('Enter');
  assert.match(await result.innerText(), /找到 2 篇手记/);
  const save = composition.getByRole('button', { name: '收藏《周末的散步记录》', exact: true });
  await save.focus();
  await save.press('Space');
  assert.equal(await save.getAttribute('aria-pressed'), 'true');
  assert.equal(await save.locator('svg path').first().getAttribute('fill'), 'currentColor');
  await save.press('Enter');
  assert.equal(await save.getAttribute('aria-pressed'), 'false');
  await field.fill('没有这篇手记');
  await composition.getByRole('button', { name: '搜索', exact: true }).click();
  assert.match(await result.innerText(), /没有匹配的手记/);
  await clear.click();
  assert.match(await result.innerText(), /找到 3 篇手记/);
  assert.equal(await field.inputValue(), '');
  assert.equal(await field.evaluate((node) => document.activeElement === node), true);

  const custom = page.locator('#icon-custom .example-preview svg');
  assert.equal(await custom.first().getAttribute('viewBox'), '0 0 16 16');
  assert.equal((await custom.first().boundingBox()).width, 24);
  assert.equal((await custom.nth(1).boundingBox()).width, 32);
  const names = page.locator('#icon-accessibility .example-preview');
  assert.equal(await names.getByRole('img', { name: '阅读提示', exact: true }).count(), 1);
  assert.equal(await names.getByRole('img', { name: '已同步', exact: true }).count(), 1);
  assert.equal(await names.getByRole('img').count(), 2);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
}
