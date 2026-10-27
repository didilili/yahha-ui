import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

export async function verifyCoreComponents(page, baseURL) {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const id of ['button', 'text-field', 'select']) {
      await page.goto(`${baseURL}#/components/${id}`);
      await page.locator('#design').waitFor();
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `${id} page fits ${width}px.`,
      );
    }

    await page.goto(`${baseURL}#/components/button`);
    const states = page.locator('#button-states');
    await states.waitFor();
    for (const name of ['保存草稿', '备份草稿']) {
      const action = states.getByRole('button', { name, exact: true });
      const before = await action.boundingBox();
      await action.click();
      assert.equal(await action.getAttribute('aria-busy'), 'true');
      assert.equal(await action.isDisabled(), true);
      const loading = await action.boundingBox();
      assert(Math.abs(before.width - loading.width) < 0.1, `${name} keeps its width.`);
      assert(Math.abs(before.height - loading.height) < 0.1, `${name} keeps its height.`);
      await page.waitForFunction((node) => !node.disabled, await action.elementHandle());
      assert.equal(await action.innerText(), name);
    }
    await verifySource(states, 'foundations/ButtonStates.tsx');

    await page.goto(`${baseURL}#/components/text-field`);
    const validation = page.locator('#validation');
    await validation.waitFor();
    const nickname = validation.getByRole('textbox', { name: '你的昵称', exact: true });
    await nickname.fill('这是一段超过十二个字符的昵称文本');
    await validation.getByRole('button', { name: '保存昵称', exact: true }).click();
    assert.equal(await nickname.getAttribute('aria-invalid'), 'true');
    assert.equal(await nickname.evaluate((node) => document.activeElement === node), true);
    assert.equal(await nickname.inputValue(), '这是一段超过十二个字符的昵称文本');
    await nickname.fill('小林');
    await validation.getByRole('button', { name: '保存昵称', exact: true }).click();
    await validation.getByRole('status').getByText('已保存：小林', { exact: true }).waitFor();
    assert.equal(await nickname.getAttribute('aria-invalid'), null);
    const native = page.locator('#native');
    const password = native.getByLabel('示例密码', { exact: true });
    await password.fill('demo-only');
    assert.equal(await password.getAttribute('type'), 'password');
    assert.equal(await password.getAttribute('autocomplete'), 'new-password');
    await native.getByRole('button', { name: '聚焦邮箱输入框', exact: true }).click();
    assert.equal(
      await native
        .getByLabel('联系邮箱', { exact: true })
        .evaluate((node) => document.activeElement === node),
      true,
    );
    await verifySource(native, 'forms/TextFieldNative.tsx');

    await page.goto(`${baseURL}#/components/select`);
    const selectStates = page.locator('#states');
    await selectStates.waitFor();
    const category = selectStates.getByRole('combobox', { name: '必选分类', exact: true });
    assert.equal(await category.getAttribute('aria-invalid'), 'true');
    await category.click();
    const categoryList = page.getByRole('listbox');
    await categoryList.waitFor();
    await page.getByRole('option', { name: '生活手记', exact: true }).click();
    await categoryList.waitFor({ state: 'hidden' });
    assert.equal(await category.getAttribute('aria-invalid'), null);
    assert.equal(await selectStates.getByText('请先选择文章分类。', { exact: true }).count(), 0);
    const form = page.locator('#form');
    const archive = form.getByRole('combobox', { name: '归档分类', exact: true });
    await archive.focus();
    await page.keyboard.press('Enter');
    await page.getByRole('listbox').waitFor();
    assert.equal(await page.getByRole('option').count(), 8);
    await page.waitForFunction(
      (node) => document.activeElement === node,
      await page.getByRole('option').first().elementHandle(),
    );
    await page.keyboard.press('End');
    await page.waitForFunction(
      (node) => document.activeElement === node,
      await page.getByRole('option').last().elementHandle(),
    );
    await page.keyboard.press('Enter');
    await page.getByRole('listbox').waitFor({ state: 'hidden' });
    await form.getByRole('button', { name: '读取表单', exact: true }).click();
    await form.getByRole('status').getByText('提交值：favorites', { exact: true }).waitFor();
    await form.getByRole('button', { name: '重置', exact: true }).click();
    assert.equal(await archive.innerText(), '日常手记');
    await verifySource(form, 'new-forms/SelectForm.tsx');
  }
}

async function verifySource(example, relative) {
  await example.getByRole('button', { name: '展开代码', exact: true }).click();
  const expected = await readFile(
    new URL(`../../playground/src/examples/${relative}`, import.meta.url),
    'utf8',
  );
  assert.equal(await example.locator('.component-source pre code').textContent(), expected);
}
