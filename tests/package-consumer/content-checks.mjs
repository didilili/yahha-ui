import assert from 'node:assert/strict';

/** Content fixtures use the installed package, with no component-style overrides. */
export async function verifyContentResources(page) {
  for (const [size, pixels] of [
    ['sm', 32],
    ['md', 44],
    ['lg', 64],
  ]) {
    const avatar = page.getByTestId(`content-avatar-${size}`);
    await avatar.locator('img').evaluate((image) => image.decode());
    await page.waitForFunction(
      (id) => document.querySelector(`[data-testid="${id}"]`).textContent === '',
      `content-avatar-${size}`,
    );
    const bounds = await avatar.boundingBox();
    assert.equal(bounds.width, pixels, `${size} avatar width remains stable after decoding.`);
    assert.equal(bounds.height, pixels, `${size} avatar height remains stable after decoding.`);
    assert.equal(await avatar.getAttribute('aria-label'), `Transparent author ${size}`);
  }
  for (const [id, text] of [
    ['emoji', '👩‍💻库'],
    ['accent', 'e\u0301m'],
    ['flag', '🇨🇳库'],
  ]) {
    assert.equal(await page.getByTestId(`content-avatar-${id}`).textContent(), text);
  }

  const longFrame = page.getByTestId('content-long-image');
  const fallback = longFrame.getByRole('img', { name: 'Content narrow cover', exact: true });
  await fallback.scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => document.querySelector('[data-testid="content-long-image"] [role="img"]')?.tabIndex === 0,
  );
  const before = await fallback.boundingBox();
  assert.equal(before.width, 160);
  assert.equal(before.height, 80, 'Long failure copy must not resize the fixed-ratio cover.');
  const scroll = await fallback.evaluate((node) => ({
    height: node.clientHeight,
    scroll: node.scrollHeight,
    overflow: getComputedStyle(node).overflowY,
    initial: node.scrollTop,
    iconTop: node.querySelector('svg').getBoundingClientRect().top,
    frameTop: node.getBoundingClientRect().top,
  }));
  assert.ok(scroll.scroll > scroll.height, 'The long copy exercises real vertical overflow.');
  assert.match(scroll.overflow, /auto|scroll/);
  assert.equal(scroll.initial, 0);
  assert.ok(
    scroll.iconTop >= scroll.frameTop,
    'The first content starts inside the visible frame.',
  );

  await page.getByRole('button', { name: 'Clear review avatar', exact: true }).focus();
  await page.keyboard.press('Tab');
  assert.equal(
    await fallback.evaluate((node) => document.activeElement === node),
    true,
    'Tab reaches the overflowing failure explanation after the preceding control.',
  );
  await page.keyboard.press('End');
  await page.waitForFunction(() => {
    const node = document.querySelector('[data-testid="content-long-image"] [role="img"]');
    return node.scrollTop >= node.scrollHeight - node.clientHeight - 1;
  });
  const finalLine = await fallback.evaluate((node) => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let last;
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      if (text.textContent.trim()) last = text;
    }
    const range = document.createRange();
    range.selectNodeContents(last);
    const lines = [...range.getClientRects()];
    return {
      bottom: lines.at(-1).bottom,
      visibleBottom: node.getBoundingClientRect().bottom,
    };
  });
  assert.ok(
    finalLine.bottom <= finalLine.visibleBottom + 1,
    'Keyboard scrolling exposes the end of the failure explanation.',
  );
  await page.keyboard.press('Home');
  await page.waitForFunction(
    () => document.querySelector('[data-testid="content-long-image"] [role="img"]').scrollTop === 0,
  );
  await page.keyboard.press('Tab');
  assert.equal(
    await page
      .getByRole('button', { name: 'Load content image', exact: true })
      .evaluate((node) => document.activeElement === node),
    true,
    'Tab skips short and decorative failures and reaches the next action.',
  );
  const imageFrame = longFrame.locator(':scope > div');
  await imageFrame.evaluate((node) => {
    node.style.aspectRatio = '1 / 1';
  });
  await page.waitForFunction(() => {
    const node = document.querySelector('[data-testid="content-long-image"] [role="img"]');
    return (
      node.clientHeight === 160 &&
      node.scrollHeight <= node.clientHeight + 1 &&
      node.tabIndex === -1
    );
  });
  const expanded = await fallback.boundingBox();
  assert.equal(expanded.width, 160);
  assert.equal(expanded.height, 160, 'ResizeObserver notices when the explanation fits.');
  await imageFrame.evaluate((node) => {
    node.style.aspectRatio = '2 / 1';
  });
  await page.waitForFunction(() => {
    const node = document.querySelector('[data-testid="content-long-image"] [role="img"]');
    return node.clientHeight === 80 && node.scrollHeight > node.clientHeight && node.tabIndex === 0;
  });
  const after = await fallback.boundingBox();
  assert.equal(after.width, before.width);
  assert.equal(after.height, before.height);
  assert.notEqual(
    await page.getByTestId('content-short-image').getByRole('img').getAttribute('tabindex'),
    '0',
    'Short failure copy does not add an unnecessary tab stop.',
  );
  assert.equal(
    await page.getByTestId('content-decorative-image').locator('[tabindex="0"]').count(),
    0,
    'Decorative empty-alt failures stay out of the keyboard sequence.',
  );
  const blankFrame = page.getByTestId('content-blank-image');
  assert.equal(await blankFrame.getByRole('img').count(), 0);
  assert.equal(
    await blankFrame.locator('[tabindex="0"]').count(),
    0,
    'Whitespace-only alt must not create an unnamed focusable failure.',
  );

  const natural = page.getByRole('img', { name: 'Content natural picture', exact: true });
  await natural.evaluate((image) => image.decode());
  const naturalBounds = await natural.boundingBox();
  assert.equal(naturalBounds.width, 120);
  assert.equal(naturalBounds.height, 80);

  let requests = 0;
  await page.route('**/content-retry.svg', (route) => {
    requests += 1;
    return route.fulfill(
      requests === 1
        ? { status: 404, body: 'Expected missing cover' }
        : {
            status: 200,
            contentType: 'image/svg+xml',
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="skyblue"/></svg>',
          },
    );
  });
  const retryFrame = page.getByTestId('content-retry-image');
  await page.getByRole('button', { name: 'Load content image', exact: true }).click();
  await retryFrame.getByText('图片暂时无法显示', { exact: true }).waitFor();
  await page.waitForFunction(
    () => document.querySelector('[data-testid="content-retry-image"] img')?.hidden === true,
  );
  assert.equal(requests, 1);
  const failedBounds = await retryFrame.boundingBox();
  await page.getByRole('button', { name: 'Clear content image', exact: true }).click();
  await page.getByRole('button', { name: 'Load content image', exact: true }).click();
  const recovered = retryFrame.getByRole('img', { name: 'Content retry picture', exact: true });
  await recovered.waitFor();
  await recovered.evaluate((image) => image.decode());
  await retryFrame.getByText('图片暂时无法显示', { exact: true }).waitFor({ state: 'detached' });
  assert.equal(requests, 2);
  const recoveredBounds = await retryFrame.boundingBox();
  assert.equal(recoveredBounds.width, failedBounds.width);
  assert.equal(recoveredBounds.height, failedBounds.height);
  console.log(
    'Content resources passed: transparent/grapheme avatars, fixed-ratio keyboard-readable failure copy and same-source image recovery.',
  );
}
