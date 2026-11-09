import assert from 'node:assert/strict';
import { componentCatalog } from '../../playground/src/docs/component-catalog.ts';
import { guideCatalog } from '../../playground/src/docs/guide-catalog.ts';

const routes = [
  ...componentCatalog.map(({ id, name, chinese }) => ({
    id,
    href: `#/components/${id}`,
    title: [name, chinese].filter(Boolean).join(' '),
  })),
  ...guideCatalog.map(({ id, name }) => ({ id, href: `#/guides/${id}`, title: name })),
  { id: 'component-overview', href: '#/components', title: '组件总览' },
];

async function openDocument(page, baseURL, route) {
  await page.goto(`${baseURL}${route.href}`);
  await page.getByRole('heading', { level: 1, name: route.title, exact: true }).waitFor();
  await page
    .locator(route.id === 'component-overview' ? '.component-overview-page' : '.doc-section')
    .first()
    .waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function readShell(page) {
  return page.evaluate(() => {
    const box = (node) => {
      const rect = node.getBoundingClientRect();
      return Object.fromEntries(
        ['x', 'y', 'width', 'height'].map((key) => [key, Math.round(rect[key] * 100) / 100]),
      );
    };
    const border = (style) =>
      ['Top', 'Right', 'Bottom', 'Left'].map((edge) => ({
        width: style[`border${edge}Width`],
        style: style[`border${edge}Style`],
        color: style[`border${edge}Color`],
      }));
    const sidebar = document.querySelector('.docs-sidebar');
    const search = sidebar.querySelector('.doc-search-trigger');
    const header = document.querySelector('.docs-header');
    const sidebarStyle = getComputedStyle(sidebar);
    const headerStyle = getComputedStyle(header);
    const searchStyle = getComputedStyle(search);
    return {
      header: {
        bounds: box(header),
        background: headerStyle.backgroundColor,
        border: border(headerStyle),
      },
      sidebar: {
        bounds: box(sidebar),
        background: sidebarStyle.backgroundColor,
        border: border(sidebarStyle),
        radius: sidebarStyle.borderRadius,
        padding: sidebarStyle.padding,
      },
      search: {
        bounds: box(search),
        radius: searchStyle.borderRadius,
        minHeight: searchStyle.minHeight,
        fontSize: searchStyle.fontSize,
      },
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
}

function inspectShell(actual, expected, mobile) {
  const failures = [];
  for (const part of ['header', 'sidebar', 'search']) {
    if (JSON.stringify(actual[part]) !== JSON.stringify(expected[part]))
      failures.push({ part, expected: expected[part], actual: actual[part] });
  }
  if (actual.sidebar.background !== 'rgb(255, 255, 255)')
    failures.push({ part: 'sidebar background', actual: actual.sidebar.background });
  const paintedBorders = actual.sidebar.border.filter(
    ({ width, style }) => parseFloat(width) > 0 && !['none', 'hidden'].includes(style),
  );
  if (paintedBorders.length < (mobile ? 1 : 4))
    failures.push({ part: 'visible sidebar outline', actual: actual.sidebar.border });
  if (!actual.sidebar.radius.split(/\s+/).some((radius) => parseFloat(radius) > 0))
    failures.push({ part: 'rounded sidebar container', actual: actual.sidebar.radius });
  if (actual.overflow) failures.push({ part: 'page overflow', actual: true });
  return failures;
}

/** Compare every document with the same public shell, while allowing content templates to vary. */
export async function verifyShellConsistency(browser, baseURL, { throwOnFailure = true } = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  const report = [];
  try {
    for (const width of [1440, 390]) {
      const mobile = width === 390;
      await page.setViewportSize({ width, height: mobile ? 844 : 900 });
      let expected;
      for (const route of routes) {
        await openDocument(page, baseURL, route);
        if (mobile) await page.getByRole('button', { name: '打开文档目录', exact: true }).click();
        if (mobile) await page.locator('.docs-sidebar.is-open').waitFor();
        const actual = await readShell(page);
        expected ??= actual;
        const failures = inspectShell(actual, expected, mobile);
        if (mobile) {
          await page.keyboard.press('Escape');
          await page.waitForFunction(
            () => document.activeElement?.getAttribute('aria-label') === '打开文档目录',
          );
          assert.notEqual(
            await page.evaluate(() => document.body.style.overflow),
            'hidden',
            `${route.href}: closing the mobile directory releases its scroll lock.`,
          );
        }
        report.push({ width, route: route.href, passed: failures.length === 0, failures });
      }
    }
    const representatives = routes.filter(({ id }) =>
      [
        'button',
        'getting-started',
        'design-baseline',
        'artwork',
        'recipes',
        'component-overview',
      ].includes(id),
    );
    for (const width of [961, 1100, 1200, 1201]) {
      await page.setViewportSize({ width, height: 900 });
      let expected;
      for (const route of representatives) {
        await openDocument(page, baseURL, route);
        const actual = await readShell(page);
        expected ??= actual;
        const failures = inspectShell(actual, expected, false);
        report.push({ width, route: route.href, passed: failures.length === 0, failures });
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ forcedColors: 'active' });
    let forcedBaseline;
    for (const route of representatives.filter(({ id }) =>
      ['button', 'design-baseline', 'recipes'].includes(id),
    )) {
      await openDocument(page, baseURL, route);
      const actual = await readShell(page);
      forcedBaseline ??= actual;
      const failures = inspectShell(actual, forcedBaseline, false);
      report.push({
        width: 1440,
        forcedColors: true,
        route: route.href,
        passed: failures.length === 0,
        failures,
      });
    }
    assert.deepEqual(runtimeErrors, [], 'The shared-shell routes have no runtime errors.');
    if (throwOnFailure)
      assert.deepEqual(
        report.filter(({ passed }) => !passed),
        [],
        'Document areas keep a consistent navigation container at the same viewport.',
      );
    return report;
  } finally {
    await context.close();
  }
}
