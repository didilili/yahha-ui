import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

export async function verifySelectionComponents(page, baseURL) {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const id of ['checkbox', 'radio-group', 'switch', 'segmented-control']) {
      await page.goto(`${baseURL}#/components/${id}`);
      await page.locator('#design').waitFor();
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `${id} at ${width}px fits.`,
      );
    }
    await page.goto(`${baseURL}#/components/checkbox`);
    const mixed = page.locator('#mixed');
    const all = mixed.getByRole('checkbox', { name: '订阅所有分类', exact: true });
    await all.waitFor();
    assert.equal(await all.getAttribute('aria-checked'), 'mixed');
    await all.check();
    assert.equal(await mixed.getByRole('checkbox', { checked: true }).count(), 3);
    await mixed.getByRole('button', { name: '恢复初始选择', exact: true }).click();
    assert.equal(await all.getAttribute('aria-checked'), 'mixed');
    const checkboxForm = page.locator('#form');
    const agreement = checkboxForm.getByRole('checkbox', {
      name: '我确认读取以上订阅分类',
      exact: true,
    });
    await checkboxForm.getByRole('button', { name: '读取订阅', exact: true }).click();
    assert.equal(await agreement.getAttribute('aria-invalid'), 'true');
    assert.equal(await agreement.evaluate((node) => node === document.activeElement), true);
    await agreement.check();
    assert.equal(await agreement.getAttribute('aria-invalid'), null);
    await checkboxForm.getByRole('button', { name: '读取订阅', exact: true }).click();
    await checkboxForm
      .getByRole('status')
      .getByText('读取结果：journal。', { exact: true })
      .waitFor();
    await checkboxForm.getByRole('button', { name: '重置', exact: true }).click();
    assert.equal(await agreement.isChecked(), false);
    await verifySource(checkboxForm, 'new-forms/CheckboxForm.tsx');

    await page.goto(`${baseURL}#/components/radio-group`);
    const radioForm = page.locator('#form');
    await radioForm.getByRole('button', { name: '读取表单', exact: true }).click();
    const weekly = radioForm.getByRole('radio', { name: '每周', exact: true });
    assert.equal(
      await radioForm
        .getByRole('group', { name: '订阅频率', exact: true })
        .getAttribute('aria-invalid'),
      'true',
    );
    assert.equal(
      await weekly.evaluate((node) =>
        (node.getAttribute('aria-describedby') ?? '')
          .split(/\s+/)
          .some((id) => document.getElementById(id)?.textContent?.includes('请选择一种订阅频率')),
      ),
      true,
    );
    await radioForm.getByRole('radio', { name: '每月', exact: true }).check();
    assert.equal(
      await radioForm
        .getByRole('group', { name: '订阅频率', exact: true })
        .getAttribute('aria-invalid'),
      null,
    );
    await radioForm.getByRole('button', { name: '读取表单', exact: true }).click();
    await radioForm
      .getByRole('status')
      .getByText('读取结果：frequency=monthly。', { exact: true })
      .waitFor();
    await radioForm.getByRole('button', { name: '重置', exact: true }).click();
    assert.equal(await radioForm.getByRole('radio', { checked: true }).count(), 0);
    await verifySource(radioForm, 'new-forms/RadioGroupForm.tsx');

    await page.goto(`${baseURL}#/components/switch`);
    const controlled = page.locator('#controlled');
    const summary = controlled.getByRole('switch', { name: '显示文章摘要', exact: true });
    await summary.waitFor();
    await summary.uncheck();
    await controlled
      .getByRole('status')
      .getByText('摘要已隐藏，文章标题仍然保留。', { exact: true })
      .waitFor();
    assert.equal(
      await controlled.getByRole('heading', { name: '沿着河边，慢慢走', exact: true }).isVisible(),
      true,
    );
    const switchForm = page.locator('#form');
    await switchForm.getByRole('switch', { name: '文章封面', exact: true }).uncheck();
    await switchForm.getByRole('button', { name: '读取偏好', exact: true }).click();
    assert.match(
      await switchForm.locator('.example-preview').getByRole('status').innerText(),
      /未包含封面偏好/,
    );
    await switchForm.getByRole('button', { name: '重置', exact: true }).click();
    assert.equal(
      await switchForm.getByRole('switch', { name: '文章封面', exact: true }).isChecked(),
      true,
    );
    await verifySource(switchForm, 'new-forms/SwitchForm.tsx');

    await page.goto(`${baseURL}#/components/segmented-control`);
    const segmented = page.locator('#form');
    await segmented.getByRole('button', { name: '读取排序值', exact: true }).click();
    await segmented.getByRole('alert').waitFor();
    await segmented.getByRole('radio', { name: '最多阅读', exact: true }).check();
    assert.equal(await segmented.getByRole('alert').count(), 0);
    await segmented.getByRole('button', { name: '读取排序值', exact: true }).click();
    await segmented
      .getByRole('status')
      .getByText('读取结果：sort=popular。', { exact: true })
      .waitFor();
    await segmented.getByRole('button', { name: '恢复初始值', exact: true }).click();
    assert.equal(await segmented.getByRole('radio', { checked: true }).count(), 0);
    const disabled = page.locator('#disabled');
    const group = disabled.getByRole('group', { name: '整组文章可见性', exact: true });
    assert.equal(await group.getByRole('radio').first().isDisabled(), true);
    await disabled
      .getByRole('group', { name: '文章可见性', exact: true })
      .getByRole('radio', { name: '仅自己', exact: true })
      .check();
    assert.equal(
      await group.getByRole('radio', { name: '公开', exact: true }).isChecked(),
      true,
      'The disabled example keeps its own state.',
    );
    await disabled.getByRole('button', { name: '解除整组禁用', exact: true }).click();
    assert.equal(await group.getByRole('radio').first().isDisabled(), false);
    await verifySource(segmented, 'forms/SegmentedForm.tsx');
  }
  await verifyTextareaExamples(page, baseURL);
}

