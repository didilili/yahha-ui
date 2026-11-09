import assert from 'node:assert/strict';
import { apiRowAnchor } from '../../playground/src/docs/api-anchor.ts';
import { waitForGuideReady } from './guide-loading-checks.mjs';

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

async function requireFormValues(input, nickname, showAuthor) {
  assert.deepEqual(
    await input.evaluate((node) => {
      const values = new FormData(node.form);
      return { nickname: values.get('nickname'), showAuthor: values.get('showAuthor') };
    }),
    { nickname, showAuthor: showAuthor ? 'yes' : null },
  );
}

async function verifyBasics(page) {
  const example = page.locator('#forms-basics .example-preview');
  const input = example.getByRole('textbox', { name: '昵称', exact: true });
  const checkbox = example.getByRole('checkbox', { name: '显示署名', exact: true });
  const submit = example.getByRole('button', { name: '读取表单', exact: true });
  const reset = example.getByRole('button', { name: '恢复初始值', exact: true });
  const status = example.getByRole('status');
  const error = example.getByText('请填写昵称。', { exact: true });
  await input.waitFor();
  assert.equal(await input.inputValue(), '库米');
  assert.equal(await checkbox.isChecked(), true);
  assert.equal(await input.evaluate((node) => node.required && node.form.noValidate), true);
  assert.equal(await submit.getAttribute('type'), 'submit');
  assert.equal(await reset.getAttribute('type'), 'reset');
  await requireFormValues(input, '库米', true);
  await submit.click();
  await status.getByText('读取结果：昵称为“库米”；显示署名：是。', { exact: true }).waitFor();

  await checkbox.uncheck();
  assert.equal((await status.textContent()).trim(), '', 'Editing clears the previous result.');
  await requireFormValues(input, '库米', false);
  await input.fill('  河边读者  ');
  await input.press('Enter');
  await status.getByText('读取结果：昵称为“河边读者”；显示署名：否。', { exact: true }).waitFor();
  assert.equal(await input.inputValue(), '  河边读者  ', 'Submission preserves the typed draft.');

  for (const value of ['', '   ']) {
    await input.fill(value);
    await submit.click();
    await error.waitFor();
    await requireFocus(page, input);
    assert.equal(await input.getAttribute('aria-invalid'), 'true');
    assert.equal(await input.inputValue(), value);
    assert.equal((await status.textContent()).trim(), '');
    assert.equal(
      await input.evaluate((node) =>
        node
          .getAttribute('aria-describedby')
          ?.split(/\s+/)
          .some((id) => document.getElementById(id)?.textContent.includes('请填写昵称。')),
      ),
      true,
      'The custom error is associated with the focused input.',
    );
  }

  for (const action of ['button', 'programmatic']) {
    if (action === 'button') await reset.click();
    else await input.evaluate((node) => node.form.reset());
    await page.waitForFunction(
      () => document.querySelector('#forms-basics input[name="nickname"]')?.value === '库米',
    );
    assert.equal(await checkbox.isChecked(), true, 'Native reset restores the uncontrolled check.');
    assert.notEqual(await input.getAttribute('aria-invalid'), 'true');
    assert.equal(await error.count(), 0);
    assert.equal((await status.textContent()).trim(), '');
    await requireFormValues(input, '库米', true);
    if (action === 'button') {
      await input.fill('');
      await checkbox.uncheck();
      await submit.click();
      await error.waitFor();
    }
  }
}

const controls = [
  ['Input', 'input', 'form'],
  ['Textarea', 'textarea', 'textarea-comment-draft'],
  ['Select', 'select', 'form'],
  ['Checkbox', 'checkbox', 'form'],
  ['RadioGroup', 'radio-group', 'form'],
  ['Switch', 'switch', 'form'],
  ['SegmentedControl', 'segmented-control', 'form'],
];

async function verifyControlMatrix(page, width) {
  const region = page.getByRole('region', { name: '表单控件接入差异', exact: true });
  const rows = region.locator('tbody tr');
  assert.equal(await rows.count(), 7);
  for (const [index, [name, id, section]] of controls.entries()) {
    assert.equal(
      await rows.nth(index).getByRole('link', { name, exact: true }).getAttribute('href'),
      `#/components/${id}?section=${section}`,
    );
  }
  assert.equal(await region.getAttribute('tabindex'), '0');
  await region.scrollIntoViewIfNeeded();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  if (width === 320) {
    assert.equal(await region.evaluate((node) => node.scrollWidth > node.clientWidth), true);
    await region.focus();
    await requireFocus(page, region);
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(
      () => document.querySelector('[aria-label="表单控件接入差异"]')?.scrollLeft > 0,
    );
  }
}

