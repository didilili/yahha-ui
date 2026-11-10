import { componentCatalog } from '../../playground/src/docs/component-catalog.ts';
import { verifyProgressExamples } from './progress-examples.mjs';
import assert from 'node:assert/strict';
import { verifyExampleAssets } from './example-setup-checks.mjs';
import {
  closeSearchDialog,
  openSearchDialog,
  searchField,
  visibleSearchEntry,
} from './search-dialog-helpers.mjs';
import { verifyDesignBaseline } from './design-checks.mjs';
import { verifyCoreComponents } from './core-components.mjs';
import { verifySelectionComponents } from './selection-components.mjs';
import { verifyTeachingExamples } from './example-teaching-checks.mjs';
import { verifyFeedbackFlow, verifyFeedbackExamples } from './feedback-components.mjs';
import { verifyBlogArchive, verifyNavigationExamples } from './navigation-components.mjs';
import {
  verifyResponsiveFocus,
  verifyTocResponsiveFocus,
  verifyRouteInteractionFocus,
} from './site-checks.mjs';
import {
  verifyDialogForm,
  verifyArticleActions,
  verifyOverlayExamples,
} from './overlay-components.mjs';
import { readFile } from 'node:fs/promises';
import {
  measureTextButton,
  verifyTextButtonLoading,
  verifyTextButtonRestored,
} from './loading-layout.mjs';

async function isFocused(locator) {
  return locator.evaluate((element) => element === document.activeElement);
}

async function requireFocus(locator, message) {
  await locator
    .page()
    .waitForFunction(
      (element) => element === document.activeElement,
      await locator.elementHandle(),
      { timeout: 3000 },
    );
  // Portal close and menu focus restoration both settle before the next paint.
  await locator
    .page()
    .evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
  assert.equal(await isFocused(locator), true, message);
}

async function minHeight(locator, height, description) {
  const box = await locator.boundingBox();
  assert.ok(box && box.height >= height - 0.1, `${description} must be at least ${height}px high.`);
}

async function verifyCodeControls(page) {
  const example = page.locator('.example-block').first();
  const sourceBlock = example.locator('.component-source');
  await sourceBlock.getByRole('button', { name: '展开代码', exact: true }).click();
  const code = sourceBlock.locator('pre');
  assert.equal(await code.isVisible(), true);
  await sourceBlock.getByRole('button', { name: '收起代码', exact: true }).click();
  assert.equal(await code.isVisible(), false);
  await sourceBlock.getByRole('button', { name: '展开代码', exact: true }).click();
  const source = await code.innerText();
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value) => {
          window.shellCopiedSource = value;
        },
      },
    }),
  );
  await sourceBlock.getByRole('button', { name: '复制代码', exact: true }).click();
  await sourceBlock.getByText('已复制', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.shellCopiedSource), source);
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('Clipboard access denied')) },
    }),
  );
  await sourceBlock.getByRole('button', { name: '复制代码', exact: true }).click();
  const fallback = sourceBlock.getByRole('textbox', { name: '手动复制代码', exact: true });
  await fallback.waitFor();
  await requireFocus(fallback, 'Manual copy must focus the real textarea.');
  assert.equal(await fallback.inputValue(), source);
  assert.deepEqual(
    await fallback.evaluate((element) => [element.selectionStart, element.selectionEnd]),
    [0, source.length],
    'The complete source must be selected after clipboard failure.',
  );
  assert.equal(await fallback.getAttribute('readonly'), '');
  const calloutBounds = await sourceBlock.locator('.copy-fallback').boundingBox();
  const textareaBounds = await fallback.boundingBox();
  assert.ok(
    calloutBounds && textareaBounds && textareaBounds.width >= calloutBounds.width - 100,
    `Manual-copy input must use the available callout width (${textareaBounds?.width}px inside ${calloutBounds?.width}px).`,
  );

  // Repeating a denied copy must restore focus/selection even when the mode stays manual.
  await fallback.press('ArrowLeft');
  await sourceBlock.getByRole('button', { name: '复制代码', exact: true }).click();
  await requireFocus(fallback, 'A repeated failed copy must return focus to the textarea.');
  assert.deepEqual(
    await fallback.evaluate((element) => [element.selectionStart, element.selectionEnd]),
    [0, source.length],
    'A repeated failed copy must select the complete source again.',
  );

  await sourceBlock.getByRole('button', { name: '收起代码', exact: true }).click();
  assert.equal(await code.isVisible(), false);
  await sourceBlock.getByRole('button', { name: '复制代码', exact: true }).click();
  await fallback.waitFor();
  assert.equal(await code.isVisible(), true, 'A failed copy must reveal the source again.');
  await requireFocus(fallback, 'A failed copy after collapse must focus the textarea again.');
  assert.deepEqual(
    await fallback.evaluate((element) => [element.selectionStart, element.selectionEnd]),
    [0, source.length],
    'A failed copy after collapse must select the complete source again.',
  );
}

