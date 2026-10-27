import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { verifyReadingExperience } from './reading-checks.mjs';

const storageKey = 'chiikawa-ui-example-blog:saved:v1';
const latestTitle = '沿着河边，慢慢走';
const pageTwoIds = ['bookshop-corner', 'rainy-room', 'early-market', 'reread-pages'];

async function focused(page, id) {
  await page.waitForFunction((target) => document.activeElement?.id === target, id);
}

async function hashIs(page, hash) {
  await page.waitForURL((url) => url.hash === hash);
}

async function results(page, ids, count = ids.length, current = 1, total = 1) {
  await page.waitForFunction(
    ({ ids, count, current, total }) => {
      const links = [...document.querySelectorAll('.blog-archive-list h3 a')];
      const status = document.querySelector('.blog-archive-results [role="status"]');
      return (
        links.map((link) => link.id.replace('post-link-', '')).join() === ids.join() &&
        status?.textContent === `共 ${count} 篇手记 · 第 ${current} / ${total} 页`
      );
    },
    { ids, count, current, total },
  );
}

async function touchTarget(control) {
  const box = await control.boundingBox();
  assert.ok(box && box.width >= 44 && box.height >= 44, 'Core controls need a 44px touch target.');
}

async function repeatSection(page, link, targetId) {
  const before = await page.evaluate(
    (id) => ({
      entries: history.length,
      top: document.getElementById(id).getBoundingClientRect().top,
    }),
    targetId,
  );
  await link.click();
  await focused(page, targetId);
  await page.waitForFunction(
    ({ id, top }) => Math.abs(document.getElementById(id).getBoundingClientRect().top - top) <= 2,
    { id: targetId, top: before.top },
  );
  assert.equal(await page.evaluate(() => history.length), before.entries);
}

async function noOverflow(page) {
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    `Horizontal overflow at ${page.url()}`,
  );
}

async function welcomeMotion(page) {
  const scene = page.locator('.blog-home-hero .friends-welcome');
  await scene.scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => document.querySelector('.friends-welcome')?.dataset.running === 'true',
  );
  const pause = scene.getByRole('button', { name: '暂停场景动效', exact: true });
  await touchTarget(pause);
  await pause.click();
  const resume = scene.getByRole('button', { name: '继续场景动效', exact: true });
  await resume.waitFor();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.blog-home-hero-cloud > svg, .blog-home-grass')]
      .flatMap((element) => element.getAnimations())
      .every((animation) => animation.playState === 'paused'),
  );
  const frozen = await page.locator('.blog-home-hero-cloud-one > svg').evaluate(async (element) => {
    const animation = element.getAnimations()[0];
    await animation.ready;
    const before = animation.currentTime;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return { before, after: animation.currentTime };
  });
  assert.equal(
    frozen.after,
    frozen.before,
    'The shared pause control must freeze the blog sky too.',
  );
  await resume.click();
  await page.waitForFunction(
    (before) =>
      document
        .querySelector('.blog-home-hero-cloud-one > svg')
        ?.getAnimations()
        .some((animation) => animation.playState === 'running' && animation.currentTime > before),
    frozen.before,
  );
  assert.equal(
    await scene.getByRole('button', { name: '再打个招呼', exact: true }).isEnabled(),
    true,
  );
  await noOverflow(page);
}

async function healthy(page, baseURL) {
  const position = await page.evaluate(() => window.scrollY);
  // Offscreen images remain visible; responsive display:none decorations need no lazy load.
  for (const image of await page.locator('img:visible').all()) await image.scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    [...document.images].every((image) => {
      const bounds = image.getBoundingClientRect();
      const visible =
        bounds.width > 0 && bounds.height > 0 && getComputedStyle(image).visibility === 'visible';
      return !visible || (image.complete && image.naturalWidth > 0);
    }),
  );
  assert.ok(
    await page
      .locator('img')
      .evaluateAll((images) =>
        images.every((image) => !image.complete || !image.currentSrc || image.naturalWidth > 0),
      ),
    'Every decoded image, including hidden decorations, must load successfully.',
  );
  await page.evaluate((top) => window.scrollTo(0, top), position);
  await noOverflow(page);
  assert.equal(new URL(page.url()).pathname, new URL(baseURL).pathname);
  const outsideDeployment = await page
    .locator('img')
    .evaluateAll(
      (images, base) =>
        images.map((image) => image.currentSrc || image.src).filter((src) => !src.startsWith(base)),
      baseURL,
    );
  assert.deepEqual(outsideDeployment, [], 'Images must work from the nested deployment.');
}

