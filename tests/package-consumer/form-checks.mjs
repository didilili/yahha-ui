import assert from 'node:assert/strict';

async function appearance(locator) {
  return locator.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      color: style.color,
      background: style.backgroundColor,
      border: style.borderColor,
      opacity: style.opacity,
      outline: style.outlineStyle,
      fontSize: parseFloat(style.fontSize),
      height: node.getBoundingClientRect().height,
      cursor: style.cursor,
    };
  });
}

function contrast(foreground, background) {
  function luminance(color) {
    const channels = color
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number)
      .map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }
  const values = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
  return (values[1] + 0.05) / (values[0] + 0.05);
}

export async function verifyFormStates(page, width) {
  const input = page.getByRole('textbox', { name: 'Reset field', exact: true });
  const readonly = page.getByRole('textbox', { name: 'Readonly field', exact: true });
  const invalid = page.getByRole('textbox', { name: 'External invalid field', exact: true });
  const disabled = page.getByRole('textbox', { name: 'Disabled plain field', exact: true });
  const choices = page.getByRole('group', { name: 'Keyboard choices', exact: true });
  const first = choices.getByRole('radio', { name: 'First choice', exact: true });
  const last = choices.getByRole('radio', { name: 'Last choice', exact: true });
  const selected = first.locator('..');
  const unselected = last.locator('..');
  const disabledChoice = page
    .getByRole('radio', { name: 'Selected while disabled', exact: true })
    .locator('..');
  const inheritedChoice = page.getByRole('radio', {
    name: 'Inherited selected choice',
    exact: true,
  });

  for (const theme of ['pink', 'blue', 'yellow']) {
    await page.getByRole('combobox', { name: 'Form preview theme' }).selectOption(theme);
    await page.mouse.move(0, 0);
    const normalStyle = await appearance(input);
    const readonlyStyle = await appearance(readonly);
    assert(normalStyle.height >= 44, 'TextField must retain a 44px control target.');
    if (width <= 480)
      assert(
        normalStyle.fontSize >= 16,
        'Small-screen inputs should avoid automatic zoom from sub-16px text.',
      );
    assert.notEqual(
      readonlyStyle.background,
      normalStyle.background,
      'Readonly must be visually distinguishable from editable input.',
    );
    assert.notEqual(
      (await appearance(invalid)).border,
      normalStyle.border,
      'Native aria-invalid=true must have an error border without an error slot.',
    );
    await readonly.focus();
    assert.equal(await readonly.evaluate((node) => document.activeElement === node), true);
    await page.keyboard.type('changed');
    assert.equal(await readonly.inputValue(), 'Copy this address');
    await readonly.hover();
    assert.equal(
      (await appearance(readonly)).background,
      readonlyStyle.background,
      'Readonly should keep its non-editable background on hover.',
    );
    const disabledStyle = await appearance(disabled);
    assert(
      contrast(disabledStyle.color, disabledStyle.background) >= 4.5,
      'Disabled field text remains readable.',
    );

    assert(
      (await appearance(selected)).height >= 44,
      'Each radio label needs its own 44px hit target.',
    );
    await unselected.hover();
    const idleHover = (await appearance(unselected)).background;
    await selected.hover();
    assert.notEqual(
      (await appearance(selected)).background,
      idleHover,
      'Hover must not erase the selected appearance.',
    );
    assert(await first.isChecked());
    const disabledSelectedStyle = await appearance(disabledChoice);
    assert.equal(
      disabledSelectedStyle.opacity,
      '1',
      'Disabled options must not fade text with whole-element opacity.',
    );
    assert(
      contrast(disabledSelectedStyle.color, disabledSelectedStyle.background) >= 4.5,
      'Disabled option text remains readable.',
    );
    assert.equal(await inheritedChoice.isDisabled(), true);
    const inheritedLabel = inheritedChoice.locator('..');
    await inheritedLabel.hover();
    const inheritedStyle = await appearance(inheritedLabel);
    assert.equal(inheritedStyle.cursor, 'not-allowed');
    assert.equal(
      inheritedStyle.background,
      disabledSelectedStyle.background,
      'Ancestor fieldset disabling keeps the selected disabled appearance.',
    );
    assert.equal(
      (
        await appearance(
          page.getByRole('textbox', { name: 'Inherited disabled field', exact: true }),
        )
      ).background,
      disabledStyle.background,
    );
    const groupWidth = (await choices.boundingBox()).width;
    await first.focus();
    await page.keyboard.press('ArrowRight');
    assert(await last.isChecked(), 'Arrow keys still skip disabled options.');
    assert(
      Math.abs((await choices.boundingBox()).width - groupWidth) <= 1,
      'Changing selection should not shift the group width.',
    );
    assert.equal(
      (await appearance(unselected)).outline,
      'solid',
      'Keyboard focus stays visible on the radio label.',
    );
    await page.keyboard.press('ArrowLeft');
    await invalid.focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.matches(':disabled')), false);
  }
  await page.getByRole('combobox', { name: 'Form preview theme' }).selectOption('pink');
}
