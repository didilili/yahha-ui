import assert from 'node:assert/strict';
import { componentCatalog } from '../../playground/src/docs/component-catalog.ts';

const expectedEntries = Object.fromEntries(
  `button:Button icon-button:IconButton badge:Badge surface:Surface
   theme-provider:ThemeProvider text-field:TextField segmented-control:SegmentedControl
   select:Select textarea:Textarea checkbox:Checkbox radio-group:RadioGroup switch:Switch
   text:Text heading:Heading link:Link divider:Divider avatar:Avatar image:Image
   skeleton:Skeleton spinner:Spinner alert:Alert tabs:Tabs pagination:Pagination
   accordion:Accordion dropdown-menu:DropdownMenu popover:Popover tooltip:Tooltip
   dialog:Dialog empty-state:EmptyState toast:Toast`
    .trim()
    .split(/\s+/)
    .map((entry) => entry.split(':')),
);
const expectedIds = Object.keys(expectedEntries).sort();
const uiGroups = ['通用', '排版', '布局', '表单', '内容展示', '导航', '浮层', '反馈'];
const groupCounts = Object.fromEntries(
  uiGroups.map((group) => [group, componentCatalog.filter((item) => item.group === group).length]),
);
const cards = (page) => page.locator('[data-component-id]');
const catalog = (page) => page.locator('.component-overview-page');
const search = (page) => catalog(page).getByRole('searchbox', { name: '搜索组件', exact: true });
const category = (page, group) => catalog(page).getByRole('radio', { name: group, exact: true });
async function ids(page) {
  return (
    await cards(page).evaluateAll((nodes) => nodes.map((node) => node.dataset.componentId))
  ).sort();
}
async function expectIds(page, expected) {
  await page.waitForFunction((expected) => {
    const ids = [...document.querySelectorAll('[data-component-id]')]
      .map((node) => node.dataset.componentId)
      .sort();
    return JSON.stringify(ids) === JSON.stringify([...expected].sort());
  }, expected);
  assert.deepEqual(await ids(page), [...expected].sort());
  const status = await catalog(page)
    .getByRole('status', { name: '组件筛选结果', exact: true })
    .innerText();
  assert.match(
    status.replace(/\s/g, ''),
    new RegExp(`显示${expected.length}/30个入口`),
    'Visible result counts agree with rendered cards.',
  );
}
async function focus(page, target) {
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await target.elementHandle(),
  );
}
async function overview(page) {
  await page.getByRole('heading', { level: 1, name: '组件总览', exact: true }).waitFor();
  await expectIds(page, expectedIds);
  assert.equal(
    await page.locator('main h1').count(),
    1,
    'The overview has one real H1, including visual previews.',
  );
  assert.equal(
    await catalog(page).locator('a a').count(),
    0,
    'Card links cannot wrap preview links.',
  );
  assert.equal(
    await page.getByRole('dialog').count(),
    0,
    'Overview previews do not open floating dialogs.',
  );
  assert.equal(await page.getByRole('menu').count(), 0);
  assert.equal(await page.getByRole('listbox').count(), 0);
  assert.equal(await page.locator('[data-base-ui-tooltip-trigger][data-popup-open]').count(), 0);
}
async function verifyCards(page) {
  for (const item of componentCatalog) {
    const card = page.locator(`[data-component-id="${item.id}"]`);
    const preview = card.locator(`[data-component-preview="${item.id}"]`);
    assert.equal(
      await preview.getAttribute('aria-hidden'),
      'true',
      `${item.id}: previews remain decorative.`,
    );
    assert.equal(
      await preview.evaluate((node) => node.inert),
      true,
      `${item.id}: decorative previews do not take focus.`,
    );
    const link = card.getByRole('link', {
      name: `${item.name} ${item.chinese}，查看示例与 API`,
      exact: true,
    });
    assert.equal(await link.getAttribute('href'), `#/components/${item.id}`);
    assert.equal(await link.locator('strong').textContent(), expectedEntries[item.id]);
    assert.equal(
      await card.getByRole('link').count(),
      1,
      `${item.id}: one accessible document entry.`,
    );
  }
  assert.equal(
    await catalog(page).getByRole('status', { name: '组件筛选结果', exact: true }).count(),
    1,
  );
  const clipped = await page
    .locator('[data-component-preview]')
    .evaluateAll((nodes) =>
      nodes
        .filter((node) => node.scrollWidth > node.clientWidth + 1)
        .map((node) => node.dataset.componentPreview),
    );
  assert.deepEqual(
    clipped,
    [],
    'Preview wrappers retain default controls without horizontal clipping.',
  );
  for (const [group, count] of Object.entries(groupCounts))
    assert.equal(
      await page.locator(`.overview-group[data-group="${group}"] [data-component-id]`).count(),
      count,
    );
}
async function verifyCatalogSections(page) {
  const overviewGroups = await page.locator('.overview-group').evaluateAll((sections) =>
    sections.map((section) => ({
      group: section.dataset.group,
      ids: [...section.querySelectorAll('[data-component-id]')]
        .map((card) => card.dataset.componentId)
        .sort(),
    })),
  );
  assert.deepEqual(
    overviewGroups.map(({ group }) => group),
    uiGroups,
    'The overview presents seven task-oriented UI categories in their intended order.',
  );
  const theme = page.locator('.overview-configuration');
  assert.equal(await theme.count(), 1, 'Theme configuration has its own section.');
  assert.equal(await theme.getAttribute('data-group'), '主题配置');
  assert.equal(await theme.getByRole('heading', { level: 2, name: /^主题配置/ }).count(), 1);
  assert.deepEqual(
    await theme
      .locator('[data-component-id]')
      .evaluateAll((cards) => cards.map((card) => card.dataset.componentId)),
    ['theme-provider'],
    'ThemeProvider is a separate configuration entry outside the UI groups.',
  );
  const sidebarGroups = await page.locator('.docs-sidebar .nav-group').evaluateAll((sections) =>
    sections
      .map((section) => ({
        group: section.querySelector('p')?.textContent,
        ids: [...section.querySelectorAll('a[href^="#/components/"]')]
          .map((link) => link.getAttribute('href').split('/').at(-1))
          .sort(),
      }))
      .filter(({ ids }) => ids.length > 0),
  );
  assert.deepEqual(
    sidebarGroups,
    [...overviewGroups, { group: '主题配置', ids: ['theme-provider'] }],
    'Sidebar navigation and overview sections expose the same categories and document entries.',
  );
}

