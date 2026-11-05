import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';
import { readFile } from 'node:fs/promises';
import { verifyButtonExamples } from './button-examples.mjs';
import { revealIconButtonExample, verifyIconButtonReadingList } from './icon-button-examples.mjs';
import { verifyTextFieldSearch, verifyTextFieldCopy } from './text-field-examples.mjs';
import { verifySelectCollection, verifySelectAvailability } from './select-examples.mjs';

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
    await verifyButtonExamples(page);
    await verifySource(states, 'foundations/ButtonStates.tsx');

    await page.goto(`${baseURL}#/components/text-field`);
    const validation = page.locator('#validation');
    await validation.waitFor();
    const nickname = validation.getByRole('textbox', { name: '你的昵称', exact: true });
    await nickname.fill('这是一段超过十二个字符的昵称文本');
    await validation.getByRole('button', { name: '检查昵称', exact: true }).click();
    assert.equal(await nickname.getAttribute('aria-invalid'), 'true');
    assert.equal(await nickname.evaluate((node) => document.activeElement === node), true);
    assert.equal(await nickname.inputValue(), '这是一段超过十二个字符的昵称文本');
    await nickname.fill('库米');
    await validation.getByRole('button', { name: '检查昵称', exact: true }).click();
    await validation
      .getByRole('status')
      .getByText('检查结果：昵称“库米”符合要求。', { exact: true })
      .waitFor();
    assert.equal(await nickname.getAttribute('aria-invalid'), null);
    const native = page.locator('#native');
    await revealExample(native);
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
    await verifyTextFieldSearch(page, page.locator('#text-field-search .example-preview'));
    await verifyTextFieldCopy(page, page.locator('#text-field-copy .example-preview'));
    const email = native.getByLabel('联系邮箱', { exact: true });
    const checkEmail = native.getByRole('button', { name: '检查邮箱格式', exact: true });
    await checkEmail.click();
    assert.equal(await email.evaluate((node) => node.validity.valueMissing), true);
    assert.equal(await email.evaluate((node) => document.activeElement === node), true);
    await email.fill('invalid-email');
    await checkEmail.click();
    assert.equal(await email.evaluate((node) => node.validity.typeMismatch), true);
    await email.fill('hello@example.com');
    await checkEmail.click();
    await native
      .getByRole('status')
      .getByText('检查结果：邮箱格式正确。', { exact: true })
      .waitFor();

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
    await revealExample(form);
    const archive = form.getByRole('combobox', { name: '归档分类', exact: true });
    await form.getByRole('button', { name: '读取表单', exact: true }).click();
    assert.equal(await archive.getAttribute('aria-invalid'), 'true');
    assert.equal(await archive.evaluate((node) => document.activeElement === node), true);
    await form.getByText('请选择归档分类后再读取表单。', { exact: true }).waitFor();
    await archive.click();
    await page.getByRole('option', { name: '读书笔记', exact: true }).click();
    await page.getByRole('listbox').waitFor({ state: 'hidden' });
    await form.getByRole('button', { name: '读取表单', exact: true }).click();
    await form
      .getByRole('status')
      .getByText('读取结果：category=reading。', { exact: true })
      .waitFor();
    await form.getByRole('button', { name: '重置为未选择', exact: true }).click();
    assert.equal(await archive.innerText(), '请选择归档分类');
    assert.equal(await archive.getAttribute('aria-invalid'), null);
    await verifySource(form, 'new-forms/SelectForm.tsx');

    const longOptions = page.locator('#long-options');
    await revealExample(longOptions);
    const longSelect = longOptions.getByRole('combobox', { name: '浏览归档分类', exact: true });
    await longSelect.focus();
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
    assert.equal(await longSelect.innerText(), '值得再看的收藏');
    await verifySource(longOptions, 'new-forms/SelectLongOptions.tsx');
    await verifySelectCollection(page, page.locator('#select-collection .example-preview'));
    await verifySelectAvailability(
      page,
      page.locator('#select-available-collections .example-preview'),
    );
  }
}

