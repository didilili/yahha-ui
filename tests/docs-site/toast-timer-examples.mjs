import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

/** The example owns the timer; pausing must preserve the elapsed undo window. */
export async function verifyToastTimer(
  page,
  scope = page.locator('#timer-and-action .example-preview'),
) {
  await revealExample(scope);
  const archive = scope.getByRole('button', { name: '归档文章', exact: true });
  const restore = scope.getByRole('button', { name: '恢复文章', exact: true });
  const status = scope.getByRole('status');
  const progress = scope.getByRole('progressbar', { name: '提示显示时间', exact: true });
  await archive.click();
  await status.getByRole('button', { name: '关闭提示', exact: true }).click();
  assert.equal(await status.count(), 0);
  assert.equal(await restore.evaluate((node) => node === document.activeElement), true);
  await restore.click();
  assert.equal(await archive.evaluate((node) => node === document.activeElement), true);
  await page.clock.install();
  try {
    await archive.click();
    await restore.focus();
    await page.mouse.move(0, 0);
    await page.clock.runFor(3000);
    assert.equal(await status.getByRole('progressbar').count(), 0);
    assert.equal(await progress.getAttribute('aria-valuemax'), '8000');
    const spent = Number(await progress.getAttribute('aria-valuenow'));
    assert(spent >= 2900 && spent <= 3100);
    const undo = status.getByRole('button', { name: '撤销归档', exact: true });
    await undo.focus();
    const paused = await progress.getAttribute('aria-valuenow');
    await page.clock.fastForward(5000);
    assert.equal(await status.count(), 1, 'Keyboard focus pauses the remaining undo time.');
    assert(Math.abs(Number(await progress.getAttribute('aria-valuenow')) - Number(paused)) < 100);
    assert.match(await progress.getAttribute('aria-valuetext'), /已暂停/);
    await restore.focus();
    await page.clock.runFor(5100);
    assert.equal(
      await status.count(),
      0,
      'Resuming consumes the remaining five seconds, not eight.',
    );
    assert.equal(await restore.evaluate((node) => node === document.activeElement), true);
    await restore.click();
    assert.equal(await archive.evaluate((node) => node === document.activeElement), true);

    await archive.click();
    await restore.focus();
    await page.mouse.move(0, 0);
    await page.clock.runFor(2000);
    await status.hover();
    const hoverPaused = await progress.getAttribute('aria-valuenow');
    await page.clock.fastForward(10000);
    assert.equal(await status.count(), 1, 'Pointer hover pauses the remaining undo time.');
    assert(
      Math.abs(Number(await progress.getAttribute('aria-valuenow')) - Number(hoverPaused)) < 100,
    );
    await page.mouse.move(0, 0);
    await page.clock.runFor(6100);
    assert.equal(await status.count(), 0, 'Leaving hover continues the remaining time.');
    await restore.click();

    await archive.click();
    await restore.focus();
    await page.mouse.move(0, 0);
    await page.clock.runFor(1000);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    const hiddenPaused = await progress.getAttribute('aria-valuenow');
    await page.clock.fastForward(10000);
    assert.equal(await status.count(), 1, 'A hidden document pauses the remaining undo time.');
    assert(
      Math.abs(Number(await progress.getAttribute('aria-valuenow')) - Number(hiddenPaused)) < 100,
    );
    await page.evaluate(() => {
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.clock.runFor(7100);
    assert.equal(await status.count(), 0);
    assert.equal(await restore.evaluate((node) => node === document.activeElement), true);
    await restore.click();

    await archive.click();
    const keyboardUndo = status.getByRole('button', { name: '撤销归档', exact: true });
    await keyboardUndo.focus();
    await keyboardUndo.press('Enter');
    assert.equal(await status.count(), 0);
    assert.equal(await progress.count(), 0);
    assert.equal(await archive.evaluate((node) => node === document.activeElement), true);
    return {
      focusPause: true,
      hoverPause: true,
      simulatedBackgroundPause: true,
      resumesRemainingTime: true,
      progressOutsideStatus: true,
      manualCloseAndUndoFocus: true,
    };
  } finally {
    await page.evaluate(() => {
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.clock.resume();
  }
}
