import assert from 'node:assert/strict';

async function expectText(page, testId, value) {
  await page.waitForFunction(
    ({ id, expected }) => document.querySelector(`[data-testid="${id}"]`)?.textContent === expected,
    { id: testId, expected: String(value) },
  );
}

async function expectFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

async function expectValues(page, testId, expected) {
  await page.waitForFunction(
    ({ id, values }) => {
      const text = document.querySelector(`[data-testid="${id}"]`)?.textContent;
      if (!text) return false;
      const actual = JSON.parse(text);
      return (
        Object.keys(actual).length === Object.keys(values).length &&
        Object.entries(values).every(([name, value]) => actual[name] === value)
      );
    },
    { id: testId, values: expected },
  );
  assert.deepEqual(JSON.parse(await page.getByTestId(testId).textContent()), expected);
}

async function describedError(locator, message) {
  const descriptions = await locator.evaluate((node) =>
    (node.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent),
  );
  if (message) assert(descriptions.includes(message), 'The error must describe its real control.');
  else assert(descriptions.some((text) => typeof text === 'string' && text.length > 0));
}

async function selectCategory(page, name) {
  const select = page.getByRole('combobox', { name: 'Form category', exact: true });
  await select.click();
  await page.getByRole('option', { name, exact: true }).click();
  const node = await select.elementHandle();
  try {
    await page.waitForFunction(({ element, expected }) => element.textContent.includes(expected), {
      element: node,
      expected: name,
    });
  } finally {
    await node.dispose();
  }
}