async function verifySearchRecovery(page) {
  const sidebar = page.locator('.docs-sidebar');
  const directoryWasOpen = await sidebar.evaluate((node) => node.classList.contains('is-open'));
  const directoryLinks = sidebar.locator('.nav-group a');
  const originalLinks = await directoryLinks.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('href')),
  );
  const dialog = await openSearchDialog(page, await visibleSearchEntry(page, sidebar));
  const search = searchField(page);
  await search.fill('输入框');
  await dialog.getByRole('link', { name: 'Input 输入框', exact: true }).waitFor();
  assert.equal(await dialog.getByRole('link', { name: 'Button 按钮', exact: true }).count(), 0);
  await search.fill('分段单选');
  await dialog.getByRole('link', { name: 'SegmentedControl 分段选择', exact: true }).waitFor();
  assert.equal(
    await dialog.locator('a[href^="#/components/"]').count(),
    1,
    'The previous Chinese name remains a usable search alias.',
  );
  await dialog.getByRole('button', { name: '清空搜索', exact: true }).click();
  assert.equal(await search.inputValue(), '');
  await requireFocus(search, 'Clearing the search must restore input focus.');
  await search.fill('这条搜索没有任何组件');
  await dialog.getByText('没有匹配的文档，试试其他关键词。', { exact: true }).waitFor();
  await dialog.getByRole('button', { name: '清空搜索', exact: true }).click();
  assert.equal(await search.inputValue(), '');
  await requireFocus(search, 'Empty-result recovery must restore input focus.');
  assert.deepEqual(
    await directoryLinks.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href'))),
    originalLinks,
    'Searching and empty-result recovery do not replace the original directory.',
  );
  await closeSearchDialog(page);
  if (directoryWasOpen)
    await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
  await sidebar.getByRole('link', { name: 'Button 按钮', exact: true }).waitFor();
}

/** Focused navigation regression that can run independently of the full component suite. */
export async function verifyDocsNavigation(browser, baseURL) {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  try {
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${baseURL}#/components/button`);
      await page.locator('.example-block').first().waitFor();
      if (width < 800)
        await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
      await page.evaluate(() => document.fonts.ready);
      const sidebar = page.locator('.docs-sidebar');
      assert.deepEqual(
        await sidebar.locator('.nav-group > p').allTextContents(),
        ['组件', '通用', '排版', '布局', '表单', '内容展示', '导航', '浮层', '反馈', '主题配置'],
        'The directory keeps eight UI categories and a separate theme configuration group.',
      );
      const componentLinks = sidebar.locator('a[href^="#/components/"]');
      assert.equal(await componentLinks.count(), componentCatalog.length);
      assert.equal(
        new Set(
          await componentLinks.evaluateAll((links) =>
            links.map((link) => link.getAttribute('href')),
          ),
        ).size,
        componentCatalog.length,
        'Every document URL has exactly one directory entry.',
      );
      const geometry = await sidebar.locator('.nav-group a').evaluateAll((links) =>
        links.map((link) => {
          const bounds = link.getBoundingClientRect();
          const chinese = link.querySelector('.nav-chinese');
          const textBoxes = (element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            return [...range.getClientRects()].filter((box) => box.width > 0 && box.height > 0);
          };
          const chineseLines = chinese ? textBoxes(chinese) : [];
          const text = [...link.children].flatMap(textBoxes);
          return {
            label: link.textContent,
            height: bounds.height,
            chineseLines: chineseLines.length,
            chinese: chinese?.textContent,
            escaped: text.some(
              (box) =>
                box.left < bounds.left - 1 ||
                box.right > bounds.right + 1 ||
                box.top < bounds.top - 1 ||
                box.bottom > bounds.bottom + 1,
            ),
          };
        }),
      );
      assert.deepEqual(
        geometry.filter(({ height }) => height < 43.9),
        [],
        `All directory links retain at least a 44px target at ${width}px.`,
      );
      assert.deepEqual(
        geometry.filter(({ chinese, chineseLines }) => chinese && chineseLines !== 1),
        [],
        `Chinese subtitles move as complete phrases instead of wrapping individual characters at ${width}px.`,
      );
      assert.deepEqual(
        geometry.filter(({ escaped }) => escaped),
        [],
        `English names and Chinese subtitles stay inside their directory links at ${width}px.`,
      );
      await verifySearchRecovery(page);
      for (const { query, id, title } of [
        { query: '输入框', id: 'input', title: 'Input 输入框' },
        { query: '分段单选', id: 'segmented-control', title: 'SegmentedControl 分段选择' },
        { query: '主题配置', id: 'theme-provider', title: 'ThemeProvider 主题配置' },
      ]) {
        const menu = page.getByRole('button', { name: /^(打开|关闭)文档目录$/ });
        if (width < 800 && (await menu.getAttribute('aria-expanded')) === 'false')
          await menu.click();
        const dialog = await openSearchDialog(page, await visibleSearchEntry(page, sidebar));
        await searchField(page).fill(query);
        const link = dialog.getByRole('link', { name: title, exact: true });
        assert.equal(await link.getAttribute('href'), `#/components/${id}`);
        await link.click();
        await dialog.waitFor({ state: 'hidden' });
        const heading = page.getByRole('heading', { level: 1, name: title, exact: true });
        await heading.waitFor();
        await requireFocus(heading, 'Following a directory result focuses the new document title.');
        if (width < 800) assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      }
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `Directory navigation does not create page overflow at ${width}px.`,
      );
      console.log(
        `Browser: ${width}px categorized directory, 44px links, complete Chinese subtitles and legacy search aliases passed.`,
      );
    }
  } finally {
    await context.close();
  }
}