/** Textarea retains native editing, caller-owned validation and form reset. */
export async function verifyTextareaExamples(page, baseURL) {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}#/components/textarea`);
    const basic = page.locator('#basic');
    const message = basic.getByRole('textbox', { name: '给作者留言', exact: true });
    await message.waitFor();
    assert.equal(await message.getAttribute('rows'), '4');
    assert.equal(await message.evaluate((node) => getComputedStyle(node).resize), 'vertical');
    assert.equal(
      await message.evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
      width === 320 ? 16 : 14,
    );
    const multiline = `第一行留言\n第二行留言\n${'PersonalReadingJournal'.repeat(30)}`;
    await message.fill(multiline);
    assert.equal(await message.inputValue(), multiline);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `Long multiline content stays within the ${width}px document.`,
    );

    const controlled = page.locator('#controlled');
    const checkedMessage = controlled.getByRole('textbox', { name: '留言内容', exact: true });
    const check = controlled.getByRole('button', { name: '检查留言', exact: true });
    await checkedMessage.fill('');
    await check.click();
    assert.equal(await checkedMessage.getAttribute('aria-invalid'), 'true');
    assert.equal(
      await checkedMessage.evaluate((node) => document.activeElement === node),
      true,
      'A failed message check returns focus to the textarea.',
    );
    const descriptions = await checkedMessage.evaluate((node) =>
      (node.getAttribute('aria-describedby') ?? '')
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent ?? ''),
    );
    assert(descriptions.some((text) => text.includes('请填写留言后再检查')));
    await checkedMessage.fill('谢谢分享。\n这篇手记很温柔。');
    assert.equal(await checkedMessage.getAttribute('aria-invalid'), null);
    await check.click();
    await controlled
      .getByRole('status')
      .getByText('检查结果：留言符合要求。', { exact: true })
      .waitFor();
    await checkedMessage.fill('');
    await checkedMessage.press('a');
    await checkedMessage.press('End');
    await page.keyboard.insertText('文'.repeat(250));
    assert.equal(
      (await checkedMessage.inputValue()).length,
      200,
      'Native maxLength limits typing.',
    );
    await controlled.getByText('已输入 200 / 200', { exact: true }).waitFor();
    await verifySource(controlled, 'new-forms/TextareaControlled.tsx');

    const native = page.locator('#native');
    const draft = native.getByRole('textbox', { name: '草稿', exact: true });
    const initial = await draft.inputValue();
    await draft.fill('修改后的草稿\n保留换行。');
    assert.deepEqual(await draft.evaluate((node) => [...new FormData(node.form)]), [
      ['draft', '修改后的草稿\n保留换行。'],
    ]);
    const readonly = native.getByRole('textbox', { name: '已发布简介', exact: true });
    assert.equal(await readonly.getAttribute('readonly'), '');
    assert.equal(await readonly.evaluate((node) => getComputedStyle(node).resize), 'none');
    await readonly.focus();
    const published = await readonly.inputValue();
    await readonly.press('x');
    assert.equal(await readonly.inputValue(), published);
    const disabled = native.getByRole('textbox', { name: '暂时关闭留言', exact: true });
    assert.equal(await disabled.isDisabled(), true);
    await native.getByRole('button', { name: '重置草稿', exact: true }).click();
    assert.equal(await draft.inputValue(), initial);
    assert.equal(await readonly.inputValue(), published);
    await verifySource(native, 'new-forms/TextareaStates.tsx');
  }
}

async function verifySource(example, relative) {
  await example.getByRole('button', { name: '展开代码', exact: true }).click();
  assert.equal(
    await example.locator('.component-source pre code').textContent(),
    await readFile(new URL(`../../playground/src/examples/${relative}`, import.meta.url), 'utf8'),
  );
  await example.getByRole('button', { name: '收起代码', exact: true }).click();
}
