import assert from 'node:assert/strict';

async function entered(popup, phase) {
  await popup.waitFor();
  assert.equal(
    await popup.getAttribute('data-ref-checked'),
    'DIV',
    'Public popup refs retain their DOM target.',
  );
  await popup.evaluate(async (node, phase) => {
    let transitions = [];
    for (let frame = 0; frame < 10; frame++) {
      transitions = node.getAnimations().filter((animation) => animation instanceof CSSTransition);
      if (transitions.length) break;
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    await Promise.all(transitions.map((animation) => animation.ready));
    for (const animation of transitions) {
      const duration = animation.effect.getTiming().duration;
      if (!(duration > 0 && Number.isFinite(duration)))
        throw new Error('Overlay feedback must finish.');
      if (phase === 'mid-entry') {
        animation.pause();
        animation.currentTime = duration / 2;
      } else animation.finish();
    }
    if (phase === 'mid-entry' && !transitions.length)
      throw new Error('The race must exercise a real unfinished entry.');
  }, phase);
}
async function closeRetained(page, popup) {
  if ((await popup.count()) && (await popup.getAttribute('data-open')) !== null)
    await page.keyboard.press('Escape');
  await popup.waitFor({ state: 'detached' });
}
async function focused(page, target) {
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await target.elementHandle(),
  );
}
async function race(page, kind, phase, activation) {
  const menu = kind.endsWith('menu');
  const popup = page.locator(menu ? `.${kind}-popup` : `.${kind}-lifecycle-popup`);
  const trigger = page.getByTestId(`${kind}-trigger`);
  await trigger.click();
  await entered(popup, phase);
  const target = menu
    ? popup.getByRole('menuitem', { name: `${kind} next action`, exact: true })
    : activation === 'Enter'
      ? popup.getByRole('textbox', { name: `${kind} draft`, exact: true })
      : popup.getByRole('button', { name: `${kind} action`, exact: true });
  await target.focus();
  // These two real key sequences intentionally have no DOM read, animation wait or focus repair between them.
  await page.keyboard.press('Escape');
  await page.keyboard.press(activation);
  assert.equal(
    await page.getByTestId(`${kind}-actions`).textContent(),
    '0',
    `${kind} ${phase} ${activation}: retained closing controls cannot act.`,
  );
  if (!menu)
    assert.equal(
      await page.getByTestId(`${kind}-submissions`).textContent(),
      '0',
      `${kind}: native implicit submission cannot escape the closing guard.`,
    );
  // If focus already returned, Enter can legitimately reopen the trigger. That is not an accidental action.
  await closeRetained(page, popup);
  await focused(page, trigger);
}
async function staleDomDispatch(page, kind) {
  await page.getByTestId(`${kind}-trigger`).click();
  const popup = page.locator(`.${kind}-lifecycle-popup`);
  await entered(popup, 'entered');
  const retained = await popup.elementHandle();
  await page.keyboard.press('Escape');
  await retained.evaluate((node) => {
    if (!node.isConnected || !node.inert || node.hasAttribute('data-open'))
      throw new Error('The stale-event probe must target a retained, genuinely closed popup.');
    // Retained DOM may still be referenced by pending application work after close.
    for (const animation of node.getAnimations()) animation.pause();
    node.querySelector('form button[type="button"]')?.click();
    node.querySelector('form').requestSubmit();
  });
  assert.equal(
    await page.getByTestId(`${kind}-submissions`).textContent(),
    '0',
    'A retained form cannot submit after close.',
  );
  assert.equal(
    await page.getByTestId(`${kind}-actions`).textContent(),
    '0',
    'A retained button cannot invoke a closing action.',
  );
  await retained.evaluate((node) => {
    for (const animation of node.getAnimations()) animation.finish();
  });
  await popup.waitFor({ state: 'detached' });
}

