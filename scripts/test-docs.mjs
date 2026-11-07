import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { startStaticServer } from './static-server.mjs';
import { verifyDocs } from '../tests/docs-site/browser.mjs';
import { verifyAdoption } from '../tests/docs-site/adoption-checks.mjs';
import { verifySectionNavigation } from '../tests/docs-site/section-navigation-checks.mjs';
import { verifySearch } from '../tests/docs-site/search-checks.mjs';
import { verifyGuideLoading } from '../tests/docs-site/guide-loading-checks.mjs';
import {
  verifyCoreComponents,
  verifyCoreControlEdges,
} from '../tests/docs-site/core-components.mjs';
import { verifySelectionComponents } from '../tests/docs-site/selection-components.mjs';
import {
  verifyBlogArchive,
  verifyNavigationExamples,
} from '../tests/docs-site/navigation-components.mjs';
import {
  verifyArticleActions,
  verifyDialogForm,
  verifyOverlayExamples,
} from '../tests/docs-site/overlay-components.mjs';

const root = fileURLToPath(new URL('../demo-dist/', import.meta.url));
let server;
let browser;
try {
  // A nested deployment catches absolute asset URLs that would fail on GitHub Pages.
  server = await startStaticServer([{ directory: root, prefix: '/docs-preview/' }]);
  const baseURL = `${server.origin}/docs-preview/`;
  if (process.argv.includes('--adoption')) {
    browser = await chromium.launch({ headless: true });
    await verifyGuideLoading(browser, baseURL);
    await verifySearch(browser, baseURL);
    await verifySectionNavigation(browser, baseURL);
    await verifyAdoption(browser, baseURL);
    console.log('Documentation adoption paths passed at desktop and 390px.');
  } else if (process.argv.includes('--core-controls')) {
    for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
      browser = await engine.launch({ headless: true });
      try {
        const page = await browser.newPage();
        page.setDefaultTimeout(5000);
        await verifyCoreComponents(page, baseURL);
        await verifyCoreControlEdges(page, baseURL);
        await verifySelectionComponents(page, baseURL);
        console.log(`${name}: nine controls passed at desktop and 320px.`);
      } finally {
        await browser.close();
        browser = undefined;
      }
    }
  } else if (
    process.argv.includes('--navigation-controls') ||
    process.argv.includes('--overlay-controls')
  ) {
    const overlays = process.argv.includes('--overlay-controls');
    for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
      browser = await engine.launch({ headless: true });
      try {
        for (const width of [1280, 320]) {
          const page = await browser.newPage({
            viewport: { width, height: overlays && width === 320 ? 500 : 844 },
          });
          page.setDefaultTimeout(5000);
          try {
            if (overlays) {
              await verifyDialogForm(page, baseURL);
              await verifyOverlayExamples(page, baseURL);
              await verifyArticleActions(page, baseURL);
            } else {
              await verifyNavigationExamples(page, baseURL);
              await verifyBlogArchive(page, baseURL);
            }
            console.log(
              `${name}: ${overlays ? 'overlay examples and article actions' : 'navigation examples and blog archive'} passed at ${width}px.`,
            );
          } finally {
            await page.close();
          }
        }
      } finally {
        await browser.close();
        browser = undefined;
      }
    }
  } else {
    browser = await chromium.launch({ headless: true });
    await verifyDocs(browser, baseURL);
    console.log(
      'Documentation passed: homepage interactions, routes, all component APIs/examples, SVG states and welcome motion controls, copy fallback, search, dialog, mobile navigation and nested deployment.',
    );
  }
} finally {
  await browser?.close();
  await server?.close();
}
