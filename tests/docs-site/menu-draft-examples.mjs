import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const initialTitle = '周末想写的一页';
const removedMessage = '已从示例列表中移出，可恢复原草稿';
const restoredMessage = '草稿已恢复，内容没有丢失';

async function settle(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
    await settle(page);
    assert.equal(await node.evaluate((element) => document.activeElement === element), true);
  } finally {
    await node.dispose();
  }
}

/** Retain native draft state while its contextual menu/trigger unmount and recover. */
export async function verifyMenuDraft(page, scope = page.locator('#controlled .example-preview')) {
  await revealExample(scope);
  const article = scope.getByRole('article', { name: '示例草稿', exact: true });
  const field = scope.getByRole('textbox', { name: '草稿标题', exact: true });
  const recovery = scope.getByRole('button', { name: '恢复草稿', exact: true });
  const trigger = scope.getByRole('button', { name: /^操作草稿：/ });
  const status = scope.getByRole('status');
  const snapshots = [];
  const menuGeometry = [];
  let stage = 'initial';
  let originalError, result, originalTrigger;

  async function record(expectedMessage = null) {
    assert.equal(await status.count(), 1);
    if (expectedMessage !== null)
      await status.getByText(expectedMessage, { exact: true }).waitFor();
    assert.equal(await scope.getByRole('alert').count(), 0);
    assert.equal(await scope.locator('[aria-live]').count(), 0);
    const dimensions = await page.evaluate(() => ({
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    assert(dimensions.documentWidth <= dimensions.width + 1);
    snapshots.push({
      stage,
      status: await status.textContent(),
      removed: (await article.count()) === 0,
      editing: await field.isVisible(),
      ...dimensions,
    });
  }

  async function requireContext(title) {
    await trigger.waitFor();
    assert.equal(await trigger.getAttribute('aria-label'), `操作草稿：${title}`);
    assert.equal(await trigger.textContent(), '草稿操作');
    assert.equal(await trigger.evaluate((node) => node.tagName), 'BUTTON');
    const box = await trigger.boundingBox();
    assert(box.width >= 44 - 0.01 && box.height >= 44 - 0.01);
  }

  async function inspectMenu(menu, focusedItem = null) {
    const node = await menu.elementHandle();
    try {
      await page.waitForFunction(
        (element) => Number(getComputedStyle(element).opacity) >= 0.999,
        node,
      );
      const geometry = await menu.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          width: innerWidth,
          height: innerHeight,
          left: bounds.left,
          right: bounds.right,
          top: bounds.top,
          bottom: bounds.bottom,
          clientHeight: element.clientHeight,
          scrollHeight: element.scrollHeight,
          items: [...element.querySelectorAll('[role="menuitem"]')].map((item) => {
            const rect = item.getBoundingClientRect();
            return { label: item.textContent, width: rect.width, height: rect.height };
          }),
        };
      });
      assert(geometry.left >= -1 && geometry.right <= geometry.width + 1);
      assert(geometry.top >= -1 && geometry.bottom <= geometry.height + 1);
      for (const item of geometry.items)
        assert(item.width >= 44 - 0.01 && item.height >= 44 - 0.01);
      if (focusedItem) {
        const box = await focusedItem.boundingBox();
        assert(box.y >= geometry.top - 1 && box.y + box.height <= geometry.bottom + 1);
      }
      menuGeometry.push({ stage, ...geometry });
    } finally {
      await node.dispose();
    }
  }

  async function openMenu(title) {
    await requireContext(title);
    await trigger.focus();
    await trigger.press('ArrowDown');
    const menu = page.getByRole('menu', { name: `操作草稿：${title}`, exact: true });
    await menu.waitFor();
    assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    assert.deepEqual(await menu.getByRole('menuitem').allTextContents(), [
      '继续编辑',
      '发布（等待审核）',
      '移出草稿列表',
    ]);
    await requireFocus(page, menu.getByRole('menuitem', { name: '继续编辑', exact: true }));
    await inspectMenu(menu);
    return menu;
  }

  async function activateThenExit(menu, item, key = 'Enter') {
    const popup = await menu.elementHandle();
    try {
      await item.press(key);
      // Wait for the actual retained exit DOM to unmount, rather than assuming a duration.
      await page.waitForFunction((element) => !element.isConnected, popup);
    } finally {
      await popup.dispose();
    }
  }

  async function escapeMenu(menu, title) {
    await activateThenExit(menu, menu, 'Escape');
    await requireContext(title);
    await requireFocus(page, trigger);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
  }

  async function edit(title) {
    const menu = await openMenu(title);
    await activateThenExit(menu, menu.getByRole('menuitem', { name: '继续编辑', exact: true }));
    await field.waitFor();
    await requireFocus(page, field);
    await record('正在编辑草稿');
  }

  async function remove(title) {
    const menu = await openMenu(title);
    await menu.getByRole('menuitem', { name: '继续编辑', exact: true }).press('End');
    const action = menu.getByRole('menuitem', { name: '移出草稿列表', exact: true });
    await requireFocus(page, action);
    await inspectMenu(menu, action);
    await activateThenExit(menu, action);
    await article.waitFor({ state: 'detached' });
    assert.equal(await trigger.count(), 0);
    await recovery.waitFor();
    await requireFocus(page, recovery);
    await record(removedMessage);
  }

  async function restore(title, key) {
    await recovery.press(key);
    await article.waitFor();
    assert.equal(await recovery.count(), 0);
    await requireContext(title);
    await requireFocus(page, trigger);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    await record(restoredMessage);
  }

  async function save(title) {
    const button = scope.getByRole('button', { name: '保存草稿', exact: true });
    await button.focus();
    await button.press('Enter');
    await scope.getByRole('heading', { name: title, exact: true }).waitFor();
    await requireContext(title);
    await requireFocus(page, trigger);
    assert.equal(await field.count(), 0);
    await record('草稿标题已保存在本页');
  }

  try {
    await article.waitFor();
    await requireContext(initialTitle);
    await scope.getByRole('heading', { name: initialTitle, exact: true }).waitFor();
    assert.equal(await field.count(), 0);
    assert.equal(await recovery.count(), 0);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    originalTrigger = await trigger.elementHandle();
    await record();

    stage = 'keyboard removal unmounts the actual original trigger';
    await remove(initialTitle);
    assert.equal(await originalTrigger.evaluate((element) => element.isConnected), false);
    stage = 'Space recovery mounts a new trigger and Escape returns to that trigger';
    await restore(initialTitle, 'Space');
    assert.equal(await trigger.evaluate((element, old) => element === old, originalTrigger), false);
    await escapeMenu(await openMenu(initialTitle), initialTitle);

    stage = 'disabled publication is discoverable but cannot execute or close the menu';
    const menu = await openMenu(initialTitle);
    await menu.getByRole('menuitem', { name: '继续编辑', exact: true }).press('ArrowDown');
    const publish = menu.getByRole('menuitem', { name: '发布（等待审核）', exact: true });
    await requireFocus(page, publish);
    assert.equal(await publish.getAttribute('aria-disabled'), 'true');
    const message = await status.textContent();
    for (const key of ['Enter', 'Space']) {
      await publish.press(key);
      await menu.waitFor();
      await requireFocus(page, publish);
      assert.equal(await status.textContent(), message);
      assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    }
    await publish.press('Home');
    await requireFocus(page, menu.getByRole('menuitem', { name: '继续编辑', exact: true }));
    await escapeMenu(menu, initialTitle);

    stage = 'raw unsaved draft survives article/input unmount and recovery';
    await edit(initialTitle);
    const raw = '  未提交的小小手记  ';
    await field.fill(raw);
    const oldField = await field.elementHandle();
    try {
      await remove(initialTitle);
      assert.equal(await oldField.evaluate((element) => element.isConnected), false);
      await restore(initialTitle, 'Enter');
      assert.equal(await field.inputValue(), raw);
      assert.equal(await field.evaluate((element, old) => element === old, oldField), false);
      assert.equal(await field.evaluate((element) => document.activeElement === element), false);
    } finally {
      await oldField.dispose();
    }

    stage = 'cancel returns to the saved title and its contextual trigger';
    const cancel = scope.getByRole('button', { name: '取消编辑', exact: true });
    await cancel.focus();
    await cancel.press('Space');
    await scope.getByRole('heading', { name: initialTitle, exact: true }).waitFor();
    await requireContext(initialTitle);
    await requireFocus(page, trigger);
    assert.equal(await field.count(), 0);
    await record('已取消编辑，草稿标题没有改变');

    stage = 'save trims the title and updates both trigger and menu accessible names';
    await edit(initialTitle);
    assert.equal(await field.inputValue(), initialTitle);
    const renamed = '周末沿着河边走走，再去书店读一页';
    await field.fill(`  ${renamed}  `);
    await save(renamed);
    assert.equal(
      await scope.getByRole('button', { name: `操作草稿：${initialTitle}`, exact: true }).count(),
      0,
    );
    await escapeMenu(await openMenu(renamed), renamed);

    stage = 'renamed saved content survives another removal and recovery';
    await remove(renamed);
    await restore(renamed, 'Space');
    await scope.getByRole('heading', { name: renamed, exact: true }).waitFor();
    await escapeMenu(await openMenu(renamed), renamed);
    result = { snapshots, menuGeometry };
  } catch (error) {
    error.message = `MenuDraft [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      stage = 'cleanup';
      if (await recovery.count()) {
        await recovery.focus();
        await recovery.press('Enter');
        await article.waitFor();
        await requireFocus(page, trigger);
      }
      if ((await trigger.getAttribute('aria-expanded')) === 'true') {
        const activeMenu = page.getByRole('menu', { name: /^操作草稿：/ });
        await escapeMenu(
          activeMenu,
          (await trigger.getAttribute('aria-label')).slice('操作草稿：'.length),
        );
      }
      if (await field.isVisible()) {
        const cancel = scope.getByRole('button', { name: '取消编辑', exact: true });
        await cancel.focus();
        await cancel.press('Enter');
        await requireFocus(page, trigger);
      }
      const title = await scope.getByRole('heading', { level: 3 }).textContent();
      if (title !== initialTitle) {
        await edit(title);
        await field.fill(initialTitle);
        await save(initialTitle);
      }
      await requireContext(initialTitle);
      assert.equal(await field.count(), 0);
      assert.equal(await recovery.count(), 0);
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
      await record();
      // No test-only reset: the final status truthfully reflects the real cleanup save/cancel.
    } catch (error) {
      if (!originalError) originalError = error;
      else originalError.message += `\nCleanup also failed: ${error}`;
    } finally {
      if (originalTrigger) await originalTrigger.dispose();
    }
  }
  if (originalError) throw originalError;
  return result;
}
