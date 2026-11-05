import assert from 'node:assert/strict';

const initialMessage = '通知已关闭。';
const resetMessage = '示例已重置，通知已关闭。';
const pendingMessage = '正在本地模拟保存…';
const failureMessage = '已恢复为关闭，再次开启可重试。';

async function revealExample(example) {
  // Open actual summaries; never change details.open or force a hidden interaction.
  for (;;) {
    const handle = await example.evaluateHandle((node) => {
      let outermost = null;
      for (let parent = node.parentElement; parent; parent = parent.parentElement)
        if (parent.tagName === 'DETAILS' && !parent.open) outermost = parent;
      return outermost;
    });
    try {
      const details = handle.asElement();
      if (!details) return;
      const summary = await details.$(':scope > summary');
      assert(summary, 'A collapsed example has an operable summary.');
      await summary.click();
      await summary.dispose();
    } finally {
      await handle.dispose();
    }
  }
}

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

async function requireText(page, locator, expected) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction(({ element, text }) => element.textContent.trim() === text, {
      element: node,
      text: expected,
    });
  } finally {
    await node.dispose();
  }
}

/** Observe the first painted loading frames, including the beginning of the thumb transition. */
async function observeLoadingMotion(control) {
  return control.evaluateHandle((input) => {
    const completed = new Promise((resolve) => {
      const rows = [];
      const deadline = setTimeout(() => resolve({ rows, timedOut: true }), 1500);
      input.addEventListener(
        'change',
        () => {
          let start;
          function sample(time) {
            start ??= time;
            const style = getComputedStyle(input);
            const thumb = getComputedStyle(input, '::after');
            const rect = input.getBoundingClientRect();
            const mark = [...input.parentElement.querySelectorAll('[aria-hidden="true"]')].find(
              (node) => node.children.length === 3,
            );
            if (mark && thumb.display !== 'none') {
              const glyph = mark.getBoundingClientRect();
              const width = parseFloat(thumb.width);
              const left =
                thumb.left !== 'auto'
                  ? rect.left + parseFloat(style.borderLeftWidth) + parseFloat(thumb.left)
                  : rect.right -
                    parseFloat(style.borderRightWidth) -
                    parseFloat(thumb.right) -
                    width;
              rows.push({
                time: time - start,
                offset: glyph.left + glyph.width / 2 - (left + width / 2),
              });
            }
            if (time - start < 200) requestAnimationFrame(sample);
            else {
              clearTimeout(deadline);
              resolve({ rows, timedOut: false });
            }
          }
          requestAnimationFrame(sample);
        },
        { once: true },
      );
    });
    return { completed };
  });
}

