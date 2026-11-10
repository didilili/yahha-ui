import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { waitForGuideReady } from './guide-loading-checks.mjs';

/** Run the first component from the directly provided App.tsx source. */
export async function verifyQuickstartFlow(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const report = [];
  try {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto('about:blank');
      await page.goto(`${baseURL}#/guides/getting-started`);
      await waitForGuideReady(page, '开始使用');
      const firstComponent = page
        .locator('.doc-section')
        .filter({ has: page.locator('#first-component') });
      const instructions = await firstComponent.locator('.doc-prose').innerText();
      assert.match(instructions, /保存为\s*App\.tsx/);
      assert.doesNotMatch(instructions, /Example\.tsx|完整接入/);

      const install = page.locator('.doc-section').filter({ has: page.locator('#install') });
      const optional = install.locator('details');
      await optional.waitFor({ state: 'attached' });
      assert.equal(await optional.getAttribute('open'), null);
      await page
        .getByRole('navigation', { name: '接入路径', exact: true })
        .getByRole('link', { name: /在现有项目中使用组件/ })
        .click();
      await page.waitForFunction(() => document.activeElement?.id === 'install');
      assert.equal(
        await optional.getAttribute('open'),
        null,
        'The primary installation link must keep the optional local-package path closed.',
      );
      assert.equal(await install.locator('pre:visible').count(), 1);
      assert.equal(await install.locator('pre:visible').innerText(), 'npm install yahha-ui');
      await optional.locator('summary').click();
      assert.equal(await install.locator('pre:visible').count(), 3);
      assert.match(
        await optional.innerText(),
        /npm install \/absolute\/path\/yahha-ui-[\d.]+\.tgz/,
      );
      assert.match(await optional.innerText(), /npm ci\nnpm run build:lib\nnpm pack/);
      await optional.locator('summary').click();
      assert.equal(await optional.getAttribute('open'), null);

      const example = page.locator('#first-button');
      const source = example.locator('.component-source');
      await source.getByRole('button', { name: '展开代码', exact: true }).click();
      await page.evaluate(() =>
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async (value) => {
              window.__quickstartCopied = value;
            },
          },
        }),
      );
      await source.getByRole('button', { name: '复制代码', exact: true }).click();
      await source.getByText('已复制', { exact: true }).waitFor();
      assert.equal(
        await page.evaluate(() => window.__quickstartCopied),
        await source.locator('pre').innerText(),
      );
      const appSource = await source.locator('pre').textContent();
      assert.equal(
        appSource,
        await readFile(
          new URL('../../playground/src/examples/GettingStarted.tsx', import.meta.url),
          'utf8',
        ),
        'Quickstart copies the unchanged runnable App module.',
      );
      assert.match(appSource, /export default function App\(/);
      assert.match(appSource, /import ['"]yahha-ui\/style\.css['"]/);
      assert.match(appSource, /<ThemeProvider theme="pink">/);
      assert.equal(await example.locator('.example-entry, .example-setup').count(), 0);
      assert.equal(
        await page
          .getByRole('button', { name: '收藏这篇文章', exact: true })
          .getAttribute('aria-pressed'),
        'false',
      );
      await page.getByRole('button', { name: '收藏这篇文章', exact: true }).click();
      assert.equal(
        await page
          .getByRole('button', { name: '收藏这篇文章', exact: true })
          .getAttribute('aria-pressed'),
        'true',
      );
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      report.push({
        width,
        directAppSource: true,
        optionalInstallClosed: true,
        primaryInstallLink: true,
        appCopy: true,
        runnableExample: true,
      });
    }
    return report;
  } finally {
    await context.close();
  }
}