async function coreJourney(page, baseURL) {
  await page.goto(baseURL);
  await page.getByRole('heading', { level: 1, name: /和朋友们/ }).waitFor();
  assert.equal(await page.locator('.blog-home-posts article').count(), 3);
  await welcomeMotion(page);
  await healthy(page, baseURL);
  await page
    .getByRole('navigation', { name: '主导航' })
    .getByRole('link', { name: '手记归档' })
    .click();
  await hashIs(page, '#/archive');
  await results(
    page,
    ['river-evening', 'window-reading', 'soup-afternoon', 'leaf-letter'],
    12,
    1,
    3,
  );
  await healthy(page, baseURL);
  await page.getByRole('button', { name: '第 2 页', exact: true }).click();
  await hashIs(page, '#/archive?page=2');
  await results(page, pageTwoIds, 12, 2, 3);
  await focused(page, 'archive-results-heading');
  const save = page.locator('#save-bookshop-corner');
  await touchTarget(save);
  await save.click();
  await page.getByText('喜欢的手记，收好啦', { exact: true }).waitFor();
  const savedArtwork = page.locator('.blog-notice-celebration');
  await savedArtwork.evaluate((image) => image.decode());
  assert.match(await savedArtwork.getAttribute('src'), /collection-saved-motion.*\.svg/);
  assert.equal(await save.getAttribute('aria-pressed'), 'true');
  const close = page.getByRole('button', { name: '关闭提示', exact: true });
  await touchTarget(close);
  await noOverflow(page);
  await close.click();
  await close.waitFor({ state: 'detached' });
  await focused(page, 'save-bookshop-corner');
  await healthy(page, baseURL);

  const articleLink = page.locator('#post-link-bookshop-corner');
  await articleLink.scrollIntoViewIfNeeded();
  await articleLink.focus();
  const scroll = await page.evaluate(() => window.scrollY);
  assert.ok(scroll > 0, 'Back must restore a genuinely scrolled archive.');
  await articleLink.click();
  await page.getByRole('heading', { level: 1, name: '书店角落，有一把空椅子' }).waitFor();
  await focused(page, 'page-heading');
  assert.equal(
    new URL(page.url().split('#')[1], baseURL).searchParams.get('from'),
    '#/archive?page=2',
  );
  await healthy(page, baseURL);
  await page.goBack();
  await hashIs(page, '#/archive?page=2');
  await results(page, pageTwoIds, 12, 2, 3);
  await focused(page, 'post-link-bookshop-corner');
  await page.waitForFunction((top) => Math.abs(window.scrollY - top) <= 2, scroll);
  assert.equal(await page.locator('#save-bookshop-corner').getAttribute('aria-pressed'), 'true');
}

