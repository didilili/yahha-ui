import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const initialDraft = '这篇散步手记让我也想出门走走。\n谢谢你分享沿途的小花。';
const previewMessage = '预览已更新，内容未发送。';
const errorMessage = '写下一点想法再预览。';

async function requireFocus(page, locator) {
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await locator.elementHandle(),
  );
}

function matchingGeometry({ element, expectedRows, expectedHeight }) {
  if (!element.isConnected) return false;
  const style = element.ownerDocument.defaultView.getComputedStyle(element);
  const geometry = {
    height: element.getBoundingClientRect().height,
    width: element.getBoundingClientRect().width,
    lineHeight: Number.parseFloat(style.lineHeight),
    padding: Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom),
    border: Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.borderBottomWidth),
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
    scrollTop: element.scrollTop,
  };
  if (
    geometry.width <= 0 ||
    geometry.height <= 0 ||
    !Number.isFinite(geometry.lineHeight) ||
    geometry.lineHeight <= 0
  )
    return false;
  if (expectedRows !== null) {
    const expected = expectedRows * geometry.lineHeight + geometry.padding + geometry.border;
    if (Math.abs(geometry.height - expected) > 1) return false;
  }
  if (expectedHeight !== null && Math.abs(geometry.height - expectedHeight) > 1) return false;
  return geometry;
}

async function waitForGeometry(page, input, rows = null, originalHeight = null) {
  const node = await input.elementHandle();
  const args = { element: node, expectedRows: rows, expectedHeight: originalHeight };
  const deadline = Date.now() + 8000;
  try {
    while (Date.now() < deadline) {
      // Keep this predicate synchronous: an async predicate's Promise can satisfy the poll early.
      const result = await page.waitForFunction(matchingGeometry, args, {
        timeout: Math.max(1, deadline - Date.now()),
      });
      let before;
      try {
        before = await result.jsonValue();
      } finally {
        await result.dispose();
      }
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
      );
      const after = await page.evaluate(matchingGeometry, args);
      if (
        after &&
        ['height', 'width', 'lineHeight', 'padding', 'border'].every(
          (key) => Math.abs(after[key] - before[key]) <= 0.25,
        ) &&
        after.scrollHeight === before.scrollHeight
      )
        return after;
    }
    assert.fail(`Textarea geometry did not stabilize for rows=${rows}, height=${originalHeight}.`);
  } finally {
    await node.dispose();
  }
}

function requireRowHeight(geometry, rows) {
  const expected = rows * geometry.lineHeight + geometry.padding + geometry.border;
  assert(
    Math.abs(geometry.height - expected) <= 1,
    `${rows} visible rows use the actual line height, padding and border: ${geometry.height}px / ${expected}px.`,
  );
}

/** Also reusable against the same draft example installed from the package. */
export async function verifyTextareaGutters(page, input, { requireGutter = false } = {}) {
  const original = { value: await input.inputValue(), style: await input.getAttribute('style') };
  const samples = [];
  try {
    await input.evaluate((node) => {
      Object.assign(node.style, {
        boxSizing: 'border-box',
        width: '200px',
        maxWidth: 'none',
        minHeight: '0',
        maxHeight: 'none',
        fontFamily: 'monospace',
        fontSize: '16px',
        lineHeight: '20px',
        padding: '10px',
        borderWidth: '2px',
      });
    });
    for (const gutter of ['auto', 'stable', 'stable both-edges']) {
      await input.evaluate((node, value) => {
        node.style.scrollbarGutter = value;
      }, gutter);
      await input.fill('');
      await input.fill('x'.repeat(36));
      const geometry = await waitForGeometry(page, input);
      // Measure the real editing area rather than predicting wrapping from font metrics.
      const native = await input.evaluate((node) => {
        const style = getComputedStyle(node);
        const height = node.style.height;
        const overflowY = node.style.overflowY;
        node.style.overflowY = 'hidden';
        node.style.height = '0px';
        const needed = node.scrollHeight;
        node.style.height = height;
        node.style.overflowY = overflowY;
        const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        return {
          rows: Math.round((needed - padding) / parseFloat(style.lineHeight)),
          gutter: node.offsetWidth - border - node.clientWidth,
        };
      });
      assert(native.rows >= 2 && native.rows < 8, 'The wrapping fixture stays below maxRows.');
      requireRowHeight(geometry, native.rows);
      assert(
        geometry.scrollHeight <= geometry.clientHeight + 1,
        `${gutter}: content below maxRows is fully visible.`,
      );
      samples.push({ mode: gutter, ...native, ...geometry });
    }
    if (requireGutter)
      assert(samples[1].gutter > 0, 'The regression must exercise a real reserved gutter.');
    return samples;
  } finally {
    await input.evaluate((node, style) => {
      if (style === null) node.removeAttribute('style');
      else node.setAttribute('style', style);
    }, original.style);
    await input.fill(original.value);
    await waitForGeometry(page, input);
  }
}

