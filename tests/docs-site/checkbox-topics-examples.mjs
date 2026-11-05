import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const queryKey = 'checkbox-topic';
const titles = ['把周末留给半本书', '绕到河边再回家', '带一本书去公园'];

function controls(scope) {
  return {
    reading: scope.getByRole('checkbox', { name: '阅读', exact: true }),
    walking: scope.getByRole('checkbox', { name: '散步', exact: true }),
    stargazing: scope.getByRole('checkbox', { name: '观星', exact: true }),
    clear: scope.getByRole('button', { name: '清空兴趣', exact: true }),
    share: scope.getByRole('link', { name: '分享当前兴趣', exact: true }),
    status: scope.getByRole('status'),
  };
}

async function requireTopics(page, scope, selected, expectedTitles) {
  const node = await scope.elementHandle();
  try {
    await page.waitForFunction(
      ({ element, expected }) =>
        JSON.stringify(
          [...element.querySelectorAll('input[type="checkbox"]')]
            .filter((input) => input.checked)
            .map((input) => input.value),
        ) === JSON.stringify(expected),
      { element: node, expected: selected },
    );
  } finally {
    await node.dispose();
  }
  assert.equal(await scope.getByRole('status').count(), 1);
  assert.equal(await scope.locator('[aria-live]').count(), 0);
  const actualTitles = await scope.locator('ul').getByRole('heading').allTextContents();
  assert.deepEqual(actualTitles, expectedTitles);
  assert.match(
    await scope.getByRole('status').innerText(),
    new RegExp(`共 ${expectedTitles.length} 篇`),
  );
  assert.equal(
    await scope.getByRole('heading', { name: '还没有相关手记', exact: true }).count(),
    expectedTitles.length === 0 ? 1 : 0,
  );
}

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

async function requireShare(page, share) {
  const node = await share.elementHandle();
  try {
    await page.waitForFunction((element) => element.href === window.location.href, node);
  } finally {
    await node.dispose();
  }
  assert.equal(await share.evaluate((element) => element.tagName), 'A');
  assert.equal(await share.getAttribute('href'), page.url());
}

function otherParams(href) {
  return [...new URL(href).searchParams].filter(([key]) => key !== queryKey);
}

function setOwnTopics(href, values) {
  const url = new URL(href);
  url.searchParams.delete(queryKey);
  values.forEach((value) => url.searchParams.append(queryKey, value));
  return url;
}

function topicsScope(page) {
  return page
    .getByRole('group', { name: '阅读兴趣', exact: true, includeHidden: true })
    .locator('..');
}

