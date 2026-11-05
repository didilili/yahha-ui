import assert from 'node:assert/strict';
import { revealExample } from './reveal-example.mjs';

async function requireFocus(page, locator) {
  const node = await locator.elementHandle();
  try {
    await page.waitForFunction((element) => document.activeElement === element, node);
  } finally {
    await node.dispose();
  }
}

/** Hide and recover a persistent reading note without losing the article or its focus context. */
export async function verifyAlertReadingNotice(
  page,
  scope = page.locator('#alert-reading-notice .example-preview'),
) {
  await revealExample(scope);
  const article = scope.getByRole('article', { name: '那天沿着河岸，慢慢走回家', exact: true });
  const toggle = scope.getByRole('button', { name: '阅读提醒', exact: true });
  const note = scope.locator('[role="note"]');
  const hide = note.getByRole('button', { name: '隐藏阅读提醒', exact: true, includeHidden: true });
  const paragraphs = article.locator(':scope > p');
  await toggle.waitFor();
  const originalArticle = await article.elementHandle();
  const originalToggle = await toggle.elementHandle();
  const originalNote = await note.elementHandle();
  const originalParagraphs = await paragraphs.elementHandles();
  const originalText = await article.textContent();
  const originalBody = await paragraphs.allTextContents();
  const states = [];
  let stage = 'initial';
  let originalError, cleanupError, outside, pointerTrace, result;

  async function requireState(visible) {
    await page.waitForFunction(
      ({ button, notice, expected }) =>
        button.getAttribute('aria-expanded') === String(expected) && notice.hidden === !expected,
      { button: originalToggle, notice: originalNote, expected: visible },
    );
    assert.equal(await toggle.getAttribute('aria-controls'), await note.getAttribute('id'));
    assert.equal(await note.getAttribute('aria-labelledby'), await toggle.getAttribute('id'));
    assert.equal(await note.isVisible(), visible);
    assert.equal(await scope.getByRole('note').count(), visible ? 1 : 0);
    assert.equal(
      await scope.getByRole('button', { name: '隐藏阅读提醒', exact: true }).count(),
      visible ? 1 : 0,
    );
    assert.equal(await note.count(), 1, 'Native hidden keeps the original note mounted.');
    for (const [locator, original] of [
      [article, originalArticle],
      [toggle, originalToggle],
      [note, originalNote],
    ])
      assert.equal(await locator.evaluate((node, old) => node === old, original), true);
    assert.equal(await article.textContent(), originalText);
    assert.deepEqual(await paragraphs.allTextContents(), originalBody);
    for (let index = 0; index < originalParagraphs.length; index++)
      assert.equal(
        await paragraphs
          .nth(index)
          .evaluate((node, old) => node === old, originalParagraphs[index]),
        true,
      );
    assert.equal(await article.locator('time').getAttribute('datetime'), '2022-04-16');
    assert.equal(await scope.locator('input, textarea, select').count(), 0);
    assert.equal(await scope.locator('[aria-live], [role="status"], [role="alert"]').count(), 0);
    const geometry = await article.evaluate((node) => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
      client: node.clientWidth,
      scroll: node.scrollWidth,
    }));
    assert(geometry.document <= geometry.viewport + 1 && geometry.scroll <= geometry.client + 1);
    states.push({ stage, visible, ...geometry });
  }

  try {
    await requireState(true);
    assert.equal(originalBody.length, 2);
    assert.equal(await note.getByText('读旧手记前，先看一眼', { exact: true }).count(), 1);
    const targets = [];
    for (const button of [toggle, hide]) {
      assert.equal(await button.evaluate((node) => node.tagName), 'BUTTON');
      const box = await button.boundingBox();
      assert(box.width >= 43.99 && box.height >= 43.99);
      targets.push({ text: await button.textContent(), width: box.width, height: box.height });
    }

    stage = 'keyboard hide returns to the stable external button';
    await hide.focus();
    await hide.press('Enter');
    await requireState(false);
    await requireFocus(page, toggle);
    await page.keyboard.press('Tab');
    const hiddenTabTarget = await page.evaluate(() => ({
      tag: document.activeElement.tagName,
      text: document.activeElement.textContent?.slice(0, 60),
      insideHidden: document.activeElement.closest('[hidden]') !== null,
    }));
    assert.equal(hiddenTabTarget.insideHidden, false);

    stage = 'external keyboard recovery retains focus';
    await toggle.focus();
    await toggle.press('Space');
    await requireState(true);
    await requireFocus(page, toggle);
    await toggle.press('Enter');
    await requireState(false);
    await requireFocus(page, toggle);
    await toggle.press('Space');
    await requireState(true);
    await requireFocus(page, toggle);

    stage = 'external-focus negative control with native DOM click, not physical pointer input';
    outside = await page.evaluateHandle(() => {
      const button = document.createElement('button');
      button.textContent = 'Temporary external focus probe';
      document.body.append(button);
      button.focus();
      return button;
    });
    for (const button of [toggle, hide]) {
      await button.evaluate((node) => node.click());
      await requireState(false);
      assert.equal(await outside.evaluate((node) => document.activeElement === node), true);
      await toggle.evaluate((node) => node.click());
      await requireState(true);
      assert.equal(await outside.evaluate((node) => document.activeElement === node), true);
    }
    await outside.evaluate((node) => node.remove());
    await outside.dispose();
    outside = null;

    stage = 'physical pointer hide follows the browser focus policy';
    await toggle.focus();
    pointerTrace = await hide.evaluateHandle((node) => {
      const trace = {};
      node.addEventListener(
        'click',
        () => {
          trace.active = document.activeElement;
          trace.focusWasInside = node.closest('[role="note"]').contains(document.activeElement);
        },
        { capture: true, once: true },
      );
      return trace;
    });
    await hide.click();
    await requireState(false);
    const pointer = await pointerTrace.evaluate((trace) => ({
      focusWasInside: trace.focusWasInside,
      activeAtClick: trace.active?.tagName,
      activeAfter: document.activeElement.tagName,
      externalFocusPreserved: document.activeElement === trace.active,
    }));
    if (pointer.focusWasInside) await requireFocus(page, toggle);
    else assert.equal(pointer.externalFocusPreserved, true);
    await toggle.click();
    await requireState(true);
    result = {
      states,
      targets,
      hiddenTabTarget,
      pointer,
      nativeDomNegativeControl:
        'Temporary external button plus native .click(); not physical input.',
      sameArticleAndNote: true,
      liveRegions: 0,
      speechCertification: false,
    };
  } catch (error) {
    originalError = error;
  } finally {
    try {
      if ((await toggle.getAttribute('aria-expanded')) === 'false') await toggle.click();
      await requireState(true);
    } catch (error) {
      cleanupError = error;
    }
    if (outside) {
      await outside.evaluate((node) => node.remove());
      await outside.dispose();
    }
    if (pointerTrace) await pointerTrace.dispose();
    for (const handle of [originalArticle, originalToggle, originalNote, ...originalParagraphs])
      await handle.dispose();
  }
  if (originalError) {
    originalError.message = `[Alert reading notice: ${stage}] ${originalError.message}`;
    if (cleanupError) originalError.message += `; cleanup: ${cleanupError.message}`;
    throw originalError;
  }
  if (cleanupError) throw cleanupError;
  return result;
}