async function verifyLegacyCategoryNavigation(page, baseURL) {
  for (const { group, expected, query, matches, target } of [
    {
      group: '基础',
      expected: [
        'button',
        'icon-button',
        'badge',
        'surface',
        'theme-provider',
        'text',
        'heading',
        'link',
        'divider',
      ],
      query: 'BUTTON',
      matches: ['button', 'icon-button'],
      target: 'button',
    },
    {
      group: '内容',
      expected: ['avatar', 'image'],
      query: 'Image',
      matches: ['image'],
      target: 'image',
    },
  ]) {
    await page.goto(`${baseURL}#/components?${new URLSearchParams({ group })}`);
    await page.getByRole('heading', { level: 1, name: '组件总览', exact: true }).waitFor();
    await expectIds(page, expected);
    const legacyCategory = category(page, `${group}（旧分类）`);
    assert.equal(await legacyCategory.isChecked(), true);
    await search(page).fill(query);
    await expectIds(page, matches);
    await focus(page, search(page));
    await page.locator(`[data-component-id="${target}"]`).getByRole('link').click();
    await page.locator('.example-block').first().waitFor();
    await page.locator('#api').waitFor();
    await page.goBack();
    await page.getByRole('heading', { level: 1, name: '组件总览', exact: true }).waitFor();
    await expectIds(page, matches);
    assert.equal(await legacyCategory.isChecked(), true, 'Back restores the legacy category.');
    assert.equal(await search(page).inputValue(), query, 'Back restores the legacy search.');
    const restored = new URLSearchParams(page.url().split('?')[1]);
    assert.equal(restored.get('group'), group);
    assert.equal(restored.get('q'), query);
    await focus(page, page.getByRole('heading', { level: 1, name: '组件总览', exact: true }));
    await catalog(page).getByRole('button', { name: '清空组件搜索', exact: true }).click();
    await expectIds(page, expected);
    await category(page, '通用').check();
    await expectIds(page, ['button', 'icon-button']);
    await page.waitForFunction(
      () => new URLSearchParams(location.hash.split('?')[1]).get('group') === '通用',
    );
    assert.equal(
      await legacyCategory.count(),
      0,
      'Selecting a current category leaves legacy mode.',
    );
  }
  await page.goto(`${baseURL}#/components?${new URLSearchParams({ group: '反馈' })}`);
  await expectIds(page, ['alert', 'toast', 'empty-state', 'spinner', 'skeleton']);
  assert.equal(await category(page, '反馈').isChecked(), true);
  await page.goto(`${baseURL}#/components?${new URLSearchParams({ group: '浮层' })}`);
  await expectIds(page, ['dialog', 'popover', 'tooltip', 'dropdown-menu']);
  assert.equal(await category(page, '浮层').isChecked(), true);
  await page.goto(`${baseURL}#/components?${new URLSearchParams({ group: '浮层与反馈' })}`);
  await expectIds(page, [
    'dialog',
    'popover',
    'tooltip',
    'alert',
    'toast',
    'empty-state',
    'spinner',
    'skeleton',
  ]);
  assert.equal(await category(page, '浮层与反馈（旧分类）').isChecked(), true);
  await page.locator('.docs-header').getByRole('link', { name: '组件', exact: true }).click();
  await overview(page);
}

