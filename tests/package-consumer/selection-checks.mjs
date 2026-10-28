import assert from 'node:assert/strict';

const near = (actual, expected) =>
  assert(Math.abs(actual - expected) < 0.1, `${actual} must equal ${expected}.`);

/** First rendered text line, rather than the containing block's padding box. */
export const firstTextRect = (locator) =>
  locator.evaluate((node) => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      if (!text.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(text);
      const rect = range.getClientRects()[0];
      if (rect) return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }
    throw new Error('The contract expects a visible text line.');
  });

/** Check the rendered marks from the installed package, including optimizer output. */
export async function verifyCheckboxMarks(scope) {
  for (const testId of ['selection-checkbox', 'selection-disabled']) {
    const checkedPaint = await scope.getByTestId(testId).evaluate((node) =>
      ['::before', '::after'].map((pseudo) => {
        const style = getComputedStyle(node, pseudo);
        return { opacity: Number(style.opacity), angle: parseFloat(style.rotate) || 0 };
      }),
    );
    assert(
      checkedPaint.every((part) => part.opacity === 1),
      'Enabled and disabled checked boxes keep both strokes visible.',
    );
    near(checkedPaint[0].angle, 45);
    near(checkedPaint[1].angle, -47);
  }

  const mixed = scope.getByTestId('selection-mixed');
  for (const direction of ['ltr', 'rtl']) {
    for (const disabled of [false, true]) {
      const paint = await mixed.evaluate(
        (node, state) => {
          const previousDirection = node.getAttribute('dir');
          const previousDisabled = node.disabled;
          node.dir = state.direction;
          node.disabled = state.disabled;
          const line = getComputedStyle(node, '::after');
          const before = getComputedStyle(node, '::before');
          const result = {
            angle: parseFloat(line.rotate) || 0,
            width: parseFloat(line.width),
            height: parseFloat(line.height),
            opacity: Number(line.opacity),
            beforeOpacity: Number(before.opacity),
            indeterminate: node.indeterminate,
            ariaChecked: node.getAttribute('aria-checked'),
          };
          if (previousDirection === null) node.removeAttribute('dir');
          else node.setAttribute('dir', previousDirection);
          node.disabled = previousDisabled;
          return result;
        },
        { direction, disabled },
      );
      assert.equal(
        paint.angle,
        0,
        `The ${direction} ${disabled ? 'disabled' : 'enabled'} mixed mark stays horizontal after packaging.`,
      );
      assert(paint.width > paint.height, 'The mixed mark is a short horizontal bar.');
      assert.equal(paint.opacity, 1);
      assert.equal(paint.beforeOpacity, 0, 'A mixed checkbox does not retain a checked stroke.');
      assert.equal(paint.indeterminate, true);
      assert.equal(paint.ariaChecked, 'mixed');
    }
  }
}

