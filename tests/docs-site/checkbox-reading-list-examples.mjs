import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const titles = [
  '沿河走到面包店的那条小路',
  'ReadingNotesForASlowWeekend：还没读完的两页书',
  '花店门口，写给朋友的一张纸条',
];
const dialogTitle = '从稍后阅读移除所选手记？';
const failure = '清单和选择仍然保留，请再次点击“确认移除”。';

async function requireText(page, locator, expected) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction(({ element, text }) => element.textContent.trim() === text, {
      element: node,
      text: expected,
    });
  } finally {
    await node.dispose();
  }
}

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

async function requireMixed(page, locator, checked, indeterminate) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction(
      ({ element, selected, mixed }) =>
        element.checked === selected && element.indeterminate === mixed,
      { element: node, selected: checked, mixed: indeterminate },
    );
    assert.equal(await locator.getAttribute('aria-checked'), indeterminate ? 'mixed' : null);
  } finally {
    await node.dispose();
  }
}

/** Exercise the local reading-list task using the same component in docs and installed packages. */
export async function verifyCheckboxReadingList(page, example) {
  await revealExample(example);
  const checkbox = (title) =>
    example.getByRole('checkbox', {
      name: `选择手记：${title}`,
      exact: true,
      includeHidden: true,
    });
  const all = example.getByRole('checkbox', {
    name: '全选当前清单',
    exact: true,
    includeHidden: true,
  });
  const list = example.getByRole('list', {
    name: '稍后阅读清单',
    exact: true,
    includeHidden: true,
  });
  const action = example.getByRole('button', { name: '移除所选', exact: true });
  const restore = example.getByRole('button', { name: '恢复示例清单', exact: true });
  const status = example.getByRole('status', { includeHidden: true });
  // The modal hides its background from the accessibility tree, including the one result region.
  const dialog = page.getByRole('dialog', { includeHidden: true }).filter({
    has: page.getByText(dialogTitle, { exact: true }),
  });
  const cancel = dialog.getByRole('button', { name: '取消', exact: true });
  const confirm = dialog.getByRole('button', { name: '确认移除', exact: true });
  const snapshot = dialog.getByRole('list', { name: '本次将移出的手记', exact: true });
  const alert = dialog.getByRole('alert');
  let stage = 'initial';
  let originalError;

  async function requireList(expectedTitles) {
    if (expectedTitles.length) {
      await list.waitFor({ state: 'attached' });
      assert.deepEqual(await list.locator('li strong').allTextContents(), expectedTitles);
    } else {
      assert.equal(await list.count(), 0);
    }
  }

  async function requireSelection(selectedTitles, currentTitles = titles) {
    await requireText(
      page,
      status,
      `已选 ${selectedTitles.length} 篇，共 ${currentTitles.length} 篇。`,
    );
    await requireList(currentTitles);
    for (const title of currentTitles) {
      assert.equal(await checkbox(title).isChecked(), selectedTitles.includes(title), title);
    }
    if (currentTitles.length) {
      await requireMixed(
        page,
        all,
        selectedTitles.length === currentTitles.length,
        selectedTitles.length > 0 && selectedTitles.length < currentTitles.length,
      );
    }
    assert.equal(await status.count(), 1, 'The task has one outer result announcement.');
  }

  async function openDialog(expectedTitles) {
    await action.focus();
    await action.press('Enter');
    await dialog.waitFor({ state: 'visible' });
    await requireFocus(page, cancel);
    assert.deepEqual(await snapshot.locator('li').allTextContents(), expectedTitles);
    assert.equal(
      await dialog
        .getByText(`将移出本次选择的 ${expectedTitles.length} 篇手记，文章内容不会删除。`, {
          exact: true,
        })
        .count(),
      1,
    );
    assert.equal(await status.count(), 1);
    assert.equal(await dialog.getByRole('status').count(), 0);
  }

  async function requireBusy() {
    const node = await confirm.elementHandle();
    try {
      await page.waitForFunction(
        (element) => element.disabled && element.getAttribute('aria-busy') === 'true',
        node,
      );
    } finally {
      await node.dispose();
    }
    assert.equal(await cancel.isEnabled(), true, 'Waiting can still be cancelled.');
    assert.equal(await dialog.getByText('正在移出所选手记…', { exact: true }).count(), 1);
    assert.equal(await dialog.getByRole('status').count(), 0);
  }

  async function cancelDialog() {
    await cancel.click();
    await dialog.waitFor({ state: 'detached' });
    await requireFocus(page, action);
  }

  async function requireFailure(selectedTitles) {
    await alert.waitFor({ state: 'visible' });
    assert.equal(await alert.count(), 1);
    assert.equal(await alert.getByText('模拟移除失败', { exact: true }).count(), 1);
    assert.equal(await alert.getByText(failure, { exact: true }).count(), 1);
    assert.equal(await confirm.isEnabled(), true);
    assert.notEqual(await confirm.getAttribute('aria-busy'), 'true');
    await requireSelection(selectedTitles);
    assert.deepEqual(await snapshot.locator('li').allTextContents(), selectedTitles);
    assert.equal(await example.getByRole('alert', { includeHidden: true }).count(), 0);
    assert.equal(await dialog.getByRole('status').count(), 0);
    assert(!(await status.textContent()).includes('失败'));
  }

  try {
    await action.waitFor();
    await requireSelection([]);
    assert.equal(await action.isDisabled(), true);
    assert.equal(await restore.count(), 0);
    assert.equal(await dialog.count(), 0);

    stage = 'partial and full selection';
    await checkbox(titles[0]).check();
    await requireSelection([titles[0]]);
    assert.equal(await action.isEnabled(), true);
    await all.check();
    await requireSelection(titles);
    await all.uncheck();
    await requireSelection([]);
    assert.equal(await action.isDisabled(), true);

    stage = 'snapshot and cancel';
    const selected = [titles[0], titles[2]];
    await checkbox(selected[0]).check();
    await checkbox(selected[1]).check();
    await requireSelection(selected);
    await openDialog(selected);
    await cancelDialog();
    await requireSelection(selected);

    stage = 'first failure preserves list and retry button';
    await openDialog(selected);
    const retryButton = await confirm.elementHandle();
    try {
      await confirm.click();
      await requireBusy();
      for (const title of titles) assert.equal(await checkbox(title).isDisabled(), true);
      await requireFailure(selected);
      assert.equal(
        await confirm.evaluate((node, previous) => node === previous, retryButton),
        true,
        'Retry uses the same confirmation button.',
      );
      stage = 'retry succeeds and focuses surviving item';
      await confirm.click();
      await requireBusy();
      await dialog.waitFor({ state: 'detached' });
      await requireText(page, status, '已从稍后阅读移除 2 篇，文章仍然保留。');
      await requireList([titles[1]]);
      assert.equal(await checkbox(titles[1]).isChecked(), false);
      await requireMixed(page, all, false, false);
      await requireFocus(page, checkbox(titles[1]));
      assert.equal(await action.isDisabled(), true);
      assert.equal(await status.count(), 1);
    } finally {
      await retryButton.dispose();
    }

    stage = 'restore initial list';
    await restore.click();
    await requireSelection([]);
    await requireFocus(page, checkbox(titles[0]));
    assert.equal(await restore.count(), 0);

    stage = 'cancel waiting and reject late removal';
    await checkbox(titles[0]).check();
    await openDialog([titles[0]]);
    await confirm.click();
    await requireBusy();
    await cancelDialog();
    // The example's real request lasts 700ms. Cross that window to catch a late completion.
    await page.waitForTimeout(800);
    await requireSelection([titles[0]]);
    assert.equal(await action.isEnabled(), true);
    assert.equal(await dialog.count(), 0);
    assert.equal(await example.getByRole('alert').count(), 0);

    stage = 'failure keeps user focus on cancel';
    await openDialog([titles[0]]);
    await confirm.click();
    await requireBusy();
    await cancel.focus();
    await requireFocus(page, cancel);
    await requireFailure([titles[0]]);
    await requireFocus(page, cancel);
    await cancelDialog();
    await requireSelection([titles[0]]);

    stage = 'clear list and restore from empty state';
    await all.check();
    await requireSelection(titles);
    await openDialog(titles);
    await confirm.click();
    await requireBusy();
    await dialog.waitFor({ state: 'detached' });
    await requireText(page, status, '已从稍后阅读移除 3 篇，文章仍然保留。');
    await requireList([]);
    assert.equal(await example.getByRole('checkbox', { includeHidden: true }).count(), 0);
    assert.equal(
      await example.getByRole('heading', { name: '稍后阅读清单已清空', exact: true }).count(),
      1,
    );
    assert.equal(
      await example.getByText('这里只移出了清单，文章内容仍然保留。', { exact: true }).count(),
      1,
    );
    await requireFocus(page, restore);
    assert.equal(await action.isDisabled(), true);
    assert.equal(await status.count(), 1);
    await restore.press('Space');
    await requireSelection([]);
    await requireFocus(page, checkbox(titles[0]));
  } catch (error) {
    error.message = `CheckboxReadingList [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      if (await dialog.count()) {
        await cancel.click();
        await dialog.waitFor({ state: 'detached' });
      }
      if (await restore.count()) await restore.click();
      for (const title of titles) {
        if (await checkbox(title).isChecked()) await checkbox(title).uncheck();
      }
      await requireSelection([]);
      assert.equal(await action.isDisabled(), true);
      assert.equal(await restore.count(), 0);
      assert.equal(await dialog.count(), 0);
    } catch (cleanupError) {
      if (!originalError) originalError = cleanupError;
      else originalError.message += `\nCleanup also failed: ${cleanupError}`;
    }
  }
  if (originalError) throw originalError;
}