async function verifyCrosslinks(page, baseURL) {
  for (const [, id, section] of controls) {
    await page.goto(`${baseURL}#/components/${id}?section=${section}`);
    await page.locator(`[id="${section}"]`).waitFor();
    const backlink = page.locator('main .doc-prose a[href^="#/guides/forms"]').first();
    await backlink.waitFor();
    const target = new URLSearchParams((await backlink.getAttribute('href')).split('?')[1]).get(
      'section',
    );
    await backlink.click();
    await waitForGuideReady(page, '原生表单接入');
    await page.waitForFunction((anchor) => document.activeElement?.id === anchor, target);
    assert.equal(new URL(page.url()).hash, `#/guides/forms?section=${target}`);
  }
  for (const [href, target, title] of [
    ['#/guides/interactions?section=feedback', 'feedback', '交互组合'],
    ['#/guides/states?section=scene-article-actions', 'scene-article-actions', '组合示例'],
  ]) {
    await page.goto(`${baseURL}#/guides/forms?section=controls`);
    await waitForGuideReady(page, '原生表单接入');
    await page.locator(`main .doc-prose a[href="${href}"]`).click();
    await waitForGuideReady(page, title);
    await page.waitForFunction((anchor) => document.activeElement?.id === anchor, target);
  }
}

async function verifyLegacyDestinations(page, baseURL) {
  for (const [section, destination] of [
    ['', ''],
    ['validation', 'validation'],
    ['text-field-slots', 'text-field-slots'],
    ['integration', 'form'],
  ]) {
    await page.goto(`${baseURL}#/components/text-field${section ? `?section=${section}` : ''}`);
    await page.getByRole('heading', { level: 1, name: 'Input 输入框', exact: true }).waitFor();
    assert.equal(
      new URL(page.url()).hash,
      `#/components/input${destination ? `?section=${destination}` : ''}`,
    );
    if (destination)
      await page.waitForFunction((id) => document.activeElement?.id === id, destination);
  }
  for (const [route, property] of [
    ['text-field', 'label'],
    ['text-field', 'name / form'],
    ['input', 'classNames'],
  ]) {
    const previous = apiRowAnchor('TextFieldProps', property);
    const current = apiRowAnchor('InputProps', property);
    await page.goto(`${baseURL}#/components/${route}?section=${encodeURIComponent(previous)}`);
    await page.waitForFunction((id) => document.activeElement?.id === id, current);
    assert.equal(
      new URL(page.url()).hash,
      `#/components/input?section=${encodeURIComponent(current)}`,
    );
    assert.equal(await page.evaluate(() => document.activeElement?.tagName), 'TR');
  }
  await page.goto(`${baseURL}#fields`);
  await page.getByRole('heading', { level: 1, name: 'Input 输入框', exact: true }).waitFor();
  assert.equal(
    await page.locator('.docs-sidebar .nav-group a[aria-current="page"]').getAttribute('href'),
    '#/components/input',
  );
  await page.goto(`${baseURL}#/components/radio-group?section=radio-comment-signature`);
  await waitForGuideReady(page, '交互组合');
  await page.waitForFunction(() => document.activeElement?.id === 'radio-comment-signature');
  assert.equal(new URL(page.url()).hash, '#/guides/interactions?section=radio-comment-signature');
  assert.equal(await page.locator('#radio-comment-signature .example-preview form').count(), 1);
}

/** Verify the shared form task, native values, bidirectional links and compatibility destinations. */
export async function verifyFormsGuide(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: width === 320 ? 844 : 900 });
      await page.goto(`${baseURL}#/guides/forms`);
      await waitForGuideReady(page, '原生表单接入');
      assert.equal(await page.locator('.example-block').count(), 1);
      assert.equal(
        await page.locator('.docs-sidebar a[href="#/guides/forms"]').getAttribute('aria-current'),
        'page',
      );
      assert.equal(
        await page
          .getByRole('navigation', { name: '快捷导航', exact: true, includeHidden: true })
          .locator('a[aria-current="page"]')
          .getAttribute('href'),
        '#/guides/getting-started',
      );
      await verifyBasics(page);
      await verifyControlMatrix(page, width);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await verifyCrosslinks(page, baseURL);
    await verifyLegacyDestinations(page, baseURL);
    assert.deepEqual(errors, [], 'Form integration routes have no browser runtime errors.');
  } finally {
    await context.close();
  }
}
