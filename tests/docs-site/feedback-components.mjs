import { verifyToastSimple } from './toast-reading-examples.mjs';
import { verifyToastTimer } from './toast-timer-examples.mjs';
import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';
import {
  measureTextButton,
  verifyTextButtonLoading,
  verifyTextButtonRestored,
} from './loading-layout.mjs';

async function choose(page, select, label) {
  await select.click();
  await page.getByRole('option', { name: label, exact: true }).click();
  await page.getByRole('listbox').waitFor({ state: 'hidden' });
}

export async function verifyFeedbackFlow(page, baseURL) {
  await page.goto(`${baseURL}#/guides/states?section=loading`);
  const scene = page.locator('#scene-loading .example-preview');
  const ready = scene.getByRole('heading', { name: '一只纸袋，一路面包香', exact: true });
  await ready.waitFor();
  const next = scene.getByRole('combobox', { name: '下次加载结果', exact: true });
  const reload = scene.getByRole('button', { name: '重新加载文章', exact: true });
  await choose(page, next, '加载失败');
  await reload.click();
  await scene.getByText('文章加载失败', { exact: true }).waitFor();
  await scene.getByRole('button', { name: '重试加载', exact: true }).click();
  await ready.waitFor();
  await page.waitForFunction(() => document.activeElement?.textContent === '一只纸袋，一路面包香');
  const save = scene.getByRole('button', { name: '收藏这篇手记', exact: true });
  await save.click();
  assert.equal(await save.getAttribute('aria-pressed'), 'true');
  await scene
    .getByRole('status')
    .filter({ hasText: '已收藏这篇手记' })
    .getByRole('button', { name: '撤销收藏', exact: true })
    .click();
  assert.equal(await save.getAttribute('aria-pressed'), 'false');
  assert.equal(await save.evaluate((node) => node === document.activeElement), true);
  await choose(page, next, '没有结果');
  await reload.click();
  await scene.getByRole('heading', { name: '这次没有找到手记', exact: true }).waitFor();
  await scene.getByRole('button', { name: '查看示例手记', exact: true }).click();
  await ready.waitFor();
  await page.waitForFunction(() => document.activeElement?.textContent === '一只纸袋，一路面包香');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}

async function focused(page, locator) {
  await page.waitForFunction(
    (node) => node === document.activeElement,
    await locator.elementHandle(),
  );
}

export async function verifyFeedbackExamples(page, baseURL) {
  await page.goto(`${baseURL}#/components/alert`);
  const alert = page.locator('#alert-action .example-preview');
  await revealExample(alert);
  const checkbox = alert.getByRole('checkbox', { name: '接收每周阅读推荐', exact: true });
  await checkbox.uncheck();
  const save = alert.getByRole('button', { name: '保存订阅偏好', exact: true });
  const before = await measureTextButton(save);
  await save.click();
  assert.equal(await save.getAttribute('aria-busy'), 'true');
  verifyTextButtonLoading(before, await measureTextButton(save));
  await alert.getByText('订阅偏好保存失败', { exact: true }).waitFor();
  assert.equal(await checkbox.isChecked(), false);
  await alert.getByRole('button', { name: '重试保存', exact: true }).click();
  await alert.getByText('订阅偏好已保存', { exact: true }).waitFor();
  const edit = alert.getByRole('button', { name: '修改偏好', exact: true });
  await focused(page, edit);
  assert.equal(await checkbox.isChecked(), false);
  // The result changes the action name; compare its original geometry once reset to idle.
  await edit.click();
  verifyTextButtonRestored(before, await measureTextButton(save));

  await page.goto(`${baseURL}#/components/empty-state`);
  const basicEmpty = page.locator('#basic .example-preview');
  const create = basicEmpty.getByRole('button', { name: '创建示例文章', exact: true });
  await create.click();
  await focused(
    page,
    basicEmpty.getByRole('heading', { name: '第一篇示例文章已创建', exact: true }),
  );
  await basicEmpty.getByRole('button', { name: '恢复初始空态', exact: true }).click();
  await focused(page, create);
  const searchExample = page.locator('#search .example-preview');
  await searchExample.getByRole('button', { name: '清空搜索', exact: true }).click();
  await focused(page, searchExample.getByRole('textbox', { name: '搜索文章', exact: true }));

  await page.goto(`${baseURL}#/components/skeleton`);
  const skeleton = page.locator('#skeleton-content .example-preview');
  await revealExample(skeleton);
  const region = skeleton.getByRole('region', { name: '文章摘要', exact: true });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const loading = await region.boundingBox();
    await skeleton.getByRole('button', { name: '显示内容', exact: true }).click();
    assert.equal(await region.getAttribute('aria-busy'), 'false');
    assert.equal(await region.getByRole('img', { name: '库米', exact: true }).isVisible(), true);
    const loaded = await region.boundingBox();
    assert.ok(
      Math.abs(loading.height - loaded.height) < 0.1,
      `Skeleton and content must reserve the same space at ${width}px.`,
    );
    await skeleton.getByRole('button', { name: '显示加载占位', exact: true }).click();
    assert.equal(await region.getAttribute('aria-busy'), 'true');
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}#/components/spinner`);
  const spinner = page.locator('#spinner-waiting .example-preview');
  await spinner.getByRole('button', { name: '显示完成状态', exact: true }).click();
  await spinner
    .getByRole('status', { name: '文章等待状态', exact: true })
    .getByText('文章已准备好，可以继续阅读。', { exact: true })
    .waitFor();

  await page.goto(`${baseURL}#/components/toast`);
  await verifyToastSimple(page);
  const basicToast = page.locator('#basic .example-preview');
  await revealExample(basicToast);
  const trigger = basicToast.getByRole('button', { name: /^(加入|移出)稍后阅读$/ });
  await trigger.click();
  await focused(page, trigger);
  await trigger.click();
  assert.equal(await basicToast.getByRole('status').count(), 1);
  await basicToast.getByRole('button', { name: '关闭提示', exact: true }).click();
  await focused(page, trigger);
  const tones = page.locator('#tones .example-preview');
  await tones.getByRole('button', { name: '关闭提示', exact: true }).first().click();
  const restoreTones = tones.getByRole('button', { name: '恢复已关闭的提示', exact: true });
  await focused(page, restoreTones);
  await restoreTones.click();
  await focused(page, tones.getByRole('heading', { name: '三种结果说明', exact: true }));
  assert.equal(await tones.getByRole('status').count(), 3);

  await verifyToastTimer(page);
}