/** Check local optimistic preference saving without changing React state or native DOM values. */
export async function verifySwitchPreference(page, example) {
  await revealExample(example);
  const control = example.getByRole('switch', { name: '启用通知', exact: true });
  const label = example.getByText('启用通知', { exact: true });
  const reset = example.getByRole('button', { name: '重置示例', exact: true });
  const status = example.getByRole('status');
  const alert = example.getByRole('alert');
  await control.waitFor();
  const originalControl = await control.elementHandle();
  let focusProbe;
  let stage = 'initial';
  let originalError;

  async function requireSameControl() {
    assert.equal(
      await control.evaluate((node, original) => node === original, originalControl),
      true,
      'Rollback, retry, save and reset retain the same native switch.',
    );
    assert.equal(await example.getByRole('switch', { name: '启用通知', exact: true }).count(), 1);
    assert.equal(await control.evaluate((node) => node.disabled), false);
  }

  async function requireIdle() {
    await page.waitForFunction(
      (node) =>
        node.getAttribute('aria-busy') !== 'true' && node.getAttribute('aria-disabled') !== 'true',
      originalControl,
    );
    assert.equal(await reset.isEnabled(), true);
    await requireSameControl();
  }

  async function requirePending(target) {
    await requireText(page, status, pendingMessage);
    assert.equal(await status.count(), 1);
    assert.equal(await control.getAttribute('aria-busy'), 'true');
    assert.equal(await control.getAttribute('aria-disabled'), 'true');
    assert.equal(await control.isChecked(), target);
    assert.equal(await reset.isDisabled(), true);
    assert.equal(await alert.count(), 0);
    await requireSameControl();
  }

  async function requireFailure() {
    await alert.waitFor({ state: 'visible' });
    await requireIdle();
    assert.equal(await alert.count(), 1);
    assert.equal(await alert.getByText('模拟保存失败', { exact: true }).count(), 1);
    assert.equal(await alert.getByText(failureMessage, { exact: true }).count(), 1);
    assert.equal(await control.isChecked(), false);
    await requireText(page, status, '');
    assert.equal(await status.count(), 1, 'Failure is not repeated in the result status.');
    assert.equal(await alert.getByRole('status').count(), 0);
  }

  async function requireSaved(target) {
    await requireText(page, status, `通知已${target ? '开启' : '关闭'}；仅当前示例生效。`);
    await requireIdle();
    assert.equal(await control.isChecked(), target);
    assert.equal(await alert.count(), 0);
    assert.equal(await status.count(), 1);
  }

  async function restorePreference() {
    // Let the actual in-flight timer finish before using the example's real reset action.
    await requireIdle();
    await reset.focus();
    await reset.click();
    await requireText(page, status, resetMessage);
    await requireIdle();
    assert.equal(await control.isChecked(), false);
    assert.equal(await alert.count(), 0);
    assert.equal(await status.count(), 1);
  }

  try {
    await requireIdle();
    assert.equal(await control.isChecked(), false);
    assert.equal(await status.count(), 1);
    assert.equal(await alert.count(), 0);
    assert(
      [initialMessage, resetMessage].includes((await status.textContent()).trim()),
      'A fresh or restored example starts with notifications off.',
    );
    assert.equal(await example.getByRole('list').count(), 0);
    assert.equal(await example.getByRole('heading').count(), 0);

    stage = 'optimistic change and busy activation guards';
    await control.focus();
    const motion = await observeLoadingMotion(control);
    try {
      await control.press('Space');
      const measured = await motion.evaluate((observer) => observer.completed);
      assert.equal(measured.timedOut, false);
      assert(measured.rows.length >= 2);
      assert(
        measured.rows.every((frame) => Math.abs(frame.offset) < 0.1),
        'Loading mark stays centered in the white thumb from its first painted frame.',
      );
    } finally {
      await motion.dispose();
    }
    await requirePending(true);
    await requireFocus(page, control);
    await page.keyboard.press('Space');
    assert.equal(await control.isChecked(), true, 'Extra Space cannot reverse the pending target.');
    await requireFocus(page, control);

    // Real pointer input bypasses Playwright's aria-disabled actionability check.
    await label.scrollIntoViewIfNeeded();
    const box = await label.boundingBox();
    assert(box);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    assert.equal(
      await control.isChecked(),
      true,
      'Clicking the label cannot reverse a busy target.',
    );
    const frames = await control.evaluate(async (node) => {
      const samples = [];
      for (let frame = 0; frame < 3; frame += 1) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        samples.push(node.checked);
      }
      return samples;
    });
    assert.deepEqual(
      frames,
      [true, true, true],
      'The busy target stays stable across rendered frames.',
    );
    await requirePending(true);

    stage = 'first failure rolls back without a second completion';
    await requireFailure();
    // Cross another request-length window to expose a repeated busy activation accepted by mistake.
    await page.waitForTimeout(800);
    await requireFailure();

    stage = 'same switch retries successfully';
    await control.focus();
    await control.press('Space');
    await requirePending(true);
    await requireFocus(page, control);
    await requireSaved(true);
    await requireFocus(page, control);

    stage = 'pointer turns the preference off successfully';
    await label.click();
    await requirePending(false);
    await requireSaved(false);
    // Pointer activation does not imply focus on every platform.

    stage = 'reset restores the first-failure strategy';
    await restorePreference();
    await control.focus();
    await control.press('Space');
    await requirePending(true);
    await requireFocus(page, control);

    stage = 'failure does not steal focus from another control';
    focusProbe = await page.evaluateHandle(() => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Switch preference focus probe';
      document.body.append(button);
      button.focus({ preventScroll: true });
      return button;
    });
    await requireFailure();
    assert.equal(
      await page.evaluate((node) => document.activeElement === node, focusProbe),
      true,
      'A delayed failure preserves the reader’s external focus.',
    );
  } catch (error) {
    error.message = `SwitchReadingPreference [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      await restorePreference();
    } catch (cleanupError) {
      if (!originalError) originalError = cleanupError;
      else originalError.message += `\nCleanup also failed: ${cleanupError}`;
    } finally {
      if (focusProbe) {
        await focusProbe.evaluate((node) => node.remove());
        await focusProbe.dispose();
      }
      await originalControl.dispose();
    }
  }
  if (originalError) throw originalError;
}

async function clickLabel(page, control) {
  const label = control.locator('xpath=ancestor::label');
  await label.scrollIntoViewIfNeeded();
  const rect = await label.boundingBox();
  assert(rect && rect.width >= 44 && rect.height >= 44, 'Switch label keeps a 44px target.');
  await page.mouse.click(rect.x + rect.width / 2, rect.y + rect.height / 2);
  return rect;
}

/** The four primary examples stay small; no form or article task is required to learn a switch. */
export async function verifySwitchExamples(page) {
  const basic = page.locator('#basic .example-preview');
  const controlled = page.locator('#controlled .example-preview');
  const basicInput = basic.getByRole('switch', { name: '启用通知', exact: true });
  const controlledInput = controlled.getByRole('switch', { name: '启用通知', exact: true });
  const observations = { states: [] };
  let originalError;
  try {
    await basicInput.waitFor();
    assert.equal(await basic.getByRole('switch').count(), 1);
    assert.equal((await basic.innerText()).trim(), '启用通知');
    assert.equal(await basicInput.isChecked(), false);
    await basicInput.focus();
    await page.keyboard.press('Space');
    assert.equal(await basicInput.isChecked(), true);
    await requireFocus(page, basicInput);
    observations.basicTarget = await clickLabel(page, basicInput);
    assert.equal(await basicInput.isChecked(), false);

    assert.equal(await controlled.getByRole('switch').count(), 1);
    assert.equal(await controlled.getByRole('status').count(), 0);
    assert.equal(await controlled.getByRole('heading').count(), 0);
    await controlled.getByText('已关闭', { exact: true }).waitFor();
    await controlledInput.focus();
    await page.keyboard.press('Space');
    await controlled.getByText('已开启', { exact: true }).waitFor();
    assert.equal(await controlledInput.isChecked(), true);
    observations.controlledTarget = await clickLabel(page, controlledInput);
    await controlled.getByText('已关闭', { exact: true }).waitFor();
    assert.equal(await controlledInput.isChecked(), false);

    for (const mode of ['disabled', 'loading']) {
      const example = page.locator(`#switch-${mode} .example-preview`);
      assert.equal(await example.getByRole('switch').count(), 2);
      for (const [name, checked] of [
        ['邮件通知', false],
        ['站内通知', true],
      ]) {
        const input = example.getByRole('switch', { name, exact: true });
        assert.equal(await input.isChecked(), checked);
        assert.equal(await input.evaluate((node) => node.disabled), mode === 'disabled');
        if (mode === 'loading') {
          assert.equal(await input.getAttribute('aria-busy'), 'true');
          assert.equal(await input.getAttribute('aria-disabled'), 'true');
          await input.focus();
          await requireFocus(page, input);
          await page.keyboard.press('Space');
          assert.equal(await input.isChecked(), checked);
        }
        const rect = await clickLabel(page, input);
        const samples = await input.evaluate(async (node) => {
          const values = [];
          for (let i = 0; i < 3; i++) {
            await new Promise(requestAnimationFrame);
            values.push(node.checked);
          }
          return values;
        });
        assert.deepEqual(samples, [checked, checked, checked]);
        if (mode === 'loading') await requireFocus(page, input);
        observations.states.push({ mode, name, checked, rect, samples });
      }
    }
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
    );
  } catch (error) {
    originalError = error;
  } finally {
    for (const input of [basicInput, controlledInput]) {
      try {
        if (await input.isChecked()) {
          await input.focus();
          await page.keyboard.press('Space');
        }
      } catch (error) {
        if (!originalError) originalError = error;
      }
    }
  }
  if (originalError) throw originalError;
  return observations;
}

