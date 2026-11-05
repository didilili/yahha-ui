import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const labels = { journal: '周末慢读', reading: '想再读一遍' };
const statusText = (value) => `当前收藏位置：${labels[value] ?? '尚未加入'}。`;
const errorMessage = '请选择一个可用收藏夹。';

async function focused(page, locator) {
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

async function painted(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction(
      (element) =>
        !element.hasAttribute('data-starting-style') &&
        getComputedStyle(element).opacity === '1' &&
        !element
          .getAnimations({ subtree: true })
          .some((animation) => animation.playState === 'running'),
      node,
    );
  } finally {
    await node.dispose();
  }
}

/** The child Select is a real body Portal; its Escape and draft remain separate from its parent. */
export async function verifyPopoverCollection(
  page,
  scope = page.locator('#popover-collection .example-preview'),
) {
  await revealExample(scope);
  const trigger = scope.getByRole('button', { name: '为这篇手记选择收藏夹', exact: true });
  const reading = scope.getByRole('button', { name: '继续阅读', exact: true });
  const heading = scope.getByRole('heading', { name: '沿着河边，慢慢走', exact: true });
  const status = scope.getByRole('status', { includeHidden: true });
  const parent = page.getByRole('dialog', { name: '手记收藏位置', exact: true });
  const combo = parent.getByRole('combobox', { name: '收藏夹', exact: true });
  const submit = parent.getByRole('button', { name: '放进收藏夹', exact: true });
  const cancel = parent.getByRole('button', { name: '取消', exact: true });
  const portalGeometry = [];
  const states = [];
  const keyboardSelections = [];
  let stage = 'initial';
  let originalError, result;
  await trigger.waitFor();
  const initialText = (await status.textContent()).trim();
  const initialAssigned =
    Object.keys(labels).find((value) => statusText(value) === initialText) ?? null;
  let assigned = initialAssigned;

  async function requireStatus(value) {
    const node = await status.elementHandle();
    try {
      await page.waitForFunction(({ element, text }) => element.textContent === text, {
        element: node,
        text: statusText(value),
      });
    } finally {
      await node.dispose();
    }
    assert.equal(await status.count(), 1);
    assert.equal(await scope.locator('[aria-live]').count(), 0);
    if (await parent.count()) assert.equal(await parent.getByRole('status').count(), 0);
    states.push({ stage, assigned: value });
  }

  async function nativeValue(value) {
    const node = await combo.elementHandle();
    try {
      await page.waitForFunction(
        ({ element, expected }) => new FormData(element.form).get('collection') === expected,
        { element: node, expected: value ?? '' },
      );
    } finally {
      await node.dispose();
    }
    assert.deepEqual(await parent.locator('form').evaluate((form) => [...new FormData(form)]), [
      ['collection', value ?? ''],
    ]);
  }

  async function openParent(key = 'Enter') {
    await trigger.focus();
    await trigger.press(key);
    await parent.waitFor();
    await focused(page, combo);
    await painted(page, parent);
    await focused(page, combo);
    await nativeValue(assigned);
    assert.equal(await parent.getByText(errorMessage, { exact: true }).count(), 0);
    assert.equal(
      await reading.count(),
      1,
      'The nonmodal parent leaves the outside reading action accessible.',
    );
    assert.equal(
      await heading.evaluate((node) => node.closest('[inert], [aria-hidden="true"]') !== null),
      false,
    );
    await requireStatus(assigned);
  }

  async function closeParent(action, target = trigger) {
    const popup = await parent.elementHandle();
    try {
      await action();
      await page.waitForFunction((node) => !node.isConnected, popup);
    } finally {
      await popup.dispose();
    }
    await focused(page, target);
    await settle(page);
    assert.equal(await target.evaluate((node) => document.activeElement === node), true);
  }

  async function openSelect(pointer = false) {
    if ((await combo.getAttribute('aria-expanded')) !== 'true') {
      if (pointer) await combo.click();
      else {
        await combo.focus();
        await combo.press('Space');
      }
    }
    const node = await combo.elementHandle();
    try {
      await page.waitForFunction(
        (element) =>
          element.getAttribute('aria-expanded') === 'true' &&
          Boolean(element.getAttribute('aria-controls')),
        node,
      );
    } finally {
      await node.dispose();
    }
    const controls = await combo.getAttribute('aria-controls');
    assert(controls);
    const listbox = page.locator(`[id=${JSON.stringify(controls)}]`);
    await listbox.waitFor({ state: 'visible' });
    await painted(page, listbox);
    assert.equal(await listbox.getAttribute('role'), 'listbox');
    return listbox;
  }

  async function childClosed(listbox) {
    const node = await combo.elementHandle();
    try {
      await page.waitForFunction(
        (element) => element.getAttribute('aria-expanded') === 'false',
        node,
      );
    } finally {
      await node.dispose();
    }
    await listbox.waitFor({ state: 'hidden' });
    await focused(page, combo);
  }

  async function choose(value, pointer = false) {
    const listbox = await openSelect(pointer);
    if (pointer) await listbox.getByRole('option', { name: labels[value], exact: true }).click();
    else {
      // The inner List can paint before the outer popup completes its keyboard focus handoff.
      const list = await listbox.elementHandle();
      let initialFocus;
      try {
        await page.waitForFunction((node) => node.contains(document.activeElement), list);
        initialFocus = await list.evaluate(() => ({
          tag: document.activeElement.tagName,
          role: document.activeElement.getAttribute('role'),
          text: document.activeElement.textContent,
        }));
      } finally {
        await list.dispose();
      }
      await page.keyboard.press('Home');
      await focused(page, listbox.getByRole('option', { name: labels.journal, exact: true }));
      if (value === 'reading') {
        await page.keyboard.press('ArrowDown');
        await focused(page, listbox.getByRole('option', { name: labels.reading, exact: true }));
      }
      await page.keyboard.press('Enter');
      keyboardSelections.push({ stage, initialFocus, selected: value });
    }
    await nativeValue(value);
    await childClosed(listbox);
    assert.equal(await parent.isVisible(), true);
    assert.notEqual(await combo.getAttribute('aria-invalid'), 'true');
    await requireStatus(assigned);
  }

  async function commit(value, pointer = false) {
    await closeParent(async () => {
      if (pointer) await submit.click();
      else {
        await submit.focus();
        await submit.press('Space');
      }
    });
    await requireStatus(value);
    assigned = value;
  }

  async function inspectPortals(listbox) {
    await painted(page, parent);
    const parentNode = await parent.elementHandle();
    const childNode = await listbox.elementHandle();
    try {
      const relation = await parentNode.evaluate(
        (node, child) => ({
          isDOMDescendant: node.contains(child),
          bodyPortaled: child.getRootNode() === document && document.body.contains(child),
          separateThemeWrapper:
            node.closest('[data-yahha-theme]') !== child.closest('[data-yahha-theme]'),
        }),
        childNode,
      );
      assert.deepEqual(relation, {
        isDOMDescendant: false,
        bodyPortaled: true,
        separateThemeWrapper: true,
      });
      const measure = (node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom },
          width: innerWidth,
          height: innerHeight,
          documentWidth: document.documentElement.scrollWidth,
          clientWidth: node.clientWidth,
          scrollWidth: node.scrollWidth,
          clientHeight: node.clientHeight,
          scrollHeight: node.scrollHeight,
          theme: node.closest('[data-yahha-theme]')?.getAttribute('data-yahha-theme'),
          tokens: ['--yahha-ink', '--yahha-surface', '--yahha-accent'].map((key) =>
            style.getPropertyValue(key).trim(),
          ),
        };
      };
      const outer = await parentNode.evaluate(measure);
      const inner = await childNode.evaluate(measure);
      assert(outer.theme);
      assert.equal(inner.theme, outer.theme);
      assert.deepEqual(inner.tokens, outer.tokens);
      for (const bounds of [outer, inner]) {
        assert(bounds.documentWidth <= bounds.width + 1);
        assert(bounds.scrollWidth <= bounds.clientWidth + 1);
        assert(bounds.rect.left >= -1 && bounds.rect.right <= bounds.width + 1);
        assert(bounds.rect.top >= -1 && bounds.rect.bottom <= bounds.height + 1);
      }
      const options = await listbox.getByRole('option').evaluateAll((nodes) =>
        nodes.map((node) => {
          const box = node.getBoundingClientRect();
          return {
            label: node.textContent,
            width: box.width,
            height: box.height,
            disabled: node.getAttribute('aria-disabled'),
          };
        }),
      );
      assert.deepEqual(
        options.map((option) => option.label),
        [labels.journal, labels.reading, '已归档（暂不接收）'],
      );
      assert(options.every((option) => option.width >= 44 - 0.01 && option.height >= 44 - 0.01));
      portalGeometry.push({ stage, relation, outer, inner, options });
    } finally {
      await parentNode.dispose();
      await childNode.dispose();
    }
  }

  try {
    assert.equal(initialText, statusText(initialAssigned));
    await requireStatus(assigned);
    await openParent();
    let missingValidation =
      'Not repeated: initial assignment is already saved and the required UI has no clear/reset control.';
    if (initialAssigned === null) {
      stage = 'missing choice reports the field error without assigning an article';
      assert.equal(await parent.locator('form').evaluate((form) => form.noValidate), true);
      await submit.focus();
      await submit.press('Enter');
      const error = parent.getByText(errorMessage, { exact: true });
      await error.waitFor();
      await focused(page, combo);
      assert.equal(await combo.getAttribute('aria-invalid'), 'true');
      const errorId = await error.getAttribute('id');
      assert(
        errorId && (await combo.getAttribute('aria-describedby')).split(/\s+/).includes(errorId),
      );
      await nativeValue(null);
      await requireStatus(null);
      missingValidation =
        'Empty initial FormData validated through the real noValidate form and focused Select.';
    }

    stage = 'the nested child is independently body portaled and themed';
    let listbox = await openSelect();
    await inspectPortals(listbox);
    const disabled = listbox.getByRole('option', { name: '已归档（暂不接收）', exact: true });
    assert.equal(await disabled.getAttribute('aria-disabled'), 'true');
    await disabled.scrollIntoViewIfNeeded();
    const box = await disabled.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await nativeValue(assigned);
    assert.equal(await parent.isVisible(), true);
    assert.equal(await listbox.isVisible(), true);
    await requireStatus(assigned);
    stage = 'first Escape closes only the child and returns Select focus';
    await page.keyboard.press('Escape');
    await childClosed(listbox);
    assert.equal(await parent.isVisible(), true);
    stage = 'second Escape closes only the parent and returns its trigger';
    await closeParent(() => combo.press('Escape'));
    await requireStatus(assigned);

    stage = 'pointer choice updates the draft, then confirmation updates assignment';
    await openParent('Space');
    await choose('reading', true);
    await commit('reading', true);

    stage = 'keyboard draft and cancellation leave the saved assignment unchanged';
    await openParent();
    await choose('journal');
    await closeParent(async () => {
      await cancel.focus();
      await cancel.press('Enter');
    });
    await requireStatus('reading');
    await openParent();
    await nativeValue('reading');

    stage = 'outside Continue Reading action keeps its heading focus after parent exit';
    await closeParent(() => reading.click(), heading);
    await requireStatus('reading');

    stage = 'native Tab leaves the nonmodal popup without a fixed browser-specific target';
    await openParent();
    await cancel.focus();
    const popup = await parent.elementHandle();
    const tabTargets = [];
    try {
      for (let attempt = 0; attempt < 5; attempt++) {
        await page.keyboard.press('Tab');
        await settle(page);
        const observed = await popup.evaluate((node) => ({
          inside: node.contains(document.activeElement),
          tag: document.activeElement.tagName,
          label: document.activeElement.getAttribute('aria-label'),
          text: document.activeElement.textContent?.trim().slice(0, 80),
        }));
        tabTargets.push(observed);
        if (!observed.inside || (await trigger.getAttribute('aria-expanded')) === 'false') break;
      }
      await page.waitForFunction((node) => !node.isConnected, popup);
      assert.equal(await popup.evaluate((node) => node.contains(document.activeElement)), false);
    } finally {
      await popup.dispose();
    }
    await requireStatus('reading');

    stage = 'keyboard choice and Space confirmation update the real saved selection';
    await openParent();
    await choose('journal');
    await commit('journal');
    await openParent();
    await nativeValue('journal');
    const reachable = [];
    for (const button of [combo, submit, cancel]) {
      await button.scrollIntoViewIfNeeded();
      const bounds = await button.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const dialog = node.closest('[role="dialog"]').getBoundingClientRect();
        const hit = document.elementFromPoint(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
        );
        return {
          label: node.getAttribute('aria-label') || node.textContent,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          bottom: rect.bottom,
          popupTop: dialog.top,
          popupBottom: dialog.bottom,
          hit: node === hit || node.contains(hit),
          scrollTop: node.closest('[role="dialog"]').scrollTop,
        };
      });
      assert(bounds.width >= 44 - 0.01 && bounds.height >= 44 - 0.01);
      assert(
        bounds.top >= bounds.popupTop - 1 && bounds.bottom <= bounds.popupBottom + 1 && bounds.hit,
      );
      reachable.push(bounds);
    }
    // On short screens these controls are reached by scrolling; the title need not stay visible.
    await closeParent(() => page.keyboard.press('Escape'));
    result = {
      initialAssigned,
      states,
      portalGeometry,
      keyboardSelections,
      missingValidation,
      tabTargets,
      reachable,
    };
  } catch (error) {
    error.message = `PopoverCollection [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      stage = 'cleanup';
      if (await parent.count()) {
        if ((await combo.getAttribute('aria-expanded')) === 'true') {
          const child = await openSelect();
          await page.keyboard.press('Escape');
          await childClosed(child);
        }
        await closeParent(async () => {
          await cancel.focus();
          await cancel.press('Enter');
        });
      }
      const currentText = (await status.textContent()).trim();
      assigned = Object.keys(labels).find((value) => statusText(value) === currentText) ?? null;
      if (initialAssigned !== null && assigned !== initialAssigned) {
        await openParent();
        await choose(initialAssigned);
        await commit(initialAssigned);
      }
      await requireStatus(assigned);
      assert.equal(await parent.count(), 0);
      if (result)
        result.cleanup = {
          assigned,
          initialAssignedRestored: assigned === initialAssigned,
          limitation:
            initialAssigned === null && assigned !== null
              ? 'Required UI has no reset-to-unassigned action. Real confirmation remains saved; subsequent calls start from that value, with no state patch, fixture control or reload.'
              : null,
        };
    } catch (error) {
      if (!originalError) originalError = error;
      else originalError.message += `\nCleanup also failed: ${error}`;
    }
  }
  if (originalError) throw originalError;
  return result;
}