/** Exercise the actual documentation controls without depending on CSS Modules names. */
export async function verifyDocsShell(browser, baseURL) {
  await verifyDocsRouteIdentity(browser, baseURL);
  await verifyDocsIdentity(browser, baseURL);
  await verifyDocsNavigation(browser, baseURL);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(`${baseURL}#/components/button`);
    await page.locator('.example-block').first().waitFor();
    await verifyResponsiveFocus(page, baseURL);
    await verifyTocResponsiveFocus(page, baseURL);
    await verifyRouteInteractionFocus(page, baseURL);
    await verifySearchRecovery(page);
    await verifyCodeControls(page);
    await verifyThemePresets(page, baseURL);
    await verifySelectFocus(page, baseURL);
    await verifyReadingExample(page, baseURL);
    await verifyReadingMediaExamples(page, baseURL);
    await verifyStateScenes(page, baseURL);
    await verifyFeedbackFlow(page, baseURL);
    await verifyFeedbackExamples(page, baseURL);
    await verifyProgressExamples(page, baseURL);
    await verifyDialogForm(page, baseURL);
    await verifyOverlayExamples(page, baseURL);
    await verifyArticleActions(page, baseURL);
    await verifyBlogArchive(page, baseURL);
    await verifyNavigationExamples(page, baseURL);
    await verifyDesignBaseline(page, baseURL);
    await verifyCoreComponents(page, baseURL);
    await verifyTeachingExamples(page, baseURL);
    await verifySelectionComponents(page, baseURL);

    for (const width of [320, 390, 640, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${baseURL}#/components/button`);
      await page.reload();
      await page.locator('.example-block').first().waitFor();
      const menu = page.getByRole('button', { name: '打开文档目录', exact: true });
      const search = page
        .locator('.docs-sidebar')
        .getByRole('button', { name: '搜索文档', exact: true });
      await minHeight(menu, 44, `Directory control at ${width}px`);
      const header = await page.locator('.docs-header').evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          height: bounds.height,
          overflow: element.scrollWidth > element.clientWidth,
          escapedChildren: [...element.children]
            .filter((child) => {
              const box = child.getBoundingClientRect();
              if (box.width === 0 || box.height === 0) return false;
              return (
                box.left < -1 ||
                box.right > innerWidth + 1 ||
                box.top < bounds.top - 1 ||
                box.bottom > bounds.bottom + 1
              );
            })
            .map((child) => child.className),
        };
      });
      assert.ok(header.height <= 80, `The header must retain one compact row at ${width}px.`);
      assert.equal(header.overflow, false, `Header content overflows at ${width}px.`);
      assert.deepEqual(
        header.escapedChildren,
        [],
        `Header controls escape their row at ${width}px.`,
      );
      await menu.click();
      await requireFocus(search, `Directory opening must focus search at ${width}px.`);
      await verifySearchRecovery(page);
      const close = page.getByRole('button', { name: '关闭文档目录', exact: true });
      await search.focus();
      await page.keyboard.press('Shift+Tab');
      await requireFocus(close, 'Reverse Tab from search reaches the directory control.');
      await page.keyboard.press('Shift+Tab');
      await requireFocus(
        page.locator('.docs-sidebar').getByRole('link').last(),
        'Reverse Tab wraps inside the open directory.',
      );
      await page.keyboard.press('Tab');
      await requireFocus(close, 'Forward Tab wraps back to the directory control.');
      await page.keyboard.press('Escape');
      await requireFocus(menu, `Directory Escape must restore its trigger at ${width}px.`);
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('.docs-header').getByRole('combobox').count(), 0);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
      );
      await verifyCodeControls(page);
    }
    assert.deepEqual(errors, [], 'Documentation shell must not throw runtime errors.');
  } finally {
    await context.close();
  }
  await verifyDocsLoading(browser, baseURL);
}