/** Observe real timer cancellation across a same-document React route unmount, not a page reload. */
export async function verifySwitchPreferenceUnmount(page, example) {
  const originalURL = page.url();
  if (
    !new URL(originalURL).hash.startsWith('#/components/switch') ||
    (await page.locator('.docs-app').count()) === 0
  )
    return { status: 'not-run', reason: 'Standalone has no real React unmount navigation.' };
  await revealExample(example);
  const control = example.getByRole('switch', { name: '启用通知', exact: true });
  const reset = example.getByRole('button', { name: '重置示例', exact: true });
  await page.waitForFunction(
    (node) => node.getAttribute('aria-busy') !== 'true',
    await control.elementHandle(),
  );
  await reset.click();
  const originalInput = await control.elementHandle();
  const documentHandle = await page.evaluateHandle(() => document);
  const probe = await page.evaluateHandle(() => {
    const originalSet = window.setTimeout;
    const originalClear = window.clearTimeout;
    const records = [];
    window.setTimeout = function (handler, delay, ...args) {
      if (delay !== 700 || typeof handler !== 'function')
        return originalSet.call(window, handler, delay, ...args);
      const record = { delay, createdAt: performance.now(), firedAt: null, clearedAt: null };
      const id = originalSet.call(
        window,
        function (...values) {
          record.firedAt = performance.now();
          return handler.apply(this, values);
        },
        delay,
        ...args,
      );
      record.id = id;
      records.push(record);
      return id;
    };
    window.clearTimeout = function (id) {
      const record = records.find((item) => item.id === id);
      if (record) record.clearedAt = performance.now();
      return originalClear.call(window, id);
    };
    return {
      records,
      restore() {
        window.setTimeout = originalSet;
        window.clearTimeout = originalClear;
      },
    };
  });
  let originalError;
  let result;
  try {
    await control.focus();
    await page.keyboard.press('Space');
    await requireText(page, example.getByRole('status'), pendingMessage);
    assert.equal(await probe.evaluate((state) => state.records.length), 1);
    const next = new URL(originalURL);
    next.hash = '/components/text';
    await page.goto(next.href);
    await page.locator('#text-sizes .example-preview').waitFor();
    assert.equal(await page.evaluate((original) => document === original, documentHandle), true);
    await page.waitForFunction((state) => state.records[0].clearedAt !== null, probe);
    const remaining = await probe.evaluate((state) =>
      Math.max(0, state.records[0].createdAt + 850 - performance.now()),
    );
    await page.waitForTimeout(remaining);
    const [timer] = await probe.evaluate((state) => state.records);
    assert.equal(
      timer.firedAt,
      null,
      'The cancelled original task does not fire after its deadline.',
    );
    assert.ok(timer.clearedAt - timer.createdAt < 700);
    await page.goBack();
    await revealExample(example);
    const fresh = example.getByRole('switch', { name: '启用通知', exact: true });
    await fresh.waitFor();
    assert.equal(await fresh.evaluate((node, original) => node === original, originalInput), false);
    assert.equal(await fresh.isChecked(), false);
    await requireText(page, example.getByRole('status'), initialMessage);
    assert.equal(await example.getByRole('alert').count(), 0);
    assert.equal(await page.evaluate((original) => document === original, documentHandle), true);
    result = { status: 'passed', sameDocument: true, timer, remountedInitialState: true };
  } catch (error) {
    originalError = error;
  } finally {
    await probe.evaluate((state) => state.restore());
    await probe.dispose();
    await originalInput.dispose();
    await documentHandle.dispose();
    if (page.url() !== originalURL) await page.goto(originalURL);
  }
  if (originalError) throw originalError;
  return result;
}