export async function verifySelectionContract(page, scope, hasTouch) {
  await verifyCheckboxMarks(scope);
  const checkbox = scope.getByTestId('selection-checkbox');
  const mixed = scope.getByTestId('selection-mixed');
  const toggle = scope.getByTestId('selection-switch');
  for (const input of [checkbox, mixed, scope.getByTestId('selection-disabled')]) {
    const box = await input.boundingBox();
    near(box.width, 22);
    near(box.height, 22);
    near((await input.locator('..').boundingBox()).height, 44);
  }
  const track = await toggle.boundingBox();
  near(track.width, 50);
  near(track.height, 30);
  near((await toggle.locator('..').boundingBox()).height, 44);
  assert.equal(await mixed.getAttribute('aria-checked'), 'mixed');
  assert.equal(await mixed.evaluate((node) => node.indeterminate), true);
  const long = scope.getByTestId('selection-long');
  assert.equal((await long.boundingBox()).width, 22);
  assert.equal(
    await long.locator('..').evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
    true,
  );
  for (const [input, textClass, hintClass] of [
    [long, '.selection-long-text', '.selection-long-hint'],
    [
      scope.getByTestId('selection-switch-long'),
      '.selection-switch-long-text',
      '.selection-switch-long-hint',
    ],
  ]) {
    const mark = await input.boundingBox();
    const text = await firstTextRect(scope.locator(textClass));
    const hint = await firstTextRect(scope.locator(hintClass));
    near(text.x, hint.x);
    assert(
      Math.abs(mark.y + mark.height / 2 - text.y - text.height / 2) <= 2,
      'A long choice keeps its mark centered on the first rendered text line.',
    );
    assert(
      await input.locator('..').evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
      'A long Chinese choice must wrap inside its label.',
    );
  }

  const label = checkbox.locator('..');
  const row = await label.boundingBox();
  await label.click({ position: { x: row.width - 3, y: row.height / 2 } });
  assert.equal(
    await checkbox.isChecked(),
    false,
    'The far side of the label is an actual click target.',
  );
  await checkbox.focus();
  await page.keyboard.press('Space');
  assert.equal(await checkbox.isChecked(), true);
  if (!hasTouch) {
    await page.mouse.move(0, 0);
    const before = await toggle.evaluate((node) => getComputedStyle(node).borderTopColor);
    const disabled = scope.getByTestId('selection-switch-disabled');
    const disabledBefore = await disabled.evaluate((node) => getComputedStyle(node).borderTopColor);
    await toggle.locator('..').hover();
    const after = await toggle.evaluate((node) => getComputedStyle(node).borderTopColor);
    assert.notEqual(after, before, 'Hovering the label also acknowledges the enabled switch.');
    await disabled.locator('..').hover();
    assert.equal(
      await disabled.evaluate((node) => getComputedStyle(node).borderTopColor),
      disabledBefore,
    );
  }
  await toggle.focus();
  await page.keyboard.press('Space');
  assert.equal(await toggle.isChecked(), false);
  const radios = scope.getByTestId('selection-radio');
  const first = radios.getByRole('radio', { name: 'First selection', exact: true });
  const last = radios.getByRole('radio', { name: 'Last selection', exact: true });
  const description = await first.evaluate((node) =>
    (node.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent)
      .join(' / '),
  );
  for (const expected of [
    'Additional selection context',
    'Group selection hint',
    'Choose one selection',
    'First option detail',
  ])
    assert(description.includes(expected), `Focused choice includes ${expected}.`);
  assert.equal(await radios.getAttribute('aria-invalid'), 'true');
  const legendText = await firstTextRect(radios.locator('.selection-radio-legend'));
  near(legendText.x, (await firstTextRect(radios.locator('.selection-radio-hint'))).x);
  near(legendText.x, (await firstTextRect(radios.locator('.selection-radio-error'))).x);
  await first.focus();
  const invalidFocus = await first.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      border: style.borderColor,
      outline: style.outlineColor,
      width: parseFloat(style.outlineWidth),
    };
  });
  assert(invalidFocus.width > 0, 'Invalid choices retain a visible keyboard focus ring.');
  assert.equal(
    invalidFocus.outline,
    invalidFocus.border,
    'The invalid choice and its focus share the error meaning.',
  );
  near((await first.boundingBox()).width, 22);
  await first.check();
  await page.keyboard.press('ArrowRight');
  assert.equal(await last.isChecked(), true, 'Native arrows skip disabled choices.');
  assert.equal(await radios.getAttribute('aria-invalid'), null);
  const selectedPaint = await last.evaluate((node) => {
    const row = node.closest('label');
    const probe = document.createElement('span');
    probe.style.background = 'var(--chi-accent-soft)';
    row.append(probe);
    const expected = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const dot = getComputedStyle(node, '::after');
    return {
      background: getComputedStyle(row).backgroundColor,
      expected,
      dot: dot.content !== 'none' && parseFloat(dot.width) > 0,
      focused: document.activeElement === node,
      outline: parseFloat(getComputedStyle(node).outlineWidth),
    };
  });
  assert.equal(
    selectedPaint.background,
    selectedPaint.expected,
    'A selected radio uses the quiet selection paper.',
  );
  assert(
    selectedPaint.dot && selectedPaint.focused && selectedPaint.outline > 0,
    'The selection dot and keyboard focus remain visible together.',
  );
  const locked = scope
    .getByTestId('selection-radio-locked')
    .getByRole('radio', { name: 'Locked selection', exact: true });
  assert.equal(await locked.isChecked(), true);
  assert.equal(await locked.isDisabled(), true);
  const disabledPaint = await locked.evaluate((node) => ({
    background: getComputedStyle(node.closest('label')).backgroundColor,
    dot: getComputedStyle(node, '::after').content,
  }));
  assert.notEqual(
    disabledPaint.background,
    selectedPaint.background,
    'A disabled selected row avoids the active paper tint.',
  );
  assert.notEqual(disabledPaint.dot, 'none', 'A disabled selected radio still carries its dot.');
  assert.equal(
    await last.evaluate((node) =>
      (node.getAttribute('aria-describedby') ?? '')
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent)
        .join(' / ')
        .includes('Group selection hint'),
    ),
    true,
  );
  const segments = scope.getByTestId('selection-segments');
  const selected = segments.getByRole('radio', { name: 'First selection', exact: true });
  assert.equal(
    await selected.evaluate(
      (node) => document.getElementById(node.getAttribute('aria-describedby'))?.textContent,
    ),
    'Additional selection context',
  );
  near((await selected.locator('..').boundingBox()).height, 44);
  assert.notEqual(
    await segments
      .locator('.selection-tray')
      .evaluate((node) => getComputedStyle(node).borderColor),
    await selected.locator('..').evaluate((node) => getComputedStyle(node).borderColor),
    'The tray has a lighter boundary than its selected paper.',
  );
  await selected.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(
    await segments.getByRole('radio', { name: 'Last selection', exact: true }).isChecked(),
    true,
  );
  const longSegments = scope.getByTestId('selection-segments-long');
  assert(
    await longSegments.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      if (bounds.left < 0 || bounds.right > innerWidth + 1) return false;
      for (const option of node.querySelectorAll('label')) {
        const box = option.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(option.querySelector('span'));
        if (
          box.height < 44 ||
          [...range.getClientRects()].some(
            (line) =>
              line.left < box.left - 0.1 ||
              line.right > box.right + 0.1 ||
              line.top < box.top - 0.1 ||
              line.bottom > box.bottom + 0.1,
          )
        )
          return false;
      }
      return true;
    }),
    'Long segmented choices preserve complete text inside their own paper on narrow screens.',
  );
}

