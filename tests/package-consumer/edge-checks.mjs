import assert from 'node:assert/strict';
import { verifyContentResources } from './content-checks.mjs';

export async function verifyReviewRegressions(browser, url) {
  for (const width of [1280, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    let imageRequests = 0;
    await page.route('**/review-avatar.svg', (route) => {
      imageRequests += 1;
      return route.fulfill(
        imageRequests === 1
          ? { status: 404, body: 'Missing avatar' }
          : {
              status: 200,
              contentType: 'image/svg+xml',
              body: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="7" fill="pink"/></svg>',
            },
      );
    });
    try {
      await page.goto(`${url}?edge-cases`);
      const tabs = page.getByTestId('review-rtl-tabs');
      const middle = tabs.getByRole('tab', { name: 'B', exact: true });
      const left = tabs.getByRole('tab', { name: 'C', exact: true });
      await middle.focus();
      await page.keyboard.press('ArrowLeft');
      assert.equal(await left.evaluate((node) => document.activeElement === node), true);
      assert.ok((await left.boundingBox()).x < (await middle.boundingBox()).x);
      await page.keyboard.press('Enter');
      assert.equal(await left.getAttribute('aria-selected'), 'true');

      const select = page.getByRole('combobox', { name: 'Delayed external select', exact: true });
      for (let version = 0; version < 2; version += 1) {
        await page
          .getByRole('button', { name: 'Mount or replace external form', exact: true })
          .click();
        await select.click();
        await page.getByRole('option', { name: 'Review B', exact: true }).click();
        assert.equal(
          await page
            .locator('#review-external-form')
            .evaluate((form) => new FormData(form).get('review-choice')),
          'b',
        );
        await page.getByRole('button', { name: 'Reset external select', exact: true }).click();
        await page.waitForFunction(
          () =>
            new FormData(document.getElementById('review-external-form')).get('review-choice') ===
            'a',
        );
        assert.match(await select.textContent(), /Review A/);
      }

      const accordion = page.getByTestId('review-accordion');
      const firstPanel = accordion.getByRole('button', { name: 'Review panel A', exact: true });
      const secondPanel = accordion.getByRole('button', { name: 'Review panel B', exact: true });
      await firstPanel.click();
      await secondPanel.click();
      await page
        .getByRole('textbox', { name: 'Review retained draft', exact: true })
        .fill('Keep this draft');
      await page.getByRole('button', { name: 'Toggle review accordion mode', exact: true }).click();
      assert.equal(await firstPanel.getAttribute('aria-expanded'), 'true');
      assert.equal(await secondPanel.getAttribute('aria-expanded'), 'false');
      assert.equal(
        await page
          .getByRole('textbox', { name: 'Review retained draft', exact: true })
          .inputValue(),
        'Keep this draft',
      );
      await page.getByRole('button', { name: 'Toggle review accordion mode', exact: true }).click();
      assert.equal(await secondPanel.getAttribute('aria-expanded'), 'false');

      const picture = page.getByTestId('review-avatar').locator('img');
      const failedImage = page.waitForResponse((response) =>
        response.url().endsWith('/review-avatar.svg'),
      );
      await page.getByRole('button', { name: 'Load review avatar', exact: true }).click();
      await failedImage;
      await page.waitForFunction(
        () => !document.querySelector('[data-testid="review-avatar"] img'),
      );
      assert.equal(imageRequests, 1);
      await page.getByRole('button', { name: 'Clear review avatar', exact: true }).click();
      await page.getByRole('button', { name: 'Load review avatar', exact: true }).click();
      await picture.waitFor();
      await picture.evaluate((node) => node.decode());
      assert.equal(imageRequests, 2);
      assert.ok(await picture.evaluate((node) => node.naturalWidth > 0));
      await verifyContentResources(page);
      assert.deepEqual(errors, []);
      console.log(
        `Browser review regressions passed: ${width}px RTL tabs, live external-form reset, accordion mode and avatar retry.`,
      );
    } finally {
      await page.close();
    }
  }
}
import { verifyFormStates } from './form-checks.mjs';

async function focused(page, locator) {
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await locator.elementHandle(),
  );
}

