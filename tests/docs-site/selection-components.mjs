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
    const agreement = checkboxForm.getByRole('checkbox', { name: '我已阅读订阅说明', exact: true });
    await checkboxForm.getByRole('button', { name: '读取订阅', exact: true }).click();
    assert.equal(await agreement.getAttribute('aria-invalid'), 'true');
    assert.equal(await agreement.evaluate((node) => node === document.activeElement), true);
    await agreement.check();
    assert.equal(await agreement.getAttribute('aria-invalid'), null);
    await checkboxForm.getByRole('button', { name: '读取订阅', exact: true }).click();
    await checkboxForm
      .getByRole('status')
      .getByText('订阅分类值：journal', { exact: true })
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
    await radioForm.getByRole('status').getByText('提交值：monthly', { exact: true }).waitFor();
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
      /没有 covers 字段/,
    );
    await switchForm.getByRole('button', { name: '重置', exact: true }).click();
    assert.equal(
      await switchForm.getByRole('switch', { name: '文章封面', exact: true }).isChecked(),
      true,
    );
    await verifySource(switchForm, 'new-forms/SwitchForm.tsx');

    await page.goto(`${baseURL}#/components/segmented-control`);
    const segmented = page.locator('#form');
    await segmented.getByRole('button', { name: '应用排序', exact: true }).click();
    await segmented.getByRole('alert').waitFor();
    await segmented.getByRole('radio', { name: '最多阅读', exact: true }).check();
    assert.equal(await segmented.getByRole('alert').count(), 0);
    await segmented.getByRole('button', { name: '应用排序', exact: true }).click();
    await segmented
      .getByRole('status')
      .getByText('提交的 sort：popular', { exact: true })
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
}

async function verifySource(example, relative) {
  await example.getByRole('button', { name: '展开代码', exact: true }).click();
  assert.equal(
    await example.locator('.component-source pre code').textContent(),
    await readFile(new URL(`../../playground/src/examples/${relative}`, import.meta.url), 'utf8'),
  );
}
