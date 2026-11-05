import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

async function geometry(article) {
  return article.evaluate((node) => {
    const paragraphs = [...node.querySelectorAll('p')];
    const style = getComputedStyle(paragraphs[0]);
    const body = paragraphs[0].parentElement;
    return {
      title: node.querySelector('h3').textContent,
      paragraphs: paragraphs.map((paragraph) => paragraph.textContent),
      fontSize: Number.parseFloat(style.fontSize),
      lineHeight: Number.parseFloat(style.lineHeight),
      paragraphGap: Number.parseFloat(getComputedStyle(body).rowGap),
      bodyHeight: body.getBoundingClientRect().height,
      paragraphHeights: paragraphs.map((paragraph) => paragraph.getBoundingClientRect().height),
    };
  });
}

function requireSameContent(actual, expected) {
  assert.equal(actual.title, expected.title);
  assert.deepEqual(
    actual.paragraphs,
    expected.paragraphs,
    'Both layouts use exactly the same prose.',
  );
  assert.equal(actual.fontSize, expected.fontSize, 'Only reading rhythm changes, not font size.');
}

function requireSameGeometry(actual, expected) {
  requireSameContent(actual, expected);
  for (const key of ['lineHeight', 'paragraphGap', 'bodyHeight'])
    assert(Math.abs(actual[key] - expected[key]) <= 0.5, `${key} returns to its standard value.`);
}

export async function verifyRadioReadingLayout(
  page,
  example = page
    .getByRole('group', { name: '阅读版式', exact: true, includeHidden: true })
    .locator('..'),
) {
  await revealExample(example);
  const group = example.getByRole('group', { name: '阅读版式', exact: true });
  const standard = group.getByRole('radio', { name: '标准', exact: true });
  const relaxed = group.getByRole('radio', { name: '宽松', exact: true });
  const article = example.getByRole('article', { name: '阅读版式预览', exact: true });
  const reset = example.getByRole('button', { name: '恢复标准版式', exact: true });
  const status = example.getByRole('status');
  await group.waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  async function requireSelection(value) {
    const selected = value === 'standard' ? standard : relaxed;
    const node = await selected.elementHandle();
    try {
      await page.waitForFunction((element) => element.checked, node);
    } finally {
      await node.dispose();
    }
    assert.equal(await group.getByRole('radio', { checked: true }).count(), 1);
    assert.equal(
      (await status.innerText()).trim(),
      `当前版式：${value === 'standard' ? '标准' : '宽松'}。`,
    );
    assert.equal(await status.count(), 1);
    assert.equal(await example.locator('[aria-live]').count(), 0);
    assert.equal(await article.getAttribute('aria-live'), null);
  }

  await requireSelection('standard');
  assert.equal(await article.locator('p').count(), 3);
  const initial = await geometry(article);
  const originalParagraph = await article.locator('p').first().elementHandle();
  const controlFontSize = await standard.evaluate(
    (node) => getComputedStyle(node.closest('label')).fontSize,
  );
  try {
    for (const radio of [standard, relaxed])
      assert(
        await radio.evaluate((node) => node.closest('label').getBoundingClientRect().height >= 44),
      );

    await relaxed.focus();
    await relaxed.click();
    await requireSelection('relaxed');
    const pointerFocus = await article.evaluate((node) => {
      const active = document.activeElement;
      return {
        tag: active?.tagName,
        value: active?.getAttribute('value'),
        inArticle: node.contains(active),
        inStatus: active?.closest('[role="status"]') != null,
      };
    });
    assert.equal(pointerFocus.inArticle, false, 'Pointer selection does not focus the prose.');
    assert.equal(pointerFocus.inStatus, false, 'Pointer selection does not focus the status.');
    const spacious = await geometry(article);
    requireSameContent(spacious, initial);
    assert(
      spacious.lineHeight > initial.lineHeight,
      'The relaxed prose has greater computed line height.',
    );
    assert(spacious.paragraphGap > initial.paragraphGap, 'The actual paragraph gap increases.');
    assert(spacious.bodyHeight > initial.bodyHeight, 'The prose occupies more layout space.');
    assert.equal(
      await relaxed.evaluate((node) => getComputedStyle(node.closest('label')).fontSize),
      controlFontSize,
    );
    assert.equal(
      await article
        .locator('p')
        .first()
        .evaluate((node, original) => node === original, originalParagraph),
      true,
    );

    await standard.focus();
    await standard.press('Space');
    await requireSelection('standard');
    await requireFocus(page, standard);
    requireSameGeometry(await geometry(article), initial);
    await standard.press('ArrowDown');
    await requireSelection('relaxed');
    await requireFocus(page, relaxed);
    await relaxed.press('ArrowUp');
    await requireSelection('standard');
    await requireFocus(page, standard);
    await relaxed.focus();
    await relaxed.press('Space');
    await requireSelection('relaxed');
    await requireFocus(page, relaxed);

    await reset.focus();
    await reset.press('Enter');
    await requireSelection('standard');
    await requireFocus(page, reset);
    const restored = await geometry(article);
    requireSameGeometry(restored, initial);
    await reset.press('Space');
    await requireSelection('standard');
    await requireFocus(page, reset);
    requireSameGeometry(await geometry(article), initial);
    return { initial, relaxed: spacious, restored, pointerFocus };
  } finally {
    await originalParagraph.dispose();
  }
}
