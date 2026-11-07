import assert from 'node:assert/strict';
import {
  firstTextRect,
  verifyNativeSelectionFallback,
  verifySelectionContract,
} from './selection-checks.mjs';

const themes = ['pink', 'blue', 'yellow'];
const states = ['normal', 'readonly', 'error', 'disabled'];
const closeTo = (actual, expected, label) =>
  assert(Math.abs(actual - expected) < 0.1, `${label}: expected ${expected}, received ${actual}.`);
const measurement = (locator) =>
  locator.evaluate((node) => {
    const rect = node.getBoundingClientRect(),
      css = getComputedStyle(node);
    return {
      height: rect.height,
      width: rect.width,
      font: parseFloat(css.fontSize),
      scroll: node.scrollWidth,
      client: node.clientWidth,
    };
  });

export async function verifyDesignContract(browser, url) {
  for (const configuration of [
    { viewport: { width: 1280, height: 900 }, hasTouch: false, inputFont: 14 },
    { viewport: { width: 320, height: 640 }, hasTouch: true, inputFont: 16 },
    { viewport: { width: 390, height: 844 }, hasTouch: true, inputFont: 16 },
    { viewport: { width: 1280, height: 900 }, hasTouch: true, inputFont: 16 },
  ]) {
    const context = await browser.newContext({
      viewport: configuration.viewport,
      hasTouch: configuration.hasTouch,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    try {
      await page.goto(`${url}?design-contract`);
      await page.getByRole('heading', { name: 'Installed design contract', exact: true }).waitFor();
      const unthemedAction = page.getByRole('button', {
        name: 'Toggle design loading',
        exact: true,
      });
      const appearanceLoadingBounds = new Map();
      const loadingLayoutBounds = new Map();
      const restingShadow = await unthemedAction.evaluate(
        (node) => getComputedStyle(node).boxShadow,
      );
      assert.notEqual(restingShadow, 'none', 'Standalone actions retain their default paper base.');
      if (!configuration.hasTouch) {
        await unthemedAction.hover();
        await page.mouse.down();
        try {
          const pressedShadow = await unthemedAction.evaluate(
            (node) => getComputedStyle(node).boxShadow,
          );
          assert.notEqual(
            pressedShadow,
            'none',
            'Standalone actions retain their pressed paper base.',
          );
          assert.notEqual(
            pressedShadow,
            restingShadow,
            'A standalone action visibly responds to pressing.',
          );
        } finally {
          await page.mouse.move(0, 0);
          await page.mouse.up();
        }
      }
      for (const theme of themes) {
        const scope = page.locator(`[data-design-theme="${theme}"]`);
        const label = `${theme} ${configuration.viewport.width}px touch=${configuration.hasTouch}`;
        closeTo(
          (await measurement(scope.getByTestId('design-body'))).font,
          16,
          `${label} body font`,
        );
        for (const [id, height] of [
          ['design-button', 44],
          ['design-button-disabled', 44],
          ['design-button-loading', 44],
          ['design-button-sm', 36],
          ['design-button-lg', 52],
          ['design-icon', 44],
          ['design-icon-loading', 44],
        ])
          closeTo((await measurement(scope.getByTestId(id))).height, height, `${label} ${id}`);
        await verifyActionGlyphs(scope, label);
        appearanceLoadingBounds.set(theme, await verifyActionAppearances(scope, label));
        loadingLayoutBounds.set(theme, await verifyLoadingLayout(scope, label));
        await verifyPaperHierarchy(scope, label);
        for (const family of ['field', 'select', 'area']) {
          for (const state of states) {
            const result = await measurement(scope.getByTestId(`design-${family}-${state}`));
            closeTo(result.height, 44, `${label} ${family} ${state} height`);
            closeTo(result.font, configuration.inputFont, `${label} ${family} ${state} font`);
          }
        }
        await verifyNativeDateFields(scope, label);
        await verifyTextarea(page, scope, label);
        await verifyFieldFeedback(page, scope, label);
        if (!configuration.hasTouch) await verifyPressedHover(page, scope, label);
        const longSelect = scope.getByTestId('design-select-long');
        const long = await measurement(longSelect);
        assert(long.height > 44, `${label}: a multiline selected label must grow beyond 44px.`);
        assert(
          long.scroll <= long.client + 1,
          `${label}: long selected label must not overflow horizontally.`,
        );
        assert(
          await longSelect.evaluate((node) => {
            const box = node.getBoundingClientRect();
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
            for (let text = walker.nextNode(); text; text = walker.nextNode()) {
              if (!text.textContent.trim() || text.parentElement.closest('[aria-hidden="true"]'))
                continue;
              const range = document.createRange();
              range.selectNodeContents(text);
              if (
                [...range.getClientRects()].some(
                  (rect) =>
                    rect.top < box.top ||
                    rect.bottom > box.bottom ||
                    rect.left < box.left ||
                    rect.right > box.right,
                )
              )
                return false;
            }
            return true;
          }),
          `${label}: every selected-label line must remain inside the trigger.`,
        );
        await longSelect.click();
        const option = page.getByRole('option');
        await option.waitFor();
        const optionBox = await option.boundingBox();
        assert(
          optionBox.height >= 44 &&
            optionBox.x >= 0 &&
            optionBox.x + optionBox.width <= configuration.viewport.width + 1,
          `${label}: the long option must fit its viewport and keep a 44px target.`,
        );
        await page.keyboard.press('Escape');
        await option.waitFor({ state: 'hidden' });
        await verifyLongOptionMenu(page, scope, label);
        await verifySelectionContract(page, scope, configuration.hasTouch);
      }
      await page.getByRole('button', { name: 'Toggle design loading', exact: true }).click();
      for (const theme of themes) {
        const scope = page.locator(`[data-design-theme="${theme}"]`);
        for (const id of ['design-button-loading', 'design-icon-loading'])
          closeTo(
            (await measurement(scope.getByTestId(id))).height,
            44,
            `${theme} ${id} after loading`,
          );
        for (const [id, before] of appearanceLoadingBounds.get(theme)) {
          const button = scope.getByTestId(id);
          const after = await measurement(button);
          closeTo(after.height, before.height, `${theme} ${id} retains height after loading`);
          closeTo(after.width, before.width, `${theme} ${id} retains width after loading`);
          assert.equal(await button.isDisabled(), false);
          assert.notEqual(await button.getAttribute('aria-busy'), 'true');
        }
        await verifyLoadingLayoutAfter(scope, theme, loadingLayoutBounds.get(theme));
      }
      console.log(
        `Browser design contract passed: ${configuration.viewport.width}px touch=${configuration.hasTouch}, three presets.`,
      );
    } finally {
      await context.close();
    }
  }
  await verifySelectForcedColors(browser, url);
  await verifyShortViewport(browser, url);
}

/** Keep native date editors on the field scale without replacing their browser behavior. */
export async function verifyNativeDateFields(scope, label) {
  const values = [
    ['date', '2026-10-28', '2026-10-29'],
    ['time', '10:30', '11:45'],
    ['datetime-local', '2026-10-28T10:30', '2026-10-29T11:45'],
    ['month', '2026-10', '2026-11'],
    ['week', '2026-W44', '2026-W45'],
  ];
  const form = scope.getByTestId('design-native-dates');
  for (const [type, initial, changed] of values) {
    const input = form.getByTestId(`design-native-${type}`);
    closeTo((await measurement(input)).height, 44, `${label}: native ${type} field height`);
    assert.equal(await input.getAttribute('type'), type);
    assert.equal(await input.inputValue(), initial);
    await input.fill(changed);
    assert.equal(await input.inputValue(), changed, `${label}: native ${type} remains editable.`);
  }
  assert.deepEqual(
    await form.evaluate((node) => [...new FormData(node)]),
    values.map(([type, , changed]) => [type, changed]),
    `${label}: native date values participate in FormData.`,
  );
  const required = form.getByTestId('design-native-date');
  await required.fill('');
  assert.equal(await form.evaluate((node) => node.checkValidity()), false);
  assert.equal(await required.evaluate((node) => node.validity.valueMissing), true);
  await form.getByRole('button', { name: 'Reset native dates', exact: true }).click();
  for (const [type, initial] of values) {
    assert.equal(await form.getByTestId(`design-native-${type}`).inputValue(), initial);
  }
  assert.equal(await form.evaluate((node) => node.checkValidity()), true);
}

async function verifyTextarea(page, scope, label) {
  const starts = [];
  for (const family of ['field', 'area']) {
    for (const part of ['label', 'hint']) {
      starts.push((await firstTextRect(scope.locator(`.design-${family}-error-${part}`))).x);
    }
    const message = scope.locator(`.design-${family}-error-message`);
    const mark = message.locator('svg');
    const labelStart = starts.at(-2);
    closeTo(
      (await firstTextRect(message)).x,
      labelStart + 20,
      `${label}: error text clears its mark`,
    );
    closeTo((await mark.boundingBox()).x, labelStart, `${label}: error mark aligns with the label`);
    assert.equal(await mark.getAttribute('aria-hidden'), 'true');
    assert.equal(await mark.getAttribute('focusable'), 'false');
  }
  for (const start of starts)
    closeTo(start, starts[0], `${label}: field helper text aligns at its first rendered glyph`);
  const textarea = scope.getByTestId('design-area-multiline');
  assert(
    (await measurement(textarea)).height > 44,
    `${label}: multiline notes retain their own height.`,
  );
  assert.equal(await textarea.evaluate((node) => getComputedStyle(node).resize), 'vertical');
  const content = '给今天留一点空白。\n把喜欢的小事写下来。';
  assert.equal(await textarea.inputValue(), content);
  await textarea.fill(`${content}\n这段内容仍可以继续编辑。`);
  assert.equal(await textarea.inputValue(), `${content}\n这段内容仍可以继续编辑。`);
  await textarea.fill(content);
}

async function verifyFieldFeedback(page, scope, label) {
  for (const [state, token] of [
    ['normal', '--yahha-focus'],
    ['error', '--yahha-error'],
  ]) {
    await scope.getByTestId(`design-field-${state}`).focus();
    const leading = await scope.locator(`.design-leading-${state}`).evaluate((node, variable) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${variable})`;
      node.append(probe);
      const expected = getComputedStyle(probe).color;
      probe.remove();
      return { actual: getComputedStyle(node).color, expected };
    }, token);
    assert.equal(
      leading.actual,
      leading.expected,
      `${label}: ${state} field icon follows its state.`,
    );
  }
  for (const state of ['normal', 'error']) {
    const trigger = scope.getByTestId(`design-select-${state}`);
    await trigger.click();
    await page.getByRole('listbox').waitFor();
    const feedback = await trigger.evaluate((node, invalid) => {
      const probe = document.createElement('span');
      probe.style.borderColor = `var(${invalid ? '--yahha-error' : '--yahha-focus'})`;
      probe.style.background = `var(${invalid ? '--yahha-error-field' : '--yahha-accent-soft'})`;
      node.append(probe);
      const expected = getComputedStyle(probe);
      const actual = getComputedStyle(node);
      const result = {
        border: actual.borderColor,
        background: actual.backgroundColor,
        expectedBorder: expected.borderColor,
        expectedBackground: expected.backgroundColor,
      };
      probe.remove();
      return result;
    }, state === 'error');
    assert.equal(
      feedback.border,
      feedback.expectedBorder,
      `${label}: expanded ${state} select border.`,
    );
    assert.equal(
      feedback.background,
      feedback.expectedBackground,
      `${label}: expanded ${state} select paper.`,
    );
    await page.keyboard.press('Escape');
    await page.getByRole('listbox').waitFor({ state: 'hidden' });
  }
}

async function verifyActionGlyphs(scope, label) {
  for (const [size, height, actionGlyph, iconGlyph] of [
    ['sm', 36, 16, 18],
    ['md', 44, 18, 20],
    ['lg', 52, 20, 22],
  ]) {
    for (const [id, glyphSize, centered] of [
      [`design-button-icons-${size}`, actionGlyph, false],
      [`design-icon-${size}`, iconGlyph, true],
    ]) {
      const button = scope.getByTestId(id);
      closeTo((await measurement(button)).height, height, `${label} ${id} height`);
      const geometry = await button.evaluate((node) => {
        const bounds = node.getBoundingClientRect();
        return [...node.querySelectorAll('svg')].map((svg) => {
          const glyph = svg.getBoundingClientRect();
          return {
            width: glyph.width,
            height: glyph.height,
            centerX: glyph.x + glyph.width / 2 - (bounds.x + bounds.width / 2),
            centerY: glyph.y + glyph.height / 2 - (bounds.y + bounds.height / 2),
          };
        });
      });
      assert.equal(geometry.length, centered ? 1 : 2, `${label} ${id} renders its real glyphs.`);
      for (const glyph of geometry) {
        closeTo(glyph.width, glyphSize, `${label} ${id} glyph width`);
        closeTo(glyph.height, glyphSize, `${label} ${id} glyph height`);
        closeTo(glyph.centerY, 0, `${label} ${id} glyph vertical center`);
        if (centered) closeTo(glyph.centerX, 0, `${label} ${id} glyph horizontal center`);
      }
    }
  }
  const longButton = scope.getByTestId('design-button-long');
  const long = await measurement(longButton);
  assert(
    long.height >= 44 && long.scroll <= long.client + 1,
    `${label}: a long action label fits.`,
  );
  assert(
    await longButton.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      for (let text = walker.nextNode(); text; text = walker.nextNode()) {
        if (!text.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(text);
        if (
          [...range.getClientRects()].some(
            (rect) =>
              rect.left < bounds.left - 0.1 ||
              rect.right > bounds.right + 0.1 ||
              rect.top < bounds.top - 0.1 ||
              rect.bottom > bounds.bottom + 0.1,
          )
        )
          return false;
      }
      return true;
    }),
    `${label}: the entire action label remains visible after wrapping.`,
  );
}

/** Exercise both action appearances through the installed package, without site CSS overrides. */
async function actionAppearanceSnapshot(scope) {
  return scope
    .getByTestId('design-decorated-actions')
    .locator('button')
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const bounds = node.getBoundingClientRect();
        const css = getComputedStyle(node);
        const relativeBox = (element) => {
          const box = element.getBoundingClientRect();
          return {
            width: box.width,
            height: box.height,
            left: box.left - bounds.left,
            right: box.right - bounds.left,
            top: box.top - bounds.top,
            bottom: box.bottom - bounds.top,
            centerX: box.left + box.width / 2 - (bounds.left + bounds.width / 2),
            centerY: box.top + box.height / 2 - (bounds.top + bounds.height / 2),
          };
        };
        const glyphs = [...node.querySelectorAll('svg')].filter(
          (svg) => !svg.closest('[data-loading-mark]'),
        );
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        const textRects = [];
        for (let text = walker.nextNode(); text; text = walker.nextNode()) {
          if (!text.textContent.trim() || text.parentElement.closest('[aria-hidden="true"], svg'))
            continue;
          const range = document.createRange();
          range.selectNodeContents(text);
          textRects.push(...range.getClientRects());
        }
        return {
          id: node.dataset.testid,
          width: bounds.width,
          height: bounds.height,
          scrollFits: node.scrollWidth <= node.clientWidth + 1,
          textFits:
            textRects.length === 0 ||
            textRects.every(
              (rect) =>
                rect.left >= bounds.left - 0.1 &&
                rect.right <= bounds.right + 0.1 &&
                rect.top >= bounds.top - 0.1 &&
                rect.bottom <= bounds.bottom + 0.1,
            ),
          opacity: css.opacity,
          color: css.color,
          background: css.backgroundColor,
          borderColor: css.borderTopColor,
          border: css.borderTopStyle,
          transform: css.transform,
          transformLoop: node
            .getAnimations({ subtree: true })
            .some(
              (animation) =>
                animation.playState === 'running' &&
                animation.effect?.getComputedTiming().iterations === Infinity &&
                animation.effect.getKeyframes().some((frame) => 'transform' in frame),
            ),
          glyphs: glyphs.map((glyph) => ({
            ...relativeBox(glyph),
            visibility: getComputedStyle(glyph).visibility,
          })),
        };
      }),
    );
}

async function verifyActionAppearances(scope, label) {
  const samples = scope.getByTestId('design-decorated-actions');
  const snapshots = await actionAppearanceSnapshot(scope);
  const byId = new Map(snapshots.map((sample) => [sample.id, sample]));
  const stateColors = await samples.evaluate((node) => {
    const probe = document.createElement('span');
    node.append(probe);
    const color = (variable) => {
      probe.style.color = `var(${variable})`;
      return getComputedStyle(probe).color;
    };
    const result = {
      error: color('--yahha-error'),
      muted: color('--yahha-muted'),
      disabledSurface: color('--yahha-disabled-surface'),
      selected: color('--yahha-accent-hover'),
    };
    probe.remove();
    return result;
  });
  assert.equal(snapshots.length, 24, `${label}: exercise both appearances and action states.`);
  assert.equal(
    await samples.getByRole('img').count(),
    0,
    `${label}: functional glyphs do not duplicate action names.`,
  );
  assert.equal(await samples.getByRole('button', { name: 'Save', exact: true }).count(), 8);
  assert.equal(await samples.getByRole('button', { name: 'Add note', exact: true }).count(), 6);
  assert.equal(await samples.getByRole('button', { name: 'Save note', exact: true }).count(), 2);
  for (const sample of snapshots) {
    assert(sample.scrollFits && sample.textFits, `${label} ${sample.id}: label fits its control.`);
    assert.equal(sample.opacity, '1', `${label} ${sample.id}: text is not faded as a group.`);
    assert.equal(sample.transformLoop, false, `${label} ${sample.id}: reduced motion stops loops.`);
    assert.equal(
      sample.transform,
      'none',
      `${label} ${sample.id}: reduced motion keeps controls still.`,
    );
  }
  for (const appearance of ['default', 'soft']) {
    for (const [size, height, buttonGlyph, iconGlyph] of [
      ['sm', 36, 16, 18],
      ['md', 44, 18, 20],
      ['lg', 52, 20, 22],
    ]) {
      for (const [family, glyphSize] of [
        ['button', buttonGlyph],
        ['icon', iconGlyph],
      ]) {
        const id = `design-decorated-${family}-${appearance}-${size}`;
        const sample = byId.get(id);
        closeTo(sample.height, height, `${label} ${id} height`);
        assert.equal(sample.glyphs.length, 1, `${label} ${id}: the real action glyph remains.`);
        const [glyph] = sample.glyphs;
        closeTo(glyph.width, glyphSize, `${label} ${id} action glyph width`);
        closeTo(glyph.height, glyphSize, `${label} ${id} action glyph height`);
        assert.equal(glyph.visibility, 'visible');
        if (family === 'icon') {
          closeTo(sample.width, height, `${label} ${id} square target`);
          assert(
            glyph.left >= 0 &&
              glyph.right <= sample.width &&
              glyph.top >= 0 &&
              glyph.bottom <= sample.height,
            `${label} ${id}: the functional glyph stays complete.`,
          );
          closeTo(glyph.centerX, 0, `${label} ${id} action glyph horizontal center`);
          closeTo(glyph.centerY, 0, `${label} ${id} action glyph vertical center`);
        } else {
          closeTo(glyph.centerY, 0, `${label} ${id} action glyph vertical center`);
        }
      }
    }
    const disabled = samples.getByTestId(`design-decorated-disabled-${appearance}`);
    assert.equal(await disabled.isDisabled(), true);
    const disabledSample = byId.get(`design-decorated-disabled-${appearance}`);
    closeTo(disabledSample.height, 44, `${label} ${appearance} disabled target`);
    assert.equal(disabledSample.color, stateColors.muted);
    assert.equal(disabledSample.background, stateColors.disabledSurface);
    const pressed = byId.get(`design-decorated-pressed-${appearance}`);
    assert.equal(pressed.background, stateColors.selected);
    closeTo(pressed.height, 44, `${label} ${appearance} selected target`);
    assert.equal(
      await samples
        .getByTestId(`design-decorated-pressed-${appearance}`)
        .getAttribute('aria-pressed'),
      'true',
    );
    const destructive = byId.get(`design-decorated-destructive-${appearance}`);
    assert.equal(destructive.color, stateColors.error);
    assert.equal(destructive.borderColor, stateColors.error);
    closeTo(destructive.height, 44, `${label} ${appearance} destructive target`);
    assert.equal(
      await samples
        .getByTestId(`design-decorated-destructive-${appearance}`)
        .getAttribute('data-destructive'),
      'true',
    );
    const long = byId.get(`design-decorated-long-${appearance}`);
    assert(long.height > 44, `${label} ${appearance}: a long action label wraps and grows.`);
  }
  const loadingBounds = [];
  for (const appearance of ['default', 'soft']) {
    for (const family of ['loading', 'icon-loading']) {
      const id = `design-decorated-${family}-${appearance}`;
      const button = samples.getByTestId(id);
      assert.equal(await button.isDisabled(), true);
      assert.equal(await button.getAttribute('aria-busy'), 'true');
      closeTo(byId.get(id).height, 44, `${label} ${id} loading target height`);
      if (family === 'icon-loading')
        closeTo(byId.get(id).width, 44, `${label} ${id} loading square target`);
      loadingBounds.push([id, byId.get(id)]);
    }
  }
  return loadingBounds;
}

/** Measure the visible loading group, not an icon hidden inside the button's padding. */
async function loadingLayoutSnapshot(scope) {
  return scope
    .getByTestId('design-loading-actions')
    .getByRole('button')
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const bounds = node.getBoundingClientRect();
        const css = getComputedStyle(node);
        const box = (element) => {
          const rect = element.getBoundingClientRect();
          return {
            left: rect.left - bounds.left,
            right: rect.right - bounds.left,
            top: rect.top - bounds.top,
            bottom: rect.bottom - bounds.top,
            width: rect.width,
            height: rect.height,
          };
        };
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        const text = [];
        for (let item = walker.nextNode(); item; item = walker.nextNode()) {
          if (!item.textContent.trim() || item.parentElement.closest('[aria-hidden="true"], svg'))
            continue;
          const range = document.createRange();
          range.selectNodeContents(item);
          text.push(
            ...[...range.getClientRects()].map((rect) => ({
              left: rect.left - bounds.left,
              right: rect.right - bounds.left,
              top: rect.top - bounds.top,
              bottom: rect.bottom - bounds.top,
            })),
          );
        }
        const mark = node.querySelector('[data-loading-mark="biscuit"]');
        const realGlyphs = [...node.querySelectorAll('svg')]
          .filter(
            (svg) =>
              !svg.closest('[data-loading-mark]') && getComputedStyle(svg).visibility !== 'hidden',
          )
          .map(box);
        const textBox = {
          left: Math.min(...text.map((rect) => rect.left)),
          right: Math.max(...text.map((rect) => rect.right)),
        };
        const markBox = mark ? box(mark) : null;
        const content = [...realGlyphs, ...text, ...(markBox ? [markBox] : [])];
        return {
          id: node.dataset.testid,
          kind: node.dataset.loadingCase,
          size: node.dataset.size,
          direction: css.direction,
          name: node.textContent,
          width: bounds.width,
          height: bounds.height,
          disabled: node.disabled,
          busy: node.getAttribute('aria-busy'),
          mark: markBox,
          text: textBox,
          gap: parseFloat(css.columnGap),
          contentLeft: Math.min(...content.map((rect) => rect.left)),
          contentRight: Math.max(...content.map((rect) => rect.right)),
          textFits: text.every(
            (rect) =>
              rect.left >= 0 &&
              rect.right <= bounds.width &&
              rect.top >= 0 &&
              rect.bottom <= bounds.height,
          ),
          scrollFits: node.scrollWidth <= node.clientWidth + 1,
        };
      }),
    );
}

async function verifyLoadingLayout(scope, label) {
  const snapshots = await loadingLayoutSnapshot(scope);
  assert.equal(snapshots.length, 32, `${label}: loading covers both directions and appearances.`);
  for (const sample of snapshots) {
    const message = `${label} ${sample.id}`;
    assert.equal(sample.disabled, true, `${message}: loading blocks activation.`);
    assert.equal(sample.busy, 'true', `${message}: the true waiting state remains available.`);
    assert(sample.mark, `${message}: loading is visibly represented.`);
    assert(sample.textFits && sample.scrollFits, `${message}: the full label stays readable.`);
    const expected = { sm: 16, md: 18, lg: 20 }[sample.size];
    closeTo(sample.mark.width, expected, `${message} loading frame width`);
    closeTo(sample.mark.height, expected, `${message} loading frame height`);
    closeTo(
      (sample.mark.top + sample.mark.bottom) / 2,
      sample.height / 2,
      `${message} loading frame vertical center`,
    );
    const gap =
      sample.direction === 'rtl'
        ? sample.mark.left - sample.text.right
        : sample.text.left - sample.mark.right;
    closeTo(sample.gap, 8, `${message} loading group gap`);
    if (sample.kind === 'long') {
      assert(gap >= 8 - 0.1, `${message}: multiline text must not overlap the loading frame.`);
      assert(sample.height > 44, `${message}: a long label grows beyond one line.`);
    } else {
      closeTo(gap, 8, `${message} actual loading-to-label gap`);
      closeTo(
        sample.contentLeft,
        sample.width - sample.contentRight,
        `${message} balanced outer space`,
      );
      closeTo(sample.height, { sm: 36, md: 44, lg: 52 }[sample.size], `${message} target height`);
    }
  }
  return new Map(snapshots.map((sample) => [sample.id, sample]));
}

async function verifyLoadingLayoutAfter(scope, label, before) {
  for (const sample of await loadingLayoutSnapshot(scope)) {
    const previous = before.get(sample.id);
    const message = `${label} ${sample.id}`;
    assert.equal(sample.disabled, false, `${message}: completion restores activation.`);
    assert.notEqual(sample.busy, 'true', `${message}: completion clears the waiting state.`);
    assert.equal(sample.mark, null, `${message}: the loading frame is removed on completion.`);
    assert.equal(sample.name, previous.name, `${message}: the visible action label is retained.`);
    assert(sample.textFits && sample.scrollFits, `${message}: the complete label remains visible.`);
    if (sample.kind === 'leading') {
      closeTo(sample.width, previous.width, `${message} keeps the existing icon slot width`);
      closeTo(sample.height, previous.height, `${message} keeps the existing icon slot height`);
    } else if (sample.kind === 'long') {
      closeTo(sample.width, previous.width, `${message} keeps the caller's explicit width`);
      assert(sample.height >= 44, `${message}: wrapping retains the minimum target.`);
    } else {
      closeTo(
        previous.width - sample.width,
        previous.mark.width + previous.gap,
        `${message} the loading frame and gap take real layout space`,
      );
      closeTo(sample.height, previous.height, `${message} retains target height`);
    }
  }
}

async function verifyActionAppearanceForcedColors(page, colorScheme) {
  await page.emulateMedia({ forcedColors: 'none' });
  const before = new Map();
  for (const theme of themes) {
    const scope = page.locator(`[data-design-theme="${theme}"]`);
    before.set(
      theme,
      new Map((await actionAppearanceSnapshot(scope)).map((sample) => [sample.id, sample])),
    );
  }
  await page.emulateMedia({ forcedColors: 'active' });
  for (const theme of themes) {
    const scope = page.locator(`[data-design-theme="${theme}"]`);
    for (const sample of await actionAppearanceSnapshot(scope)) {
      const label = `${theme} ${colorScheme} forced colors ${sample.id}`;
      const normal = before.get(theme).get(sample.id);
      closeTo(sample.width, normal.width, `${label} control width`);
      closeTo(sample.height, normal.height, `${label} control height`);
      assert(sample.textFits && sample.scrollFits, `${label}: action text remains fully readable.`);
      if (!sample.id.includes('loading')) {
        assert.equal(sample.glyphs.length, normal.glyphs.length, `${label}: real glyphs remain.`);
        for (const [index, glyph] of sample.glyphs.entries()) {
          assert.equal(glyph.visibility, 'visible', `${label}: functional glyph stays visible.`);
          closeTo(glyph.width, normal.glyphs[index].width, `${label} glyph width`);
          closeTo(glyph.height, normal.glyphs[index].height, `${label} glyph height`);
          closeTo(glyph.centerX, normal.glyphs[index].centerX, `${label} glyph horizontal center`);
          closeTo(glyph.centerY, normal.glyphs[index].centerY, `${label} glyph vertical center`);
        }
      }
    }
    for (const appearance of ['default', 'soft']) {
      const button = scope.getByTestId(`design-decorated-pressed-${appearance}`);
      await button.focus();
      const focus = await button.evaluate((node) => {
        const css = getComputedStyle(node);
        return {
          border: css.borderTopStyle,
          outline: css.outlineStyle,
          outlineWidth: css.outlineWidth,
          selected: node.getAttribute('aria-pressed'),
        };
      });
      assert.deepEqual(
        focus,
        { border: 'dashed', outline: 'solid', outlineWidth: '2px', selected: 'true' },
        `${theme} ${colorScheme} ${appearance}: selected marker and keyboard focus remain distinct.`,
      );
    }
  }
}

async function verifyPaperHierarchy(scope, label) {
  const paper = await scope.getByTestId('design-surface').evaluate((node) => {
    const neutral = node.querySelector('[data-testid="design-badge-neutral"]');
    const accent = node.querySelector('[data-testid="design-badge-accent"]');
    const success = node.querySelector('[data-testid="design-badge-success"]');
    const control = node.closest('section').querySelector('[data-testid="design-button"]');
    const probe = document.createElement('span');
    probe.style.backgroundColor = 'var(--yahha-accent)';
    node.append(probe);
    const themeAccent = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const surfaceStyle = getComputedStyle(node);
    const successStyle = getComputedStyle(success, '::before');
    return {
      border: surfaceStyle.borderColor,
      neutralBorder: getComputedStyle(neutral).borderColor,
      controlBorder: getComputedStyle(control).borderColor,
      shadow: surfaceStyle.boxShadow,
      accent: getComputedStyle(accent).backgroundColor,
      themeAccent,
      successInk: getComputedStyle(success).color,
      successMark: {
        content: successStyle.content,
        left: parseFloat(successStyle.borderInlineStartWidth),
        bottom: parseFloat(successStyle.borderBlockEndWidth),
      },
    };
  });
  const luminance = (color) => {
    const [r, g, b] = color
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map((value) => {
        const channel = Number(value) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
    return r * 0.2126 + g * 0.7152 + b * 0.0722;
  };
  assert.equal(paper.border, paper.neutralBorder, `${label}: neutral papers share an edge weight.`);
  assert(
    luminance(paper.border) > luminance(paper.controlBorder),
    `${label}: content paper has a lighter edge than an action control.`,
  );
  assert.equal(paper.shadow, 'none', `${label}: the reading surface remains flat.`);
  assert.equal(paper.accent, paper.themeAccent, `${label}: accent paper uses its active theme.`);
  const [r, g, b] = paper.successInk
    .match(/[\d.]+/g)
    .slice(0, 3)
    .map(Number);
  assert(g > r && g > b, `${label}: completion keeps its independent green meaning.`);
  assert(
    paper.successMark.content !== 'none' &&
      paper.successMark.left > 0 &&
      paper.successMark.bottom > 0,
    `${label}: completion retains a non-color checkmark.`,
  );
}

async function verifyPressedHover(page, scope, label) {
  for (const variant of ['primary', 'secondary', 'ghost']) {
    const button = scope.getByTestId(`design-pressed-${variant}`);
    await button.hover();
    const colors = await button.evaluate((node) => {
      const probe = document.createElement('span');
      probe.style.background = 'var(--yahha-accent-hover)';
      node.append(probe);
      const expected = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return { actual: getComputedStyle(node).backgroundColor, expected };
    });
    assert.equal(colors.actual, colors.expected, `${label}: ${variant} hover retains selection.`);
    assert.equal(await button.getAttribute('aria-pressed'), 'true');
  }
}

async function verifyShortViewport(browser, url) {
  for (const width of [1280, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 280 },
      hasTouch: width === 390,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    try {
      await page.goto(`${url}?design-contract`);
      for (const theme of themes) {
        const trigger = page
          .locator(`[data-design-theme="${theme}"]`)
          .getByTestId('design-select-long-menu');
        await trigger.scrollIntoViewIfNeeded();
        await trigger.focus();
        await page.keyboard.press('Enter');
        const list = page.getByRole('listbox');
        await list.waitFor();
        await page.waitForFunction(
          (node) => document.activeElement === node,
          await page.getByRole('option').first().elementHandle(),
        );
        const bounds = await list.evaluate((node) => {
          const popup = node.parentElement.getBoundingClientRect();
          return {
            top: popup.top,
            bottom: popup.bottom,
            left: popup.left,
            right: popup.right,
            client: node.clientHeight,
            scroll: node.scrollHeight,
          };
        });
        assert(
          bounds.top >= 0 && bounds.bottom <= 281 && bounds.left >= 0 && bounds.right <= width + 1,
          `${theme} ${width}×280: menu paper including padding/borders must fit: ${JSON.stringify(bounds)}`,
        );
        assert(
          bounds.client > 0 && bounds.scroll > bounds.client,
          'The short menu remains scrollable.',
        );
        await page.keyboard.press('End');
        await page.waitForFunction(
          (node) => document.activeElement === node,
          await page.getByRole('option').last().elementHandle(),
        );
        await page.keyboard.press('Enter');
        await list.waitFor({ state: 'hidden' });
        assert.match(await trigger.innerText(), /Long menu option 8/);
      }
    } finally {
      await context.close();
    }
  }
}

async function verifyLongOptionMenu(page, scope, label) {
  const trigger = scope.getByTestId('design-select-long-menu');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const options = page.getByRole('option');
  const first = options.first(),
    last = options.last();
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await first.elementHandle(),
  );
  const geometry = await options.evaluateAll((nodes) => {
    const list = nodes[0].parentElement;
    return {
      count: nodes.length,
      scroll: list.scrollHeight,
      client: list.clientHeight,
      rows: nodes.map((node) => {
        const box = node.getBoundingClientRect();
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        const rects = [];
        for (let text = walker.nextNode(); text; text = walker.nextNode()) {
          if (!text.textContent.trim() || text.parentElement.closest('[aria-hidden="true"]'))
            continue;
          const range = document.createRange();
          range.selectNodeContents(text);
          rects.push(...range.getClientRects());
        }
        return {
          height: box.height,
          scroll: node.scrollHeight,
          client: node.clientHeight,
          textTop: Math.min(...rects.map((rect) => rect.top)),
          textBottom: Math.max(...rects.map((rect) => rect.bottom)),
          containsText:
            rects.length > 0 &&
            rects.every(
              (rect) =>
                rect.top >= box.top - 0.1 &&
                rect.bottom <= box.bottom + 0.1 &&
                rect.left >= box.left - 0.1 &&
                rect.right <= box.right + 0.1,
            ),
        };
      }),
    };
  });
  assert.equal(geometry.count, 8, `${label}: exercise a crowded eight-option list.`);
  assert(geometry.scroll > geometry.client + 1, `${label}: the long list must scroll as a whole.`);
  for (const [index, row] of geometry.rows.entries()) {
    assert(
      row.height >= 44 && row.containsText && row.scroll <= row.client + 1,
      `${label}: option ${index + 1} must retain its natural text height: ${JSON.stringify(row)}.`,
    );
    if (index)
      assert(
        geometry.rows[index - 1].textBottom <= row.textTop,
        `${label}: adjacent option text must not overlap.`,
      );
  }
  await page.keyboard.press('End');
  await page.waitForFunction(
    (node) => {
      if (document.activeElement !== node) return false;
      const list = node.parentElement,
        box = node.getBoundingClientRect(),
        viewport = list.getBoundingClientRect();
      return list.scrollTop > 0 && box.top >= viewport.top - 1 && box.bottom <= viewport.bottom + 1;
    },
    await last.elementHandle(),
  );
  await page.keyboard.press('Escape');
  await first.waitFor({ state: 'hidden' });
}

async function verifySelectForcedColors(browser, url) {
  for (const colorScheme of ['light', 'dark']) {
    const page = await browser.newPage({
      forcedColors: 'active',
      colorScheme,
      reducedMotion: 'reduce',
    });
    try {
      await page.goto(`${url}?design-contract`);
      await verifyActionAppearanceForcedColors(page, colorScheme);
      for (const variant of ['primary', 'secondary', 'ghost']) {
        const button = page
          .locator('[data-design-theme="pink"]')
          .getByTestId(`design-pressed-${variant}`);
        await button.hover();
        const state = await button.evaluate((node) => {
          const css = getComputedStyle(node);
          return { border: css.borderTopStyle, selected: node.getAttribute('aria-pressed') };
        });
        assert.deepEqual(
          state,
          { border: 'dashed', selected: 'true' },
          `${colorScheme}: ${variant} selected marker survives forced-color hover.`,
        );
      }
      const trigger = page
        .locator('[data-design-theme="pink"]')
        .getByTestId('design-select-normal');
      await trigger.focus();
      await page.keyboard.press('Enter');
      const selected = page.getByRole('option', { name: 'First design option', exact: true });
      await page.waitForFunction(
        (node) => document.activeElement === node,
        await selected.elementHandle(),
      );
      await page.keyboard.press('ArrowDown');
      const next = page.getByRole('option', { name: 'Next design option', exact: true });
      await page.waitForFunction(
        (node) => document.activeElement === node,
        await next.elementHandle(),
      );
      const css = await next.evaluate((node) => {
        const value = getComputedStyle(node);
        return {
          style: value.outlineStyle,
          width: value.outlineWidth,
          color: value.outlineColor,
          selected: node.getAttribute('aria-selected'),
        };
      });
      assert.equal(css.selected, 'false');
      assert.equal(
        css.style,
        'solid',
        `${colorScheme}: the unselected keyboard option needs a painted focus ring.`,
      );
      assert.equal(css.width, '2px');
      const system = await page.evaluate(() => {
        const node = document.createElement('span');
        node.style.color = 'Highlight';
        document.body.append(node);
        const highlight = getComputedStyle(node).color;
        node.style.color = 'GrayText';
        const gray = getComputedStyle(node).color;
        node.remove();
        return { highlight, gray };
      });
      assert.equal(css.color, system.highlight);
      assert(
        await selected.locator('svg').isVisible(),
        'Keyboard focus must preserve the selected checkmark.',
      );
      await page.keyboard.press('ArrowDown');
      const disabled = page.getByRole('option', { name: 'Disabled design option', exact: true });
      await page.waitForFunction(
        (node) => document.activeElement === node,
        await disabled.elementHandle(),
      );
      assert.equal(await disabled.evaluate((node) => getComputedStyle(node).color), system.gray);
      await page.keyboard.press('Enter');
      assert.equal(
        await disabled.getAttribute('aria-selected'),
        'false',
        'A discoverable disabled option must remain unselectable.',
      );
      assert.equal(await selected.getAttribute('aria-selected'), 'true');
      await page.keyboard.press('Escape');
      await page.getByRole('listbox').waitFor({ state: 'hidden' });
      await verifyNativeSelectionFallback(page, page.locator('[data-design-theme="pink"]'));
      console.log(
        `Browser Select forced colors passed: ${colorScheme}, keyboard focus and disabled state.`,
      );
    } finally {
      await page.close();
    }
  }
}
