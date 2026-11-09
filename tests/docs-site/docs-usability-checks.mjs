import assert from 'node:assert/strict';
import { closeSearchDialog, searchDialog, searchField } from './search-dialog-helpers.mjs';

const sourceToggle = (page) =>
  page.getByRole('button', { name: /^(展开|收起)全部代码$/, exact: true });

async function focused(page, locator) {
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await locator.elementHandle(),
  );
}

async function nextPaint(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

export async function verifySearchShortcut(page, baseURL) {
  const results = [];
  for (const path of ['#/components/input?section=examples', '#/']) {
    await page.goto(`${baseURL}${path}`);
    const heading = page.locator('main h1');
    await heading.waitFor();
    for (const modifier of ['Control', 'Meta']) {
      await page.keyboard.press(`${modifier}+k`);
      await searchDialog(page).waitFor();
      await focused(page, searchField(page));
      const text = `保留搜索词 ${modifier}`;
      await searchField(page).fill(text);
      await closeSearchDialog(page);
      await heading.focus();
      await page.keyboard.press(`${modifier}+k`);
      await focused(page, searchField(page));
      assert.deepEqual(
        await searchField(page).evaluate((node) => [
          node.value,
          node.selectionStart,
          node.selectionEnd,
        ]),
        [text, 0, text.length],
        `${path}: ${modifier}+K selects the existing search text.`,
      );
      await closeSearchDialog(page);
    }
    if (path !== '#/') {
      for (const flags of [{ isComposing: true }, { repeat: true }]) {
        await heading.focus();
        await focused(page, heading);
        await page.evaluate(
          (flags) =>
            window.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'k',
                code: 'KeyK',
                ctrlKey: true,
                bubbles: true,
                cancelable: true,
                ...flags,
              }),
            ),
          flags,
        );
        await nextPaint(page);
        assert.equal(
          await heading.evaluate((node) => node === document.activeElement),
          true,
          'IME composition and repeat keydown do not reopen or refocus search.',
        );
        assert.equal(
          await page.getByRole('button', { name: '关闭文档目录', exact: true }).isVisible(),
          false,
        );
        assert.equal(await searchDialog(page).isVisible(), false);
      }
    }
    results.push({
      path,
      width: page.viewportSize().width,
      bothModifiers: true,
      existingTextSelected: true,
    });
  }
  if (page.viewportSize().width !== 320) {
    await page.goto(`${baseURL}#/components/dialog?section=basic`);
    await page.getByRole('heading', { level: 1, name: 'Dialog 弹窗', exact: true }).waitFor();
    const trigger = page
      .locator('#basic')
      .getByRole('button', { name: '查看阅读提示', exact: true });
    await trigger.focus();
    await trigger.press('Enter');
    const dialog = page.getByRole('dialog', { name: '长文阅读建议', exact: true });
    const close = dialog.getByRole('button', { name: '关闭弹窗', exact: true });
    await focused(page, close);
    for (const modifier of ['Control', 'Meta']) {
      await page.keyboard.press(`${modifier}+k`);
      await nextPaint(page);
      assert.equal(
        await close.evaluate((node) => node === document.activeElement),
        true,
        'A global search shortcut cannot move focus outside an active Dialog.',
      );
      assert.equal(await dialog.isVisible(), true);
      assert.equal(await searchDialog(page).isVisible(), false);
    }
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await focused(page, trigger);
    results.push({ width: page.viewportSize().width, activeDialogShortcutIgnored: true });
  }
  return results;
}