export async function verifyTextareaDraft(page, example) {
  await revealExample(example);
  const input = example.getByRole('textbox', { name: '给这篇手记留句话', exact: true });
  const previewButton = example.getByRole('button', { name: '预览留言', exact: true });
  const reset = example.getByRole('button', { name: '恢复草稿', exact: true });
  const status = example.getByRole('status');
  const preview = example.getByRole('region', { name: '留言预览', exact: true });
  const error = example.getByText(errorMessage, { exact: true });
  await input.waitFor({ state: 'visible' });
  const originalInput = await input.elementHandle();
  let initialHeight = null;

  async function requireSameInput() {
    assert.equal(
      await input.evaluate((node, initialNode) => node === initialNode, originalInput),
      true,
      'Editing, validation and reset preserve the original textarea node.',
    );
  }

  async function requireNoPreview() {
    assert.equal(await preview.count(), 0);
    assert.equal(await status.count(), 1, 'The comment draft has one result announcement.');
    assert.equal((await status.innerText()).trim(), '');
  }

  async function requirePreview(value) {
    await preview.waitFor();
    await status.getByText(previewMessage, { exact: true }).waitFor();
    assert.equal(await status.count(), 1);
    assert.deepEqual(
      await preview.evaluate((node) => ({
        text: node.textContent,
        whiteSpace: getComputedStyle(node.firstElementChild).whiteSpace,
      })),
      { text: value, whiteSpace: 'pre-wrap' },
      'The local preview preserves the original whitespace and line breaks.',
    );
    assert.equal(await input.inputValue(), value);
    await requireSameInput();
  }

  try {
    assert.equal(await input.inputValue(), initialDraft);
    assert.equal(
      await input.evaluate((node) => node.ownerDocument.activeElement === node),
      false,
      'Mounting the draft does not steal focus.',
    );
    await requireNoPreview();
    await input.evaluate(async (node) => {
      await node.ownerDocument.fonts?.ready;
    });
    const initial = await waitForGeometry(page, input);
    initialHeight = initial.height;
    assert.equal(
      await input.evaluate((node) => node.ownerDocument.activeElement === node),
      false,
      'Settling the automatic height does not move focus to the textarea.',
    );
    const minimum = 2 * initial.lineHeight + initial.padding + initial.border;
    const maximum = 8 * initial.lineHeight + initial.padding + initial.border;
    assert(initial.height >= minimum - 1 && initial.height <= maximum + 1);
    assert(initial.scrollHeight <= initial.clientHeight + 1, 'The initial draft is fully visible.');
    assert.equal(await reset.getAttribute('type'), 'reset');

    const longDraft = Array.from({ length: 15 }, (_, index) => {
      if (index === 0) return '  第一行保留开头空格。';
      if (index === 7) return '';
      if (index === 14) return '最后一行保留结尾空格。  ';
      return `第${index + 1}行留言。`;
    }).join('\n');
    await input.fill(longDraft);
    const expanded = await waitForGeometry(page, input, 8);
    requireRowHeight(expanded, 8);
    assert.equal(await input.inputValue(), longDraft);
    assert(expanded.scrollHeight > expanded.clientHeight + 1, 'Long content scrolls at maxRows.');
    await input.evaluate((node) => {
      node.scrollTop = node.scrollHeight;
    });
    await page.waitForFunction(
      (node) => Math.abs(node.scrollHeight - node.clientHeight - node.scrollTop) <= 1,
      originalInput,
    );
    assert.equal(await input.inputValue(), longDraft, 'Scrolling never truncates the draft.');
    await previewButton.click();
    await requirePreview(longDraft);

    await input.focus();
    await input.press('ControlOrMeta+A');
    await input.press('Backspace');
    await input.fill('短留言');
    const shrunk = await waitForGeometry(page, input, 2);
    requireRowHeight(shrunk, 2);
    assert(shrunk.scrollHeight <= shrunk.clientHeight + 1, 'Short content no longer overflows.');
    assert.equal(shrunk.scrollTop, 0);
    await requireNoPreview();
    await requireSameInput();

    await input.press('End');
    await input.press('Enter');
    assert.equal(
      await input.inputValue(),
      '短留言\n',
      'Enter inserts a newline instead of previewing.',
    );
    await requireFocus(page, input);
    await requireNoPreview();
    requireRowHeight(await waitForGeometry(page, input, 2), 2);

    await input.fill(longDraft);
    requireRowHeight(await waitForGeometry(page, input, 8), 8);
    await previewButton.click();
    await requirePreview(longDraft);
    // A real reset-button activation exercises the browser's default action, not only microtasks.
    await reset.click();
    await page.waitForFunction((node) => node.value === node.defaultValue, originalInput);
    const restored = await waitForGeometry(page, input, null, initial.height);
    assert.equal(await input.inputValue(), initialDraft);
    assert(
      Math.abs(restored.height - initial.height) <= 1,
      'Reset restores the initial draft height.',
    );
    assert.equal(
      await input.evaluate((node) => new FormData(node.form).get('comment')),
      initialDraft,
    );
    await requireNoPreview();
    await requireSameInput();

    const whitespace = '  \n  ';
    await input.fill(whitespace);
    await previewButton.click();
    await error.waitFor();
    await requireFocus(page, input);
    assert.equal(await input.inputValue(), whitespace, 'Validation preserves the entered content.');
    assert.equal(await input.getAttribute('aria-invalid'), 'true');
    const errorId = await error.getAttribute('id');
    assert(
      errorId && (await input.getAttribute('aria-describedby')).split(/\s+/).includes(errorId),
    );
    await requireNoPreview();

    await input.fill('谢谢分享。');
    await page.waitForFunction(
      (node) => node.getAttribute('aria-invalid') !== 'true',
      originalInput,
    );
    assert.equal(await error.count(), 0, 'Editing clears the outdated validation error.');
    await requireNoPreview();
    await requireSameInput();
    requireRowHeight(await waitForGeometry(page, input, 2), 2);
    await verifyTextareaGutters(page, input);
  } finally {
    try {
      // The helper may run again on this same React instance at another viewport width.
      await reset.focus();
      await reset.click();
      await page.waitForFunction((node) => node.value === node.defaultValue, originalInput);
      assert.equal(await input.inputValue(), initialDraft);
      await waitForGeometry(page, input, null, initialHeight);
      await requireNoPreview();
      assert.equal(await error.count(), 0);
    } finally {
      await originalInput.dispose();
    }
  }
}
