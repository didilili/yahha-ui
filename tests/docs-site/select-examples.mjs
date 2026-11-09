import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const readingTitle = 'Reading 阅读摘记';
const journalTitle = 'Journal 日常手记';
const restoredMessage = '已恢复 2 个示例选项，请选择一个。';

async function settle(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function requireText(page, locator, text) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction(({ element, expected }) => element.textContent.trim() === expected, {
      element: node,
      expected: text,
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

async function requireValue(page, trigger, value, included = true) {
  const node = await trigger.elementHandle();
  try {
    await page.waitForFunction(
      ({ element, expected, hasField }) => {
        const data = new FormData(element.form);
        return data.has('collection') === hasField && data.get('collection') === expected;
      },
      { element: node, expected: value, hasField: included },
    );
  } finally {
    await node.dispose();
  }
}

async function requireDisabled(page, trigger, disabled) {
  const node = await trigger.elementHandle();
  try {
    await page.waitForFunction(
      ({ element, expected }) => element.matches(':disabled') === expected,
      { element: node, expected: disabled },
    );
  } finally {
    await node.dispose();
  }
}

async function closeSelect(page, trigger) {
  await settle(page);
  if ((await trigger.getAttribute('aria-expanded')) === 'true') {
    const controls = await trigger.getAttribute('aria-controls');
    await page.keyboard.press('Escape');
    const node = await trigger.elementHandle();
    try {
      await page.waitForFunction(
        (element) => element.getAttribute('aria-expanded') === 'false',
        node,
      );
    } finally {
      await node.dispose();
    }
    if (controls)
      await page.locator(`[id=${JSON.stringify(controls)}]`).waitFor({ state: 'hidden' });
    await requireFocus(page, trigger);
  }
}

async function openSelect(page, trigger) {
  if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
  const node = await trigger.elementHandle();
  try {
    await page.waitForFunction((element) => element.getAttribute('aria-expanded') === 'true', node);
  } finally {
    await node.dispose();
  }
  const controls = await trigger.getAttribute('aria-controls');
  await page.locator(`[id=${JSON.stringify(controls)}]`).waitFor({ state: 'visible' });
  return controls;
}

async function choose(
  page,
  trigger,
  title,
  value,
  valueProbe = (expected) => requireValue(page, trigger, expected),
) {
  const controls = await openSelect(page, trigger);
  await page.getByRole('option', { name: new RegExp(`^${title}`) }).click();
  await valueProbe(value);
  await page.locator(`[id=${JSON.stringify(controls)}]`).waitFor({ state: 'hidden' });
  await requireFocus(page, trigger);
}

async function focusSnapshot(page) {
  return page.evaluate(() => {
    const element = document.activeElement;
    return {
      tag: element?.tagName,
      role: element?.getAttribute('role'),
      text: element === document.body ? '(body)' : element?.textContent?.trim().slice(0, 100),
      disabled: element?.matches(':disabled') ?? false,
    };
  });
}

function checkInlineChildren(node) {
  return node.querySelectorAll(
    'a,button,div,p,section,article,form,fieldset,ul,ol,li,h1,h2,h3,h4,h5,h6',
  ).length;
}

async function requireRichLabel(page, trigger, title, description) {
  const node = await trigger.elementHandle();
  try {
    await page.waitForFunction(
      ({ element, title, description }) =>
        element.textContent.includes(title) && element.textContent.includes(description),
      { element: node, title, description },
    );
  } finally {
    await node.dispose();
  }
}

export async function verifySelectCollection(page, example) {
  await revealExample(example);
  const trigger = example.getByRole('combobox', { name: '收藏夹', exact: true });
  const labels = [
    [journalTitle, '散步、天气和日常的小事。'],
    [readingTitle, '读过的文章与想留下的句子。'],
    ['Archive 已归档', '已归档，暂不接收新手记。'],
  ];
  let stage = 'initial rich label';
  let originalError;
  await trigger.waitFor();

  async function restoreJournal() {
    const controls = await openSelect(page, trigger);
    const popup = page.locator(`[id=${JSON.stringify(controls)}]`);
    await popup.getByRole('option', { name: new RegExp(`^${journalTitle}`) }).click();
    await requireRichLabel(page, trigger, ...labels[0]);
    await popup.waitFor({ state: 'hidden' });
    await requireFocus(page, trigger);
  }

  try {
    await requireRichLabel(page, trigger, ...labels[0]);
    assert.equal(await trigger.evaluate(checkInlineChildren), 0);

    stage = 'inline option names and descriptions';
    const controls = await openSelect(page, trigger);
    const popup = page.locator(`[id=${JSON.stringify(controls)}]`);
    assert.equal(await popup.getByRole('option').count(), 3);
    for (const [title, description] of labels) {
      const option = popup.getByRole('option', { name: new RegExp(`^${title}`) });
      assert((await option.innerText()).includes(description));
      const content = await option.evaluate((node) => {
        const title = [...node.querySelectorAll('span')].find(
          (span) =>
            span.childElementCount === 0 && /^(Journal|Reading|Archive) /.test(span.textContent),
        );
        const label = title?.parentElement;
        return {
          tag: label?.tagName,
          blocks: label?.querySelectorAll(
            'a,button,div,p,section,article,form,fieldset,ul,ol,li,h1,h2,h3,h4,h5,h6',
          ).length,
          actions: node.querySelectorAll('button,a').length,
        };
      });
      assert.deepEqual(content, { tag: 'SPAN', blocks: 0, actions: 0 });
    }

    stage = 'disabled option';
    const archived = popup.getByRole('option', { name: /^Archive 已归档/ });
    assert.equal(await archived.getAttribute('aria-disabled'), 'true');
    await archived.scrollIntoViewIfNeeded();
    await settle(page);
    const box = await archived.boundingBox();
    assert(box, 'The disabled option is visible for the pointer check.');
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await settle(page);
    await requireRichLabel(page, trigger, ...labels[0]);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    await closeSelect(page, trigger);

    stage = 'closed-state typeahead and selected label';
    await page
      .getByRole('option', { name: /^Reading 阅读摘记/, includeHidden: true })
      .waitFor({ state: 'attached' });
    await trigger.press('r');
    await requireRichLabel(page, trigger, ...labels[1]);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    assert.equal(await trigger.evaluate(checkInlineChildren), 0);
    await requireFocus(page, trigger);

    stage = 'pointer selection and close focus';
    await restoreJournal();
  } catch (error) {
    error.message = `SelectCollection [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      await closeSelect(page, trigger);
      // Restore through the real option UI; this focused example has no form workflow.
      if (!(await trigger.innerText()).includes(journalTitle)) await restoreJournal();
      await requireRichLabel(page, trigger, ...labels[0]);
    } catch (cleanupError) {
      if (!originalError) originalError = cleanupError;
      else originalError.message += `\nCleanup also failed: ${cleanupError}`;
    }
  }
  if (originalError) throw originalError;
  return { richLabels: 3, disabledOption: true, closedTypeahead: true, restoredToJournal: true };
}

export async function verifySelectAvailability(page, example) {
  await revealExample(example);
  const trigger = example.getByRole('combobox', { name: '可用收藏夹', exact: true });
  const restore = example.getByRole('button', { name: '恢复选项', exact: true });
  const remove = example.getByRole('button', { name: '移除选中项', exact: true });
  const status = example.getByRole('status');
  const observations = { removals: [], restoredInitialState: false };
  let stage = 'initial';
  let originalError;
  await trigger.waitFor();

  async function requireAvailableValue(value, disabled = false) {
    const field = example.locator('input[name="collection"]');
    await field.waitFor({ state: 'attached' });
    const node = await field.elementHandle();
    try {
      // This example has no form: inspect its real control and visible label without
      // inventing a form association or weakening other examples' FormData assertions.
      await page.waitForFunction(
        ({ element, expected, disabled }) =>
          element.form === null && element.value === expected && element.disabled === disabled,
        { element: node, expected: value ?? '', disabled },
      );
    } finally {
      await node.dispose();
    }
    const text = new Map([
      [null, '暂无可用收藏夹'],
      ['', '请选择收藏夹'],
      ['reading', readingTitle],
      ['journal', journalTitle],
    ]).get(value);
    assert.notEqual(text, undefined, 'Availability expects a known option or empty state.');
    await requireText(page, trigger, text);
  }

  async function restoreWithKeyboard() {
    await restore.focus();
    await restore.press('Enter');
    await requireDisabled(page, trigger, false);
    await requireAvailableValue('');
    await requireText(page, status, restoredMessage);
    await requireFocus(page, restore);
    assert.equal(await trigger.innerText(), '请选择收藏夹');
    assert.equal(await remove.isDisabled(), true);
  }

  async function recordRemovalFocus(entry) {
    await settle(page);
    const afterRemoval = await focusSnapshot(page);
    await page.keyboard.press('Tab');
    await settle(page);
    const afterTab = await focusSnapshot(page);
    await page.keyboard.press('Shift+Tab');
    await settle(page);
    const afterShiftTab = await focusSnapshot(page);
    observations.removals.push({ entry, afterRemoval, afterTab, afterShiftTab });
  }

  async function requireRemovedReading() {
    await requireAvailableValue('');
    await requireText(page, status, `已移除「${readingTitle}」，请重新选择。`);
    await requireDisabled(page, trigger, false);
    assert.equal(await trigger.innerText(), '请选择收藏夹');
    assert.equal(await remove.isDisabled(), true);
    assert(!(await trigger.innerText()).includes('reading'));
  }

  try {
    assert.equal(await status.count(), 1, 'Availability has one result announcement.');
    assert.equal(
      await example.locator('form').count(),
      0,
      'Dynamic options use a layout container.',
    );
    assert.equal(await trigger.isDisabled(), true, 'The initial option list is genuinely empty.');
    assert.equal(await trigger.innerText(), '暂无可用收藏夹');
    await requireAvailableValue(null, true);
    await requireText(page, status, '');
    assert.equal(await remove.isDisabled(), true);

    // Start from the untouched empty field, then use closed-state typeahead after recovery.
    // Selecting through real UI necessarily focuses the trigger; no hidden state is injected.
    stage = 'fresh recovery and closed-state typeahead';
    await restoreWithKeyboard();
    await trigger.focus();
    // Base UI force-mounts closed options after first focus. Await its actual option DOM.
    await page
      .getByRole('option', { name: readingTitle, exact: true, includeHidden: true })
      .waitFor({ state: 'attached' });
    await trigger.press('r');
    await requireAvailableValue('reading');
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    await requireText(page, status, '');
    await remove.click();
    await requireRemovedReading();
    await recordRemovalFocus('fresh empty → recover without focusing trigger → closed typeahead');

    stage = 'remove final collection';
    await choose(page, trigger, journalTitle, 'journal', requireAvailableValue);
    await requireText(page, status, '');
    await remove.click();
    await requireDisabled(page, trigger, true);
    await requireAvailableValue(null, true);
    await requireText(page, status, '已移除最后一个选项，可恢复示例选项后再选择。');
    assert.equal(await trigger.innerText(), '暂无可用收藏夹');
    assert.equal(await remove.isDisabled(), true);
    await recordRemovalFocus('removing the last available collection');

    stage = 'opened-popup selection and removal';
    await restoreWithKeyboard();
    await choose(page, trigger, readingTitle, 'reading', requireAvailableValue);
    await requireText(page, status, '');
    await remove.click();
    await requireRemovedReading();
    await recordRemovalFocus('recovered → opened popup → select Reading → remove');
    assert.equal(await status.count(), 1);
  } catch (error) {
    error.message = `SelectAvailability [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      await closeSelect(page, trigger);
      // Exercise removal through the real controls before remounting the document.
      let removedDuringCleanup = false;
      for (let count = 0; count < 3 && !(await trigger.isDisabled()); count += 1) {
        const controls = await openSelect(page, trigger);
        await page.getByRole('option').first().click();
        await page.locator(`[id=${JSON.stringify(controls)}]`).waitFor({ state: 'hidden' });
        await remove.click();
        removedDuringCleanup = true;
        await settle(page);
      }
      await requireDisabled(page, trigger, true);
      await requireAvailableValue(null, true);
      if (removedDuringCleanup)
        await requireText(page, status, '已移除最后一个选项，可恢复示例选项后再选择。');
      // The layout example deliberately has no reset action. Reloading creates its
      // original empty option state and clears the removal feedback via a real remount.
      await page.reload();
      await revealExample(example);
      await trigger.waitFor();
      await requireAvailableValue(null, true);
      await requireText(page, status, '');
      assert.equal(await trigger.innerText(), '暂无可用收藏夹');
      assert.equal(await remove.isDisabled(), true);
      observations.restoredInitialState = true;
    } catch (cleanupError) {
      if (!originalError) originalError = cleanupError;
      else originalError.message += `\nCleanup also failed: ${cleanupError}`;
    }
  }
  if (originalError) throw originalError;
  return observations;
}
