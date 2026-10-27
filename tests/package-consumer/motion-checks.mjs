import assert from 'node:assert/strict';

const closeTo = (actual, expected, message) =>
  assert(Math.abs(actual - expected) < 0.1, `${message}: ${actual} vs ${expected}.`);

const dimensions = (locator) =>
  locator.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return [rect.width, rect.height];
  });

async function settle(locator) {
  return locator.evaluate(async (node) => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const transitions = node
      .getAnimations({ subtree: true })
      .filter((animation) => animation instanceof CSSTransition);
    await Promise.all(transitions.map((animation) => animation.ready));
    for (const animation of transitions) {
      if (!Number.isFinite(animation.effect.getComputedTiming().endTime))
        throw new Error('A control transition must finish.');
      animation.finish();
    }
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}

const translation = (locator, pseudo = null) =>
  locator.evaluate((node, pseudo) => {
    const transform = getComputedStyle(node, pseudo).transform;
    const matrix = transform === 'none' ? new DOMMatrix() : new DOMMatrix(transform);
    return [matrix.m41, matrix.m42];
  }, pseudo);

async function pressAction(page, button) {
  await button.scrollIntoViewIfNeeded();
  await button.hover();
  await settle(button);
  const before = await dimensions(button);
  await page.mouse.down();
  try {
    // Set a real browser CSS transition to its midpoint to avoid machine-speed timing races.
    const midpoint = await button.evaluate(async (node) => {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const animation = node
        .getAnimations()
        .find(
          (animation) =>
            animation instanceof CSSTransition && animation.transitionProperty === 'transform',
        );
      if (!animation) return null;
      await animation.ready;
      const duration = animation.effect.getTiming().duration;
      if (!(duration > 0 && Number.isFinite(duration))) return null;
      animation.pause();
      animation.currentTime = duration / 2;
      const matrix = new DOMMatrix(getComputedStyle(node).transform);
      animation.finish();
      return matrix.m42;
    });
    assert(
      midpoint > 0 && midpoint < 1.1,
      'Press feedback must interpolate toward its finite landing.',
    );
    await settle(button);
    const pressed = await translation(button);
    assert(
      pressed[1] > midpoint && pressed[1] <= 1.5,
      'Press feedback moves down gently without scale.',
    );
    if ((await button.getAttribute('aria-pressed')) === 'true') {
      const layers = await button.evaluate((node) =>
        getComputedStyle(node).boxShadow.match(/(?:rgba?\([^)]*\)|[^,])+/g),
      );
      assert(
        layers?.length && layers.every((layer) => layer.includes('inset')),
        'An already selected action must retain its inset pressed edge while held.',
      );
    }
    assert.deepEqual(
      await dimensions(button),
      before,
      'Press feedback must preserve control width/height.',
    );
  } finally {
    await page.mouse.up();
  }
  await settle(button);
  closeTo((await translation(button))[1], 0, 'Release returns to the original baseline');
  assert.deepEqual(await dimensions(button), before, 'Release must preserve control width/height.');
  await button.focus();
  await page.keyboard.down('Space');
  await settle(button);
  assert((await translation(button))[1] > 0, 'Space must use the same tactile response.');
  await page.keyboard.up('Space');
  await settle(button);
  closeTo((await translation(button))[1], 0, 'Space release returns to the original baseline');
  assert(
    await button.evaluate(
      (node) =>
        document.activeElement === node && parseFloat(getComputedStyle(node).outlineWidth) >= 2,
    ),
    'Keyboard activation must retain a visible focus indicator.',
  );
}

const checkMarks = (locator) =>
  locator.evaluate((node) =>
    ['::before', '::after'].map((pseudo) => {
      const css = getComputedStyle(node, pseudo);
      return Number(css.opacity);
    }),
  );

const thumbLeft = (locator) =>
  locator.evaluate((node) => {
    const css = getComputedStyle(node, '::after');
    const transform = css.transform === 'none' ? new DOMMatrix() : new DOMMatrix(css.transform);
    return parseFloat(css.left) + transform.m41;
  });

