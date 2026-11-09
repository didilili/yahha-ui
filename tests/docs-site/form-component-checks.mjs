import assert from 'node:assert/strict';

async function requireFocus(page, locator) {
  const element = await locator.elementHandle();
  try {
    await page.waitForFunction((node) => document.activeElement === node, element);
  } finally {
    await element.dispose();
  }
}

async function requireDescription(control) {
  assert.equal(
    await control.evaluate((node) =>
      node
        .getAttribute('aria-describedby')
        ?.split(/\s+/)
        .some((id) => document.getElementById(id)?.textContent.trim()),
    ),
    true,
    'The field error must be associated with the invalid control.',
  );
}

export async function verifyFormComponent(browser, baseURL) {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(7000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('about:blank');
      await page.goto(`${baseURL}#/components/form`);
      await page.getByRole('heading', { level: 1, name: 'Form 表单', exact: true }).waitFor();
      const basic = page.locator('#form-basic .example-preview');
      const nickname = basic.getByRole('textbox', { name: '昵称', exact: true });
      await nickname.waitFor();
      assert.equal(await nickname.inputValue(), '库米');
      await nickname.fill('河边读者');
      await basic.getByRole('button', { name: '读取表单', exact: true }).click();
      await basic
        .getByRole('status')
        .getByText('读取结果：昵称为“河边读者”。', { exact: true })
        .waitFor();
      await basic.getByRole('button', { name: '恢复初始值', exact: true }).click();
      assert.equal(await nickname.inputValue(), '库米');
      assert.equal((await basic.getByRole('status').textContent()).trim(), '');

      const validation = page.locator('#form-validation .example-preview');
      const publicName = validation.getByRole('textbox', { name: '公开昵称', exact: true });
      const email = validation.getByRole('textbox', { name: '联系邮箱', exact: true });
      const validate = validation.getByRole('button', { name: '检查并读取', exact: true });
      await validate.click();
      await requireFocus(page, publicName);
      assert.equal(await publicName.getAttribute('aria-invalid'), 'true');
      await requireDescription(publicName);
      await publicName.fill('   ');
      await email.focus();
      await validation.getByText('昵称不能只包含空格。', { exact: true }).waitFor();
      await publicName.fill('河边读者');
      await email.fill('invalid-email');
      await validate.click();
      await requireFocus(page, email);
      assert.equal(await email.getAttribute('aria-invalid'), 'true');
      await email.fill('reader@example.com');
      await validate.click();
      await validation
        .getByRole('status')
        .getByText('校验通过：河边读者 · reader@example.com', { exact: true })
        .waitFor();
      await validation.getByRole('button', { name: '重置资料', exact: true }).click();
      assert.equal(await publicName.inputValue(), '');
      assert.equal(await email.inputValue(), '');

      const controls = page.locator('#form-controls .example-preview');
      const summary = controls.getByRole('switch', { name: '显示文章摘要', exact: true });
      const view = controls.getByRole('group', { name: '默认视图', exact: true });
      const read = controls.getByRole('button', { name: '读取设置', exact: true });
      await read.click();
      await requireFocus(page, summary);
      assert.equal(await summary.getAttribute('aria-invalid'), 'true');
      await requireDescription(summary);
      await summary.check();
      await read.click();
      await requireFocus(page, view.getByRole('radio', { name: '列表', exact: true }));
      await requireDescription(view.getByRole('radio', { name: '列表', exact: true }));
      await view.getByRole('radio', { name: '列表', exact: true }).check();
      await read.click();
      await controls
        .getByRole('status')
        .getByText('读取结果：河边散步小记 · journal · 订阅更新 · list', { exact: true })
        .waitFor();
      const category = controls.getByRole('combobox', { name: '文章分类', exact: true });
      await category.click();
      await page.getByRole('option', { name: '读书笔记', exact: true }).click();
      assert.equal(
        (await controls.getByRole('status').textContent()).trim(),
        '',
        'Selecting clears the previous result.',
      );
      await controls.getByRole('button', { name: '重置设置', exact: true }).click();
      assert.equal(await summary.isChecked(), false);
      assert.equal(await view.getByRole('radio', { name: '列表', exact: true }).isChecked(), false);
      assert.equal(
        await controls.getByRole('checkbox', { name: '订阅更新', exact: true }).isChecked(),
        true,
      );
      assert.match(await category.innerText(), /生活手记/);

      const submission = page.locator('#form-submission .example-preview');
      const savedName = submission.getByRole('textbox', { name: '公开昵称', exact: true });
      const save = submission.getByRole('button', { name: '保存昵称', exact: true });
      await save.click();
      await submission.getByText('这个示例昵称已被使用，请换一个。', { exact: true }).waitFor();
      await requireFocus(page, savedName);
      await savedName.fill('河边读者');
      await save.click();
      await submission
        .getByRole('status')
        .getByText('已保存昵称“河边读者”。', { exact: true })
        .waitFor();
      await submission.getByRole('button', { name: '恢复初始值', exact: true }).click();
      assert.equal(await savedName.inputValue(), '库米');
      assert.equal((await submission.getByRole('status').textContent()).trim(), '');
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
      );
    }
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
}
