import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

const writeLabel = '写一张明信片';
const previewLabel = '预览明信片';
const emptyMessage = '还没有写下明信片内容。';

async function requireFocus(page, locator) {
  const element = await locator.elementHandle();
  try {
    await page.waitForFunction((node) => document.activeElement === node, element);
  } finally {
    await element.dispose();
  }
}

async function requireText(page, locator, text) {
  const element = await locator.elementHandle();
  try {
    await page.waitForFunction(({ node, expected }) => node.textContent === expected, {
      node: element,
      expected: text,
    });
  } finally {
    await element.dispose();
  }
}

async function settle(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function focusedNode(page) {
  return page.evaluate(() => {
    const node = document.activeElement;
    return {
      tag: node.tagName,
      role: node.getAttribute('role'),
      label: node.getAttribute('aria-label'),
      text: node.textContent?.trim().slice(0, 80),
    };
  });
}

/** Edit and preview the same native draft, retaining the manual Tabs activation contract. */
export async function verifyTabsPostcard(page, example) {
  await revealExample(example);
  const list = example.getByRole('tablist', { name: '明信片编辑与预览', exact: true });
  const write = list.getByRole('tab', { name: writeLabel, exact: true });
  const previewTab = list.getByRole('tab', { name: previewLabel, exact: true });
  const writePanel = example.getByRole('tabpanel', { name: writeLabel, includeHidden: true });
  const previewPanel = example.getByRole('tabpanel', { name: previewLabel, includeHidden: true });
  // getByLabel also retains access to the mounted input while its panel is hidden/inert.
  const input = example.getByLabel('明信片草稿', { exact: true });
  const back = example.getByRole('button', { name: '回到明信片', exact: true });
  const article = example.getByRole('article', { name: '明信片预览', includeHidden: true });
  const status = example.getByRole('status');
  const snapshots = [];
  const tabTargets = [];
  let stage = 'initial';
  let originalError, result;
  await input.waitFor();
  const originalInput = await input.elementHandle();

  async function requireState(selected, raw, previewText = raw) {
    const current = selected === 'write' ? write : previewTab;
    const other = selected === 'write' ? previewTab : write;
    const currentPanel = selected === 'write' ? writePanel : previewPanel;
    const otherPanel = selected === 'write' ? previewPanel : writePanel;
    const node = await current.elementHandle();
    try {
      await page.waitForFunction(
        (element) => element.getAttribute('aria-selected') === 'true',
        node,
      );
    } finally {
      await node.dispose();
    }
    await currentPanel.waitFor({ state: 'visible' });
    await otherPanel.waitFor({ state: 'hidden' });
    assert.equal(await other.getAttribute('aria-selected'), 'false');
    assert.equal(await example.getByRole('tabpanel', { includeHidden: true }).count(), 2);
    assert.equal(await input.evaluate((element, old) => element === old, originalInput), true);
    assert.equal(await input.inputValue(), raw);
    assert.equal(await input.isVisible(), selected === 'write');
    assert.equal(await input.isDisabled(), false, 'Keeping a field hidden does not disable it.');
    assert.equal(await status.count(), 1);
    await requireText(
      page,
      status,
      `当前栏目：${selected === 'write' ? writeLabel : previewLabel}`,
    );
    assert.equal(await example.locator('[aria-live]').count(), 0);
    assert.equal(await example.getByRole('alert').count(), 0);
    assert.equal(
      await article.evaluate((element) =>
        element.closest('[role="status"], [role="alert"], [aria-live]'),
      ),
      null,
    );
    for (const [tab, panel] of [
      [write, writePanel],
      [previewTab, previewPanel],
    ]) {
      assert.equal(await tab.getAttribute('aria-controls'), await panel.getAttribute('id'));
      assert.equal(await panel.getAttribute('aria-labelledby'), await tab.getAttribute('id'));
    }
    if (selected === 'about') {
      await article.waitFor({ state: 'visible' });
      assert.equal(
        await article.getByRole('heading', { name: '写给朋友的明信片', exact: true }).count(),
        1,
      );
      assert.equal(await article.locator('p').count(), 1);
      await requireText(
        page,
        article.locator('p'),
        previewText === '' ? emptyMessage : previewText,
      );
      assert.equal(
        await article.getByText(emptyMessage, { exact: true }).count(),
        previewText === '' ? 1 : 0,
      );
      assert.equal(
        await article.locator('img, script, strong, a, button, input, textarea').count(),
        0,
      );
      assert.equal(await article.getByRole('status').count(), 0);
    }
    snapshots.push({ stage, selected, raw, preview: selected === 'about' ? previewText : null });
  }

  async function activatePreview(raw, key = 'Enter') {
    await previewTab.focus();
    await previewTab.press(key);
    await requireState('about', raw);
    await requireFocus(page, previewTab);
  }

  async function returnToDraft(raw, key = 'Enter') {
    await back.focus();
    await back.press(key);
    await requireState('write', raw);
    await requireFocus(page, input);
  }

  try {
    await list.waitFor();
    assert.equal(await list.getByRole('tab').count(), 2);
    assert(['horizontal', null].includes(await list.getAttribute('aria-orientation')));
    await requireState('write', '');

    stage = 'default arrows and Home/End move focus without activating';
    await write.focus();
    await write.press('ArrowRight');
    await requireFocus(page, previewTab);
    await requireState('write', '');
    await previewTab.press('Home');
    await requireFocus(page, write);
    await requireState('write', '');
    await write.press('End');
    await requireFocus(page, previewTab);
    await requireState('write', '');
    await previewTab.press('Enter');
    await requireState('about', '');
    await requireFocus(page, previewTab);

    stage = 'Tab enters the active panel and skips the hidden retained input';
    await previewTab.press('Tab');
    tabTargets.push({ from: previewLabel, target: await focusedNode(page) });
    await requireFocus(page, previewPanel);
    assert.equal(await input.evaluate((element) => document.activeElement === element), false);
    await previewPanel.press('Shift+Tab');
    await requireFocus(page, previewTab);
    await previewTab.press('ArrowLeft');
    await requireFocus(page, write);
    await requireState('about', '');
    await write.press('Space');
    await requireState('write', '');
    await requireFocus(page, write);
    await write.press('Tab');
    tabTargets.push({ from: writeLabel, target: await focusedNode(page) });
    await requireFocus(page, writePanel);
    await writePanel.press('Tab');
    await requireFocus(page, input);

    stage = 'raw Chinese draft with surrounding spaces is the real preview';
    const raw = '  河边的小花开了，想把这件小事写给你。  ';
    await input.fill(raw);
    const selection = await input.evaluate((element) => ({
      start: element.selectionStart,
      end: element.selectionEnd,
    }));
    await previewTab.click();
    await requireState('about', raw);
    // Native pointer activation does not guarantee button focus in WebKit.
    assert.equal(await input.evaluate((element) => document.activeElement === element), false);
    await returnToDraft(raw);
    assert.deepEqual(
      await input.evaluate((element) => ({
        start: element.selectionStart,
        end: element.selectionEnd,
      })),
      selection,
    );

    stage = 'editing then entering preview again replaces the old preview';
    const edited = '这次绕到书店门口，再一起去窗边读一会儿书。';
    await input.fill(edited);
    await activatePreview(edited, 'Space');
    await returnToDraft(edited, 'Space');

    stage = 'whitespace remains raw content rather than a fabricated validation error';
    await input.fill('   ');
    await activatePreview('   ');
    await returnToDraft('   ');

    stage = 'HTML-like draft is literal text';
    const literal = '<img src="missing-postcard.png"> <strong>周末见</strong> & "原文"';
    await input.fill(literal);
    await activatePreview(literal);
    await returnToDraft(literal);

    stage = 'long Chinese and unbroken English preview wrap';
    const long =
      '沿着河边慢慢走，把小花、晚霞和朋友的话记在明信片上。'.repeat(8) +
      'APostcardWithAVeryLongUnbrokenSentenceForASlowWeekend'.repeat(8);
    await input.fill(long);
    await activatePreview(long);
    await settle(page);
    const geometry = await article.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const paragraph = element.querySelector('p');
      return {
        viewportWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        left: box.left,
        right: box.right,
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        textClientWidth: paragraph.clientWidth,
        textScrollWidth: paragraph.scrollWidth,
      };
    });
    assert(geometry.documentWidth <= geometry.viewportWidth + 1);
    assert(geometry.left >= -1 && geometry.right <= geometry.viewportWidth + 1);
    assert(geometry.scrollWidth <= geometry.clientWidth + 1);
    assert(geometry.textScrollWidth <= geometry.textClientWidth + 1);

    stage = 'a later preview selection cancels pending Back focus';
    const elements = await Promise.all([
      back.elementHandle(),
      write.elementHandle(),
      previewTab.elementHandle(),
    ]);
    let rapidActivation;
    try {
      rapidActivation = await page.evaluate(
        ({ button, writeTab, previewButton }) =>
          new Promise((resolve, reject) => {
            // Same-frame native DOM activation probes the pending-rAF ordering deterministically;
            // it is not physical pointer/keyboard timing or a React-internal state mutation.
            const timeout = setTimeout(() => {
              observer.disconnect();
              reject(
                new Error('Back did not commit the edit tab before the rapid preview action.'),
              );
            }, 3000);
            const observer = new MutationObserver(() => {
              if (writeTab.getAttribute('aria-selected') !== 'true') return;
              observer.disconnect();
              clearTimeout(timeout);
              previewButton.focus();
              previewButton.click();
              resolve({ editTabCommittedBeforePreview: true });
            });
            observer.observe(writeTab, { attributes: true, attributeFilter: ['aria-selected'] });
            button.focus();
            button.click();
          }),
        { button: elements[0], writeTab: elements[1], previewButton: elements[2] },
      );
    } finally {
      await Promise.all(elements.map((element) => element.dispose()));
    }
    await requireState('about', long);
    await settle(page);
    await requireFocus(page, previewTab);
    assert.equal(await input.evaluate((element) => document.activeElement === element), false);

    stage = 'clearing the actual draft produces the empty preview again';
    await returnToDraft(long);
    await input.fill('');
    await activatePreview('');
    result = { snapshots, tabTargets, geometry, rapidActivation };
  } catch (error) {
    error.message = `TabsPostcard [${stage}]: ${error.message}`;
    originalError = error;
  } finally {
    try {
      stage = 'cleanup';
      await back.focus();
      await back.press('Enter');
      await requireFocus(page, input);
      await input.fill('');
      await requireState('write', '');
    } catch (error) {
      if (!originalError) originalError = error;
      else originalError.message += `\nCleanup also failed: ${error}`;
    } finally {
      await originalInput.dispose();
    }
  }
  if (originalError) throw originalError;
  return result;
}