async function sampleMarkTransition(input) {
  const sample = await input.evaluate(async (node) => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const transitions = node
      .getAnimations({ subtree: true })
      .filter(
        (animation) =>
          animation instanceof CSSTransition &&
          ['opacity', 'transform'].includes(animation.transitionProperty),
      );
    await Promise.all(transitions.map((animation) => animation.ready));
    for (const animation of transitions) {
      animation.pause();
      animation.currentTime = Number(animation.effect.getTiming().duration) / 2;
    }
    const marks = ['::before', '::after'].map((pseudo) => {
      const css = getComputedStyle(node, pseudo);
      const matrix = css.transform === 'none' ? new DOMMatrix() : new DOMMatrix(css.transform);
      return { opacity: Number(css.opacity), scale: Math.hypot(matrix.a, matrix.b) };
    });
    for (const animation of transitions) animation.finish();
    return { count: transitions.length, marks };
  });
  assert(sample.count > 0, 'Check and cancellation must use a finite mark transition.');
  for (const mark of sample.marks) {
    assert(
      mark.opacity > 0 && mark.opacity < 1,
      'Both check strokes visibly interpolate instead of blinking.',
    );
    assert(
      mark.scale > 0 && mark.scale < 1,
      'The mark settles without enlarging past its final size.',
    );
  }
}

async function verifySelections(page, scope) {
  const checkbox = scope.getByTestId('selection-checkbox');
  const before = await dimensions(checkbox);
  await checkbox.uncheck();
  await sampleMarkTransition(checkbox);
  await settle(checkbox);
  assert.deepEqual(await checkMarks(checkbox), [0, 0], 'Unchecking clears both strokes.');
  await checkbox.focus();
  await page.keyboard.press('Space');
  await sampleMarkTransition(checkbox);
  await settle(checkbox);
  assert.equal(await checkbox.isChecked(), true);
  assert.deepEqual(await checkMarks(checkbox), [1, 1], 'Checking lands with a complete mark.');
  assert.deepEqual(await dimensions(checkbox), before, 'The mark must not resize its square.');
  const mixed = scope.getByTestId('selection-mixed');
  await mixed.click();
  await settle(mixed);
  assert.equal(await mixed.evaluate((node) => node.indeterminate), true);
  assert.equal(await mixed.getAttribute('aria-checked'), 'mixed');
  assert.deepEqual(await checkMarks(mixed), [0, 1], 'Mixed state keeps one clear bar.');

  const toggle = scope.getByTestId('selection-switch');
  const switchSize = await dimensions(toggle);
  const travel = [];
  for (const direction of ['ltr', 'rtl', 'css-rtl']) {
    await scope.evaluate((node, value) => {
      node.removeAttribute('dir');
      node.style.removeProperty('direction');
      if (value === 'css-rtl') node.style.direction = 'rtl';
      else node.dir = value;
    }, direction);
    await toggle.uncheck();
    await settle(toggle);
    const off = await thumbLeft(toggle);
    await toggle.check();
    await settle(toggle);
    const on = await thumbLeft(toggle);
    travel.push(on - off);
    assert(Math.abs(on - off) > 12, `${direction}: switch thumb must visibly travel.`);
    assert.equal(
      Math.sign(on - off),
      direction === 'ltr' ? 1 : -1,
      `${direction}: thumb must follow reading direction.`,
    );
    // Reverse before the previous transition finishes; it must settle at the new native value.
    await toggle.uncheck();
    await toggle.evaluate(async (node) => {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      for (const animation of node.getAnimations({ subtree: true })) {
        if (!(animation instanceof CSSTransition)) continue;
        await animation.ready;
        animation.pause();
        animation.currentTime = Number(animation.effect.getTiming().duration) / 2;
      }
    });
    await toggle.check();
    await settle(toggle);
    closeTo(await thumbLeft(toggle), on, `${direction}: rapid reversal lands at checked position`);
    assert.deepEqual(
      await dimensions(toggle),
      switchSize,
      'Switch travel must not resize its track.',
    );
  }
  closeTo(travel[0], -travel[1], 'RTL preserves the same switch travel');
  closeTo(travel[1], travel[2], 'CSS direction preserves logical switch travel too');
  await scope.evaluate((node) => {
    node.removeAttribute('dir');
    node.style.removeProperty('direction');
  });
  for (const id of ['selection-disabled', 'selection-switch-disabled']) {
    const input = scope.getByTestId(id);
    const checked = await input.isChecked();
    await input.scrollIntoViewIfNeeded();
    const box = await input.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    assert.equal(await input.isChecked(), checked, `${id}: disabled control retains its value.`);
    assert.equal(
      await input.evaluate((node) => node.getAnimations({ subtree: true }).length),
      0,
      `${id}: disabled controls do not animate.`,
    );
  }
}