async function desktopJourney(page, baseURL) {
  await page.locator('#post-link-bookshop-corner').click();
  await page.getByRole('heading', { level: 1, name: '书店角落，有一把空椅子' }).waitFor();
  await page.getByRole('navigation', { name: '这一页的小路标' }).getByRole('link').first().click();
  await page.waitForURL((url) => url.hash.includes('&section=shelter-from-rain'));
  await focused(page, 'article-section-shelter-from-rain');
  await repeatSection(
    page,
    page.getByRole('navigation', { name: '这一页的小路标' }).getByRole('link').first(),
    'article-section-shelter-from-rain',
  );
  assert.equal(await page.locator('h1').innerText(), '书店角落，有一把空椅子');
  await page.getByRole('link', { name: '返回手记列表' }).click();
  await hashIs(page, '#/archive?page=2');
  await page
    .getByRole('navigation', { name: '主导航' })
    .getByRole('link', { name: '手记归档' })
    .click();

  const search = page.getByRole('searchbox', { name: '搜索手记' });
  await search.fill(latestTitle);
  await hashIs(page, `#/archive?q=${encodeURIComponent(latestTitle)}`);
  await results(page, ['river-evening']);
  await focused(page, 'archive-search');
  await search.fill('');
  await page.getByRole('radio', { name: '散步', exact: true }).check();
  await hashIs(page, '#/archive?category=walk');
  await results(page, ['river-evening', 'leaf-letter', 'early-market', 'moonlit-path']);
  await page.getByRole('combobox', { name: '排列顺序' }).click();
  await page.getByRole('option', { name: '从最早开始', exact: true }).click();
  await hashIs(page, '#/archive?category=walk&sort=oldest');
  await results(page, ['moonlit-path', 'early-market', 'leaf-letter', 'river-evening']);
  await healthy(page, baseURL);

  await search.fill('这是一条没有对应手记的检索词');
  await page.getByRole('heading', { name: '这一页暂时没有手记', exact: true }).waitFor();
  assert.match(
    await page.locator('.blog-archive-empty img').getAttribute('src'),
    /search-empty.*\.svg/,
  );
  assert.equal(
    new URL(page.url().split('#')[1], baseURL).searchParams.get('q'),
    '这是一条没有对应手记的检索词',
  );
  await healthy(page, baseURL);
  await page.getByRole('button', { name: '清空条件，看看全部' }).click();
  await hashIs(page, '#/archive');
  await focused(page, 'archive-search');
  await results(
    page,
    ['river-evening', 'window-reading', 'soup-afternoon', 'leaf-letter'],
    12,
    1,
    3,
  );
  await page.getByRole('checkbox', { name: '只看收藏' }).check();
  await hashIs(page, '#/archive?saved=1');
  await results(page, ['bookshop-corner']);
  await page.locator('#save-bookshop-corner').click();
  await page.getByRole('heading', { name: '先收藏一篇喜欢的手记吧', exact: true }).waitFor();
  assert.equal(
    await page.locator('.blog-notice-celebration').count(),
    0,
    'Removing a bookmark must not play a saved celebration.',
  );
  await page.getByRole('button', { name: '撤销这次收藏操作' }).click();
  await results(page, ['bookshop-corner']);
  await focused(page, 'save-bookshop-corner');
  await page.reload();
  await results(page, ['bookshop-corner']);
  assert.deepEqual(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey),
    ['bookshop-corner'],
  );
  await page.locator('#save-bookshop-corner').click();
  await page.getByRole('button', { name: '关闭提示' }).click();
  await focused(page, 'archive-results-heading');
  await page.reload();
  await page.getByRole('heading', { name: '先收藏一篇喜欢的手记吧', exact: true }).waitFor();
  assert.deepEqual(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey),
    [],
  );
  await healthy(page, baseURL);

  await page
    .getByRole('navigation', { name: '主导航' })
    .getByRole('link', { name: '关于小站' })
    .click();
  await hashIs(page, '#/?section=about');
  await focused(page, 'about-heading');
  assert.equal(await page.getByRole('heading', { name: '嗨，我是库米' }).isVisible(), true);
  await healthy(page, baseURL);
  await repeatSection(
    page,
    page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '关于小站' }),
    'about-heading',
  );
  await page.goto(`${baseURL}#//[`);
  await page.getByRole('heading', { name: '这一页，好像走丢了', exact: true }).waitFor();
  assert.equal(
    await page.getByRole('heading', { level: 1, name: '这一页，好像走丢了', exact: true }).count(),
    1,
  );
  assert.match(
    await page.locator('.blog-not-found-art').getAttribute('src'),
    /friends-lost.*\.svg/,
  );
  await healthy(page, baseURL);
  await page.goto(`${baseURL}#/missing-page`);
  await page.getByRole('heading', { name: '这一页，好像走丢了', exact: true }).waitFor();
  await healthy(page, baseURL);
  await page.getByRole('link', { name: '回到小站首页 →' }).click();
  await hashIs(page, '#/');
  await focused(page, 'blog-home-heading');
}

