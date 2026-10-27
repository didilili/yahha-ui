import assert from 'node:assert/strict';
import {
  firstTextRect,
  verifyNativeSelectionFallback,
  verifySelectionContract,
} from './selection-checks.mjs';

const themes = ['chiikawa', 'hachiware', 'usagi'];
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
        await verifyPaperHierarchy(scope, label);
        for (const family of ['field', 'select', 'area']) {
          for (const state of states) {
            const result = await measurement(scope.getByTestId(`design-${family}-${state}`));
            closeTo(result.height, 44, `${label} ${family} ${state} height`);
            closeTo(result.font, configuration.inputFont, `${label} ${family} ${state} font`);
          }
        }
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

async function verifyTextarea(page, scope, label) {
  const starts = [];
  for (const family of ['field', 'area']) {
    for (const part of ['label', 'hint', 'message']) {
      starts.push((await firstTextRect(scope.locator(`.design-${family}-error-${part}`))).x);
    }
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
    ['normal', '--chi-focus'],
    ['error', '--chi-error'],
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
      probe.style.borderColor = `var(${invalid ? '--chi-error' : '--chi-focus'})`;
      probe.style.background = `var(${invalid ? '--chi-error-field' : '--chi-accent-soft'})`;
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

async function verifyPaperHierarchy(scope, label) {
  const paper = await scope.getByTestId('design-surface').evaluate((node) => {
    const neutral = node.querySelector('[data-testid="design-badge-neutral"]');
    const accent = node.querySelector('[data-testid="design-badge-accent"]');
    const success = node.querySelector('[data-testid="design-badge-success"]');
    const control = node.closest('section').querySelector('[data-testid="design-button"]');
    const probe = document.createElement('span');
    probe.style.backgroundColor = 'var(--chi-accent)';
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
      probe.style.background = 'var(--chi-accent-hover)';
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
      for (const variant of ['primary', 'secondary', 'ghost']) {
        const button = page
          .locator('[data-design-theme="chiikawa"]')
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
        .locator('[data-design-theme="chiikawa"]')
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
      await verifyNativeSelectionFallback(page, page.locator('[data-design-theme="chiikawa"]'));
      console.log(
        `Browser Select forced colors passed: ${colorScheme}, keyboard focus and disabled state.`,
      );
    } finally {
      await page.close();
    }
  }
}
