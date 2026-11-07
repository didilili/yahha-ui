import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const errorMessage = '请输入站点标题，不能只填写空格。';
const savedMessage = (value) => (value ? `当前标题：${value}` : '尚未保存标题。');

async function focused(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

async function settled(page, dialog) {
  const node = await dialog.elementHandle();
  try {
    await page.waitForFunction(
      (element) =>
        !element.hasAttribute('data-starting-style') &&
        getComputedStyle(element).opacity === '1' &&
        !element
          .getAnimations({ subtree: true })
          .some((animation) => animation.playState === 'running'),
      node,
    );
  } finally {
    await node.dispose();
  }
}

/** Exercise dirty-close rejection in the same dialog, input and footer without resetting React. */
export async function verifyDialogDraft(page, scope = page.locator('#form .example-preview')) {
  await revealExample(scope);
  const trigger = scope.getByRole('button', { name: '修改站点标题', exact: true });
  const dialog = page.getByRole('dialog', { name: '站点标题', exact: true });
  const input = dialog.getByRole('textbox', { name: '站点标题', exact: true });
  const cancel = dialog.getByRole('button', { name: '取消', exact: true });
  const save = dialog.getByRole('button', { name: '保存标题', exact: true });
  const close = dialog.getByRole('button', { name: '关闭弹窗', exact: true });
  const proceed = dialog.getByRole('button', { name: '继续编辑', exact: true });
  const discard = dialog.getByRole('button', { name: '放弃修改并关闭', exact: true });
  // The modal hides this outside status from the accessibility tree while open.
  const status = scope.getByRole('status', { includeHidden: true });
  const snapshots = [];
  const closeRequests = [];
  let stage = 'initial';
  let originalError, result;
  await trigger.waitFor();
  const initialText = (await status.textContent()).trim();
  const initialSaved =
    initialText === '尚未保存标题。' ? '' : initialText.slice('当前标题：'.length);
  let workingSaved = initialSaved;

  async function requireStatus(value) {
    const node = await status.elementHandle();
    try {
      await page.waitForFunction(({ element, text }) => element.textContent === text, {
        element: node,
        text: savedMessage(value),
      });
    } finally {
      await node.dispose();
    }
    assert.equal(await status.count(), 1);
  }

  async function open(value) {
    await trigger.focus();
    await trigger.press('Enter');
    await dialog.waitFor();
    await focused(page, input);
    await settled(page, dialog);
    await focused(page, input);
    assert.equal(await input.inputValue(), value);
    assert.equal(await dialog.getByRole('alert').count(), 0);
    await requireStatus(value);
  }

  async function closeWith(action) {
    const popup = await dialog.elementHandle();
    try {
      await action();
      await page.waitForFunction((node) => !node.isConnected, popup);
    } finally {
      await popup.dispose();
    }
    await focused(page, trigger);
  }

  async function nativeValue(raw) {
    assert.equal(await input.inputValue(), raw);
    assert.deepEqual(await input.evaluate((node) => [...new FormData(node.form)]), [
      ['title', raw],
    ]);
    const field = await input.elementHandle();
    try {
      assert.equal(await save.evaluate((button, node) => button.form === node.form, field), true);
    } finally {
      await field.dispose();
    }
  }

  async function geometry() {
    const measured = await dialog.evaluate((node) => {
      const box = node.getBoundingClientRect();
      return {
        width: innerWidth,
        height: innerHeight,
        documentWidth: document.documentElement.scrollWidth,
        rect: { left: box.left, right: box.right, top: box.top, bottom: box.bottom },
        clientWidth: node.clientWidth,
        scrollWidth: node.scrollWidth,
        buttons: [...node.querySelectorAll('button')].map((button) => {
          const bounds = button.getBoundingClientRect();
          return {
            name: button.getAttribute('aria-label') || button.textContent,
            width: bounds.width,
            height: bounds.height,
          };
        }),
      };
    });
    assert(measured.documentWidth <= measured.width + 1);
    assert(measured.scrollWidth <= measured.clientWidth + 1);
    assert(measured.rect.left >= -1 && measured.rect.right <= measured.width + 1);
    assert(measured.rect.top >= -1 && measured.rect.bottom <= measured.height + 1);
    for (const button of measured.buttons)
      assert(button.width >= 44 - 0.01 && button.height >= 44 - 0.01);
    return measured;
  }

  async function pointerBackdrop() {
    const popup = await dialog.elementHandle();
    let point;
    try {
      point = await page.evaluate((node) => {
        const candidates = [
          [3, 3],
          [innerWidth - 3, 3],
          [3, innerHeight - 3],
          [innerWidth - 3, innerHeight - 3],
        ];
        for (const [x, y] of candidates) {
          const hit = document.elementFromPoint(x, y);
          if (!hit || node.contains(hit)) continue;
          const rect = hit.getBoundingClientRect();
          if (
            getComputedStyle(hit).position === 'fixed' &&
            rect.left <= 0 &&
            rect.top <= 0 &&
            rect.right >= innerWidth &&
            rect.bottom >= innerHeight
          )
            return { x, y, tag: hit.tagName, position: getComputedStyle(hit).position };
        }
        return null;
      }, popup);
    } finally {
      await popup.dispose();
    }
    assert(point, 'A physical point on the full-viewport backdrop must be outside the popup.');
    await page.mouse.click(point.x, point.y);
    return point;
  }

  async function requestClose(method) {
    if (method === 'cancel') await cancel.click();
    else if (method === 'escape') await input.press('Escape');
    else if (method === 'close-button') await close.click();
    else return pointerBackdrop();
    return null;
  }

  async function requireRejected(raw, retained, selection) {
    const warning = dialog.getByRole('alert');
    await warning.getByText('还有未保存的修改', { exact: true }).waitFor();
    await proceed.waitFor();
    const popup = await dialog.elementHandle();
    let observation;
    try {
      const immediate = await dialog.evaluate((node) => ({
        inside: node.contains(document.activeElement),
        tag: document.activeElement.tagName,
      }));
      // A physical outside press may momentarily focus BODY; await the actual conditional guard.
      await page.waitForFunction((node) => node.contains(document.activeElement), popup);
      observation = {
        immediate,
        afterGuard: await dialog.evaluate((node) => ({
          inside: node.contains(document.activeElement),
          tag: document.activeElement.tagName,
        })),
      };
      assert.equal(await dialog.evaluate((node, old) => node === old, retained.dialog), true);
      assert.equal(await input.evaluate((node, old) => node === old, retained.input), true);
      assert.equal(await proceed.evaluate((node, old) => node === old, retained.cancel), true);
      assert.equal(await save.evaluate((node, old) => node === old, retained.save), true);
      assert.equal(
        await dialog.evaluate((node) => node.inert || node.hasAttribute('data-ending-style')),
        false,
      );
      assert.equal(await warning.count(), 1);
      assert.deepEqual(
        await save.evaluate((button) =>
          [...button.parentElement.querySelectorAll('button')].map((action) =>
            action.textContent.trim(),
          ),
        ),
        ['继续编辑', '保存标题', '放弃修改并关闭'],
        'Dirty-close choices belong to one footer action area without a second cancel action.',
      );
      assert.equal(await cancel.count(), 0);
      assert.equal(
        await dialog.getByRole('button', { name: /^(继续编辑|保存标题|放弃修改并关闭)$/ }).count(),
        3,
      );
      assert.equal(await page.getByRole('dialog').count(), 1);
      assert.equal(await dialog.getByRole('status').count(), 0);
      assert.equal(await dialog.locator('[aria-live]').count(), 0);
      await nativeValue(raw);
      assert.deepEqual(
        await input.evaluate((node) => [node.selectionStart, node.selectionEnd]),
        selection,
      );
      await requireStatus(workingSaved);
    } finally {
      await popup.dispose();
    }
    return observation;
  }

  try {
    assert(initialText === savedMessage(initialSaved));
    await requireStatus(initialSaved);
    stage = 'clean Escape closes after actual initial focus and opening readiness';
    await open(initialSaved);
    await closeWith(() => input.press('Escape'));

    stage = 'whitespace validation preserves raw FormData and focuses its field';
    await open(initialSaved);
    await input.fill('   ');
    await nativeValue('   ');
    await save.focus();
    await save.press('Enter');
    await dialog.getByText(errorMessage, { exact: true }).waitFor();
    assert.equal(await input.getAttribute('aria-invalid'), 'true');
    await focused(page, input);
    assert.equal(await dialog.getByRole('alert').count(), 0);
    await requireStatus(initialSaved);

    stage = 'save reads raw native form values and stores the trimmed title';
    const nextSaved = '已保存的阅读室';
    await input.fill(`  ${nextSaved}  `);
    await nativeValue(`  ${nextSaved}  `);
    assert.notEqual(await input.getAttribute('aria-invalid'), 'true');
    await closeWith(async () => {
      await save.focus();
      await save.press('Enter');
    });
    await requireStatus(nextSaved);
    workingSaved = nextSaved;
    await open(workingSaved);

    const retained = Object.fromEntries(
      await Promise.all(
        [
          ['dialog', dialog],
          ['input', input],
          ['cancel', cancel],
          ['save', save],
        ].map(async ([key, locator]) => [key, await locator.elementHandle()]),
      ),
    );
    try {
      for (const method of ['cancel', 'escape', 'close-button', 'backdrop']) {
        stage = `dirty ${method} retains the current dialog/input/footer/raw/selection`;
        const raw = `  未保存的站点标题-${method}  `;
        await input.fill(raw);
        await input.evaluate((node) => node.setSelectionRange(2, 6));
        const point = await requestClose(method);
        const firstObservation = await requireRejected(raw, retained, [2, 6]);
        const warning = await dialog.getByRole('alert').elementHandle();
        try {
          await page.keyboard.press('Escape');
          await pointerBackdrop();
          const repeatedObservation = await requireRejected(raw, retained, [2, 6]);
          assert.equal(
            await dialog.getByRole('alert').evaluate((node, old) => node === old, warning),
            true,
          );
          const bounds = await geometry();
          closeRequests.push({ method, point, firstObservation, repeatedObservation, bounds });
        } finally {
          await warning.dispose();
        }
        await proceed.focus();
        await proceed.press('Enter');
        await focused(page, input);
        assert.equal(await dialog.getByRole('alert').count(), 0);
        await nativeValue(raw);
        assert.equal(await input.evaluate((node, old) => node === old, retained.input), true);
        assert.deepEqual(
          await input.evaluate((node) => [node.selectionStart, node.selectionEnd]),
          [2, 6],
        );
      }
    } finally {
      await Promise.all(Object.values(retained).map((node) => node.dispose()));
    }

    stage = 'confirmation save submits the same native form and returns focus';
    await input.fill(`  ${workingSaved}  `);
    await input.press('Escape');
    await proceed.waitFor();
    await closeWith(async () => {
      await save.focus();
      await save.press('Enter');
    });
    await requireStatus(workingSaved);
    await open(workingSaved);

    stage = 'explicit discard closes and reopens the saved value';
    await input.fill('这次明确放弃的修改');
    await input.press('Escape');
    await discard.waitFor();
    await closeWith(async () => {
      await discard.focus();
      await discard.press('Space');
    });
    await requireStatus(workingSaved);
    await open(workingSaved);

    stage = 'raw equality to saved clears an existing warning and permits clean Escape';
    await input.fill(` ${workingSaved} `);
    await cancel.click();
    await dialog.getByRole('alert').waitFor();
    await input.fill(workingSaved);
    await dialog.getByRole('alert').waitFor({ state: 'detached' });
    await nativeValue(workingSaved);
    const finalBounds = await geometry();
    await closeWith(() => input.press('Escape'));
    await requireStatus(workingSaved);
    result = { initialSaved, closeRequests, finalBounds, snapshots };
  } catch (error) {
    error.message = `DialogDraft [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      stage = 'cleanup';
      if (await dialog.count()) {
        const popup = await dialog.elementHandle();
        try {
          if (await proceed.count()) {
            await discard.click();
          } else await cancel.click();
          await page.waitForFunction(
            (node) => !node.isConnected || node.querySelector('[role="alert"]') !== null,
            popup,
          );
          if (await popup.evaluate((node) => node.isConnected))
            await closeWith(async () => {
              await discard.focus();
              await discard.press('Enter');
            });
          else await focused(page, trigger);
        } finally {
          await popup.dispose();
        }
      }
      const currentText = (await status.textContent()).trim();
      workingSaved = currentText === '尚未保存标题。' ? '' : currentText.slice('当前标题：'.length);
      if (initialSaved) {
        await open(workingSaved);
        await input.fill(initialSaved);
        await closeWith(async () => {
          await save.focus();
          await save.press('Enter');
        });
        workingSaved = initialSaved;
      }
      await requireStatus(workingSaved);
      assert.equal(await dialog.count(), 0);
      if (result)
        result.cleanup = {
          saved: workingSaved,
          initialSavedRestored: workingSaved === initialSaved,
          limitation:
            initialSaved === '' && workingSaved !== ''
              ? 'An empty saved title cannot be restored through this required form. The helper leaves the real saved title, closes the dialog, and supports the next call from that value; no state patch or test-only reset.'
              : null,
        };
    } catch (error) {
      if (!originalError) originalError = error;
      else originalError.message += `\nCleanup also failed: ${error}`;
    }
  }
  if (originalError) throw originalError;
  return result;
}