async function verifyPreviewGeometry(page) {
  const measurements = {};
  for (const [id, selector] of [
    ['button', 'button'],
    ['icon-button', 'button'],
    ['text-field', 'input'],
    ['select', 'button[role="combobox"]'],
  ]) {
    const preview = page.locator(`[data-component-preview="${id}"]`);
    const control = preview.locator(selector).first();
    const actual = await control.evaluate((node) => {
      const rect = node.getBoundingClientRect(),
        css = getComputedStyle(node);
      return {
        width: rect.width,
        height: rect.height,
        transform: css.transform,
        font: Number.parseFloat(css.fontSize),
        border: Number.parseFloat(css.borderTopWidth),
        background: css.backgroundColor,
      };
    });
    assert(
      Math.abs(actual.height - 44) < 0.1,
      `${id}: preview keeps the public default 44px height.`,
    );
    assert.equal(
      actual.transform,
      'none',
      `${id}: previews do not shrink controls with a transform.`,
    );
    if (id === 'icon-button') assert(Math.abs(actual.width - 44) < 0.1);
    if (id === 'text-field') assert.equal(actual.font, page.viewportSize().width <= 480 ? 16 : 14);
    measurements[id] = actual;
  }
  const area = page.locator('[data-component-preview="textarea"] textarea');
  const actual = await area.evaluate((node) => {
    const css = getComputedStyle(node);
    return {
      height: node.getBoundingClientRect().height,
      expected:
        node.rows * Number.parseFloat(css.lineHeight) +
        Number.parseFloat(css.paddingTop) +
        Number.parseFloat(css.paddingBottom) +
        Number.parseFloat(css.borderTopWidth) +
        Number.parseFloat(css.borderBottomWidth),
      resize: css.resize,
    };
  });
  assert(
    Math.abs(actual.height - actual.expected) < 0.1,
    'Textarea preview retains its actual rows and line-height geometry.',
  );
  assert.equal(actual.resize, 'vertical');
  return measurements;
}
async function verifyKeyboardPreviewIsolation(page) {
  await search(page).focus();
  const visited = [];
  for (let step = 0; step < 70; step++) {
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => {
      const node = document.activeElement;
      return {
        inOverview: !!node?.closest('.component-overview-page'),
        preview: !!node?.closest('[data-component-preview]'),
        card: node?.closest('[data-component-id]')?.getAttribute('data-component-id'),
      };
    });
    assert.equal(active.preview, false, 'Tab skips all thirty visual previews.');
    if (!active.inOverview) break;
    if (active.card) visited.push(active.card);
  }
  assert.deepEqual(
    [...new Set(visited)].sort(),
    expectedIds,
    'Each card has one reachable entry, without the preview controls in the tab sequence.',
  );
}
async function verifyFiltersAndNavigation(page) {
  for (const [query, expected] of [
    ['BUTTON', ['button', 'icon-button']],
    ['输入框', ['text-field']],
    ['分段单选', ['segmented-control']],
    ['预留形状', ['skeleton']],
  ]) {
    await search(page).fill(query);
    await expectIds(page, expected);
  }
  await catalog(page).getByRole('button', { name: '清空组件搜索', exact: true }).click();
  await focus(page, search(page));
  await expectIds(page, expectedIds);
  for (const [group, count] of Object.entries(groupCounts)) {
    await category(page, group).check();
    assert.equal(await cards(page).count(), count, `${group}: count agrees with the catalog.`);
  }
  await category(page, '主题配置').check();
  await expectIds(page, ['theme-provider']);
  assert.equal(await page.locator('.overview-group').count(), 0);
  assert.equal(await page.locator('.overview-configuration').count(), 1);
  await category(page, '表单').check();
  await search(page).fill('输入');
  await expectIds(page, ['text-field', 'textarea']);
  await catalog(page).getByRole('button', { name: '清空组件搜索', exact: true }).click();
  await focus(page, search(page));
  assert.equal(
    await category(page, '表单').isChecked(),
    true,
    'Clearing only the search preserves its selected category.',
  );
  await expectIds(
    page,
    componentCatalog.filter((item) => item.group === '表单').map((item) => item.id),
  );
  await search(page).fill('输入');
  await category(page, '通用').check();
  await expectIds(page, []);
  await catalog(page).getByRole('button', { name: '清空筛选', exact: true }).click();
  await focus(page, search(page));
  assert.equal(await category(page, '全部').isChecked(), true);
  await expectIds(page, expectedIds);
  await category(page, '表单').check();
  await search(page).fill('输入');
  await expectIds(page, ['text-field', 'textarea']);
  await page.waitForFunction(() => {
    const parameters = new URLSearchParams(location.hash.split('?')[1]);
    return parameters.get('q') === '输入' && parameters.get('group') === '表单';
  });
  const hash = new URLSearchParams(page.url().split('#')[1].split('?')[1]);
  assert.equal(hash.get('q'), '输入');
  assert.equal(hash.get('group'), '表单');
  await page.locator('[data-component-id="text-field"]').getByRole('link').click();
  await page.getByRole('heading', { level: 1, name: 'TextField 单行输入', exact: true }).waitFor();
  await page.locator('.example-block').first().waitFor();
  await page.locator('#api').waitFor();
  await focus(
    page,
    page.getByRole('heading', { level: 1, name: 'TextField 单行输入', exact: true }),
  );
  assert((await page.locator('.example-block').count()) > 0);
  assert((await page.locator('.api-table tbody tr').count()) > 0);
  await page.goBack();
  await page.getByRole('heading', { level: 1, name: '组件总览', exact: true }).waitFor();
  assert.equal(await search(page).inputValue(), '输入');
  assert.equal(await category(page, '表单').isChecked(), true);
  await expectIds(page, ['text-field', 'textarea']);
  await focus(page, page.getByRole('heading', { level: 1, name: '组件总览', exact: true }));
  await page.locator('.docs-header').getByRole('link', { name: '组件', exact: true }).click();
  await overview(page);
  assert.equal(await search(page).inputValue(), '');
  assert.equal(await category(page, '全部').isChecked(), true);
  await category(page, '通用').check();
  await search(page).fill('BUTTON');
  await expectIds(page, ['button', 'icon-button']);
  const sample = page.locator('[data-component-preview="button"] button').first();
  await sample.scrollIntoViewIfNeeded();
  const box = await sample.boundingBox();
  // A real pointer over the inert sample follows the card's single stretched document link.
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.getByRole('heading', { level: 1, name: 'Button 按钮', exact: true }).waitFor();
  await page.locator('.example-block').first().waitFor();
  await page.locator('#api').waitFor();
  await page.goBack();
  await page.getByRole('heading', { level: 1, name: '组件总览', exact: true }).waitFor();
  await expectIds(page, ['button', 'icon-button']);
  assert.equal(await search(page).inputValue(), 'BUTTON');
  assert.equal(await category(page, '通用').isChecked(), true);
  await page.locator('.docs-header').getByRole('link', { name: '组件', exact: true }).click();
  await overview(page);
}
async function verifyOverviewLoadRecovery(browser, baseURL) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  const chunkPattern = /\/ComponentOverview-[^/]+\.js(?:\?|$)/;
  try {
    await page.route(chunkPattern, (route) => route.abort('failed'));
    await page.goto(`${baseURL}#/components`);
    await page.getByRole('alert').filter({ hasText: '组件总览暂时未能加载' }).waitFor();
    assert.equal(await page.locator('main h1').textContent(), '组件总览');
    assert.equal(
      await catalog(page).count(),
      0,
      'A failed chunk has a usable fallback rather than an empty page.',
    );
    assert.equal(
      await page.getByRole('button', { name: '重新加载总览', exact: true }).isEnabled(),
      true,
    );
    await page.unroute(chunkPattern);
    // Reload is the reliable recovery boundary for a browser-cached failed module fetch.
    await page.reload();
    await overview(page);
    console.log(
      'Browser: component overview module failure shows its recovery action and reload restores the catalog.',
    );
  } finally {
    await context.close();
  }
}