export async function verifyControlMotion(browser, url) {
  const context = await browser.newContext({
    reducedMotion: 'no-preference',
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__mixedMountTransitions = [];
    document.addEventListener(
      'transitionrun',
      (event) => {
        if (
          event.target instanceof HTMLInputElement &&
          event.target.matches('[data-testid="selection-mixed"]')
        )
          window.__mixedMountTransitions.push([event.propertyName, event.pseudoElement]);
      },
      true,
    );
  });
  try {
    await page.goto(`${url}?design-contract`);
    await page.waitForFunction(() => {
      const mixed = [...document.querySelectorAll('[data-testid="selection-mixed"]')];
      return mixed.length === 3 && mixed.every((input) => input.indeterminate);
    });
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    assert.deepEqual(
      await page.evaluate(() => window.__mixedMountTransitions),
      [],
      'Initially mixed controls must appear in their final state without an entrance transition.',
    );
    const scope = page.locator('[data-design-theme="chiikawa"]');
    for (const id of ['design-button', 'design-icon', 'design-pressed-primary'])
      await pressAction(page, scope.getByTestId(id));
    for (const id of ['design-button-disabled', 'design-button-loading', 'design-icon-loading']) {
      const button = scope.getByTestId(id);
      await button.scrollIntoViewIfNeeded();
      const before = await dimensions(button);
      const position = await button.boundingBox();
      await page.mouse.move(position.x + position.width / 2, position.y + position.height / 2);
      await page.mouse.down();
      try {
        await settle(button);
        assert.deepEqual(
          await translation(button),
          [0, 0],
          `${id}: disabled/loading does not depress.`,
        );
        assert.deepEqual(await dimensions(button), before);
      } finally {
        await page.mouse.up();
      }
    }
    await verifySelections(page, scope);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const button = scope.getByTestId('design-button');
    await button.hover();
    await page.mouse.down();
    assert.deepEqual(
      await translation(button),
      [0, 0],
      'Reduced motion keeps action geometry still.',
    );
    await page.mouse.up();
    for (const id of ['selection-checkbox', 'selection-switch']) {
      const input = scope.getByTestId(id);
      await input.click();
      assert.equal(
        await input.evaluate((node) => node.getAnimations({ subtree: true }).length),
        0,
        `${id}: reduced motion changes state without an animated transition.`,
      );
    }
    await page.goto(`${url}?basics`);
    const checkbox = page.getByRole('checkbox', { name: 'Basic agreement', exact: true });
    const toggle = page.getByRole('switch', { name: 'Basic subscription', exact: true });
    await checkbox.uncheck();
    await toggle.uncheck();
    await page.getByRole('button', { name: 'Reset basics', exact: true }).click();
    assert.equal(await checkbox.isChecked(), true, 'Native reset restores the check value.');
    assert.equal(await toggle.isChecked(), true, 'Native reset restores the switch value.');
    assert.deepEqual(await checkMarks(checkbox), [1, 1], 'Reset restores a complete mark.');
    console.log(
      'Browser: finite control press/release, keyboard focus, marks, switch reversal/RTL, disabled/loading, reduced motion and reset passed.',
    );
  } finally {
    await context.close();
  }
}