async function fits(locator, label) {
  const measurements = await locator.evaluate((node) => ({
    scroll: node.scrollWidth,
    client: node.clientWidth,
  }));
  assert(
    measurements.scroll <= measurements.client + 1,
    `${label} must wrap without horizontal overflow: ${JSON.stringify(measurements)}`,
  );
}

async function textWithinButtonBackground(locator) {
  const inside = await locator.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const radius = Math.min(
      parseFloat(getComputedStyle(node).borderTopLeftRadius),
      box.width / 2,
      box.height / 2,
    );
    const contains = (x, y) => {
      x -= box.left;
      y -= box.top;
      const nearestX = Math.max(radius, Math.min(box.width - radius, x));
      const nearestY = Math.max(radius, Math.min(box.height - radius, y));
      return (x - nearestX) ** 2 + (y - nearestY) ** 2 <= radius ** 2 + 1;
    };
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      if (!text.textContent.trim() || text.parentElement.closest('[aria-hidden="true"]')) continue;
      const range = document.createRange();
      range.selectNodeContents(text);
      for (const rect of range.getClientRects()) {
        if (
          !contains(rect.left, rect.top) ||
          !contains(rect.right, rect.top) ||
          !contains(rect.left, rect.bottom) ||
          !contains(rect.right, rect.bottom)
        )
          return false;
      }
    }
    return true;
  });
  assert(inside, 'Multiline button text must remain within the painted rounded background.');
}

async function feedbackColumns(locator, label, toast = false) {
  const geometry = await locator.evaluate((node) => {
    const [icon, body, close] = [...node.children].map((child) => child.getBoundingClientRect());
    const range = document.createRange();
    range.selectNodeContents(node.children[1].firstElementChild);
    const line = range.getClientRects()[0];
    const box = node.getBoundingClientRect();
    return {
      separate: icon.right <= body.left && (!close || body.right <= close.left),
      contained: icon.left >= box.left && (close ?? body).right <= box.right,
      iconCenter: Math.abs(icon.top + icon.height / 2 - line.top - line.height / 2),
      closeCenter: close && Math.abs(close.top + close.height / 2 - line.top - line.height / 2),
      closeSize: close && Math.min(close.width, close.height),
    };
  });
  assert(
    geometry.separate && geometry.contained,
    `${label}: feedback columns must not overlap or overflow.`,
  );
  if (toast) {
    assert(
      geometry.iconCenter <= 2 && geometry.closeCenter <= 2,
      `${label}: stamp and close must align with the first title line: ${JSON.stringify(geometry)}`,
    );
    assert(geometry.closeSize >= 44, `${label}: closing a toast needs a 44px target.`);
  }
}