export async function verifyReadingReturn(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  try {
    await page.goto(`${baseURL}#/archive?page=2`);
    await results(page, pageTwoIds, 12, 2, 3);
    const link = page.locator('#post-link-reread-pages');
    await link.scrollIntoViewIfNeeded();
    await link.focus();
    const originalScroll = await page.evaluate(() => scrollY);
    assert.ok(originalScroll > 0, 'The return must restore a genuinely scrolled list.');
    await link.click();
    await page.locator('.blog-article-header h1').waitFor();
    const directory = page.getByRole('button', { name: '这一页的小路标', exact: true });
    if (await directory.count()) await directory.click();
    await page
      .getByRole('navigation', { name: '这一页的小路标' })
      .getByRole('link')
      .first()
      .click();
    await page.getByRole('navigation', { name: '继续阅读' }).getByRole('link').click();
    await page.locator('.blog-article-header h1').waitFor();
    await page.getByRole('link', { name: '返回手记列表', exact: true }).click();
    await hashIs(page, '#/archive?page=2');
    await focused(page, 'post-link-reread-pages');
    await page.waitForFunction((top) => Math.abs(scrollY - top) <= 2, originalScroll);

    const direct = await context.newPage();
    direct.setDefaultTimeout(4000);
    await direct.goto(
      `${baseURL}#/posts/reread-pages?from=${encodeURIComponent('#/archive?page=2')}`,
    );
    await direct.locator('.blog-article-header h1').waitFor();
    await direct.getByRole('link', { name: '返回手记列表', exact: true }).click();
    await hashIs(direct, '#/archive?page=2');
    await focused(direct, 'page-heading');
    assert.equal(
      await direct.evaluate(() => scrollY),
      0,
      'A deep link without a remembered list starts at the top.',
    );
    console.log(
      'Blog: in-page reading return restores the source list across TOC/next-post navigation; direct links use the list-top fallback.',
    );
  } finally {
    await context.close();
  }
}

export async function verifyReadingReturnAfterRemoval(browser, baseURL, returnMethod = 'link') {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  try {
    const saved = [
      'river-evening',
      'window-reading',
      'soup-afternoon',
      'leaf-letter',
      'bookshop-corner',
    ];
    await page.addInitScript(({ key, ids }) => localStorage.setItem(key, JSON.stringify(ids)), {
      key: storageKey,
      ids: saved,
    });
    await page.goto(`${baseURL}#/archive?saved=1&page=2`);
    await results(page, ['bookshop-corner'], 5, 2, 2);
    const link = page.locator('#post-link-bookshop-corner');
    await link.scrollIntoViewIfNeeded();
    await link.focus();
    await link.click();
    await page.locator('.blog-article-header h1').waitFor();
    await page.locator('#save-bookshop-corner').click();
    await page.getByText('已经从收藏里放下了', { exact: true }).waitFor();
    if (returnMethod === 'back') await page.goBack();
    else await page.getByRole('link', { name: '返回手记列表', exact: true }).click();
    await hashIs(page, '#/archive?saved=1');
    await results(page, saved.slice(0, 4), 4, 1, 1);
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    assert.equal(
      await page.evaluate(() => document.activeElement?.id),
      'archive-results-heading',
      'Returning after the source page disappears must settle focus on the surviving results.',
    );
    assert.deepEqual(
      await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey),
      saved.slice(0, 4),
    );
    console.log(
      `Blog: ${returnMethod} return after removing the last saved-page item restores a valid results focus.`,
    );
  } finally {
    await context.close();
  }
}

