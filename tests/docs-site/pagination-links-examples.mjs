import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const pageKey = 'yahha-pagination-page';
const entries = [
  ['把一片叶子夹进手记', '河边捡到的叶子，刚好替今天留下一个书签。'],
  ['面包店开门以前', '和朋友站在门口，等第一炉面包的香气飘出来。'],
  ['窗边那把会吱呀的椅子', '乌萨奇刚坐下，椅子就响了一声；它站起来看了看，又坐了一次。'],
  ['晚饭多煮了一碗汤', '原本只想煮一人份，最后还是多放了一把面。'],
  ['在书页边画一朵小花', '那句话读了两遍，旁边就多了一朵歪歪的小花。'],
  ['等雨停的十分钟', '躲在屋檐下，听朋友讲完昨天没说完的故事。'],
  ['明信片上的地址写大了', '字写得太大，收件地址差点挤到邮票下面。'],
  ['茶凉下来之前', '手里的杯子还暖着，窗外的小路已经亮起了灯。'],
  ['走到路口再抬头看看', '朋友说今晚月亮很圆，我们就多站了一会儿。'],
];

function pageHref(href, number) {
  const result = new URL(href);
  if (number === 1) result.searchParams.delete(pageKey);
  else result.searchParams.set(pageKey, String(number));
  return result.href;
}

function pageNumber(href) {
  const requested = Number(new URL(href).searchParams.get(pageKey) ?? 1);
  return Math.min(3, Math.max(1, Number.isFinite(requested) ? Math.floor(requested) : 1));
}

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

