import assert from 'node:assert/strict';

export async function measureTextButton(button) {
  return button.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    const mark = node.querySelector('[data-loading-mark]');
    return {
      width: box.width,
      height: box.height,
      label: node.textContent,
      padding: [style.paddingInlineStart, style.paddingInlineEnd],
      markWidth: mark?.getBoundingClientRect().width ?? 0,
      gap: parseFloat(style.columnGap),
    };
  });
}

/** A text-only action gains a real icon slot; an existing startIcon keeps its slot. */
export function verifyTextButtonLoading(before, during) {
  assert.equal(before.markWidth, 0, 'The idle action must not contain a loading mark.');
  assert(during.markWidth > 0, 'Loading must paint a visible mark.');
  assert.equal(during.label, before.label, 'Loading must retain the action name.');
  assert(
    Math.abs(during.width - before.width - during.markWidth - during.gap) < 1,
    'A text-only loading action adds the visible mark and gap.',
  );
  assert(Math.abs(during.height - before.height) < 1, 'Loading must retain the action height.');
  assert.deepEqual(during.padding, before.padding, 'Loading must preserve both button insets.');
}

export function verifyTextButtonRestored(before, after) {
  assert.equal(after.markWidth, 0, 'The completed action removes its loading mark.');
  assert.equal(after.label, before.label, 'Restoring the action retains its original name.');
  assert(
    Math.abs(after.width - before.width) < 1 && Math.abs(after.height - before.height) < 1,
    'Restoring a text-only action must restore its original dimensions.',
  );
  assert.deepEqual(after.padding, before.padding, 'Restoring an action retains both insets.');
}
