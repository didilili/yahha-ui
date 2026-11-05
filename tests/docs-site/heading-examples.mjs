import assert from 'node:assert/strict';

async function revealExample(example) {
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
      assert(summary, 'The collapsed heading example has a summary.');
      await summary.click();
      await summary.dispose();
    } finally {
      await handle.dispose();
    }
  }
}

export async function verifyHeadingShare(page, example, nativeClipboard = false) {
  await revealExample(example);
  const copy = example.getByRole('button', { name: '复制本节地址', exact: true });
  await copy.waitFor();
  const href = await example
    .getByRole('link', { name: '本节永久链接', exact: true })
    .getAttribute('href');
  const address = new URL(href, page.url()).href;
  const field = example.getByRole('textbox', { name: '章节地址', exact: true });
  assert.equal(await example.getByRole('status').count(), 1);
  await page.evaluate(() => {
    window.__headingClipboard = navigator.clipboard;
  });
  try {
    if (!nativeClipboard)
      await page.evaluate(() =>
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async (text) => {
              window.__headingCopied = text;
            },
          },
        }),
      );
    await copy.focus();
    await copy.press('Enter');
    await example.getByRole('status').getByText('章节地址已复制。', { exact: true }).waitFor();
    assert.equal(
      nativeClipboard
        ? await page.evaluate(() => navigator.clipboard.readText())
        : await page.evaluate(() => window.__headingCopied),
      address,
    );
    assert.equal(await field.count(), 0);
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async () => {
            throw new DOMException('Denied', 'NotAllowedError');
          },
        },
      }),
    );
    await copy.press('Space');
    await field.waitFor();
    await page.waitForFunction(
      (node) => document.activeElement === node,
      await field.elementHandle(),
    );
    assert.equal(await field.inputValue(), address);
    assert.equal(await field.getAttribute('readonly'), '');
    assert.deepEqual(await field.evaluate((node) => [node.selectionStart, node.selectionEnd]), [
      0,
      address.length,
    ]);
    assert.match(await example.getByRole('status').innerText(), /未能复制/);
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }),
    );
    await copy.click();
    await field.waitFor();
    assert.match(await example.getByRole('status').innerText(), /未能复制/);
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.__headingCopied = text;
          },
        },
      }),
    );
    await copy.click();
    await example.getByRole('status').getByText('章节地址已复制。', { exact: true }).waitFor();
    assert.equal(await field.count(), 0);
    assert.equal(await page.evaluate(() => window.__headingCopied), address);
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: () =>
            new Promise((_, reject) => {
              window.__rejectHeadingCopy = reject;
            }),
        },
      }),
    );
    await copy.focus();
    await copy.press('Enter');
    const permalink = example.getByRole('link', { name: '本节永久链接', exact: true });
    await permalink.focus();
    await page.evaluate(() => window.__rejectHeadingCopy(new Error('Denied after focus moved')));
    await field.waitFor();
    await field.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    assert.equal(
      await permalink.evaluate((node) => document.activeElement === node),
      true,
      'A later failure must not steal focus from another control.',
    );
    return address;
  } finally {
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: window.__headingClipboard,
      }),
    );
  }
}