export async function verifySavedPageRecovery(browser, baseURL) {
  const saved = [
    'river-evening',
    'window-reading',
    'soup-afternoon',
    'leaf-letter',
    'bookshop-corner',
  ];
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  try {
    await page.addInitScript(({ key, ids }) => localStorage.setItem(key, JSON.stringify(ids)), {
      key: storageKey,
      ids: saved,
    });
    await page.goto(`${baseURL}#/archive?saved=1&page=2`);
    await results(page, ['bookshop-corner'], 5, 2, 2);
    await page.clock.install();
    await page.locator('#save-bookshop-corner').click();
    await hashIs(page, '#/archive?saved=1');
    await results(page, saved.slice(0, 4), 4, 1, 1);
    const undo = page.getByRole('button', { name: '撤销这次收藏操作', exact: true });
    await undo.waitFor();
    assert.equal(
      await page.getByText('已经从收藏里放下了', { exact: true }).isVisible(),
      true,
      'Automatic page correction must preserve the result and its undo action.',
    );
    await undo.focus();
    await page.clock.fastForward(10_000);
    assert.equal(
      await undo.isVisible(),
      true,
      'The preserved result must retain its focus-based dismissal pause.',
    );
    await undo.hover();
    await page.mouse.move(0, 0);
    await page.clock.fastForward(10_000);
    assert.equal(
      await undo.isVisible(),
      true,
      'Moving the pointer away must keep the result paused while its undo action has focus.',
    );
    await undo.hover();
    await page.locator('#archive-search').focus();
    await page.clock.fastForward(10_000);
    assert.equal(
      await undo.isVisible(),
      true,
      'Moving focus away must keep the result paused while the pointer stays over it.',
    );
    await undo.click();
    await results(page, saved.slice(0, 4), 5, 1, 2);
    await focused(page, 'archive-results-heading');
    assert.deepEqual(
      await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey),
      saved,
      'Undo must restore the off-page bookmark after the last page collapses.',
    );
    await page.locator('#save-river-evening').click();
    await undo.waitFor();
    await undo.focus();
    await undo.hover();
    await page.locator('#archive-search').focus();
    await page.mouse.move(0, 0);
    await page.clock.fastForward(7000);
    assert.equal(await undo.isVisible(), true, 'Both pauses ending must start the 8-second timer.');
    await page.clock.fastForward(1100);
    await undo.waitFor({ state: 'detached' });
    await page.locator('#save-window-reading').click();
    await undo.waitFor();
    await undo.focus();
    await undo.hover();
    await page.getByRole('button', { name: '关闭提示', exact: true }).click();
    await undo.waitFor({ state: 'detached' });
    await focused(page, 'archive-results-heading');
    await page.locator('#save-soup-afternoon').click();
    await undo.waitFor();
    await page.clock.fastForward(8100);
    await undo.waitFor({ state: 'detached' });
    await page.locator('#save-leaf-letter').click();
    await undo.waitFor();
    await page
      .getByRole('navigation', { name: '主导航' })
      .getByRole('link', { name: '首页', exact: true })
      .click();
    await hashIs(page, '#/');
    await undo.waitFor({ state: 'detached' });
    await page.clock.resume();
    console.log(
      'Blog: saved-page correction preserves undo; hover and focus independently pause dismissal; undo, close and navigation clear feedback.',
    );
  } finally {
    await context.close();
  }
}

export async function verifyBlog(browser, baseURL) {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const errors = [];
    page.setDefaultTimeout(8000);
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    try {
      await coreJourney(page, baseURL);
      if (viewport.width === 1280) await desktopJourney(page, baseURL);
      assert.deepEqual(errors, [], `Browser errors at ${viewport.width}px`);
    } catch (error) {
      if (process.env.BLOG_ARTIFACT_DIR) {
        await mkdir(process.env.BLOG_ARTIFACT_DIR, { recursive: true });
        await page.screenshot({
          path: join(process.env.BLOG_ARTIFACT_DIR, `blog-${viewport.width}-failure.png`),
          fullPage: true,
        });
      }
      throw new Error(`Blog ${viewport.width}×${viewport.height}: ${error.message}`, {
        cause: error,
      });
    } finally {
      await context.close();
    }
  }
  await verifySavedPageRecovery(browser, baseURL);
  await verifyReadingReturn(browser, baseURL);
  await verifyReadingReturnAfterRemoval(browser, baseURL);
  await verifyReadingReturnAfterRemoval(browser, baseURL, 'back');
  await verifyReadingExperience(browser, baseURL);
}
