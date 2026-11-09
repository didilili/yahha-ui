import assert from 'node:assert/strict';
import { openInteractionExample } from './reveal-example.mjs';

/** Exercise the page's save/retry and native form flows without the other control suites. */
export async function verifyButtonExamples(page) {
  const states = page.locator('#button-states .example-preview');
  await states.waitFor();
  const samples = states.getByRole('button', { name: '保存草稿', exact: true });
  assert.equal(await samples.count(), 2);
  assert.equal(await samples.nth(0).isDisabled(), true);
  assert.equal(await samples.nth(1).isDisabled(), true);
  assert.equal(await samples.nth(1).getAttribute('aria-busy'), 'true');
  assert.equal(await states.locator('[role="status"],form,article').count(), 0);

  const example = page.locator('#button-async .example-preview');
  await reveal(example);
  const action = example.getByRole('button', { name: '保存草稿', exact: true });
  const before = await action.boundingBox();
  await action.focus();
  await action.press('Enter');
  assert.equal(await action.getAttribute('aria-busy'), 'true');
  assert.equal(await action.isDisabled(), true);
  const loading = await action.boundingBox();
  assert(Math.abs(before.width - loading.width) < 0.1, 'Loading keeps its width.');
  assert(Math.abs(before.height - loading.height) < 0.1, 'Loading keeps its height.');
  await page.waitForFunction((node) => !node.disabled, await action.elementHandle());
  assert.equal(await example.getByRole('status').count(), 1);
  assert.equal(await example.getByRole('status').innerText(), '模拟保存失败，请重试。');
  await action.click();
  assert.equal(await action.isDisabled(), true);
  assert.equal(await example.getByRole('status').innerText(), '正在保存…');
  await page.waitForFunction((node) => !node.disabled, await action.elementHandle());
  assert.equal(await example.getByRole('status').innerText(), '草稿已保存');
  assert.equal(await action.innerText(), '保存草稿');

  const form = page.locator('#button-form form');
  const nickname = form.getByRole('textbox', { name: '怎么称呼你', exact: true });
  await nickname.fill('小八');
  await nickname.press('Enter');
  assert.equal(await form.getByRole('status').innerText(), '你好，小八！');
  await nickname.fill('乌萨奇');
  assert.equal(await form.getByRole('status').innerText(), '尚未提交');
  await form.getByRole('button', { name: '重置', exact: true }).click();
  assert.equal(await nickname.inputValue(), '');
  assert.equal(await form.getByRole('status').innerText(), '尚未提交');
}

export async function verifyButtonDeleteDraft(page) {
  const example = await openInteractionExample(page, 'button-delete-draft');
  await reveal(example);
  const action = example.getByRole('button', { name: '删除草稿', exact: true });
  await action.focus();
  await action.press('Enter');
  const dialog = page.getByRole('dialog', { name: '删除这份草稿？', exact: true });
  const cancel = dialog.getByRole('button', { name: '取消', exact: true });
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await cancel.elementHandle(),
  );
  await page.keyboard.press('Escape');
  await page.locator('[role="dialog"]').waitFor({ state: 'detached' });
  assert.equal(
    await example.getByRole('heading', { name: '周末散步记录', exact: true }).count(),
    1,
  );
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await action.elementHandle(),
  );
  await action.click();
  await cancel.click();
  await page.locator('[role="dialog"]').waitFor({ state: 'detached' });
  await action.click();
  await dialog.getByRole('button', { name: '确认删除', exact: true }).click();
  await page.locator('[role="dialog"]').waitFor({ state: 'detached' });
  const restore = example.getByRole('button', { name: '恢复草稿', exact: true });
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await restore.elementHandle(),
  );
  assert.equal(await example.getByRole('heading', { name: '草稿已删除', exact: true }).count(), 1);
  assert.equal(await example.getByRole('status').count(), 1);
  assert.match(await example.getByRole('status').innerText(), /草稿已删除/);
  await restore.press('Space');
  assert.equal(
    await example.getByRole('heading', { name: '周末散步记录', exact: true }).count(),
    1,
  );
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await action.elementHandle(),
  );
  assert.equal(await example.getByRole('status').innerText(), '草稿已恢复。');
}

async function reveal(example) {
  const details = example.locator('xpath=ancestor::details');
  for (const item of await details.all()) {
    if ((await item.getAttribute('open')) === null) await item.locator('summary').first().click();
  }
  await example.waitFor({ state: 'visible' });
}
