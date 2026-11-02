import assert from 'node:assert/strict';
import { verifyControlMotion } from './motion-checks.mjs';
import { verifyFieldMotion } from './field-motion-checks.mjs';
import { verifyOverlayLifecycle } from './overlay-lifecycle-checks.mjs';

export async function verifyConsumer(browser, url) {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.setDefaultTimeout(10_000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(url);
  await page.getByRole('heading', { name: 'Standalone package consumer' }).waitFor();
  for (const [testId, tag] of [
    ['dialog-trigger', 'BUTTON'],
    ['ref-icon', 'BUTTON'],
    ['ref-input', 'INPUT'],
    ['consumer-badge', 'SPAN'],
    ['consumer-surface', 'DIV'],
  ]) {
    assert.equal(
      await page.getByTestId(testId).getAttribute('data-ref-checked'),
      tag,
      `${testId} ref must reach its DOM node.`,
    );
  }
  await page.getByTestId('ref-icon').click();
  assert(
    await page.getByTestId('ref-input').evaluate((node) => document.activeElement === node),
    'The input ref must support imperative focus.',
  );

  const themes = [
    ['pink', 'rgb(255, 195, 217)', 'rgb(104, 65, 80)'],
    ['blue', 'rgb(215, 234, 245)', 'rgb(82, 106, 122)'],
    ['yellow', 'rgb(248, 229, 167)', 'rgb(124, 102, 56)'],
  ];
  const trigger = page.getByTestId('dialog-trigger');
  const dialog = page.getByRole('dialog', { name: 'Package consumer dialog' });
  for (const [theme, background, contour] of themes) {
    await page.getByRole('radio', { name: theme, exact: true }).check();
    await page.mouse.move(0, 0);
    assert.deepEqual(
      await trigger.evaluate((node) => {
        const style = getComputedStyle(node);
        return [
          style.backgroundColor,
          style.minHeight,
          style.borderRadius,
          style.borderColor,
          style.boxShadow.split(/,(?![^()]*\))/).every((shadow) => shadow.includes('inset')),
        ];
      }),
      ['rgb(255, 255, 255)', '44px', '22px 28px 24px 23px / 52% 48%', contour, true],
      `${theme}: secondary buttons must use a white reading surface, soft outline, and inner edge.`,
    );
    assert.deepEqual(
      await page.getByRole('button', { name: 'Submit scope', exact: true }).evaluate((node) => {
        const style = getComputedStyle(node);
        return [style.backgroundColor, style.color, style.boxShadow !== 'none'];
      }),
      [background, 'rgb(73, 49, 61)', true],
      `${theme}: primary buttons must use the theme accent with readable ink and a press edge.`,
    );
    await trigger.click();
    await dialog.waitFor({ state: 'visible' });
    assert.deepEqual(
      await dialog.evaluate((node) => {
        const style = getComputedStyle(node);
        return [
          node.closest('[data-yahha-theme]')?.getAttribute('data-yahha-theme'),
          style.position,
          style.borderColor,
        ];
      }),
      [theme, 'fixed', contour],
      `${theme}: the portalled dialog must retain its theme and CSS.`,
    );
    await page.getByRole('button', { name: '关闭弹窗', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
    assert(
      await trigger.evaluate((node) => document.activeElement === node),
      'Closing must restore trigger focus.',
    );
    await trigger.click();
    await dialog.waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert(
      await trigger.evaluate((node) => document.activeElement === node),
      'Escape must restore trigger focus.',
    );
    console.log(`Browser: ${theme} CSS, dialog close/Escape, and focus restoration passed.`);
  }
  const form = page.getByTestId('consumer-form');
  assert.equal(
    await form.evaluate((node) => node.checkValidity()),
    false,
    'A required empty radio group must be invalid.',
  );
  await page.getByRole('radio', { name: 'One source', exact: true }).check();
  await page.getByRole('button', { name: 'Submit scope', exact: true }).click();
  assert.equal(await page.getByRole('status', { name: 'Submitted scope' }).textContent(), 'one');
  await page.getByRole('button', { name: 'Toggle scope disabled', exact: true }).click();
  assert.equal(
    await form.evaluate((node) => new FormData(node).has('scope')),
    false,
    'Disabled group must not submit a value.',
  );
  assert.equal(
    await page.getByRole('radio', { name: 'One source', exact: true }).isDisabled(),
    true,
  );

  const customField = page.getByRole('textbox', { name: 'Custom themed input', exact: true });
  assert.equal(
    await page
      .getByTestId('consumer-line-skeleton')
      .evaluate((node) => getComputedStyle(node).backgroundColor),
    'rgb(201, 222, 236)',
    'A custom paper edge must not recolor unrelated loading placeholders.',
  );
  assert.equal(
    await customField.evaluate((node) => getComputedStyle(node).backgroundColor),
    'rgb(255, 244, 250)',
  );
  assert.equal(
    await page.locator('.consumer-field-error').evaluate((node) => getComputedStyle(node).color),
    'rgb(146, 59, 83)',
  );
  assert.equal(
    await page
      .locator('.consumer-error-toast > span > svg')
      .evaluate((node) => getComputedStyle(node).color),
    'rgb(146, 59, 83)',
  );
  assert.equal(
    await page
      .getByTestId('consumer-surface')
      .evaluate((node) => getComputedStyle(node).backgroundColor),
    'rgb(250, 245, 232)',
  );
  for (const id of ['consumer-surface', 'consumer-badge']) {
    assert.equal(
      await page.getByTestId(id).evaluate((node) => getComputedStyle(node).borderColor),
      'rgb(132, 105, 115)',
      `The public line override must reach ${id}'s lighter paper border too.`,
    );
  }
  assert.equal(
    await page
      .getByRole('button', { name: 'Open custom dialog', exact: true })
      .evaluate((node) => getComputedStyle(node).borderColor),
    'rgb(132, 105, 115)',
    'The public line token must still customize a button outline.',
  );
  await page.getByRole('button', { name: 'Open custom dialog', exact: true }).click();
  const customDialog = page.getByRole('dialog', { name: 'Custom themed dialog', exact: true });
  await customDialog.waitFor({ state: 'visible' });
  assert.equal(await customDialog.getAttribute('data-ref-checked'), 'DIV');
  assert.equal(await page.getByTestId('consumer-portal').getByRole('dialog').count(), 1);
  assert.equal(
    await customDialog.evaluate((node) => getComputedStyle(node).borderColor),
    'rgb(132, 105, 115)',
    'The same public border override must reach the portalled dialog.',
  );
  // Popup visibility precedes Base UI's scheduled initial focus.
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await customDialog.getByRole('textbox', { name: 'Dialog input', exact: true }).elementHandle(),
  );
  assert.deepEqual(
    await customDialog.evaluate((node) => {
      const style = getComputedStyle(node);
      return [
        style.backgroundColor,
        style.width,
        style.getPropertyValue('--yahha-accent').trim(),
        node.closest('.custom-theme-root') === null,
      ];
    }),
    ['rgb(250, 245, 232)', '360px', '#b9dcca', true],
  );
  await page.getByRole('button', { name: 'Update custom tokens', exact: true }).click();
  assert.equal(
    await customDialog.evaluate((node) =>
      getComputedStyle(node).getPropertyValue('--yahha-accent').trim(),
    ),
    '#e0c9f2',
  );
  await page.mouse.click(0, 0);
  assert.equal(await customDialog.isVisible(), true, 'Pointer dismissal must be disabled.');
  await page.getByRole('button', { name: 'Close custom dialog', exact: true }).click();
  await customDialog.waitFor({ state: 'hidden' });
  assert.equal(
    await page
      .getByRole('button', { name: 'Open custom dialog', exact: true })
      .evaluate((node) => document.activeElement === node),
    true,
  );
  console.log(
    'Browser: native form submission, new refs, custom theme/portal, focus and dismissal contracts passed.',
  );
  assert.deepEqual(errors, [], 'Standalone consumer emitted browser errors.');
  await page.close();
  await verifyControlMotion(browser, url);
  await verifyFieldMotion(browser, url);
  await verifyOverlayLifecycle(browser, url);
}
