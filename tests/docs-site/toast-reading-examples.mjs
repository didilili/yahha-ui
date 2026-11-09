import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const articleTitle = '窗边那半本书，留给周末的一页';

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    assert.equal(await node.evaluate((element) => document.activeElement === element), true);
  } finally {
    await node.dispose();
  }
}

/** A real local reading list with one replaceable Toast and a persistent recovery destination. */
export async function verifyToastReadingList(
  page,
  scope = page.locator('#basic .example-preview'),
) {
  await revealExample(scope);
  const trigger = scope.getByRole('button', { name: /^(加入|移出)稍后阅读$/ });
  const persistentView = scope.getByRole('button', { name: '查看阅读清单', exact: true }).first();
  const list = scope.getByRole('region', { name: '稍后阅读清单', exact: true });
  const heading = list.getByRole('heading', { name: '稍后阅读清单', exact: true });
  const status = scope.getByRole('status');
  const close = status.getByRole('button', { name: '关闭提示', exact: true });
  const action = status.getByRole('button', { name: '查看阅读清单', exact: true });
  const states = [];
  let stage = 'initial';
  let originalError, cleanupError, toast, pointerTrace, result;
  await trigger.waitFor();
  const originalTrigger = await trigger.elementHandle();
  const originalHeading = await heading.elementHandle();
  const originalView = await persistentView.elementHandle();

  async function requireState(saved, open) {
    await scope
      .getByRole('button', { name: saved ? '移出稍后阅读' : '加入稍后阅读', exact: true })
      .waitFor();
    await list.getByText(`共 ${saved ? 1 : 0} 篇手记。`, { exact: true }).waitFor();
    if (open) await status.waitFor();
    else await status.waitFor({ state: 'detached' });
    assert.equal(await status.count(), open ? 1 : 0);
    assert.equal(await list.getByRole('listitem').count(), saved ? 1 : 0);
    if (saved) assert.equal(await list.getByRole('listitem').textContent(), articleTitle);
    else await list.getByText('还没有稍后阅读的手记。', { exact: true }).waitFor();
    await scope
      .getByRole('article', { name: '示例手记', exact: true })
      .getByRole('heading', { name: articleTitle, exact: true })
      .waitFor();
    assert.equal(await scope.locator('[aria-live], [role="alert"]').count(), 0);
    assert.equal(await list.locator('[role="status"], [aria-live]').count(), 0);
    assert.equal(await trigger.evaluate((node, old) => node === old, originalTrigger), true);
    assert.equal(await heading.evaluate((node, old) => node === old, originalHeading), true);
    assert.equal(await persistentView.evaluate((node, old) => node === old, originalView), true);
    assert.equal(await heading.getAttribute('tabindex'), '-1');
    if (open) {
      assert.equal(await status.getAttribute('aria-atomic'), 'true');
      await status
        .getByText(saved ? '已加入稍后阅读' : '已移出稍后阅读', { exact: true })
        .waitFor();
      await status.getByText(articleTitle, { exact: true }).waitFor();
      assert.equal(await status.getAttribute('data-tone'), saved ? 'success' : 'info');
    }
    const targets = [];
    for (const button of await scope.getByRole('button').all()) {
      const box = await button.boundingBox();
      assert(box.width >= 43.99 && box.height >= 43.99);
      targets.push({
        name: (await button.getAttribute('aria-label')) || (await button.textContent()),
        width: box.width,
        height: box.height,
      });
    }
    const geometry = await scope.evaluate((node) => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
      client: node.clientWidth,
      scroll: node.scrollWidth,
    }));
    assert(geometry.document <= geometry.viewport + 1 && geometry.scroll <= geometry.client + 1);
    states.push({ stage, saved, open, targets, ...geometry });
  }

  try {
    await requireState(false, false);

    stage = 'add to the actual list without moving keyboard focus';
    await trigger.focus();
    await trigger.press('Enter');
    await requireState(true, true);
    await requireFocus(page, trigger);
    toast = await status.elementHandle();
    await trigger.press('Escape');
    await requireState(true, true);
    await requireFocus(page, trigger);

    stage = 'replace the same open Toast with current list state';
    await trigger.press('Space');
    await requireState(false, true);
    assert.equal(await status.evaluate((node, old) => node === old, toast), true);
    await trigger.press('Enter');
    await requireState(true, true);
    assert.equal(await status.evaluate((node, old) => node === old, toast), true);
    await requireFocus(page, trigger);

    stage = 'Toast action reaches the permanent list heading without stale return focus';
    await action.focus();
    await action.press('Enter');
    await requireState(true, false);
    await requireFocus(page, heading);
    await persistentView.focus();
    await persistentView.press('Space');
    await requireState(true, false);
    await requireFocus(page, heading);

    stage = 'keyboard close returns to the originating button and keeps the removed list state';
    await trigger.focus();
    await trigger.press('Enter');
    await requireState(false, true);
    await close.focus();
    await close.press('Space');
    await requireState(false, false);
    await requireFocus(page, trigger);

    stage = 'physical close follows actual native focus ownership';
    await trigger.press('Enter');
    await requireState(true, true);
    pointerTrace = await close.evaluateHandle((node) => {
      const trace = {};
      node.addEventListener(
        'click',
        () => {
          trace.active = document.activeElement;
          trace.focusWasInside = node.closest('[role="status"]').contains(document.activeElement);
        },
        { capture: true, once: true },
      );
      return trace;
    });
    await close.click();
    await requireState(true, false);
    const pointer = await pointerTrace.evaluate((trace) => ({
      focusWasInside: trace.focusWasInside,
      activeAtClick: trace.active?.tagName,
      activeAfter: document.activeElement.tagName,
      externalFocusPreserved: document.activeElement === trace.active,
    }));
    if (pointer.focusWasInside) await requireFocus(page, trigger);
    else assert.equal(pointer.externalFocusPreserved, true);
    await persistentView.focus();
    await persistentView.press('Enter');
    await requireFocus(page, heading);
    await requireState(true, false);
    result = {
      states,
      pointer,
      singleReplaceableStatus: true,
      persistentListEntry: true,
      escapeDoesNotClose: true,
      noTimerOrQueueTested: true,
    };
  } catch (error) {
    originalError = error;
  } finally {
    try {
      if ((await list.getByRole('listitem').count()) === 1) {
        await trigger.focus();
        await trigger.press('Enter');
      }
      if ((await status.count()) > 0) {
        await close.focus();
        await close.press('Enter');
      }
      await requireState(false, false);
    } catch (error) {
      cleanupError = error;
    }
    for (const handle of [originalTrigger, originalHeading, originalView, toast, pointerTrace])
      if (handle) await handle.dispose();
  }
  if (originalError) {
    originalError.message = `[Toast reading list: ${stage}] ${originalError.message}`;
    if (cleanupError) originalError.message += `; cleanup: ${cleanupError.message}`;
    throw originalError;
  }
  if (cleanupError) throw cleanupError;
  return result;
}