async function settle(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function activeNode(page) {
  return page.evaluate(() => ({
    tag: document.activeElement.tagName,
    role: document.activeElement.getAttribute('role'),
    label: document.activeElement.getAttribute('aria-label'),
    disabled: document.activeElement.getAttribute('aria-disabled'),
    text: document.activeElement.textContent?.trim().slice(0, 100),
  }));
}

function popupScope(page) {
  // The example's own public content, rather than a documentation-only id or a fixed host URL.
  return page
    .getByRole('navigation', { name: '手记链接分页', exact: true, includeHidden: true })
    .locator('..');
}

/** Real hrefs, local slices and native history; optional actual modifier/middle new-tab checks. */
export async function verifyPaginationLinks(
  page,
  scope = page.locator('#links .example-preview'),
  { popups = false } = {},
) {
  await revealExample(scope);
  const initial = { url: page.url(), state: await page.evaluate(() => history.state) };
  const snapshots = [];
  const nativeTabs = [];
  const popupChecks = [];
  let stage = 'initial';
  let originalError, result;

  async function requireState(activePage, activeScope, number, expectedURL = activePage.url()) {
    await revealExample(activeScope);
    const heading = activeScope.getByRole('heading', { name: `手记第 ${number} 页`, exact: true });
    const list = activeScope.getByRole('list', { name: '本页手记', exact: true });
    const nav = activeScope.getByRole('navigation', { name: '手记链接分页', exact: true });
    await heading.waitFor();
    await activeScope
      .getByRole('status')
      .getByText(`第 ${number} / 3 页，共 9 篇手记。`, { exact: true })
      .waitFor();
    assert.equal(activePage.url(), expectedURL);
    assert.equal(await list.evaluate((node) => node.tagName), 'OL');
    assert.equal(await list.getAttribute('start'), String((number - 1) * 3 + 1));
    assert.deepEqual(
      await list
        .getByRole('listitem')
        .evaluateAll((items) =>
          items.map((item) => [
            item.querySelector('h4').textContent,
            item.querySelector('p').textContent,
          ]),
        ),
      entries.slice((number - 1) * 3, number * 3),
    );
    assert.equal(await activeScope.getByRole('status').count(), 1);
    assert.equal(await activeScope.getByRole('alert').count(), 0);
    assert.equal(await activeScope.locator('[aria-live]').count(), 0);
    assert.equal(await nav.getByRole('button').count(), 0);
    assert.equal(await nav.getByRole('link').count(), 5);
    assert.equal(await nav.locator('a[href]').count(), number === 2 ? 5 : 4);
    assert.equal(await nav.locator('a[aria-current="page"]').count(), 1);
    assert.equal(
      await nav.locator('a[aria-current="page"]').getAttribute('aria-label'),
      `第 ${number} 页`,
    );
    for (let target = 1; target <= 3; target++) {
      const link = nav.getByRole('link', { name: `第 ${target} 页`, exact: true });
      assert.equal(await link.evaluate((node) => node.tagName), 'A');
      assert.equal(await link.getAttribute('href'), pageHref(expectedURL, target));
      assert.equal(await link.evaluate((node) => node.tabIndex), 0);
    }
    for (const [label, target, unavailable] of [
      ['上一页', number - 1, number === 1],
      ['下一页', number + 1, number === 3],
    ]) {
      const control = nav.getByRole('link', { name: label, exact: true });
      if (unavailable) {
        assert.equal(await control.getAttribute('aria-disabled'), 'true');
        assert.equal(await control.getAttribute('href'), null);
        assert.equal(await control.evaluate((node) => node.tabIndex), -1);
      } else {
        assert.notEqual(await control.getAttribute('aria-disabled'), 'true');
        assert.equal(await control.getAttribute('href'), pageHref(expectedURL, target));
      }
    }
    await settle(activePage);
    const geometry = await nav.evaluate((node) => ({
      viewportWidth: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      controls: [...node.querySelectorAll('[role="link"], a[href]')].map((control) => {
        const rect = control.getBoundingClientRect();
        return {
          label: control.getAttribute('aria-label'),
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
        };
      }),
    }));
    assert(geometry.documentWidth <= geometry.viewportWidth + 1);
    for (const control of geometry.controls) {
      assert(control.width >= 44 - 0.01 && control.height >= 44 - 0.01);
      assert(control.left >= -1 && control.right <= geometry.viewportWidth + 1);
    }
    const snapshot = { stage, number, url: expectedURL, geometry };
    snapshots.push(snapshot);
    return { nav, heading, snapshot };
  }

  async function activatePage(number, expectedURL, key = null) {
    const nav = scope.getByRole('navigation', { name: '手记链接分页', exact: true });
    const link = nav.getByRole('link', { name: `第 ${number} 页`, exact: true });
    if (key) {
      await link.focus();
      await link.press(key);
    } else await link.click();
    const state = await requireState(page, scope, number, expectedURL);
    await requireFocus(page, state.heading);
    return state;
  }

  try {
    await requireState(page, scope, pageNumber(initial.url), initial.url);

    stage = 'fixture URL retains unrelated query, hash and caller history state';
    const seeded = new URL(pageHref(initial.url, 1));
    seeded.searchParams.set('yahha-pagination-check', '保留 spaces & = 中文');
    seeded.searchParams.append('yahha-pagination-extra', 'first');
    seeded.searchParams.append('yahha-pagination-extra', 'second');
    // Real navigation and same-URL history-state setup, never synthetic route events.
    await page.goto(seeded.href);
    await requireState(page, scope, 1, seeded.href);
    const callerState = await page.evaluate(() => {
      const original = history.state;
      const next = {
        ...(original && typeof original === 'object' ? original : {}),
        __yahhaPaginationCheck: { retained: ['caller', 37] },
      };
      history.replaceState(next, '', location.href);
      return next;
    });

    stage = 'ordinary click changes slice and pushes exactly one history entry';
    const historyBeforeClick = await page.evaluate(() => history.length);
    const pageTwoURL = pageHref(page.url(), 2);
    await activatePage(2, pageTwoURL);
    assert.equal(await page.evaluate(() => history.length), historyBeforeClick + 1);
    assert.deepEqual(await page.evaluate(() => history.state), callerState);

    stage = 'current page is a no-op and native Tab exposes no disabled link';
    const nav = scope.getByRole('navigation', { name: '手记链接分页', exact: true });
    const current = nav.getByRole('link', { name: '第 2 页', exact: true });
    const historyAtTwo = await page.evaluate(() => history.length);
    await current.focus();
    await current.press('Enter');
    await requireState(page, scope, 2, pageTwoURL);
    assert.equal(await page.evaluate(() => history.length), historyAtTwo);
    assert.deepEqual(await page.evaluate(() => history.state), callerState);
    await requireFocus(page, current);
    await nav.getByRole('link', { name: '第 1 页', exact: true }).focus();
    await page.keyboard.press('Tab');
    const tabTarget = await activeNode(page);
    nativeTabs.push(tabTarget);
    assert.notEqual(tabTarget.disabled, 'true');

    stage = 'Space does not activate a native page link; Enter does';
    const third = nav.getByRole('link', { name: '第 3 页', exact: true });
    await third.focus();
    await third.press('Space');
    await settle(page);
    await requireState(page, scope, 2, pageTwoURL);
    assert.equal(await page.evaluate(() => history.length), historyAtTwo);
    const pageThreeURL = pageHref(page.url(), 3);
    await activatePage(3, pageThreeURL, 'Enter');
    assert.equal(await page.evaluate(() => history.length), historyAtTwo + 1);
    assert.deepEqual(await page.evaluate(() => history.state), callerState);

    stage = 'actual back and forward restore the earlier local slices';
    await page.goBack();
    await requireState(page, scope, 2, pageTwoURL);
    assert.deepEqual(await page.evaluate(() => history.state), callerState);
    const backFocus = await activeNode(page);
    await page.goForward();
    await requireState(page, scope, 3, pageThreeURL);
    assert.deepEqual(await page.evaluate(() => history.state), callerState);

    stage = 'reload reads the existing page URL without rewriting it';
    await page.reload();
    await requireState(page, scope, 3, pageThreeURL);
    assert.deepEqual(await page.evaluate(() => history.state), callerState);
    const reloadedFocus = await activeNode(page);

    if (popups) {
      const platform = await page.evaluate(() => navigator.platform);
      const modifier = /Mac/i.test(platform) ? 'Meta' : 'Control';
      for (const [kind, clickOptions] of [
        [modifier, { modifiers: [modifier] }],
        ['middle', { button: 'middle' }],
      ]) {
        stage = `actual ${kind} click opens the destination in a new tab`;
        const oldURL = page.url();
        const oldHistoryLength = await page.evaluate(() => history.length);
        const target = scope
          .getByRole('navigation', { name: '手记链接分页', exact: true })
          .getByRole('link', { name: '第 2 页', exact: true });
        const targetURL = await target.getAttribute('href');
        const [popup] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 6500 }),
          target.click(clickOptions),
        ]);
        try {
          await popup.waitForLoadState('domcontentloaded');
          await requireState(popup, popupScope(popup), 2, targetURL);
          await requireState(page, scope, 3, oldURL);
          assert.equal(await page.evaluate(() => history.length), oldHistoryLength);
          assert.deepEqual(await page.evaluate(() => history.state), callerState);
          popupChecks.push({ kind, platform, url: popup.url(), originalURL: page.url() });
        } finally {
          await popup.close();
        }
      }
    }

    stage = 'real same-route hashchange refreshes hrefs even when the page number stays the same';
    const hashTarget = new URL(page.url());
    const hash = hashTarget.hash.slice(1);
    if (hash.startsWith('/')) {
      const separator = hash.indexOf('?');
      const route = separator < 0 ? hash : hash.slice(0, separator);
      const query = new URLSearchParams(separator < 0 ? '' : hash.slice(separator + 1));
      query.set('yahha-pagination-check', 'hash-kept');
      hashTarget.hash = `${route}?${query}`;
    } else hashTarget.hash = `${hash || 'pagination-links'}?yahha-pagination-check=hash-kept`;
    await page.evaluate((next) => {
      location.hash = next;
    }, hashTarget.hash);
    await page.waitForURL(hashTarget.href);
    await requireState(page, scope, 3, hashTarget.href);

    stage = 'invalid and fractional URL values normalize for reading without writing the URL';
    for (const [value, number] of [
      ['not-a-page', 1],
      ['99', 3],
      ['2.9', 2],
    ]) {
      const invalidURL = new URL(page.url());
      invalidURL.searchParams.set(pageKey, value);
      await page.goto(invalidURL.href);
      await requireState(page, scope, number, invalidURL.href);
    }
    result = {
      snapshots,
      nativeTabs,
      backFocus,
      reloadedFocus,
      popupChecks,
      popupChecksRequested: popups,
      normalization: 'Read floor/clamp only; raw invalid query retained.',
      setupBoundary:
        'Fixture goto/replaceState and final restore are setup/cleanup; navigation evidence uses real links, back/forward, reload and native hash navigation.',
    };
  } catch (error) {
    error.message = `PaginationLinks [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      stage = 'cleanup';
      await page.evaluate(({ url, state }) => history.replaceState(state, '', url), initial);
      await page.reload();
      await requireState(page, scope, pageNumber(initial.url), initial.url);
      assert.deepEqual(await page.evaluate(() => history.state), initial.state);
      if (result) result.restoredURL = page.url();
    } catch (error) {
      if (!originalError) originalError = error;
      else originalError.message += `\nCleanup also failed: ${error}`;
    }
  }
  if (originalError) throw originalError;
  return result;
}
