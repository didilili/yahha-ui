import assert from 'node:assert/strict';

export async function verifySectionIcons(page, mode = 'component') {
  const headings = await page.locator('.doc-section > .section-title').evaluateAll((nodes) =>
    nodes.map((heading) => {
      const icon = heading.querySelector('svg');
      return {
        id: heading.id,
        kind: icon?.getAttribute('data-section-icon'),
        hidden: icon?.getAttribute('aria-hidden'),
        focusable: icon?.getAttribute('focusable'),
        width: icon?.getBoundingClientRect().width,
        margin: getComputedStyle(heading).marginInlineStart,
        anchor: heading.querySelector('.heading-anchor')?.getAttribute('href'),
      };
    }),
  );
  assert(headings.length > 0, 'The document has real chapter headings.');
  for (const heading of headings) {
    assert(
      heading.anchor?.endsWith(`section=${heading.id}`),
      'Existing chapter links remain usable.',
    );
    if (mode === 'guide') {
      assert.equal(
        heading.kind,
        undefined,
        'Ordinary guide chapters do not receive fallback icons.',
      );
      assert.equal(heading.width, undefined);
      assert.equal(heading.margin, '0px', 'Text-only headings do not retain an empty icon gutter.');
    } else {
      assert(heading.kind, `${heading.id}: a reviewed chapter identity replaces the generic star.`);
      assert.equal(heading.hidden, 'true');
      assert.equal(heading.focusable, 'false');
      assert.equal(heading.width, 29);
    }
  }
  if (mode === 'component') {
    assert.equal(headings.find(({ id }) => id === 'api')?.kind, 'api');
    assert.equal(headings.find(({ id }) => id === 'examples')?.kind, 'examples');
    assert.equal(headings.find(({ id }) => id === 'related')?.kind, 'related');
  }
}