export async function verifyComponentOverview(browser, baseURL) {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
    { width: 320, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(6000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      const requests = [];
      page.on('request', (request) => requests.push(request.url()));
      await page.goto(baseURL);
      await page.locator('main .home-title').waitFor();
      assert.equal(
        requests.some((url) => /\/ComponentOverview-[^/]+\.js(?:\?|$)/.test(url)),
        false,
        'Homepage does not download the full overview preview chunk.',
      );
      await page.locator('main').getByRole('link', { name: '逛逛组件小屋', exact: true }).click();
      await overview(page);
      await focus(page, page.getByRole('heading', { level: 1, name: '组件总览', exact: true }));
      assert(
        requests.some((url) => /\/ComponentOverview-[^/]+\.js(?:\?|$)/.test(url)),
        'The production overview chunk loads when its entry is visited.',
      );
      await verifyCards(page);
      await verifyCatalogSections(page);
      await verifyPreviewGeometry(page);
      await verifyKeyboardPreviewIsolation(page);
      if (viewport.width === 1440) {
        await verifyFiltersAndNavigation(page);
        await verifyLegacyCategoryNavigation(page, baseURL);
      } else {
        await search(page).fill('输入框');
        await expectIds(page, ['text-field']);
        await catalog(page).getByRole('button', { name: '清空组件搜索', exact: true }).click();
        await expectIds(page, expectedIds);
        await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
        const overviewLink = page
          .locator('.docs-sidebar')
          .getByRole('link', { name: '组件总览', exact: true });
        assert.equal(await overviewLink.getAttribute('href'), '#/components');
        await overviewLink.click();
        assert.equal(
          await page
            .getByRole('button', { name: '打开文档目录', exact: true })
            .getAttribute('aria-expanded'),
          'false',
        );
        await focus(page, page.getByRole('heading', { level: 1, name: '组件总览', exact: true }));
      }
      assert(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `Overview fits ${viewport.width}px.`,
      );
      assert.deepEqual(errors, [], 'Overview has no runtime errors.');
      console.log(
        `Browser: ${viewport.width}px component overview, thirty inert previews/document links, filters, default geometry, navigation and lazy entry passed.`,
      );
    } finally {
      await context.close();
    }
  }
  await verifyOverviewLoadRecovery(browser, baseURL);
}