async function verifyControlBindings(page) {
  const controls = page.getByRole('region', { name: 'Installed Form controls', exact: true });
  const nickname = controls.getByRole('textbox', { name: 'Form nickname', exact: true });
  const biography = controls.getByRole('textbox', { name: 'Form biography', exact: true });
  const select = controls.getByRole('combobox', { name: 'Form category', exact: true });
  const checkbox = controls.getByRole('checkbox', { name: 'Form accepted', exact: true });
  const notifications = controls.getByRole('switch', { name: 'Form notifications', exact: true });
  const frequency = controls.getByRole('group', { name: 'Form frequency', exact: true });
  const layout = controls.getByRole('group', { name: 'Form layout', exact: true });
  const submit = controls.getByRole('button', { name: 'Submit controls externally', exact: true });
  const reset = controls.getByRole('button', { name: 'Reset installed controls', exact: true });

  await submit.click();
  await expectFocus(page, nickname);
  assert.equal(await nickname.getAttribute('aria-invalid'), 'true');
  await describedError(nickname);
  await nickname.fill('Reader');
  await submit.click();
  await expectFocus(page, select);
  assert.equal(await select.getAttribute('aria-invalid'), 'true');
  await describedError(select);

  await selectCategory(page, 'Reading category');
  await biography.fill('Updated installed note');
  await checkbox.check();
  await checkbox.uncheck();
  await frequency.getByRole('radio', { name: 'Daily frequency', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(
    await frequency.getByRole('radio', { name: 'Weekly frequency', exact: true }).isChecked(),
    true,
  );
  await notifications.check();
  await layout.getByRole('radio', { name: 'List layout', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(
    await layout.getByRole('radio', { name: 'Tiles layout', exact: true }).isChecked(),
    true,
  );
  await controls
    .getByRole('textbox', { name: 'Form conditional draft', exact: true })
    .fill('Retained draft');
  await controls.getByRole('button', { name: 'Toggle conditional field', exact: true }).click();
  assert.equal(
    await controls.getByRole('textbox', { name: 'Form conditional draft', exact: true }).count(),
    0,
  );
  await submit.click();
  const expected = {
    nickname: 'Reader',
    biography: 'Updated installed note',
    category: 'reading',
    accepted: false,
    frequency: 'weekly',
    notifications: true,
    layout: 'tiles',
    disabledDraft: 'Disabled draft',
    conditionalDraft: 'Retained draft',
  };
  await expectValues(page, 'installed-form-submitted', expected);
  const native = new Map(JSON.parse(await page.getByTestId('installed-form-native').textContent()));
  assert.equal(native.get('nickname'), 'Reader');
  assert.equal(native.get('biography'), 'Updated installed note');
  assert.equal(native.get('category'), 'reading');
  assert.equal(native.get('frequency'), 'weekly');
  assert.equal(native.get('layout'), 'tiles');
  assert.equal(native.get('notifications'), 'on');
  assert.equal(
    native.has('accepted'),
    false,
    'Unchecked boolean state stays false while FormData omits it.',
  );
  assert.equal(native.has('disabledDraft'), false, 'FormData omits disabled controls.');
  assert.equal(
    native.has('conditionalDraft'),
    false,
    'FormData omits an unmounted conditional control.',
  );

  await controls.getByRole('button', { name: 'Show external control errors', exact: true }).click();
  assert.equal(await notifications.getAttribute('aria-invalid'), 'true');
  await describedError(notifications, 'Enable notifications to continue.');
  assert.equal(await layout.getAttribute('aria-invalid'), 'true');
  await describedError(layout, 'Choose the tiles layout.');
  await notifications.uncheck();
  await layout.getByRole('radio', { name: 'List layout', exact: true }).check();
  await page.waitForFunction(
    () => document.querySelector('[name="notifications"]')?.getAttribute('aria-invalid') !== 'true',
  );

  await controls.getByRole('button', { name: 'Clear bound frequency', exact: true }).click();
  await submit.click();
  await expectFocus(page, frequency.getByRole('radio', { name: 'Daily frequency', exact: true }));
  await frequency.getByRole('radio', { name: 'Weekly frequency', exact: true }).check();
  await controls.getByRole('button', { name: 'Clear bound layout', exact: true }).click();
  await submit.click();
  await expectFocus(page, layout.getByRole('radio', { name: 'List layout', exact: true }));
  assert.equal(await layout.getAttribute('aria-invalid'), 'true');
  await describedError(layout);
  await layout.getByRole('radio', { name: 'Tiles layout', exact: true }).check();

  await nickname.fill('reserved');
  await submit.click();
  await expectFocus(page, nickname);
  await describedError(nickname, 'This nickname is reserved.');
  assert.equal(await nickname.inputValue(), 'reserved');
  await nickname.fill('Updated reader');
  await page.waitForFunction(
    () => document.querySelector('[name="nickname"]')?.getAttribute('aria-invalid') !== 'true',
  );
  await controls.getByRole('checkbox', { name: 'Cancel controls reset', exact: true }).check();
  await reset.click();
  assert.equal(
    await nickname.inputValue(),
    'Updated reader',
    'A cancelled native reset retains the edited state.',
  );
  await controls.getByRole('checkbox', { name: 'Cancel controls reset', exact: true }).uncheck();
  await reset.click();
  await expectValues(page, 'installed-form-values', {
    nickname: '',
    biography: 'Initial reading note',
    category: null,
    accepted: false,
    frequency: 'daily',
    notifications: false,
    layout: 'list',
    disabledDraft: 'Disabled draft',
    conditionalDraft: 'Conditional draft',
  });
  assert.equal(await nickname.inputValue(), '');
  assert.equal(await biography.inputValue(), 'Initial reading note');
  assert.equal(await checkbox.isChecked(), false);
  await nickname.fill('Action reset');
  await controls.getByRole('button', { name: 'Reset through Form action', exact: true }).click();
  assert.equal(await nickname.inputValue(), '');
}

async function verifyAsyncSubmission(page) {
  const scope = page.getByRole('region', { name: 'Installed async Form', exact: true });
  const form = scope.getByTestId('installed-async-form');
  const nickname = scope.getByRole('textbox', { name: 'Async form nickname', exact: true });
  const start = scope.getByRole('button', { name: 'Start installed save', exact: true });
  const reset = scope.getByRole('button', { name: 'Reset installed save', exact: true });
  const complete = scope.getByRole('button', { name: 'Complete oldest save', exact: true });
  const fieldError = scope.getByRole('button', { name: 'Return oldest field error', exact: true });
  const reject = scope.getByRole('button', { name: 'Reject oldest save', exact: true });
  const toggle = scope.getByRole('button', { name: 'Toggle async form', exact: true });

  await form.evaluate((node) => {
    node.requestSubmit();
    node.requestSubmit();
  });
  await expectText(page, 'installed-async-attempts', 1);
  await expectText(page, 'installed-async-pending', 'true');
  assert.equal(await form.getAttribute('aria-busy'), 'true');
  await nickname.fill('Edited during save');
  await expectText(page, 'installed-async-aborted', 1);
  await expectText(page, 'installed-async-pending', 'false');
  await start.click();
  await expectText(page, 'installed-async-attempts', 2);
  await fieldError.click();
  await expectText(page, 'installed-async-pending', 'true');
  await expectText(page, 'installed-async-field-error', '');
  assert.equal(await nickname.inputValue(), 'Edited during save');
  await reset.click();
  await expectText(page, 'installed-async-aborted', 2);
  await expectText(page, 'installed-async-pending', 'false');
  assert.equal(await nickname.inputValue(), 'Initial async name');
  await fieldError.click();
  await expectText(page, 'installed-async-field-error', '');

  await start.click();
  await expectText(page, 'installed-async-attempts', 3);
  await fieldError.click();
  await expectText(page, 'installed-async-pending', 'false');
  await expectText(page, 'installed-async-field-error', 'Server rejected this nickname.');
  await expectFocus(page, nickname);
  await describedError(nickname, 'Server rejected this nickname.');
  await nickname.fill('Corrected async name');
  await expectText(page, 'installed-async-field-error', '');
  await start.click();
  await expectText(page, 'installed-async-attempts', 4);
  await reject.click();
  await expectText(page, 'installed-async-pending', 'false');
  await expectText(page, 'installed-async-rejections', 1);
  assert.notEqual(await scope.getByTestId('installed-async-submit-error').textContent(), '');
  await nickname.fill('Successful async name');
  await expectText(page, 'installed-async-submit-error', '');
  await start.click();
  await expectText(page, 'installed-async-attempts', 5);
  await complete.click();
  await expectText(page, 'installed-async-pending', 'false');
  await expectText(page, 'installed-async-field-error', '');

  await start.click();
  await expectText(page, 'installed-async-attempts', 6);
  await toggle.click();
  await expectText(page, 'installed-async-aborted', 3);
  await fieldError.click();
  await toggle.click();
  await expectText(page, 'installed-async-pending', 'false');
  await expectText(page, 'installed-async-field-error', '');
  assert.equal(await nickname.inputValue(), 'Initial async name');
}

async function verifyReservedFieldNames(page) {
  const scope = page.getByRole('region', { name: 'Installed Form reserved names', exact: true });
  const names = ['constructor', 'toString', 'reset', 'checkValidity', 'elements'];
  for (const name of names) {
    const input = scope.getByRole('textbox', { name: `Reserved ${name}`, exact: true });
    assert.equal(await input.inputValue(), '');
    assert.notEqual(await input.getAttribute('aria-invalid'), 'true');
  }
  await expectText(page, 'installed-reserved-errors', '');
  const form = scope.getByTestId('installed-reserved-form');
  assert.deepEqual(
    await form.evaluate((node) => [
      node.reset instanceof HTMLInputElement,
      node.checkValidity instanceof HTMLInputElement,
      node.elements instanceof HTMLInputElement,
    ]),
    [true, true, true],
    'The browser really exposes named controls over native form methods and getters.',
  );
  await scope.getByRole('button', { name: 'Submit reserved names', exact: true }).click();
  await expectFocus(page, scope.getByRole('textbox', { name: 'Reserved reset', exact: true }));
  await expectText(page, 'installed-reserved-submitted', '');
  const expected = Object.fromEntries(names.map((name) => [name, `Value for ${name}`]));
  for (const name of names)
    await scope
      .getByRole('textbox', { name: `Reserved ${name}`, exact: true })
      .fill(expected[name]);
  await scope.getByRole('button', { name: 'Submit reserved names', exact: true }).click();
  await expectValues(page, 'installed-reserved-submitted', expected);
  await scope.getByRole('button', { name: 'Reset reserved names', exact: true }).click();
  for (const name of names)
    assert.equal(
      await scope.getByRole('textbox', { name: `Reserved ${name}`, exact: true }).inputValue(),
      '',
    );
  await expectText(page, 'installed-reserved-errors', '');
  await scope
    .getByRole('textbox', { name: 'Reserved reset', exact: true })
    .fill('Edit after reset');
  await scope
    .getByRole('button', { name: 'Reset reserved names through action', exact: true })
    .click();
  assert.equal(
    await scope.getByRole('textbox', { name: 'Reserved reset', exact: true }).inputValue(),
    '',
  );
}

async function verifyFormErrorStyles(browser, baseURL) {
  const cases = [
    { theme: 'pink', width: 1280, direction: 'ltr', forcedColors: 'none' },
    { theme: 'blue', width: 1280, direction: 'ltr', forcedColors: 'none' },
    { theme: 'yellow', width: 1280, direction: 'ltr', forcedColors: 'none' },
    { theme: 'blue', width: 320, direction: 'rtl', forcedColors: 'none' },
    { theme: 'pink', width: 320, direction: 'rtl', forcedColors: 'active' },
    { theme: 'yellow', width: 320, direction: 'ltr', forcedColors: 'active' },
  ];
  for (const item of cases) {
    const context = await browser.newContext({
      viewport: { width: item.width, height: 900 },
      forcedColors: item.forcedColors,
      reducedMotion: 'reduce',
    });
    try {
      const page = await context.newPage();
      const url = new URL(baseURL);
      url.searchParams.set('form-component', '');
      url.searchParams.set('theme', item.theme);
      url.searchParams.set('direction', item.direction);
      await page.goto(url.href);
      await page.getByRole('heading', { name: 'Form package consumer', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Show external control errors', exact: true }).click();
      assert.equal(
        await page.locator('[data-yahha-theme]').getAttribute('data-yahha-theme'),
        item.theme,
      );
      for (const [role, name, message] of [
        ['switch', 'Form notifications', 'Enable notifications to continue.'],
        ['group', 'Form layout', 'Choose the tiles layout.'],
      ]) {
        const control = page.getByRole(role, { name, exact: true });
        await describedError(control, message);
        const id = await control.getAttribute('aria-describedby');
        const error = page.locator(`[id=${JSON.stringify(id)}]`);
        assert.equal(await error.isVisible(), true);
        assert.equal(await error.textContent(), message);
        const paint = await error.evaluate((node, forced) => {
          const style = getComputedStyle(node);
          const marker = node.querySelector('svg');
          const box = node.getBoundingClientRect();
          const markerBox = marker.getBoundingClientRect();
          const text = [...node.childNodes].find(
            (child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim(),
          );
          const range = document.createRange();
          range.selectNodeContents(text);
          const firstLine = range.getClientRects()[0];
          const probe = document.createElement('span');
          probe.style.color = forced ? 'CanvasText' : style.getPropertyValue('--yahha-error');
          node.append(probe);
          const expectedColor = getComputedStyle(probe).color;
          probe.remove();
          return {
            color: style.color,
            expectedColor,
            fontSize: Number.parseFloat(style.fontSize),
            expectedFontSize: Number.parseFloat(style.getPropertyValue('--yahha-font-size-sm')),
            direction: style.direction,
            markerWidth: markerBox.width,
            markerHeight: markerBox.height,
            markerVisible: getComputedStyle(marker).visibility !== 'hidden' && markerBox.height > 0,
            markerPainted: [...marker.querySelectorAll('path')].every((path) => {
              const markerStyle = getComputedStyle(path);
              return (
                markerStyle.stroke !== 'none' &&
                Number.parseFloat(markerStyle.strokeWidth) > 0 &&
                Number(markerStyle.opacity) > 0
              );
            }),
            markerBeforeText:
              style.direction === 'rtl'
                ? markerBox.left >= firstLine.right
                : markerBox.right <= firstLine.left,
            firstLineAligned:
              Math.abs(
                markerBox.top +
                  markerBox.height / 2 -
                  box.top -
                  Number.parseFloat(style.lineHeight) / 2,
              ) <= 1.5,
            complete:
              node.scrollWidth <= node.clientWidth + 1 &&
              node.scrollHeight <= node.clientHeight + 1,
          };
        }, item.forcedColors === 'active');
        assert.equal(
          paint.color,
          paint.expectedColor,
          `${item.theme}: error color follows theme or CanvasText.`,
        );
        assert.equal(paint.fontSize, paint.expectedFontSize);
        assert(paint.fontSize >= 12);
        assert.equal(paint.direction, item.direction);
        assert.equal(paint.markerWidth, 16);
        assert.equal(paint.markerHeight, 16);
        assert(
          paint.markerVisible &&
            paint.markerPainted &&
            paint.markerBeforeText &&
            paint.firstLineAligned &&
            paint.complete,
          JSON.stringify(paint),
        );
        assert.equal(await error.locator('svg').getAttribute('aria-hidden'), 'true');
      }
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
      );
    } finally {
      await context.close();
    }
  }
  console.log(
    'FormError: three presets, caption/error tokens, first-line marks, narrow RTL and forced colors passed.',
  );
}

/** Public Form behavior compiled and rendered against the independently installed tarball. */
export async function verifyFormComponent(browser, baseURL) {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(7000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const url = new URL(baseURL);
  url.searchParams.set('form-component', '');
  try {
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('about:blank');
      await page.goto(url.href);
      await page.getByRole('heading', { name: 'Form package consumer', exact: true }).waitFor();
      await verifyControlBindings(page);
      await verifyAsyncSubmission(page);
      await verifyReservedFieldNames(page);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
      );
      console.log(
        `Installed Form: seven bindings, native/custom errors and focus, retained values/FormData, resets and async races passed at ${width}px.`,
      );
    }
    assert.deepEqual(errors, [], 'Installed Form consumer emitted browser errors.');
  } finally {
    await context.close();
  }
  await verifyFormErrorStyles(browser, baseURL);
}