/** A visible minimal Toast with a persistent, named recovery entry and native focus. */
export async function verifyToastSimple(
  page,
  scope = page.locator('#toast-simple .example-preview'),
) {
  const show = scope.getByRole('button', { name: '显示提示', exact: true });
  const status = scope.getByRole('status');
  await show.waitFor();
  if (!(await status.count())) await show.click();
  assert.equal(await status.count(), 1);
  assert.equal(await status.getAttribute('data-tone'), 'success');
  assert.equal(await status.getAttribute('aria-atomic'), 'true');
  assert.equal(await status.getByText('这是一条提示。', { exact: true }).count(), 1);
  assert.equal(await scope.locator('[aria-live], [role="alert"]').count(), 0);
  const close = status.getByRole('button', { name: '关闭提示', exact: true });
  const box = await close.boundingBox();
  assert(box.width >= 44 && box.height >= 44);
  await close.focus();
  await close.press('Space');
  await status.waitFor({ state: 'detached' });
  await requireFocus(page, show);
  await show.press('Enter');
  await status.waitFor();
  await requireFocus(page, show);
  await show.click();
  assert.equal(await status.count(), 1);
  await page.keyboard.press('Escape');
  assert.equal(await status.isVisible(), true);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  return {
    initialVisible: true,
    singleStatus: true,
    close44: true,
    closeReturnsToShow: true,
    repeatShowOneStatus: true,
    escapeUnchanged: true,
  };
}

/** The component-page example keeps a permanent destination and returns focus on close. */
export async function verifyToastFocus(page, scope = page.locator('#basic .example-preview')) {
  await revealExample(scope);
  const trigger = scope.getByRole('button', { name: /^(收藏手记|再次显示提示)$/ });
  const status = scope.getByRole('status');
  const heading = scope.getByRole('heading', { name: '周末散步', exact: true });
  const permanentView = scope.getByRole('button', { name: '查看手记', exact: true }).first();
  const close = status.getByRole('button', { name: '关闭提示', exact: true });
  await trigger.focus();
  await trigger.press('Enter');
  await status.getByText('手记已收藏', { exact: true }).waitFor();
  await requireFocus(page, trigger);
  const originalStatus = await status.elementHandle();
  try {
    await trigger.press('Space');
    assert.equal(await status.count(), 1);
    assert.equal(
      await status.evaluate((node, original) => node === original, originalStatus),
      true,
    );
    await close.focus();
    await close.press('Space');
    await status.waitFor({ state: 'detached' });
    await requireFocus(page, trigger);
    await scope
      .getByText('已收藏。吉伊收起路线图，小八还在数口袋里的面包屑。', { exact: true })
      .waitFor();
    await trigger.press('Enter');
    await status.getByRole('button', { name: '查看手记', exact: true }).click();
    await status.waitFor({ state: 'detached' });
    await requireFocus(page, heading);
    await permanentView.focus();
    await permanentView.press('Enter');
    await requireFocus(page, heading);
    assert.equal(await scope.locator('[aria-live], [role="alert"]').count(), 0);
  } finally {
    await originalStatus.dispose();
  }
}
