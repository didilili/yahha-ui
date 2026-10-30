import assert from 'node:assert/strict';

const authorName = '库米';
const postTitle = '沿着河边，慢慢走';
const viewports = [
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
];

function author(page) {
  return page.getByRole('img', { name: authorName, exact: true });
}

async function dimensions(locator) {
  const box = await locator.boundingBox();
  assert.ok(box, 'The content remains in layout.');
  return { width: box.width, height: box.height };
}

function sameSize(actual, expected, label) {
  for (const side of ['width', 'height'])
    assert.ok(Math.abs(actual[side] - expected[side]) <= 0.5, `${label}: ${side} stays stable.`);
}

async function paintedText(locator) {
  return locator.evaluate((node) => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const visible = [];
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      if (!text.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(text);
      if (![...range.getClientRects()].some((rect) => rect.width > 0 && rect.height > 0)) continue;
      let painted = true;
      for (let parent = text.parentElement; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          Number(style.opacity) === 0
        )
          painted = false;
        if (parent === node) break;
      }
      if (painted) visible.push(text.textContent);
    }
    return visible.join('').trim();
  });
}

async function loadedAvatar(page, size) {
  const picture = author(page).locator('img');
  await picture.evaluate((image) => image.decode());
  await page.waitForFunction(() =>
    document.querySelector(
      '.blog-home-author-heading img[data-loaded], .blog-article-byline img[data-loaded]',
    ),
  );
  sameSize(await dimensions(author(page)), { width: size, height: size }, 'Author avatar');
  assert.equal(
    await paintedText(author(page)),
    '',
    'A loaded transparent avatar has no name underneath.',
  );
}

async function cover(page) {
  const image = page.locator('.blog-article-figure img');
  await image.waitFor();
  return { image, frame: page.locator('.blog-article-figure > div').first() };
}

async function fontsReady(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

async function inspectNormal(browser, baseURL, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(`${baseURL}#/?section=about`);
    await page.locator('#about-heading').waitFor();
    await loadedAvatar(page, 64);
    const authorURL = await author(page)
      .locator('img')
      .evaluate((image) => image.currentSrc || image.src);
    await page.goto(`${baseURL}#/posts/river-evening`);
    await page.getByRole('heading', { level: 1, name: postTitle, exact: true }).waitFor();
    await loadedAvatar(page, 44);
    const picture = await cover(page);
    await picture.image.evaluate((image) => image.decode());
    await fontsReady(page);
    const frameSize = await dimensions(picture.frame);
    assert.ok(
      Math.abs(frameSize.width / frameSize.height - 1.5) < 0.01,
      'The article cover stays 3:2.',
    );
    const coverURL = await picture.image.evaluate((image) => image.currentSrc || image.src);
    const coverAlt = await picture.image.getAttribute('alt');
    assert.ok(authorURL.startsWith(baseURL), 'The real author.svg comes from this deployment.');
    assert.ok(coverURL.startsWith(baseURL), 'The real rest.png cover comes from this deployment.');
    assert.ok(coverAlt, 'The article cover has descriptive alternative text.');
    assert.deepEqual(errors, []);
    return { authorURL, coverURL, coverAlt, frameSize };
  } finally {
    await context.close();
  }
}

async function inspectDelayed(browser, baseURL, viewport, resources) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let releaseAuthor;
  let releaseCover;
  const pending = [];
  const authorGate = new Promise((resolve) => {
    releaseAuthor = resolve;
  });
  const coverGate = new Promise((resolve) => {
    releaseCover = resolve;
  });
  await context.route(resources.authorURL, (route) => {
    const task = (async () => {
      const response = await route.fetch({ timeout: 6000 });
      await authorGate;
      await route.fulfill({ response });
    })();
    pending.push(task);
    return task;
  });
  await context.route(resources.coverURL, (route) => {
    const task = (async () => {
      const response = await route.fetch({ timeout: 6000 });
      await coverGate;
      await route.fulfill({ response });
    })();
    pending.push(task);
    return task;
  });
  try {
    await page.goto(`${baseURL}#/posts/river-evening`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { level: 1, name: postTitle, exact: true }).waitFor();
    await author(page).locator('img').waitFor();
    assert.equal(
      await paintedText(author(page)),
      authorName,
      'The author name remains while the picture loads.',
    );
    sameSize(await dimensions(author(page)), { width: 44, height: 44 }, 'Loading author');
    const picture = await cover(page);
    await fontsReady(page);
    assert.equal(await picture.frame.getAttribute('data-status'), 'loading');
    sameSize(await dimensions(picture.frame), resources.frameSize, 'Loading cover');
    releaseAuthor();
    releaseCover();
    await picture.image.evaluate((image) => image.decode());
    await loadedAvatar(page, 44);
    sameSize(await dimensions(picture.frame), resources.frameSize, 'Loaded cover');
    assert.deepEqual(errors, []);
  } finally {
    releaseAuthor();
    releaseCover();
    await Promise.allSettled(pending);
    await context.close();
  }
}

async function inspectFailed(browser, baseURL, viewport, resources) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  const errors = [];
  const expected = new Set([resources.authorURL, resources.coverURL]);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400 && !expected.has(response.url()))
      errors.push(`${response.status()} ${response.url()}`);
  });
  await context.route(
    (url) => expected.has(url.href),
    (route) => route.fulfill({ status: 404, body: 'Expected missing content asset' }),
  );
  try {
    await page.goto(`${baseURL}#/posts/river-evening`);
    await page.getByRole('heading', { level: 1, name: postTitle, exact: true }).waitFor();
    await author(page).locator('img').waitFor({ state: 'detached' });
    assert.equal(
      await paintedText(author(page)),
      authorName,
      'A failed avatar retains the readable author name.',
    );
    sameSize(await dimensions(author(page)), { width: 44, height: 44 }, 'Failed author');
    const fallback = page.getByRole('img', { name: resources.coverAlt, exact: true });
    await page.getByText('图片暂时无法显示', { exact: true }).waitFor();
    await fallback.waitFor();
    assert.equal(await fallback.count(), 1, 'Only one accessible cover remains after failure.');
    await fontsReady(page);
    sameSize(
      await dimensions(page.locator('.blog-article-figure > div').first()),
      resources.frameSize,
      'Failed cover',
    );
    assert.equal(
      await page.getByRole('heading', { name: '趁太阳还没下班', exact: true }).isVisible(),
      true,
    );
    const save = page.locator('#save-river-evening');
    await save.click();
    assert.equal(
      await save.getAttribute('aria-pressed'),
      'true',
      'Missing assets do not block bookmarking.',
    );
    await page.getByRole('link', { name: '返回手记归档', exact: true }).click();
    await page.waitForURL((url) => url.hash === '#/archive');
    await page.locator('#post-link-window-reading').click();
    await page
      .getByRole('heading', { level: 1, name: '窗边的书，刚好读到一半', exact: true })
      .waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.deepEqual(errors, [], 'Expected image 404s must not hide application failures.');
  } finally {
    await context.close();
  }
}

/** Resource-state probes stay isolated from the ordinary healthy-asset journeys. */
export async function verifyContentResources(browser, baseURL) {
  for (const viewport of viewports) {
    const resources = await inspectNormal(browser, baseURL, viewport);
    await inspectDelayed(browser, baseURL, viewport, resources);
    await inspectFailed(browser, baseURL, viewport, resources);
    console.log(
      `Blog content ${viewport.width}px: 64/44px author, transparent load, stable 3:2 cover, failure and reading actions passed.`,
    );
  }
}
