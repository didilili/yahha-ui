import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const title = '沿着河边，慢慢走';
const categoryLabel = '生活手记';
const errorMessage = '请先填写摘要。';
const successMessage = '摘要检查通过，预览已更新；内容未保存或发布。';

async function requireText(page, locator, expected) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction(({ element, text }) => element.textContent === text, {
      element: node,
      text: expected,
    });
  } finally {
    await node.dispose();
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

/** Exercise the local summary task with native form values, validation, buttons and resets. */
export async function verifyBadgeSummary(page, example) {
  await revealExample(example);
  const input = example.getByRole('textbox', { name: '手记摘要', exact: true });
  const check = example.getByRole('button', { name: '检查摘要', exact: true });
  const reset = example.getByRole('button', { name: '恢复示例', exact: true });
  const phaseBadge = example.locator('span[data-tone]').filter({
    hasText: /^(未检查|待检查|需补充|已检查)$/,
  });
  const category = example.locator('span[data-tone]').filter({ hasText: /^生活手记$/ });
  const preview = example.getByRole('region', { name: '摘要预览', exact: true });
  const status = example.getByRole('status');
  const error = example.getByText(errorMessage, { exact: true });
  let stage = 'initial';
  let originalError;
  let longPreviewGeometry;
  await input.waitFor();
  const originalInput = await input.elementHandle();
  const originalPhaseBadge = await phaseBadge.elementHandle();
  const originalCategory = await category.elementHandle();

  async function requireNativeValues(expected) {
    assert.equal(await input.inputValue(), expected, 'The original summary draft is preserved.');
    assert.equal(await input.evaluate((node, original) => node === original, originalInput), true);
    assert.deepEqual(
      await input.evaluate((node) => [...new FormData(node.form)]),
      [['summary', expected]],
      'FormData contains the current raw summary, not a stale preview or a badge value.',
    );
  }

  async function requireStaticBadges() {
    assert.equal(await example.getByRole('heading', { name: title, exact: true }).count(), 1);
    assert.equal(await example.locator('span[data-tone]').count(), 2);
    assert.equal(await category.textContent(), categoryLabel);
    assert.equal(await category.getAttribute('data-tone'), 'neutral');
    assert.equal(
      await category.evaluate((node, original) => node === original, originalCategory),
      true,
    );
    assert.equal(
      await phaseBadge.evaluate((node, original) => node === original, originalPhaseBadge),
      true,
    );
    for (const badge of [category, phaseBadge]) {
      const semantics = await badge.evaluate((node) => ({
        tag: node.tagName,
        tabIndex: node.tabIndex,
        role: node.getAttribute('role'),
        live: node.getAttribute('aria-live'),
        liveAncestor: node.closest('[role="status"], [role="alert"], [aria-live]') !== null,
        interactiveChildren: node.querySelectorAll('a, button, input, select, textarea').length,
      }));
      assert.deepEqual(semantics, {
        tag: 'SPAN',
        tabIndex: -1,
        role: null,
        live: null,
        liveAncestor: false,
        interactiveChildren: 0,
      });
    }
    assert.equal(await status.count(), 1);
    assert.equal(await example.getByRole('alert').count(), 0);
    assert.equal(await example.locator('[aria-live]').count(), 0);
  }

  async function requirePhase(label, tone) {
    await requireText(page, phaseBadge, label);
    assert.equal(await phaseBadge.getAttribute('data-tone'), tone);
    await requireStaticBadges();
  }

  async function requireNoPreview() {
    assert.equal(await preview.count(), 0);
    await requireText(page, status, '');
  }

  async function requireEditing(value) {
    await requirePhase('待检查', 'accent');
    await requireNativeValues(value);
    await requireNoPreview();
    assert.equal(await error.count(), 0);
    assert.notEqual(await input.getAttribute('aria-invalid'), 'true');
  }

  async function requireMissing(value) {
    await requirePhase('需补充', 'neutral');
    await requireNativeValues(value);
    await requireNoPreview();
    await error.waitFor();
    assert.equal(await error.count(), 1);
    assert.equal(await input.getAttribute('aria-invalid'), 'true');
    const errorId = await error.getAttribute('id');
    assert(
      errorId && (await input.getAttribute('aria-describedby')).split(/\s+/).includes(errorId),
      'The field error is associated with the native input.',
    );
    await requireFocus(page, input);
  }

  async function requireChecked(raw) {
    await requirePhase('已检查', 'success');
    await requireNativeValues(raw);
    await requireText(page, status, successMessage);
    await preview.waitFor();
    assert.equal(await preview.locator('p').count(), 1);
    // The author intentionally uses raw FormData for preview; trim is only an empty check.
    await requireText(page, preview.locator('p'), raw);
    assert.equal(await preview.getByRole('status').count(), 0);
    assert.equal(await preview.locator('[aria-live]').count(), 0);
    assert.equal(await error.count(), 0);
    assert.notEqual(await input.getAttribute('aria-invalid'), 'true');
  }

  async function requireInitial() {
    await requirePhase('未检查', 'neutral');
    await requireNativeValues('');
    await requireNoPreview();
    assert.equal(await error.count(), 0);
    assert.notEqual(await input.getAttribute('aria-invalid'), 'true');
  }

  try {
    await requireInitial();
    assert.equal(await check.getAttribute('type'), 'submit');
    assert.equal(await reset.getAttribute('type'), 'reset');
    assert.equal(await input.evaluate((node) => node.required && node.form.noValidate), true);

    stage = 'empty summary validation with Enter';
    await check.focus();
    await check.press('Enter');
    await requireMissing('');

    stage = 'whitespace validation preserves the draft';
    await input.fill('   ');
    await requireEditing('   ');
    assert.equal(
      await input.evaluate((node) => node.validity.valueMissing),
      false,
      'Whitespace requires the example’s explicit trim check, beyond native required.',
    );
    await check.focus();
    await check.press('Space');
    await requireMissing('   ');

    stage = 'raw nonempty summary produces the real preview';
    const raw = '  风吹过树梢，水面上的光也跟着慢下来。  ';
    await input.fill(raw);
    await requireEditing(raw);
    await check.focus();
    await check.press('Enter');
    await requireChecked(raw);
    await requireFocus(page, check);
    await check.press('Space');
    await requireChecked(raw);
    await requireFocus(page, check);

    stage = 'editing invalidates the old checked preview';
    const edited = '绕到河边，再把今天的小发现记下来。';
    await input.fill(edited);
    await requireEditing(edited);
    await check.click();
    await requireChecked(edited);
    // Native pointer activation does not guarantee button focus on every platform.

    stage = 'long Chinese and unbroken English preview wraps';
    const longSummary =
      '沿着河边慢慢走，把遇到的小花、晚霞和朋友的话记在手记里。'.repeat(8) +
      'PersonalJournalWithAVeryLongUnbrokenSummaryForASlowWeekend'.repeat(8) +
      '最后这句话也完整保留。';
    await input.fill(longSummary);
    await requireEditing(longSummary);
    await check.focus();
    await check.press('Enter');
    await requireChecked(longSummary);
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    longPreviewGeometry = await preview.evaluate((node) => {
      const box = node.getBoundingClientRect();
      return {
        viewportWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        left: box.left,
        right: box.right,
        clientWidth: node.clientWidth,
        scrollWidth: node.scrollWidth,
      };
    });
    assert(longPreviewGeometry.documentWidth <= longPreviewGeometry.viewportWidth + 1);
    assert(longPreviewGeometry.left >= -1);
    assert(longPreviewGeometry.right <= longPreviewGeometry.viewportWidth + 1);
    assert(longPreviewGeometry.scrollWidth <= longPreviewGeometry.clientWidth + 1);

    for (const [index, method] of ['button', 'programmatic', 'button', 'programmatic'].entries()) {
      stage = `${method} reset ${index + 1} and subsequent edit`;
      const draft = `第${index + 1}次摘要草稿，重置后仍可继续检查。`;
      await input.fill(draft);
      await requireEditing(draft);
      await check.focus();
      await check.press('Enter');
      await requireChecked(draft);
      if (method === 'button') {
        await reset.focus();
        await reset.press(index === 0 ? 'Enter' : 'Space');
        await requireFocus(page, reset);
      } else {
        await input.evaluate((node) => node.form.reset());
      }
      await requireInitial();
    }

    stage = 'native reset clears an error and post-reset input works';
    await check.click();
    await requireMissing('');
    await input.evaluate((node) => node.form.reset());
    await requireInitial();
    await input.fill('重置后新写下的摘要。');
    await requireEditing('重置后新写下的摘要。');
    await check.focus();
    await check.press('Space');
    await requireChecked('重置后新写下的摘要。');
  } catch (failure) {
    failure.message = `BadgeSummary [${stage}]: ${failure.message}`;
    originalError = failure;
  } finally {
    try {
      await reset.click();
      await requireInitial();
    } catch (cleanupError) {
      if (!originalError) originalError = cleanupError;
      else originalError.message += `\nCleanup also failed: ${cleanupError}`;
    } finally {
      await originalInput.dispose();
      await originalPhaseBadge.dispose();
      await originalCategory.dispose();
    }
  }
  if (originalError) throw originalError;
  return { longPreviewGeometry };
}