export async function verifyNativeSelectionFallback(page, scope) {
  const radio = scope
    .getByTestId('selection-radio')
    .getByRole('radio', { name: 'First selection', exact: true });
  await radio.check();
  for (const input of [
    scope.getByTestId('selection-checkbox'),
    scope.getByTestId('selection-mixed'),
    scope.getByTestId('selection-switch'),
    radio,
  ]) {
    assert.equal(
      await input.evaluate((node) => getComputedStyle(node).appearance),
      'auto',
      'Forced colors preserve the native selection mark.',
    );
    assert.equal(
      (await input.isChecked()) || (await input.evaluate((node) => node.indeterminate)),
      true,
    );
  }
  const selected = scope
    .getByTestId('selection-segments')
    .getByRole('radio', { name: 'First selection', exact: true });
  await selected.focus();
  // Keyboard activation makes this a keyboard-focus check after the pointer selection above.
  await page.keyboard.press('Space');
  const state = await selected.locator('..').evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      border: style.borderStyle,
      outline: style.outlineStyle,
      width: parseFloat(style.outlineWidth),
    };
  });
  assert.equal(state.border, 'dashed', 'Forced colors keep a selected paper mark.');
  assert(
    state.outline === 'solid' && state.width > 0,
    'Focus remains separate from selection in forced colors.',
  );
}
