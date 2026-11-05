import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

export async function verifyDialogForm(page, baseURL) {
  await page.goto(`${baseURL}#/components/dialog?section=form`);
  const example = page.locator('#form .example-preview');
  await revealExample(example);
  const trigger = example.getByRole('button', { name: '修改站点标题', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '站点标题', exact: true });
  const name = dialog.getByRole('textbox', { name: '站点标题', exact: true });
  await name.fill('   ');
  await dialog.getByRole('button', { name: '保存标题', exact: true }).click();
  assert.equal(await dialog.isVisible(), true, 'Whitespace-only titles must keep the form open.');
  assert.equal(await name.getAttribute('aria-invalid'), 'true');
  assert.equal(await name.evaluate((node) => document.activeElement === node), true);
  await name.fill('  小小阅读室  ');
  await dialog.getByRole('button', { name: '保存标题', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  await example.getByRole('status').getByText('当前标题：小小阅读室', { exact: true }).waitFor();
  await trigger.click();
  assert.equal(await name.inputValue(), '小小阅读室');
  await name.fill('未保存的草稿');
  await dialog.getByRole('button', { name: '取消', exact: true }).click();
  await dialog.getByRole('alert').waitFor();
  assert.equal(await name.inputValue(), '未保存的草稿');
  await dialog.getByRole('button', { name: '放弃修改并关闭', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  await trigger.click();
  assert.equal(await name.inputValue(), '小小阅读室');
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await trigger.elementHandle(),
  );
}

export async function verifyArticleActions(page, baseURL) {
  await page.goto(`${baseURL}#/guides/states?section=article-actions`);
  const scene = page.locator('#scene-article-actions .example-preview');
  await scene.getByRole('heading', { name: '沿着河边，慢慢走', exact: true }).waitFor();
  const menu = scene.getByRole('button', { name: '手记操作', exact: true });
  await menu.click();
  await page.getByRole('menuitem', { name: '编辑手记', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '编辑这篇手记', exact: true });
  await dialog.waitFor();
  const title = dialog.getByRole('textbox', { name: '文章标题', exact: true });
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await title.elementHandle(),
  );
  const category = dialog.getByRole('combobox', { name: '文章分类', exact: true });
  await category.click();
  await page.getByRole('listbox').waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('listbox').waitFor({ state: 'hidden' });
  assert.equal(await dialog.isVisible(), true);
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await category.elementHandle(),
  );
  const help = dialog.getByRole('button', { name: '写作提示', exact: true });
  await help.click();
  const note = page.getByRole('dialog', { name: '给摘要留一点余地', exact: true });
  await note.waitFor();
  await page.keyboard.press('Escape');
  await note.waitFor({ state: 'hidden' });
  assert.equal(await dialog.isVisible(), true);
  await page.waitForFunction((node) => document.activeElement === node, await help.elementHandle());
  await title.fill('未保存的标题');
  await dialog.getByRole('button', { name: '取消编辑', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  await page.waitForFunction((node) => document.activeElement === node, await menu.elementHandle());
  await menu.click();
  await page.getByRole('menuitem', { name: '编辑手记', exact: true }).click();
  assert.equal(await title.inputValue(), '沿着河边，慢慢走');
  await title.fill('散步以后，记下一点小事');
  const save = dialog.getByRole('button', { name: '保存手记', exact: true });
  await save.click();
  await dialog.getByRole('alert').getByText('保存失败', { exact: true }).waitFor();
  await page.waitForFunction((node) => document.activeElement === node, await save.elementHandle());
  const saveBounds = await save.boundingBox();
  const popupBounds = await dialog.boundingBox();
  assert.ok(
    saveBounds.y >= popupBounds.y &&
      saveBounds.y + saveBounds.height <= popupBounds.y + popupBounds.height + 1,
    'A focused retry action must remain visible after the error expands a short dialog.',
  );
  assert.equal(await title.inputValue(), '散步以后，记下一点小事');
  await save.click();
  await dialog.waitFor({ state: 'hidden' });
  await scene.getByRole('heading', { name: '散步以后，记下一点小事', exact: true }).waitFor();
  await page.waitForFunction((node) => document.activeElement === node, await menu.elementHandle());
  const notice = scene.getByRole('status').filter({ hasText: '手记已保存' });
  await notice.waitFor();
  assert.equal(await scene.getByRole('status').count(), 1, 'Save success has one live announcer.');
  await menu.click();
  await page.getByRole('menuitem', { name: '编辑手记', exact: true }).click();
  assert.equal(await notice.count(), 0, 'Editing again removes the previous success notice.');
  await title.fill('取消后不能替换已保存的标题');
  await dialog.getByRole('button', { name: '取消编辑', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  await scene.getByRole('heading', { name: '散步以后，记下一点小事', exact: true }).waitFor();
  await menu.click();
  await page.getByRole('menuitem', { name: '编辑手记', exact: true }).click();
  assert.equal(await title.inputValue(), '散步以后，记下一点小事');
  await save.click();
  await dialog.getByRole('alert').waitFor();
  await save.click();
  await dialog.waitFor({ state: 'hidden' });
  await notice.waitFor();
  assert.equal(await scene.getByRole('status').count(), 1);
  await notice.getByRole('button', { name: '关闭提示', exact: true }).click();
  await notice.waitFor({ state: 'hidden' });
  await page.waitForFunction((node) => document.activeElement === node, await menu.elementHandle());
  const bookmark = scene.getByRole('button', { name: '收藏手记', exact: true });
  await bookmark.click();
  assert.equal(await bookmark.getAttribute('aria-pressed'), 'true');
  await menu.click();
  await page.getByRole('menuitem', { name: '归档手记', exact: true }).click();
  await scene.getByText('已归档', { exact: true }).waitFor();
  await menu.click();
  await page.getByRole('menuitem', { name: '恢复到阅读列表', exact: true }).click();
  await scene.getByText('阅读列表', { exact: true }).waitFor();
  assert.equal(await bookmark.getAttribute('aria-pressed'), 'true');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
}

export async function verifyOverlayExamples(page, baseURL) {
  await page.goto(`${baseURL}#/components/popover?section=form`);
  const popover = page.locator('#form .example-preview');
  const trigger = popover.getByRole('button', { name: '重命名收藏夹', exact: true });
  await trigger.click();
  const note = page.getByRole('dialog', { name: '收藏夹名称', exact: true });
  const name = note.getByRole('textbox', { name: '名称', exact: true });
  await name.fill('未保存的名称');
  await note.getByRole('button', { name: '取消', exact: true }).click();
  await note.waitFor({ state: 'hidden' });
  await trigger.click();
  assert.equal(await name.inputValue(), '我的收藏');
  await name.fill('   ');
  await note.getByRole('button', { name: '保存名称', exact: true }).click();
  assert.equal(await name.getAttribute('aria-invalid'), 'true');
  assert.equal(await name.evaluate((node) => document.activeElement === node), true);
  await name.fill('  散步收藏  ');
  await note.getByRole('button', { name: '保存名称', exact: true }).click();
  await note.waitFor({ state: 'hidden' });
  await popover.getByRole('status').getByText('当前名称：散步收藏', { exact: true }).waitFor();

  await page.goto(`${baseURL}#/components/dropdown-menu?section=controlled`);
  const menuExample = page.locator('#controlled .example-preview');
  await revealExample(menuExample);
  const menu = menuExample.getByRole('button', { name: /^操作草稿：/ });
  await menu.click();
  await page.getByRole('menuitem', { name: '继续编辑', exact: true }).click();
  const draft = menuExample.getByRole('textbox', { name: '草稿标题', exact: true });
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await draft.elementHandle(),
  );
  await draft.fill('未提交的小小手记');
  await menu.click();
  await page.getByRole('menuitem', { name: '移出草稿列表', exact: true }).click();
  assert.equal(await menuExample.getByRole('article', { name: '示例草稿' }).count(), 0);
  await menuExample.getByRole('button', { name: '恢复草稿', exact: true }).click();
  assert.equal(await draft.inputValue(), '未提交的小小手记');
  await menuExample.getByRole('button', { name: '保存草稿', exact: true }).click();
  await menuExample.getByRole('heading', { name: '未提交的小小手记', exact: true }).waitFor();
  await page.waitForFunction((node) => document.activeElement === node, await menu.elementHandle());

  await page.goto(`${baseURL}#/components/tooltip`);
  const basic = page.locator('#basic .example-preview');
  const favorite = basic.getByRole('button', { name: '收藏文章', exact: true });
  await favorite.click();
  assert.equal(await favorite.getAttribute('aria-label'), '收藏文章');
  assert.equal(await favorite.getAttribute('aria-pressed'), 'true');
  await basic.getByText('文章已收藏', { exact: true }).waitFor();
  const options = page.locator('#options .example-preview');
  const disable = options.getByRole('button', { name: '关闭文字提示', exact: true });
  await disable.click();
  assert.equal(await disable.getAttribute('aria-pressed'), 'true');
  await options.getByRole('button', { name: '加入稍后阅读', exact: true }).click();
  await options
    .getByRole('status')
    .getByText('已触发“加入稍后阅读”操作。', { exact: true })
    .waitFor();
  await disable.click();
  assert.equal(await disable.getAttribute('aria-pressed'), 'false');
}
