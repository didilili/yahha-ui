import assert from 'node:assert/strict';

/** Keep the current deployment prefix and document query when opening a relocated workflow. */
export async function openInteractionExample(page, id) {
  const destination = new URL(page.url());
  destination.hash = `/guides/interactions?section=${encodeURIComponent(id)}`;
  await page.goto(destination.href);
  const example = page.locator(`#${id}`);
  await revealExample(example);
  await example.waitFor({ state: 'visible' });
  return example.locator('.example-preview');
}

/** Open enclosing documentation disclosures through their native summary controls. */
export async function revealExample(example) {
  for (;;) {
    const handle = await example.evaluateHandle((node) => {
      let outermost = null;
      for (let parent = node.parentElement; parent; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS' && !parent.open) outermost = parent;
      }
      return outermost;
    });
    try {
      const details = handle.asElement();
      if (!details) return;
      const summary = await details.$(':scope > summary');
      assert(summary, 'A collapsed example has a native summary control.');
      await summary.click();
      await summary.dispose();
    } finally {
      await handle.dispose();
    }
  }
}