/** Verify the loading and retry UI with a fresh document and a real failed module request. */
export async function verifyDocsLoading(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const isTabsModule = (url) =>
    /\/(?:src\/docs\/components\/tabs\.tsx|assets\/tabs-[^/]+\.js)$/.test(url.pathname);
  let releaseRequest;
  const held = new Promise((resolve) => {
    releaseRequest = resolve;
  });
  let intercepted = 0;
  await page.route(isTabsModule, async (route) => {
    intercepted += 1;
    if (intercepted === 1) {
      await held;
      await route.abort('failed');
    } else {
      await route.continue();
    }
  });
  try {
    const request = page.waitForRequest((request) => isTabsModule(new URL(request.url())));
    await page.goto(`${baseURL}#/components/tabs`, { waitUntil: 'domcontentloaded' });
    await request;
    const loading = page.getByRole('status').filter({ hasText: '正在加载组件文档' });
    await loading.waitFor();
    assert.equal(await page.locator('.example-block').count(), 0);
    releaseRequest();
    const failure = page.getByRole('alert').filter({ hasText: '组件文档加载失败' });
    await failure.waitFor();
    assert.equal(intercepted, 1, 'The test must fail the initial documentation module request.');
    await page.unroute(isTabsModule);
    await failure.getByRole('button', { name: '重新加载文档', exact: true }).click();
    await page.locator('#basic').getByRole('tablist', { name: '小站栏目', exact: true }).waitFor();
    await requireFocus(
      page.getByRole('heading', { level: 1, name: 'Tabs 标签页', exact: true }),
      'Retrying a failed document must restore a usable heading after the retry control unmounts.',
    );
    await page.locator('#basic').getByRole('tab', { name: '窗边相册', exact: true }).click();
    await page.locator('#basic').getByRole('tabpanel', { name: '窗边相册', exact: true }).waitFor();
    assert.equal(await loading.count(), 0);
    assert.equal(await failure.count(), 0);
    assert.equal(await page.title(), 'Tabs 标签页 · Yahha UI');
    const unexpected = errors.filter(
      (message) =>
        !(
          /Failed to fetch dynamically imported module/.test(message) &&
          /(?:tabs\.tsx|tabs-[^/]+\.js)/.test(message)
        ),
    );
    assert.deepEqual(
      unexpected,
      [],
      'Loading recovery must not cause unrelated runtime exceptions.',
    );
  } finally {
    releaseRequest();
    await context.close();
  }
}

/** Route identity remains correct when every page shares the same site treatment. */
export async function verifyDocsRouteIdentity(browser, baseURL) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  const routes = [
    ['/', /^把可爱，\s*搭进你的世界。$/, '#/'],
    ['/guides/introduction', '项目介绍', '#/guides/getting-started'],
    ['/guides/getting-started', '开始使用', '#/guides/getting-started'],
    ['/guides/recipes', '场景总览', '#/guides/recipes'],
    ['/guides/styling', '使用与定制', '#/guides/getting-started'],
    ['/guides/reading', '阅读与收藏', '#/guides/recipes'],
    ['/guides/design-baseline', '设计规范', '#/guides/design-baseline'],
    ['/guides/states', '组合示例', '#/guides/recipes'],
    ['/guides/interactions', '交互组合', '#/guides/recipes'],
    ['/guides/artwork', '图标与插画', '#/guides/design-baseline'],
    ['/components', '组件总览', '#/components'],
    ['/components/button', 'Button 按钮', '#/components'],
    ['/components/segmented-control', 'SegmentedControl 分段选择', '#/components'],
    ['/components/theme-provider', 'ThemeProvider 主题配置', '#/components'],
  ];
  try {
    for (const [path, title, currentHref] of routes) {
      await page.goto(`${baseURL}#${path}`);
      const heading = page.getByRole('heading', { level: 1, name: title, exact: true });
      await heading.waitFor();
      if (path.startsWith('/components/')) await page.locator('.doc-section').first().waitFor();
      if (path === '/components') await page.locator('.component-overview-page').waitFor();
      assert.deepEqual(
        await page
          .getByRole('navigation', { name: '快捷导航', exact: true })
          .locator('a[aria-current="page"]')
          .evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
        [currentHref],
        `${path}: exactly the matching top navigation entry is current.`,
      );
      assert.equal(await heading.count(), 1, `${path}: the title keeps its accessible name.`);
      assert.deepEqual(
        await heading
          .locator('span')
          .evaluateAll((spans) => spans.filter((span) => !span.textContent.trim()).length),
        0,
        `${path}: titles without a Chinese subtitle must not render an empty title fragment.`,
      );
    }
  } finally {
    await context.close();
  }
}

