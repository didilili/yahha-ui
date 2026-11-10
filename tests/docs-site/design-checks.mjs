import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  measureTextButton,
  verifyTextButtonLoading,
  verifyTextButtonRestored,
} from './loading-layout.mjs';

/** Verify that the reference page uses the shipped library, not a local visual fork. */
export async function verifyDesignBaseline(page, baseURL) {
  await page.goto(`${baseURL}#/components/button`);
  const original = page
    .locator('#button-basic')
    .getByRole('button', { name: '打个招呼', exact: true });
  await original.waitFor();
  const appearance = (element) => {
    const style = getComputedStyle(element);
    return [
      style.backgroundColor,
      style.color,
      style.borderTopWidth,
      style.borderRadius,
      style.fontSize,
      style.lineHeight,
      style.boxShadow,
    ];
  };
  const defaults = await original.evaluate(appearance);
  await page.goto(`${baseURL}#/guides/design-baseline`);
  await page.getByRole('heading', { level: 1, name: '设计规范', exact: true }).waitFor();
  const formDisclosure = page
    .locator('.doc-section')
    .filter({ has: page.locator('#controls') })
    .locator('.doc-disclosure');
  assert.equal(await formDisclosure.getAttribute('open'), null);
  await formDisclosure.locator(':scope > summary').focus();
  await page.keyboard.press('Enter');
  assert.notEqual(await formDisclosure.getAttribute('open'), null);
  const controls = page.getByRole('region', { name: '规范表单', exact: true });
  const save = controls.getByRole('button', { name: '保存设置', exact: true });
  assert.deepEqual(
    await save.evaluate(appearance),
    defaults,
    'The reference must share actual component defaults.',
  );
  const email = controls.getByRole('textbox', { name: '联系邮箱', exact: true });
  await save.click();
  assert.equal(await email.evaluate((element) => element === document.activeElement), true);
  assert.equal(await email.getAttribute('aria-invalid'), 'true');
  await email.fill('hello@example.com');
  assert.notEqual(await email.getAttribute('aria-invalid'), 'true');
  assert.equal(
    await controls
      .getByRole('textbox', { name: '站点地址 · 只读', exact: true })
      .getAttribute('readonly'),
    '',
  );
  assert.equal(
    await controls
      .getByRole('textbox', { name: '自定义域名 · 暂未开放', exact: true })
      .isDisabled(),
    true,
  );
  const select = controls.getByRole('combobox', { name: '默认文章分类', exact: true });
  await select.click();
  const popup = page.getByRole('listbox');
  await popup.getByRole('option', { name: '读书笔记', exact: true }).click();
  await popup.waitFor({ state: 'hidden' });
  const bio = controls.getByRole('textbox', { name: '简介', exact: true });
  const frequency = controls.getByRole('group', { name: '来信频率', exact: true });
  const display = controls.getByRole('group', { name: '列表展示', exact: true });
  const preferences = controls.getByRole('status', { name: '当前偏好预览', exact: true });
  await bio.fill('记录散步、读书和朋友们的小小日常。');
  await frequency.getByRole('radio', { name: '每月一封', exact: true }).check();
  await display.getByRole('radio', { name: '显示全文', exact: true }).check();
  assert.equal(await preferences.textContent(), '当前预览：每月一封来信；列表显示全文。');
  assert.deepEqual(
    await email.evaluate((node) => Object.fromEntries(new FormData(node.form))),
    {
      nickname: '库米',
      category: 'reading',
      email: 'hello@example.com',
      site: 'weekend.example',
      bio: '记录散步、读书和朋友们的小小日常。',
      frequency: 'monthly',
      display: 'full',
    },
    'The combined settings form must submit the actual current native field values.',
  );
  const before = await measureTextButton(save);
  await save.click();
  assert.equal(await save.getAttribute('aria-busy'), 'true');
  verifyTextButtonLoading(before, await measureTextButton(save));
  await controls
    .getByRole('status')
    .getByText('已在本页保存「库米」的读书笔记设置。', { exact: true })
    .waitFor();
  assert.notEqual(await save.getAttribute('aria-busy'), 'true');
  verifyTextButtonRestored(before, await measureTextButton(save));
  await controls.getByRole('button', { name: '收藏示例', exact: true }).click();
  assert.equal(
    await controls
      .getByRole('button', { name: '收藏示例', pressed: true, exact: true })
      .getAttribute('aria-pressed'),
    'true',
  );
  await controls.getByRole('button', { name: '重置', exact: true }).click();
  assert.equal(await bio.inputValue(), '');
  assert.equal(
    await frequency.getByRole('radio', { name: '每周一封', exact: true }).isChecked(),
    true,
  );
  assert.equal(
    await display.getByRole('radio', { name: '文章摘要', exact: true }).isChecked(),
    true,
  );
  assert.equal(await preferences.textContent(), '当前预览：每周一封来信；列表显示文章摘要。');
  assert.equal(await email.inputValue(), 'hello@');
  assert.equal(await email.getAttribute('aria-invalid'), 'true');
  assert.equal(
    await controls.getByText('请补全邮箱，例如 hello@example.com。', { exact: true }).count(),
    1,
    'Reset must restore the existing incomplete-email example alongside the new preferences.',
  );

  await page
    .locator('.doc-section')
    .filter({ has: page.locator('#reading') })
    .locator('.doc-disclosure > summary')
    .click();
  const reading = page.getByRole('region', { name: '规范阅读', exact: true });
  const body = reading.getByText(
    '窗台上的葱又长出一截。吉伊搬来椅子，想把它画进手记；刚画好花盆，就发现葱叶少了一段。',
    { exact: true },
  );
  assert.equal(await body.evaluate((element) => getComputedStyle(element).fontSize), '16px');
  await reading.getByRole('radio', { name: '已收藏', exact: true }).check();
  await reading.getByRole('button', { name: '显示全部手记', exact: true }).click();
  await page.waitForFunction(() => document.activeElement?.tagName === 'H4');
  await reading.getByRole('button', { name: '收藏这篇手记', pressed: false, exact: true }).click();
  await reading.getByRole('tab', { name: '看目录', exact: true }).click();
  await reading.getByRole('button', { name: '杯底多了一个圆', exact: true }).click();
  await reading.getByRole('article', { name: '杯底多了一个圆', exact: true }).waitFor();
  await page.waitForFunction(() => document.activeElement?.tagName === 'H4');
  await reading.getByRole('radio', { name: '已收藏', exact: true }).check();
  await reading.getByRole('article', { name: '窗台上的葱又长高了', exact: true }).waitFor();
  assert.equal(
    await reading.getByRole('article', { name: '杯底多了一个圆', exact: true }).count(),
    0,
  );
  await reading.getByRole('link', { name: '关于这篇示例', exact: true }).click();
  assert.match(page.url(), /#\/guides\/design-baseline$/);
  assert.equal(await reading.locator(':focus').count(), 1);
  await reading.getByRole('button', { name: '收藏这篇手记', pressed: true, exact: true }).click();
  const recover = reading.getByRole('button', { name: '显示全部手记', exact: true });
  await recover.waitFor();
  assert.equal(await recover.evaluate((element) => element === document.activeElement), true);

  for (const [id, filename] of [
    ['design-controls', 'DesignBaseline'],
    ['design-reading', 'DesignReading'],
  ]) {
    const example = page.locator(`#${id}`);
    const source = example.locator('.component-source');
    await source.getByRole('button', { name: '展开代码', exact: true }).click();
    assert.equal(
      await source.locator('pre code').textContent(),
      await readFile(
        new URL(`../../playground/src/examples/design/${filename}.tsx`, import.meta.url),
        'utf8',
      ),
      'The reference must expose its unchanged executable example.',
    );
    assert.match(
      await page.locator('.doc-example-help').innerText(),
      /本页示例已包含 ThemeProvider/,
    );
    assert.equal(await example.locator('.example-entry, .example-setup').count(), 0);
    await source.getByRole('button', { name: '收起代码', exact: true }).click();
  }
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `Reference overflow at ${width}px.`,
    );
    for (const locator of [email, select, save]) {
      const box = await locator.boundingBox();
      assert.ok(
        Math.abs(box.height - 44) < 0.1,
        `Regular controls must remain 44px at ${width}px (${box.height}).`,
      );
    }
    await select.click();
    await popup.waitFor();
    const bounds = await popup.boundingBox();
    assert.ok(
      bounds.x >= 0 && bounds.x + bounds.width <= width + 1,
      'Select must fit the narrow viewport.',
    );
    await page.keyboard.press('Escape');
    await popup.waitFor({ state: 'hidden' });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
}