export async function verifyEdgeCases(browser, url) {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 320, height: 640 },
    { width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    page.setDefaultTimeout(10_000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type())) errors.push(message.text());
    });
    try {
      await page.goto(`${url}?edge-cases`);
      await page.getByRole('heading', { name: 'Component edge cases' }).waitFor();

      const choices = page.getByRole('group', { name: 'Keyboard choices', exact: true });
      const first = choices.getByRole('radio', { name: 'First choice', exact: true });
      const last = choices.getByRole('radio', { name: 'Last choice', exact: true });
      const disabled = choices.getByRole('radio', { name: 'Disabled choice', exact: true });
      // Check the actual native hit target: .check() must work without force.
      await last.check();
      await first.check();
      for (const radio of [first, last]) {
        assert(
          await radio.evaluate((node) => {
            const input = node.getBoundingClientRect(),
              label = node.parentElement.getBoundingClientRect();
            const css = getComputedStyle(node.parentElement);
            return (
              input.left <= label.left + parseFloat(css.borderLeftWidth) + 1 &&
              input.right >= label.right - parseFloat(css.borderRightWidth) - 1 &&
              input.top <= label.top + parseFloat(css.borderTopWidth) + 1 &&
              input.bottom >= label.bottom - parseFloat(css.borderBottomWidth) - 1
            );
          }),
          'The native radio must cover the label interior, including its padding.',
        );
      }
      await first.focus();
      for (const [key, expected] of [
        ['ArrowRight', last],
        ['ArrowRight', first],
        ['ArrowLeft', last],
      ]) {
        await page.keyboard.press(key);
        await focused(page, expected);
        assert(await expected.isChecked(), `${key} must also change the selected value.`);
        assert.equal(
          await disabled.isChecked(),
          false,
          'Arrow navigation must skip disabled radios.',
        );
      }
      await page.keyboard.press('Tab');
      const resetInput = page.getByRole('textbox', { name: 'Reset field', exact: true });
      await focused(page, resetInput);
      await page.keyboard.press('Shift+Tab');
      await focused(page, last);
      await resetInput.fill('changed');
      await page.getByRole('button', { name: 'Reset form', exact: true }).click();
      assert.equal(await resetInput.inputValue(), 'initial');
      assert(
        await first.isChecked(),
        'A caller-managed reset must restore the controlled radio value.',
      );
      await verifyFormStates(page, viewport.width);

      for (const testId of [
        'long-button',
        'long-alert',
        'long-empty',
        'long-toast',
        'long-field',
        'long-choice',
        'long-badge',
        'long-surface',
      ]) {
        await fits(page.getByTestId(testId), `${viewport.width}px ${testId}`);
      }
      for (const button of await page.getByTestId('long-button').getByRole('button').all()) {
        await textWithinButtonBackground(button);
      }
      for (const id of ['long-empty', 'long-toast']) {
        const action = page.getByTestId(id).getByRole('button', { name: /^https:/ });
        await fits(action, `${viewport.width}px ${id} action`);
        await textWithinButtonBackground(action);
      }
      await feedbackColumns(page.getByTestId('long-alert').getByRole('note'), 'Multiline alert');
      await feedbackColumns(
        page.getByTestId('long-toast').getByRole('status'),
        'Multiline toast',
        true,
      );
      const disabledColor = await page
        .getByRole('textbox', { name: 'Disabled plain field', exact: true })
        .evaluate((node) => getComputedStyle(node).backgroundColor);
      assert.equal(
        await page
          .getByRole('textbox', { name: 'Disabled invalid field', exact: true })
          .evaluate((node) => getComputedStyle(node).backgroundColor),
        disabledColor,
        'An error must not replace the disabled background.',
      );
      assert.equal(
        await page
          .getByRole('button', { name: 'Loading edge button', exact: true })
          .evaluate((node) => node.getAnimations({ subtree: true }).length),
        0,
        'Reduced motion must stop the loading animation.',
      );

      const trigger = page.getByTestId('edge-dialog-trigger');
      await trigger.click();
      const dialog = page.getByRole('dialog');
      await dialog.waitFor({ state: 'visible' });
      await focused(
        page,
        dialog.getByRole('textbox', { name: 'Dialog keyboard input', exact: true }),
      );
      await fits(dialog, `${viewport.width}px long dialog`);
      const geometry = await dialog.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          width: innerWidth,
          height: innerHeight,
        };
      });
      assert(
        geometry.left >= 0 &&
          geometry.right <= geometry.width &&
          geometry.top >= 0 &&
          geometry.bottom <= geometry.height,
        `Dialog must fit the viewport: ${JSON.stringify(geometry)}`,
      );

      const close = dialog.getByRole('button', { name: '关闭弹窗', exact: true });
      const footer = dialog.getByRole('button', { name: 'Confirm edge dialog', exact: true });
      await footer.focus();
      await page.keyboard.press('Tab');
      await focused(page, close);
      await page.keyboard.press('Shift+Tab');
      await focused(page, footer);
      for (const key of [
        'Tab',
        'Tab',
        'Tab',
        'Tab',
        'Shift+Tab',
        'Shift+Tab',
        'Shift+Tab',
        'Shift+Tab',
      ]) {
        await page.keyboard.press(key);
        // Base UI may briefly focus its guard before moving back into the popup.
        await page.waitForFunction(() =>
          Boolean(document.activeElement?.closest('[role="dialog"]')),
        );
      }
      await dialog.getByRole('button', { name: 'Change open dialog theme', exact: true }).click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[role="dialog"]')
            ?.closest('[data-yahha-theme]')
            ?.getAttribute('data-yahha-theme') === 'blue',
      );
      assert.equal(
        await dialog.evaluate((node) => getComputedStyle(node).borderColor),
        'rgb(82, 106, 122)',
        'An open popup must update when the provider theme changes.',
      );

      await close.focus();
      assert.equal(
        await dialog.evaluate((node) => {
          const title = node.querySelector('h2');
          const closeButton = node.querySelector('button');
          if (!title || !closeButton)
            throw new Error('The dialog fixture is missing its title or close button.');
          const closeRect = closeButton.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(title);
          return [...range.getClientRects()].some(
            (rect) =>
              rect.left < closeRect.right &&
              rect.right > closeRect.left &&
              rect.top < closeRect.bottom &&
              rect.bottom > closeRect.top,
          );
        }),
        false,
        'Long title text must not overlap the close button.',
      );
      await footer.focus();
      assert(
        await footer.evaluate((node) => {
          const rect = node.getBoundingClientRect();
          const popup = node.closest('[role="dialog"]').getBoundingClientRect();
          return (
            rect.left >= popup.left &&
            rect.right <= popup.right &&
            rect.top >= popup.top &&
            rect.bottom <= popup.bottom
          );
        }),
        'The long footer action must remain reachable within the scrolling popup.',
      );
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      await focused(page, trigger);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
        'The fixture must not create page-wide horizontal scrolling.',
      );
      assert.deepEqual(
        errors,
        [],
        `${viewport.width}px fixture emitted browser errors or warnings.`,
      );
      console.log(
        `Browser: ${viewport.width}px keyboard, reset, long content, popup focus/scroll, and live theme passed.`,
      );
    } finally {
      await page.close();
    }
  }
  await verifyForcedColors(browser, url);
}