/** Keep the documentation identity fixed and the first usable example in the first viewport. */
export async function verifyDocsIdentity(browser, baseURL) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  try {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1280, height: 800 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`${baseURL}#/components/button`);
      await page.locator('.example-preview').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert.equal(
        await page.locator('.docs-header').getByRole('combobox').count(),
        0,
        'The documentation header must keep one fixed identity.',
      );
      assert.equal(await page.locator('.docs-app').getAttribute('data-yahha-theme'), 'pink');
      const importStrip = page.locator('.doc-heading > .source-code');
      const stripBounds = await importStrip.boundingBox();
      assert.ok(
        stripBounds && stripBounds.height <= 72,
        'The one-line import must stay a compact copyable strip.',
      );
      assert.equal(await importStrip.locator('pre').count(), 1);
      const action = await page
        .locator('.example-preview')
        .first()
        .getByRole('button')
        .first()
        .boundingBox();
      assert.ok(
        action && action.y >= 0 && action.y + action.height <= viewport.height,
        `The first live button must be visible at ${viewport.width}×${viewport.height}.`,
      );
    }
    const compact = page.locator('.doc-heading > .source-code');
    const importSource = await compact.locator('pre').innerText();
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value) => {
            window.compactCopiedSource = value;
          },
        },
      }),
    );
    await compact.getByRole('button', { name: '复制代码', exact: true }).click();
    await compact.getByText('已复制', { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => window.compactCopiedSource), importSource);
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error('Clipboard access denied')) },
      }),
    );
    await compact.getByRole('button', { name: '复制代码', exact: true }).click();
    const manual = compact.getByRole('textbox', { name: '手动复制代码', exact: true });
    await manual.waitFor();
    await requireFocus(manual, 'Compact import fallback must retain keyboard copy access.');
    assert.equal(await manual.inputValue(), importSource);
    assert.deepEqual(
      await manual.evaluate((element) => [element.selectionStart, element.selectionEnd]),
      [0, importSource.length],
    );
  } finally {
    await context.close();
  }
}

async function verifyThemePresets(page, baseURL) {
  await page.goto(`${baseURL}#/components/theme-provider`);
  const example = page.locator('#theme-variants');
  await example.locator('.example-preview').waitFor();
  const colors = [];
  for (const theme of ['pink', 'blue', 'yellow']) {
    const provider = example.locator(`.example-preview [data-yahha-theme="${theme}"]`);
    const button = provider.getByRole('button', { name: '主要按钮外观', exact: true });
    await minHeight(button, 44, `${theme} preset button`);
    colors.push(await button.evaluate((element) => getComputedStyle(element).backgroundColor));
  }
  assert.equal(
    new Set(colors).size,
    3,
    'The three provider presets must retain distinct actual button colors.',
  );
  assert.equal(await page.locator('.docs-app').getAttribute('data-yahha-theme'), 'pink');
  assert.match(await page.locator('.doc-example-help').innerText(), /本页示例已包含 ThemeProvider/);
}

async function verifySelectFocus(page, baseURL) {
  await page.goto(`${baseURL}#/components/select`);
  const example = page.locator('.example-block').first();
  const trigger = example.getByRole('combobox', { name: '文章分类', exact: true });
  await trigger.waitFor();
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const listbox = page.getByRole('listbox');
  await listbox.waitFor();
  await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => document.activeElement?.getAttribute('role') === 'option');
  const appearance = await page.evaluate(() => {
    const option = document.activeElement;
    const style = getComputedStyle(option);
    return {
      outline: style.outlineStyle,
      width: parseFloat(style.outlineWidth),
      shadow: style.boxShadow,
      theme: option.closest('[data-yahha-theme]')?.dataset.yahhaTheme,
    };
  });
  assert.equal(appearance.theme, 'pink');
  assert.ok(
    appearance.outline === 'none' || appearance.width === 0,
    'Select options must not stack a second outline over their focused indicator.',
  );
  assert.notEqual(
    appearance.shadow,
    'none',
    'The focused option must keep its single visible focus indicator.',
  );
  for (const option of await listbox.getByRole('option').all())
    await minHeight(option, 44, 'Select option');
  await page.keyboard.press('Escape');
  await listbox.waitFor({ state: 'hidden' });
  await requireFocus(trigger, 'Closing a content select must return focus to its trigger.');
}