export async function verifyBackToTop(page, baseURL) {
  const results = [];
  for (const reducedMotion of ['no-preference', 'reduce']) {
    await page.emulateMedia({ reducedMotion });
    await page.goto(`${baseURL}#/components/input?section=examples`);
    const heading = page.getByRole('heading', {
      level: 1,
      name: 'Input 输入框',
      exact: true,
    });
    await heading.waitFor();
    await page.locator('#basic .example-preview input').waitFor();
    await nextPaint(page);
    await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
    const top = page.getByRole('button', { name: '返回顶部', exact: true });
    await top.waitFor();
    const hash = new URL(page.url()).hash;
    await top.focus();
    await top.press('Enter');
    if (reducedMotion === 'reduce') {
      const firstFrameY = await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => resolve(scrollY))),
      );
      assert.equal(firstFrameY, 0, 'Reduced motion returns to the top without an animated scroll.');
    }
    await page.waitForFunction(() => scrollY === 0);
    await focused(page, heading);
    await top.waitFor({ state: 'hidden' });
    assert.equal(
      new URL(page.url()).hash,
      hash,
      'Returning to the top preserves the current section URL.',
    );
    await nextPaint(page);
    assert.equal(
      await heading.evaluate((node) => node === document.activeElement),
      true,
      'Removing the top control does not leave focus on an unmounted button.',
    );
    results.push({
      width: page.viewportSize().width,
      reducedMotion,
      scrollY: 0,
      headingFocused: true,
      hashRetained: true,
    });
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  const top = page.getByRole('button', { name: '返回顶部', exact: true });
  const heading = page.getByRole('heading', { level: 1, name: 'Input 输入框', exact: true });
  await top.waitFor();
  await top.focus();
  const hash = new URL(page.url()).hash;
  await page.keyboard.press('PageUp');
  await page.waitForFunction(() => scrollY < 600);
  await top.waitFor({ state: 'hidden' });
  await focused(page, heading);
  assert(
    (await page.evaluate(() => scrollY)) > 0,
    'Hiding a focused top control preserves the user’s PageUp position.',
  );
  assert.equal(new URL(page.url()).hash, hash);
  results.push({
    width: page.viewportSize().width,
    focusedButtonPageUp: true,
    headingFocusRetained: true,
  });
  return results;
}

async function sourceStates(page, expected) {
  await page.waitForFunction((expected) => {
    const controls = [...document.querySelectorAll('.component-source button[aria-expanded]')];
    const values = Array.isArray(expected) ? expected : controls.map(() => expected);
    return (
      controls.length > 1 &&
      controls.length === values.length &&
      controls.every(
        (control, index) => control.getAttribute('aria-expanded') === String(values[index]),
      )
    );
  }, expected);
  const values = Array.isArray(expected) ? expected : [expected];
  await page
    .getByRole('button', {
      name: values.every(Boolean) ? '收起全部代码' : '展开全部代码',
      exact: true,
    })
    .waitFor();
}

export async function verifyGuideSourceControls(
  page,
  baseURL,
  guideIds = ['interactions', 'states', 'artwork', 'design-baseline'],
) {
  const titles = {
    interactions: '交互组合',
    states: '组合示例',
    artwork: '图标与插画',
    'design-baseline': '设计规范',
  };
  const results = [];
  for (const id of guideIds) {
    await page.goto(`${baseURL}#/guides/${id}`);
    await page.getByRole('heading', { level: 1, name: titles[id], exact: true }).waitFor();
    await page.locator('.component-source').first().waitFor({ state: 'attached' });
    assert.equal(await sourceToggle(page).count(), 1, `${id}: one page-wide source control.`);
    await sourceStates(page, false);
    const count = await page.locator('.component-source').count();
    const setups = await page
      .locator('.example-setup')
      .evaluateAll((nodes) => nodes.map((node) => node.open));
    const firstExample = page.locator('.example-block').first();
    const firstId = await firstExample.getAttribute('id');
    assert.equal(
      await sourceToggle(page).evaluate(
        (node) =>
          node.closest('.doc-section') ===
          document.querySelector('.component-source').closest('.doc-section'),
      ),
      true,
      'The guide control belongs to the first section containing examples.',
    );
    // The design guide may keep its example groups folded until code is requested.
    await sourceToggle(page).click();
    await sourceStates(page, true);
    for (const pre of await page.locator('.component-source pre').all())
      assert.equal(await pre.isVisible(), true, `${id}: expanding makes the source visible.`);
    assert.deepEqual(
      await page.locator('.example-setup').evaluateAll((nodes) => nodes.map((node) => node.open)),
      setups,
    );
    await page.goto(`${baseURL}#/guides/${id}?section=${firstId}`);
    await sourceStates(page, true);
    await page
      .locator('.component-source')
      .first()
      .getByRole('button', { name: '收起代码', exact: true })
      .click();
    await sourceStates(page, [false, ...Array(count - 1).fill(true)]);
    await sourceToggle(page).click();
    await sourceStates(page, true);
    await sourceToggle(page).click();
    await sourceStates(page, false);
    assert.deepEqual(
      await page.locator('.example-setup').evaluateAll((nodes) => nodes.map((node) => node.open)),
      setups,
    );
    await sourceToggle(page).click();
    await sourceStates(page, true);
    // Leave this page expanded so the following guide must prove a clean initial state.
    results.push({
      id,
      width: page.viewportSize().width,
      sources: count,
      allVisible: true,
      setupIndependent: true,
      anchorRetained: true,
      individualSynchronized: true,
    });
  }
  await page.goto(`${baseURL}#/components/input`);
  await page.getByRole('heading', { level: 1, name: 'Input 输入框', exact: true }).waitFor();
  await sourceStates(page, false);
  return results;
}