export async function verifyCheckboxTopics(page, example = topicsScope(page)) {
  await revealExample(example);
  await example.getByRole('group', { name: '阅读兴趣', exact: true }).waitFor();
  const originalTopics = new URL(page.url()).searchParams.getAll(queryKey);
  const originalOthers = otherParams(page.url());
  const originalHash = new URL(page.url()).hash;
  const originalState = await page.evaluate(() => history.state);
  const input = controls(example);
  let isolated;
  let sharedPage;

  try {
    await input.clear.click();
    await requireTopics(page, example, [], titles);
    await requireFocus(page, input.reading);
    const emptyHistoryLength = await page.evaluate(() => history.length);
    await input.clear.click();
    assert.equal(
      await page.evaluate(() => history.length),
      emptyHistoryLength,
      'Same-value clear does not push history.',
    );

    await input.reading.press('Space');
    await requireTopics(page, example, ['reading'], [titles[0], titles[2]]);
    await requireFocus(page, input.reading);
    await input.walking.focus();
    await input.walking.press('Space');
    await requireTopics(page, example, ['reading', 'walking'], titles);
    await requireFocus(page, input.walking);
    await input.reading.focus();
    await input.reading.press('Space');
    await requireTopics(page, example, ['walking'], [titles[1], titles[2]]);
    await input.walking.focus();
    await input.walking.press('Space');
    await input.stargazing.focus();
    await input.stargazing.press('Space');
    await requireTopics(page, example, ['stargazing'], []);
    await requireFocus(page, input.stargazing);
    await input.clear.click();
    await requireTopics(page, example, [], titles);
    await requireFocus(page, input.reading);
    await requireShare(page, input.share);
    assert.deepEqual(otherParams(page.url()), originalOthers);
    assert.equal(new URL(page.url()).hash, originalHash);
    assert.deepEqual(await page.evaluate(() => history.state), originalState);

    // URL fixtures use another page so their query parameters, state and history cannot leak.
    const incoming = setOwnTopics(page.url(), [
      'unknown-topic',
      'walking',
      'reading',
      'walking',
      '',
    ]);
    incoming.searchParams.append('checkbox-topics-probe', 'first');
    incoming.searchParams.append('checkbox-topics-probe', 'second');
    isolated = await page.context().newPage();
    await isolated.goto(incoming.href);
    const scope = topicsScope(isolated);
    await revealExample(scope);
    const isolatedInput = controls(scope);
    await scope.waitFor();
    await requireTopics(isolated, scope, ['reading', 'walking'], titles);
    await requireShare(isolated, isolatedInput.share);
    assert.equal(
      isolated.url(),
      incoming.href,
      'Initial parsing does not rewrite unknown or repeated values.',
    );
    const incomingOthers = otherParams(incoming.href);
    const state = { checkboxTopicsProbe: { values: ['keep', 'both'], count: 2 } };
    await isolated.evaluate((value) => {
      history.replaceState(value, '', location.href);
      window.__checkboxTopicsEvents = [];
      for (const type of ['popstate', 'hashchange'])
        window.addEventListener(type, () => window.__checkboxTopicsEvents.push(type));
    }, state);
    const historyLength = await isolated.evaluate(() => history.length);
    await isolatedInput.reading.focus();
    await isolatedInput.reading.press('Space');
    await requireTopics(isolated, scope, ['walking'], [titles[1], titles[2]]);
    await requireFocus(isolated, isolatedInput.reading);
    assert.deepEqual(new URL(isolated.url()).searchParams.getAll(queryKey), ['walking']);
    assert.deepEqual(otherParams(isolated.url()), incomingOthers);
    assert.equal(new URL(isolated.url()).hash, incoming.hash);
    assert.deepEqual(await isolated.evaluate(() => history.state), state);
    assert.equal(
      await isolated.evaluate(() => history.length),
      historyLength + 1,
      'One toggle pushes exactly one history entry.',
    );
    assert.deepEqual(
      await isolated.evaluate(() => window.__checkboxTopicsEvents),
      [],
      'Local operations do not broadcast fake navigation events.',
    );

    await isolatedInput.walking.focus();
    await isolatedInput.walking.press('Space');
    await requireTopics(isolated, scope, [], titles);
    await isolated.goBack();
    await requireTopics(isolated, scope, ['walking'], [titles[1], titles[2]]);
    await requireShare(isolated, isolatedInput.share);
    await isolated.goForward();
    await requireTopics(isolated, scope, [], titles);
    await requireShare(isolated, isolatedInput.share);

    // A genuine hash navigation must refresh the full share address even when interests do not change.
    const changedHash = `${new URL(isolated.url()).hash}${new URL(isolated.url()).hash.includes('?') ? '&' : '?'}checkbox-topics-fragment=keep`;
    await isolated.evaluate((hash) => {
      location.hash = hash;
    }, changedHash);
    await requireShare(isolated, isolatedInput.share);
    assert.equal(
      new URL(isolated.url()).hash,
      changedHash.startsWith('#') ? changedHash : `#${changedHash}`,
    );
    await isolatedInput.reading.focus();
    await isolatedInput.reading.press('Space');
    await requireTopics(isolated, scope, ['reading'], [titles[0], titles[2]]);
    await requireShare(isolated, isolatedInput.share);
    assert.deepEqual(otherParams(isolated.url()), incomingOthers);
    const shareHref = await isolatedInput.share.getAttribute('href');
    await isolated.reload();
    await revealExample(scope);
    await requireTopics(isolated, scope, ['reading'], [titles[0], titles[2]]);
    await requireShare(isolated, isolatedInput.share);
    assert.equal(isolated.url(), shareHref);

    sharedPage = await page.context().newPage();
    await sharedPage.goto(shareHref);
    const sharedScope = topicsScope(sharedPage);
    await revealExample(sharedScope);
    await sharedScope.waitFor();
    await requireTopics(sharedPage, sharedScope, ['reading'], [titles[0], titles[2]]);
    await requireShare(sharedPage, controls(sharedScope).share);

    const unknownOnly = setOwnTopics(shareHref, ['not-listed', '', 'not-listed']);
    await isolated.goto(unknownOnly.href);
    await revealExample(scope);
    await requireTopics(isolated, scope, [], titles);
    assert.equal(
      isolated.url(),
      unknownOnly.href,
      'Unknown-only filters show all without rewriting the URL.',
    );
    assert.deepEqual(otherParams(isolated.url()), incomingOthers);
    const clearState = { checkboxTopicsClearProbe: ['preserve', { count: 2 }] };
    await isolated.evaluate((value) => history.replaceState(value, '', location.href), clearState);
    const unknownHistoryLength = await isolated.evaluate(() => history.length);
    const unknownHash = new URL(isolated.url()).hash;
    await isolatedInput.clear.focus();
    await isolatedInput.clear.press('Enter');
    await requireTopics(isolated, scope, [], titles);
    assert.deepEqual(
      new URL(isolated.url()).searchParams.getAll(queryKey),
      [],
      'Explicit clear removes unknown and repeated own values without a semantic history entry.',
    );
    assert.equal(await isolated.evaluate(() => history.length), unknownHistoryLength);
    assert.deepEqual(otherParams(isolated.url()), incomingOthers);
    assert.equal(new URL(isolated.url()).hash, unknownHash);
    assert.deepEqual(await isolated.evaluate(() => history.state), clearState);
    await requireShare(isolated, isolatedInput.share);
    await requireFocus(isolated, isolatedInput.reading);
    return {
      orFiltering: true,
      emptyResult: true,
      history: true,
      refresh: true,
      sharedNewTab: true,
      normalizedClear: true,
    };
  } finally {
    await sharedPage?.close();
    await isolated?.close();
    // Explicit test cleanup restores only this example's original repeated key values.
    const currentHref = page.url();
    const restored = setOwnTopics(currentHref, originalTopics);
    if (restored.href !== currentHref) {
      await page.evaluate((href) => history.replaceState(history.state, '', href), restored.href);
      await page.reload();
      await revealExample(example);
      await example.getByRole('group', { name: '阅读兴趣', exact: true }).waitFor();
    }
    assert.deepEqual(new URL(page.url()).searchParams.getAll(queryKey), originalTopics);
    assert.deepEqual(otherParams(page.url()), originalOthers);
    assert.equal(new URL(page.url()).hash, originalHash);
    assert.deepEqual(await page.evaluate(() => history.state), originalState);
  }
}