export async function verifyReadingExample(page, baseURL) {
  await page.goto(`${baseURL}#/guides/styling?section=reading`);
  const example = page.locator('#reading-example');
  const reading = example.locator('.example-preview');
  await reading.waitFor();
  const search = reading.getByRole('searchbox', { name: '搜索手记', exact: true });
  const river = reading.getByRole('button', { name: '沿着河边，慢慢走', exact: true });
  const weekend = reading.getByRole('button', { name: '读了三遍的那一页', exact: true });
  await search.fill('面包');
  await river.waitFor();
  await weekend.waitFor({ state: 'hidden' });
  await search.fill('');
  await weekend.waitFor();
  await reading.getByRole('radio', { name: '读书', exact: true }).check();
  await river.waitFor({ state: 'hidden' });
  await weekend.click();
  await requireFocus(
    reading.getByRole('heading', { level: 2, name: '读了三遍的那一页', exact: true }),
    'Selecting a reading entry must continue at its article heading.',
  );
  await reading.getByRole('button', { name: '收藏这篇文章', exact: true }).click();
  await reading.getByRole('article').getByRole('button', { pressed: true }).waitFor();
  await reading.getByRole('radio', { name: '日常', exact: true }).check();
  await reading
    .getByRole('article')
    .getByRole('button', { name: '收藏这篇文章', pressed: false, exact: true })
    .waitFor();
  await reading.getByRole('radio', { name: '读书', exact: true }).check();
  await reading.getByRole('article').getByRole('button', { pressed: true }).waitFor();
  await search.fill('这篇手记不存在');
  await reading.getByText('未找到相关手记', { exact: true }).waitFor();
  await reading.getByRole('button', { name: '显示全部手记', exact: true }).click();
  await requireFocus(search, 'Recovering from an empty reading result must return to search.');
  assert.equal(await search.inputValue(), '');
  assert.equal(await reading.getByRole('radio', { name: '全部', exact: true }).isChecked(), true);
  await river.waitFor();
  await weekend.waitFor();
  await reading.getByRole('article').getByRole('button', { pressed: true }).waitFor();
  const author = reading.getByRole('button', { name: '关于作者', exact: true });
  await author.click();
  const dialog = page.getByRole('dialog', { name: '关于作者', exact: true });
  await dialog.waitFor();
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  await requireFocus(
    author,
    'The reading composition must return from author details to its action.',
  );
  const currentURL = page.url();
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const image = reading.getByRole('img', { name: '淡粉纸面上的周末手记示例封面', exact: true });
    await image.waitFor();
    await image.evaluate((node) => node.decode());
    const frame = image.locator('..');
    const bounds = await frame.boundingBox();
    assert.ok(Math.abs(bounds.width / bounds.height - 16 / 9) < 0.01);
    const illustration = reading.getByRole('switch', { name: '显示文章配图', exact: true });
    await illustration.uncheck();
    assert.equal(await image.count(), 0, 'Reading must work without illustration.');
    await reading
      .getByRole('article')
      .getByText(
        '小八笑得忘了读到哪一句，又把这页从头念了一遍。今天的读书笔记多了一只长腿麻雀，书签还是没挪。',
        { exact: true },
      )
      .waitFor();
    await illustration.check();
    await image.waitFor();
    await reading.getByRole('link', { name: '读一读写在后面的话', exact: true }).click();
    const note = reading.getByRole('note', { name: '写在手记后面', exact: true });
    await requireFocus(note, 'The reading link must continue at its note.');
    assert.equal(page.url(), currentURL, 'Reading anchors must preserve the host hash route.');
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
    );
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  assert.match(await page.locator('.doc-example-help').innerText(), /本页示例已包含 ThemeProvider/);
}

export async function verifyReadingMediaExamples(page, baseURL) {
  await page.goto(`${baseURL}#/components/avatar`);
  await page
    .locator('#avatar-fallback')
    .getByRole('img', { name: '匿名用户', exact: true })
    .waitFor();
  const avatar = page.locator('#avatar-picture .example-preview');
  await avatar.getByRole('button', { name: '模拟图片失效', exact: true }).click();
  await avatar.getByText('图片暂不可用，已显示姓名回退。', { exact: true }).waitFor();
  assert.equal(
    (await avatar.getByRole('img', { name: '小八', exact: true }).boundingBox()).height,
    64,
  );
  await avatar.getByRole('button', { name: '恢复头像', exact: true }).click();
  await avatar.locator('img').evaluate((node) => node.decode());

  await page.goto(`${baseURL}#/components/image`);
  const example = page.locator('#image-failure .example-preview');
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await example
      .getByRole('status')
      .getByText('图片暂不可用，正文仍可继续阅读。', { exact: true })
      .waitFor();
    const fallback = example.getByRole('img', { name: '示例文章封面', exact: true });
    const frame = fallback.locator('..');
    const before = await frame.boundingBox();
    await example.getByRole('button', { name: '恢复图片', exact: true }).click();
    await example.getByRole('status').getByText('图片已恢复。', { exact: true }).waitFor();
    const after = await example.locator('img').locator('..').boundingBox();
    assert.ok(
      Math.abs(before.width - after.width) < 0.1 && Math.abs(before.height - after.height) < 0.1,
      'Recovering a framed image must preserve its geometry.',
    );
    await example.getByRole('button', { name: '再次模拟失败', exact: true }).click();
  }
  await page.setViewportSize({ width: 1440, height: 900 });
}

