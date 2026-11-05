import assert from 'node:assert/strict';

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