function finalFocusRow(page) {
  return page
    .getByRole('row')
    .filter({ has: page.getByRole('rowheader', { name: 'finalFocus', exact: true }) });
}

async function requireApiRow(page) {
  const row = finalFocusRow(page);
  await row.waitFor();
  await focused(page, row);
  const geometry = await row.evaluate((node) => ({
    tag: node.tagName,
    top: node.getBoundingClientRect().top,
    bottom: node.getBoundingClientRect().bottom,
    headerBottom: document.querySelector('.docs-header').getBoundingClientRect().bottom,
    height: innerHeight,
    scrollLeft: node.closest('.table-scroll').scrollLeft,
  }));
  assert.equal(geometry.tag, 'TR');
  assert(
    geometry.top >= geometry.headerBottom - 1 && geometry.bottom <= geometry.height + 1,
    'The matched API row is visible below the sticky header.',
  );
  assert.equal(geometry.scrollLeft, 0, 'API result navigation resets horizontal table scrolling.');
  return geometry;
}

export async function verifyApiSearchPosition(page, baseURL) {
  await page.goto(`${baseURL}#/components/dialog?section=api`);
  await page.getByRole('heading', { level: 1, name: 'Dialog 弹窗', exact: true }).waitFor();
  await page.waitForFunction(() => document.activeElement?.id === 'api');
  const table = page.getByRole('region', { name: 'DialogProps API 表格', exact: true });
  await table.evaluate((node) => {
    node.scrollLeft = node.scrollWidth;
  });
  assert(
    (await table.evaluate((node) => node.scrollLeft)) > 0,
    'The narrow API fixture starts horizontally scrolled.',
  );
  await page.keyboard.press('Control+k');
  await focused(page, searchField(page));
  await searchField(page).fill('Dialog finalFocus');
  const result = page
    .getByRole('dialog', { name: '搜索文档', exact: true })
    .locator('.doc-search-results')
    .getByRole('link', { name: 'Dialog 弹窗 · API · DialogProps · finalFocus', exact: true });
  await result.waitFor();
  const destination = new URL(await result.getAttribute('href'), page.url()).href;
  await result.click();
  await searchDialog(page).waitFor({ state: 'hidden' });
  const clicked = await requireApiRow(page);
  const reopened = await page.context().newPage();
  let direct;
  try {
    await reopened.setViewportSize(page.viewportSize());
    await reopened.goto(destination);
    await reopened.getByRole('heading', { level: 1, name: 'Dialog 弹窗', exact: true }).waitFor();
    direct = await requireApiRow(reopened);
  } finally {
    await reopened.close();
  }
  await page.goto(`${baseURL}#/components/dialog?section=api`);
  await page.waitForFunction(() => document.activeElement?.id === 'api');
  return {
    width: page.viewportSize().width,
    destination: new URL(destination).hash,
    clicked,
    direct,
    legacyApiHeadingRetained: true,
  };
}

/** Targeted documentation convenience checks; independent of the complete site acceptance suite. */
export async function verifyDocsUsability(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  const report = { search: [], backToTop: [], guides: [], api: null };
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    for (const width of [1440, 320, 390]) {
      await page.setViewportSize({ width, height: width < 1440 ? 844 : 900 });
      report.search.push(...(await verifySearchShortcut(page, baseURL)));
      report.backToTop.push(...(await verifyBackToTop(page, baseURL)));
      if (width === 1440) report.guides.push(...(await verifyGuideSourceControls(page, baseURL)));
      else {
        report.guides.push(
          ...(await verifyGuideSourceControls(page, baseURL, ['design-baseline'])),
        );
        if (width === 390) report.api = await verifyApiSearchPosition(page, baseURL);
      }
    }
    assert.deepEqual(errors, [], 'Documentation convenience controls have no runtime errors.');
    return report;
  } finally {
    await context.close();
  }
}