export async function verifyStateScenes(page, baseURL) {
  try {
    await verifyStateSceneExamples(page, baseURL);
  } catch (error) {
    const diagnostic = await page
      .evaluate(() => {
        const scene = document.querySelector('#scene-loading');
        const status = scene?.querySelector('.story-loading-status');
        const blockedAncestors = [];
        for (let node = status; node; node = node.parentElement) {
          const css = getComputedStyle(node);
          if (
            node.inert ||
            node.getAttribute('aria-hidden') === 'true' ||
            css.display === 'none' ||
            css.visibility === 'hidden'
          )
            blockedAncestors.push({
              tag: node.tagName,
              id: node.id,
              className: node.className,
              inert: node.inert,
              ariaHidden: node.getAttribute('aria-hidden'),
              display: css.display,
              visibility: css.visibility,
            });
        }
        return {
          url: location.href,
          visibility: document.visibilityState,
          reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
          viewport: { width: innerWidth, height: innerHeight },
          focus: { tag: document.activeElement?.tagName, id: document.activeElement?.id },
          loading: {
            phase: scene?.querySelector('.story-loading-content')?.getAttribute('data-state'),
            status: status?.textContent,
            outcome: scene?.querySelector('[role="combobox"]')?.textContent,
            disabled: scene?.querySelector('.story-loading-actions button')?.disabled,
            blockedAncestors,
          },
        };
      })
      .catch((failure) => ({ unavailable: failure.message }));
    console.error('State scene diagnostics:', JSON.stringify(diagnostic));
    throw error;
  }
}