/** Keep the four most-used controls consistent across browser engines. */
export async function verifyCoreControlEdges(page, baseURL) {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}#/components/button`);
    const toggle = page.locator('#button-toggle').getByRole('button', {
      name: '收藏文章',
      exact: true,
    });
    await toggle.waitFor();
    const before = await toggle.boundingBox();
    const glyph = await toggle.locator('svg').boundingBox();
    assert.equal(glyph.width, 18, 'The text-button icon uses its 18px frame.');
    assert.equal(glyph.height, 18);
    await toggle.focus();
    await toggle.press('Space');
    assert.equal(await toggle.getAttribute('aria-pressed'), 'true');
    const selected = await toggle.boundingBox();
    assert.equal(selected.width, before.width, 'Selecting keeps the text button width.');
    assert.equal(selected.height, before.height, 'Selecting keeps the text button height.');

    await page.goto(`${baseURL}#/components/icon-button`);
    const example = page.locator('#icon-button-loading');
    await revealIconButtonExample(example);
    const icon = example.getByRole('button', { name: '收藏文章', exact: true });
    await icon.waitFor();
    const iconGlyph = await icon.locator('svg').boundingBox();
    assert.equal(iconGlyph.width, 20, 'The icon-only action uses its 20px frame.');
    assert.equal(iconGlyph.height, 20);
    await icon.focus();
    await icon.press('Enter');
    assert.equal(await icon.getAttribute('aria-busy'), 'true');
    assert.equal(await icon.isDisabled(), true);
    const loading = await icon.boundingBox();
    assert.equal(loading.width, 44);
    assert.equal(loading.height, 44);
    await page.waitForFunction((node) => !node.disabled, await icon.elementHandle());
    assert.equal(await icon.getAttribute('aria-pressed'), 'true');
    assert.equal(await icon.getAttribute('aria-label'), '收藏文章');
    assert.equal((await icon.boundingBox()).width, 44);
    assert.equal((await icon.boundingBox()).height, 44);
    await example.getByRole('status').getByText('已收藏', { exact: true }).waitFor();
    await verifyIconButtonReadingList(page);

    await page.goto(`${baseURL}#/components/text-field`);
    const native = page.locator('#native');
    await revealExample(native);
    for (const [name, value] of [
      ['记录日期', '2026-10-28'],
      ['记录时间', '09:30'],
    ]) {
      const input = native.getByLabel(name, { exact: true });
      await input.waitFor();
      assert(
        Math.abs((await input.boundingBox()).height - 44) < 0.1,
        `${name}: native editor stays 44px.`,
      );
      await input.fill(value);
      assert.equal(await input.inputValue(), value, `${name}: native value editing stays usable.`);
    }

    await page.goto(`${baseURL}#/components/select`);
    const preview = page.locator('#basic .example-preview');
    const trigger = preview.getByRole('combobox', { name: '文章分类', exact: true });
    await trigger.waitFor();
    await preview.evaluate((node) => node.setAttribute('dir', 'rtl'));
    await trigger.focus();
    await trigger.press('Enter');
    const list = page.getByRole('listbox');
    await list.waitFor();
    assert.equal(await trigger.evaluate((node) => getComputedStyle(node).direction), 'rtl');
    assert.equal(
      await list.evaluate((node) => getComputedStyle(node).direction),
      'rtl',
      'The portalled menu keeps the local reading direction of its field.',
    );
    await preview.evaluate((node) => node.setAttribute('dir', 'ltr'));
    await page.waitForFunction(
      (node) => getComputedStyle(node).direction === 'ltr',
      await list.elementHandle(),
    );
    await page.keyboard.press('Escape');
    await list.waitFor({ state: 'hidden' });
    await page.waitForFunction(
      (node) => document.activeElement === node,
      await trigger.elementHandle(),
    );
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