/** Verify painted states after the browser replaces author colors and drops shadows. */
export async function verifyForcedColors(browser, url) {
  for (const colorScheme of ['light', 'dark']) {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
      forcedColors: 'active',
      reducedMotion: 'reduce',
      colorScheme,
    });
    const failures = [];
    const check = (condition, message) => {
      if (!condition) failures.push(message);
    };
    try {
      await page.goto(`${url}?edge-cases`);
      await page.getByRole('heading', { name: 'Forced color states', exact: true }).waitFor();
      const canvas = await page.evaluate(() => {
        const probe = document.createElement('span');
        probe.style.backgroundColor = 'Canvas';
        document.body.append(probe);
        const color = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return color;
      });
      const appearance = (locator) =>
        locator.evaluate((node, fallback) => {
          const style = getComputedStyle(node);
          return [
            style.color,
            style.backgroundColor.replace(/rgba\([^)]*,\s*0\)$/, fallback),
            style.borderColor,
            style.borderStyle,
            style.borderWidth,
          ];
        }, canvas);

      for (const variant of ['primary', 'secondary', 'ghost']) {
        for (const kind of ['button', 'icon']) {
          const toggle = page.getByTestId(`forced-${kind}-${variant}-pressed`);
          const ordinary = page.getByTestId(`forced-${kind}-${variant}-plain`);
          const selected = await appearance(toggle);
          check(
            JSON.stringify(selected) !== JSON.stringify(await appearance(ordinary)),
            `${kind} ${variant}: pressed must differ visibly from unpressed.`,
          );
          check(
            selected[0] !== canvas,
            `${kind} ${variant}: pressed text must remain visible over the Canvas text backplate.`,
          );
          await ordinary.hover();
          const ordinaryHover = await appearance(ordinary);
          await toggle.hover();
          const selectedHover = await appearance(toggle);
          check(
            JSON.stringify(selectedHover) !== JSON.stringify(ordinaryHover) &&
              selectedHover[0] !== canvas,
            `${kind} ${variant}: hover must preserve visible pressed state and text.`,
          );
          await page.keyboard.press('Tab');
          await toggle.focus();
          const selectedFocus = await appearance(toggle);
          check(
            selectedFocus[0] !== canvas &&
              JSON.stringify(selectedFocus) !== JSON.stringify(await appearance(ordinary)) &&
              (await toggle.evaluate((node) => getComputedStyle(node).outlineWidth)) === '2px',
            `${kind} ${variant}: pressed state, readable text and 2px keyboard focus must coexist.`,
          );
          await toggle.click();
          await toggle.evaluate((node) => node.blur());
          await page.mouse.move(0, 0);
          check(
            (await toggle.getAttribute('aria-pressed')) === 'false' &&
              JSON.stringify(selected) !== JSON.stringify(await appearance(toggle)),
            `${kind} ${variant}: toggling off must remove its visible pressed state.`,
          );
          await toggle.click();
          await toggle.evaluate((node) => node.blur());
          await page.mouse.move(0, 0);
        }
      }
      check(
        JSON.stringify(await appearance(page.getByTestId('forced-disabled-pressed'))) !==
          JSON.stringify(await appearance(page.getByTestId('forced-disabled-plain'))),
        'Disabled pressed buttons must retain a visible state marker.',
      );

      for (const label of [
        'Keyboard choices',
        'Disabled selected choices',
        'Inherited disabled choices',
      ]) {
        const group = page.getByRole('group', { name: label, exact: true });
        const checked = group.getByRole('radio', { checked: true });
        const unchecked = group.getByRole('radio', { checked: false }).last();
        check(
          JSON.stringify(await appearance(checked.locator('..'))) !==
            JSON.stringify(await appearance(unchecked.locator('..'))),
          `${label}: checked and unchecked options must have distinct painted states.`,
        );
      }
      const choices = page.getByRole('group', { name: 'Keyboard choices', exact: true });
      const firstChoice = choices.getByRole('radio', { name: 'First choice', exact: true });
      const lastChoice = choices.getByRole('radio', { name: 'Last choice', exact: true });
      await lastChoice.locator('..').hover();
      const ordinaryChoiceHover = await appearance(lastChoice.locator('..'));
      await firstChoice.locator('..').hover();
      const checkedChoiceHover = await appearance(firstChoice.locator('..'));
      check(
        checkedChoiceHover[0] !== canvas &&
          JSON.stringify(checkedChoiceHover) !== JSON.stringify(ordinaryChoiceHover),
        'Segmented hover must preserve visible selection and readable text.',
      );
      await choices.getByRole('radio', { name: 'First choice', exact: true }).focus();
      await page.keyboard.press('ArrowRight');
      check(
        await choices.getByRole('radio', { name: 'Last choice', exact: true }).isChecked(),
        'Forced colors must preserve native segmented keyboard selection.',
      );
      check(
        JSON.stringify(
          await appearance(
            choices.getByRole('radio', { name: 'Last choice', exact: true }).locator('..'),
          ),
        ) !==
          JSON.stringify(
            await appearance(
              choices.getByRole('radio', { name: 'First choice', exact: true }).locator('..'),
            ),
          ),
        'Segmented keyboard selection must move the visible state marker.',
      );
      check(
        (await appearance(lastChoice.locator('..')))[0] !== canvas &&
          (await lastChoice
            .locator('..')
            .evaluate((node) => getComputedStyle(node).outlineWidth)) === '2px',
        'Segmented readable selection and 2px keyboard focus must coexist.',
      );

      const tabs = page.getByTestId('forced-tabs');
      const firstTab = tabs.getByRole('tab', { name: 'First forced tab', exact: true });
      const lastTab = tabs.getByRole('tab', { name: 'Last forced tab', exact: true });
      const marker = (locator) =>
        locator.evaluate((node, fallback) => {
          const style = getComputedStyle(node, '::after');
          const parent = getComputedStyle(node);
          const background = parent.backgroundColor.replace(/rgba\([^)]*,\s*0\)$/, fallback);
          const borderVisible =
            parseFloat(style.borderBottomWidth) > 0 &&
            style.borderBottomStyle !== 'none' &&
            style.borderBottomColor !== background;
          return {
            visible:
              Number(style.opacity) > 0 &&
              (borderVisible ||
                style.backgroundColor.replace(/rgba\([^)]*,\s*0\)$/, background) !== background),
            center:
              parseFloat(style.left) +
              parseFloat(style.width) / 2 +
              new DOMMatrix(style.transform).m41,
            target: node.getBoundingClientRect().width / 2,
          };
        }, canvas);
      for (const direction of ['ltr', 'rtl']) {
        await tabs.evaluate((node, value) => (node.dir = value), direction);
        const selected = await marker(firstTab);
        check(selected.visible, `${direction}: the selected tab underline must be painted.`);
        check(
          !(await marker(lastTab)).visible,
          `${direction}: unselected tabs must have no marker.`,
        );
        check(
          Math.abs(selected.center - selected.target) < 0.1,
          `${direction}: the underline must remain centered.`,
        );
      }
      await tabs.evaluate((node) => (node.dir = 'ltr'));
      await firstTab.focus();
      await page.keyboard.press('ArrowRight');
      check(
        (await firstTab.getAttribute('aria-selected')) === 'true' &&
          (await lastTab.evaluate((node) => getComputedStyle(node).outlineWidth)) === '2px',
        'Tab selection and the separate 2px keyboard focus must coexist.',
      );
      await page.keyboard.press('Enter');
      check(
        (await lastTab.getAttribute('aria-selected')) === 'true' &&
          (await marker(lastTab)).visible &&
          !(await marker(firstTab)).visible,
        'Activating another tab must move its visible selection marker.',
      );

      const loadingIds = [
        ...['sm', 'md', 'lg'].map((size) => `forced-spinner-${size}`),
        'forced-loading-button',
        'forced-loading-start-icon',
        'forced-loading-icon',
      ];
      const sizes = [];
      for (const id of loadingIds) {
        const loading = page.getByTestId(id);
        sizes.push(await loading.boundingBox());
        if (id.startsWith('forced-spinner-')) {
          const expected = { sm: 16, md: 24, lg: 36 }[id.split('-').at(-1)];
          check(
            Math.abs(sizes.at(-1).width - expected) < 0.1 &&
              Math.abs(sizes.at(-1).height - expected) < 0.1,
            `${id}: spinner size must remain ${expected}px.`,
          );
        }
        const dots = await loading.evaluate((node, fallback) => {
          const mark = [...node.querySelectorAll('[aria-hidden="true"]')].find(
            (child) => child.children.length === 3,
          );
          if (!mark) return [];
          let background = fallback;
          for (let parent = mark.parentElement; parent; parent = parent.parentElement) {
            const color = getComputedStyle(parent).backgroundColor;
            if (!/rgba\([^)]*,\s*0\)$/.test(color)) {
              background = color;
              break;
            }
          }
          return [...mark.children].map((dot) => {
            const style = getComputedStyle(dot);
            const rect = dot.getBoundingClientRect();
            return (
              rect.width > 0 &&
              rect.height > 0 &&
              Number(style.opacity) > 0 &&
              ((parseFloat(style.borderTopWidth) > 0 &&
                style.borderTopStyle !== 'none' &&
                style.borderTopColor !== background) ||
                style.backgroundColor.replace(/rgba\([^)]*,\s*0\)$/, background) !== background)
            );
          });
        }, canvas);
        check(
          dots.length === 3 && dots.every(Boolean),
          `${id}: all three loading dots must be painted against their actual background.`,
        );
        check(
          (await loading.evaluate((node) => node.getAnimations({ subtree: true }).length)) === 0,
          `${id}: reduced motion must still stop loading animations.`,
        );
      }
      await page.getByRole('button', { name: 'Toggle loading fixtures', exact: true }).click();
      for (const [index, id] of loadingIds.entries()) {
        const current = await page.getByTestId(id).boundingBox();
        check(
          Math.abs(current.width - sizes[index].width) < 0.1 &&
            Math.abs(current.height - sizes[index].height) < 0.1,
          `${id}: loading must preserve the control dimensions.`,
        );
      }
      const skeleton = page.getByTestId('forced-skeleton');
      const forcedBox = await skeleton.boundingBox();
      const outline = await skeleton.evaluate((node) => {
        const css = getComputedStyle(node);
        return {
          width: css.outlineWidth,
          style: css.outlineStyle,
          color: css.outlineColor,
          offset: css.outlineOffset,
        };
      });
      check(
        outline.width === '1px' &&
          outline.style === 'solid' &&
          outline.color !== canvas &&
          outline.offset === '-1px',
        'Skeleton needs a visible inset outline in forced colors.',
      );
      await page.emulateMedia({ forcedColors: 'none' });
      const normalBox = await skeleton.boundingBox();
      check(
        Math.abs(forcedBox.width - normalBox.width) < 0.1 &&
          Math.abs(forcedBox.height - normalBox.height) < 0.1,
        'Skeleton forced-color outline must preserve its dimensions.',
      );
      assert.deepEqual(failures, [], `${colorScheme} forced colors: ${failures.join(' ')}`);
      console.log(
        `Browser: ${colorScheme} forced-color selection, loading, RTL, and focus passed.`,
      );
    } finally {
      await page.close();
    }
  }
}