async function verifyStateSceneExamples(page, baseURL) {
  await page.goto(`${baseURL}#/guides/states`);
  await page.getByRole('heading', { level: 1, name: '组合示例', exact: true }).waitFor();
  const loading = page.locator('#scene-loading .example-preview');
  const status = loading.getByRole('status');
  const reload = loading.getByRole('button', { name: '重新加载文章', exact: true });
  await status.getByText('正在加载文章…', { exact: true }).waitFor();
  assert.equal(await reload.isDisabled(), true);
  assert.equal(await reload.getAttribute('aria-busy'), 'true');
  assert.equal((await loading.locator('[aria-busy="true"]').count()) >= 1, true);
  await page.waitForFunction(() => {
    const image = document.querySelector('#scene-loading .story-loading-frame');
    return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
  });
  assert.match(
    await loading.locator('.story-loading-frame').getAttribute('src'),
    /little-days-page-wait-motion/,
    'The loading scene must resolve the new vector artwork.',
  );
  await status.getByText('文章已准备好', { exact: true }).waitFor();
  await loading.getByRole('heading', { name: '一只纸袋，一路面包香', exact: true }).waitFor();
  assert.equal(await reload.isEnabled(), true);
  const idleLayout = await measureTextButton(reload);
  await reload.click();
  await status.getByText('正在加载文章…', { exact: true }).waitFor();
  verifyTextButtonLoading(idleLayout, await measureTextButton(reload));
  await status.getByText('文章已准备好', { exact: true }).waitFor();
  verifyTextButtonRestored(idleLayout, await measureTextButton(reload));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await reload.click();
  await status.getByText('正在加载文章…', { exact: true }).waitFor();
  // Reload mounts a fresh image; the text state can commit before its cached SVG decodes.
  await page.waitForFunction(() => {
    const image = document.querySelector('#scene-loading .story-loading-frame');
    return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
  });
  assert.ok(
    await loading
      .locator('.story-loading-frame')
      .evaluate((node) => node.complete && node.naturalWidth > 0),
    'Reduced motion must retain a visible vector illustration; its internal playback is verified in artwork-checks.',
  );
  assert.deepEqual(
    await loading.evaluate((node) =>
      node
        .getAnimations({ subtree: true })
        .filter((animation) => animation.playState === 'running')
        .map((animation) => animation.constructor.name),
    ),
    [],
    'Reduced motion must stop the scene and inline loading loops.',
  );
  await status.getByText('文章已准备好', { exact: true }).waitFor();
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  await page.goto(`${baseURL}#/components/empty-state?section=empty-illustrations`);
  const empty = page.locator('#scene-empty .example-preview');
  await empty.getByRole('heading', { name: '还没有手记', exact: true }).waitFor();
  assert.equal(new URL(page.url()).hash, '#/guides/states?section=scene-empty');
  const create = empty.getByRole('button', { name: '创建示例手记', exact: true });
  await create.focus();
  await create.press('Enter');
  await requireFocus(
    empty.getByRole('heading', { name: '第一篇手记已创建', exact: true }),
    'Keyboard creation must move focus to the new result heading.',
  );
  await empty.getByRole('button', { name: '重置空态示例', exact: true }).click();
  await empty.getByRole('heading', { name: '还没有手记', exact: true }).waitFor();
  const scene = empty.getByRole('combobox', { name: '空态场景', exact: true });
  await scene.click();
  await page.getByRole('option', { name: '暂无收藏', exact: true }).click();
  await empty.getByRole('heading', { name: '还没有收藏', exact: true }).waitFor();
  const browse = empty.getByRole('button', { name: '浏览示例文章', exact: true });
  await browse.focus();
  await browse.press('Space');
  await requireFocus(
    empty.getByRole('heading', { name: '可以读这些文章', exact: true }),
    'Keyboard browsing must move focus to the article result heading.',
  );
  await scene.click();
  await page.getByRole('option', { name: '搜索无结果', exact: true }).click();
  const search = empty.getByRole('textbox', { name: '搜索关键词', exact: true });
  assert.equal(await search.inputValue(), '海边');
  await empty.getByRole('heading', { name: '未找到相关文章', exact: true }).waitFor();
  await empty.getByRole('button', { name: '清空搜索', exact: true }).click();
  assert.equal(await search.inputValue(), '');
  await requireFocus(search, 'Clearing scene filters must return focus to the query.');
  assert.equal(await empty.getByRole('listitem').count(), 2);
  await empty.getByText('雨天的读书笔记', { exact: true }).waitFor();
  await empty.getByText('周末散步的小发现', { exact: true }).waitFor();
  await empty.getByRole('button', { name: '重置空态示例', exact: true }).click();
  assert.equal(await search.inputValue(), '海边');
  await empty.getByRole('heading', { name: '未找到相关文章', exact: true }).waitFor();

  const notFound = page.locator('#scene-not-found .example-preview');
  await notFound.getByRole('heading', { level: 3, name: '页面未找到', exact: true }).waitFor();
  assert.equal(
    await notFound.getByRole('link', { name: '开始使用', exact: true }).getAttribute('href'),
    '#/guides/getting-started',
  );
  assert.equal(
    await notFound.getByRole('link', { name: '浏览组件', exact: true }).getAttribute('href'),
    '#/components',
  );

  for (const [id, module, assets] of [
    [
      'scene-loading',
      'LoadingScene',
      [
        'little-days-page-wait-motion.svg',
        'little-days-load-error-motion.svg',
        'little-days-collection-saved-motion.svg',
      ],
    ],
    [
      'scene-empty',
      'EmptyScene',
      ['little-days-empty-collection.svg', 'little-days-search-empty.svg'],
    ],
    ['scene-not-found', 'NotFoundScene', ['little-days-friends-lost.svg']],
  ]) {
    const example = page.locator(`#${id}`);
    const source = example.locator('.component-source');
    await source.getByRole('button', { name: '展开代码', exact: true }).click();
    const original = await readFile(
      new URL(`../../playground/src/examples/scenes/${module}.tsx`, import.meta.url),
      'utf8',
    );
    assert.equal(
      await source.locator('pre').textContent(),
      original,
      `${module} source must remain unchanged.`,
    );
    for (const asset of assets)
      assert.ok(
        original.includes(`'./artwork/${asset}'`) ||
          original.includes(`'./artwork/${asset}?no-inline'`),
      );
    await source.getByRole('button', { name: '收起代码', exact: true }).click();
    await verifyExampleAssets(
      example,
      await Promise.all(
        assets.map(async (asset) => ({
          name: asset,
          contents: await readFile(
            new URL(`../../playground/src/examples/scenes/artwork/${asset}`, import.meta.url),
          ),
        })),
      ),
    );
  }
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}#/guides/states`);
    await page.locator('#scene-not-found .example-preview').waitFor();
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `State scenes overflow at ${width}px.`,
    );
  }
}