async function normalAndControlled(page) {
  for (const kind of ['menu', 'controlled-menu']) {
    const trigger = page.getByTestId(`${kind}-trigger`);
    await trigger.click();
    const popup = page.locator(`.${kind}-popup`);
    await entered(popup, 'entered');
    await popup.getByRole('menuitem', { name: `${kind} first action`, exact: true }).focus();
    await page.keyboard.press('Enter');
    assert.equal(
      await page.getByTestId(`${kind}-actions`).textContent(),
      '1',
      'A normally open menu still activates.',
    );
    await closeRetained(page, popup);
    await focused(page, trigger);
  }
  const hold = page.getByRole('button', { name: 'Hold controlled menu open', exact: true });
  await hold.click();
  await page.getByTestId('controlled-menu-trigger').click();
  const controlled = page.locator('.controlled-menu-popup');
  await entered(controlled, 'entered');
  await page.keyboard.press('Escape');
  assert.equal(
    await controlled.getAttribute('data-open'),
    '',
    'The parent may reject a controlled close request.',
  );
  assert.equal(
    await controlled.evaluate((node) => node.inert),
    false,
    'A rejected close must not disable a still-open popup.',
  );
  assert(Number(await page.getByTestId('controlled-menu-close-requests').textContent()) > 0);
  await controlled
    .getByRole('menuitem', { name: 'controlled-menu next action', exact: true })
    .click();
  assert.equal(
    await page.getByTestId('controlled-menu-actions').textContent(),
    '2',
    'Still-open controlled menu actions remain usable.',
  );
  await hold.click();
  await controlled
    .getByRole('menuitem', { name: 'controlled-menu first action', exact: true })
    .focus();
  await page.keyboard.press('Escape');
  await controlled.waitFor({ state: 'detached' });
  for (const kind of ['dialog', 'popover']) {
    await page.getByTestId(`${kind}-trigger`).click();
    const popup = page.locator(`.${kind}-lifecycle-popup`);
    await entered(popup, 'entered');
    await popup.getByRole('textbox', { name: `${kind} draft`, exact: true }).focus();
    await page.keyboard.press('Enter');
    assert.equal(
      await page.getByTestId(`${kind}-submissions`).textContent(),
      '1',
      'Open forms retain native Enter submission.',
    );
    await popup.getByRole('button', { name: `${kind} action`, exact: true }).click();
    assert.equal(
      await page.getByTestId(`${kind}-actions`).textContent(),
      '1',
      'Open buttons remain interactive.',
    );
    await page.keyboard.press('Escape');
    await popup.waitFor({ state: 'detached' });
    await focused(page, page.getByTestId(`${kind}-trigger`));
  }
  const outside = page.getByTestId('overlay-outside-field');
  await page.getByTestId('popover-trigger').click();
  await page.locator('.popover-lifecycle-popup').waitFor();
  await outside.click();
  await page.locator('.popover-lifecycle-popup').waitFor({ state: 'detached' });
  await focused(page, outside);
  const tooltipTrigger = page.getByRole('button', { name: 'Tooltip action', exact: true });
  await outside.focus();
  for (let step = 0; step < 8; step++) {
    await page.keyboard.press('Tab');
    if (await tooltipTrigger.evaluate((node) => document.activeElement === node)) break;
  }
  await focused(page, tooltipTrigger);
  await page.locator('.lifecycle-tooltip').waitFor();
  await page.keyboard.press('Escape');
  await page.locator('.lifecycle-tooltip').waitFor({ state: 'detached' });
  await focused(page, tooltipTrigger);
  await page.keyboard.press('Enter');
  assert.equal(
    await page.getByTestId('tooltip-actions').textContent(),
    '1',
    'Tooltip dismissal does not replace its trigger action.',
  );
}
export async function verifyOverlayLifecycle(browser, url) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  try {
    await page.goto(`${url}?overlay-lifecycle`);
    await page.getByRole('heading', { name: 'Overlay lifecycle consumer', exact: true }).waitFor();
    for (let repeat = 0; repeat < 2; repeat++)
      for (const kind of ['menu', 'controlled-menu', 'dialog', 'popover'])
        for (const phase of ['entered', 'mid-entry'])
          for (const activation of ['Enter', 'Space']) await race(page, kind, phase, activation);
    for (const kind of ['dialog', 'popover']) await staleDomDispatch(page, kind);
    await normalAndControlled(page);
    console.log(
      'Browser: actual-state overlay guards prevent retained closing actions/submits, preserve rejected controlled closes, native forms, refs and focus.',
    );
  } finally {
    await context.close();
  }
  const touch = await browser.newContext({
    viewport: { width: 320, height: 640 },
    hasTouch: true,
    reducedMotion: 'reduce',
    forcedColors: 'active',
  });
  const narrow = await touch.newPage();
  try {
    await narrow.goto(`${url}?overlay-lifecycle`);
    await narrow.getByTestId('menu-trigger').tap();
    const menu = narrow.locator('.menu-popup');
    await menu.waitFor();
    assert.equal(await menu.evaluate((node) => node.getAnimations().length), 0);
    await menu.getByRole('menuitem', { name: 'menu first action', exact: true }).tap();
    await menu.waitFor({ state: 'detached' });
    assert.equal(
      await narrow.getByTestId('menu-actions').textContent(),
      '1',
      'Touch menu selection remains available.',
    );
    await narrow.getByTestId('dialog-trigger').tap();
    const dialog = narrow.locator('.dialog-lifecycle-popup');
    await dialog.waitFor();
    assert.equal(await dialog.evaluate((node) => node.getAnimations().length), 0);
    await dialog.getByRole('button', { name: 'dialog submit', exact: true }).tap();
    assert.equal(await narrow.getByTestId('dialog-submissions').textContent(), '1');
    await dialog.getByRole('button', { name: '关闭弹窗', exact: true }).tap();
    await dialog.waitFor({ state: 'detached' });
    assert(await narrow.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    console.log(
      'Browser: 320px touch, reduced motion and forced-color overlay operations remain usable.',
    );
  } finally {
    await touch.close();
  }
}
