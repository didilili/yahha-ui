import assert from 'node:assert/strict';
import { componentCatalog } from '../../playground/src/docs/component-catalog.ts';
import { createExampleEntry } from '../../playground/src/docs/example-source.ts';

const exampleGuides = [
  'getting-started',
  'forms',
  'reading',
  'states',
  'interactions',
  'design-baseline',
  'artwork',
];
const explicitPages = new Set(['theme-provider', 'reading', 'design-baseline']);
const assetGroupsByPage = {
  image: 1,
  divider: 1,
  'empty-state': 1,
  reading: 1,
  states: 3,
  artwork: 4,
};

/** Shared structure stays consistent across all component and example-guide routes. */
export async function verifyExampleSetupStructure(page, id) {
  const examples = page.locator('.example-block');
  await examples.first().waitFor({ state: 'attached' });
  assert((await examples.count()) > 0, `${id}: real runnable examples are present.`);
  assert.equal(
    await page.locator('.example-setup').count(),
    0,
    `${id}: per-example setup is removed.`,
  );
  assert.equal(
    await examples.locator('.example-entry').count(),
    0,
    `${id}: entries belong to the shared guide.`,
  );
  const help = page.locator('.doc-example-help');
  assert.equal(
    await help.count(),
    id === 'getting-started' ? 0 : 1,
    `${id}: one page-level setup link.`,
  );
  if (id !== 'getting-started') {
    assert.equal(
      await page.locator('a[href="#/guides/getting-started?section=copy-example"]').count(),
      1,
      `${id}: the shared setup guide has only one entry across the entire page.`,
    );
    assert.equal(await help.locator('a').count(), 1);
    assert.equal(
      await help.locator('a').getAttribute('href'),
      '#/guides/getting-started?section=copy-example',
    );
    if (explicitPages.has(id)) assert.match(await help.innerText(), /本页示例已包含 ThemeProvider/);
  }
  assert.equal(
    await page.locator('.example-theme-note').count(),
    id === 'states' ? 3 : 0,
    `${id}: only mixed-page explicit examples need local theme notes.`,
  );
  assert.deepEqual(
    await page
      .locator('.example-theme-note')
      .evaluateAll((notes) => notes.map((note) => note.closest('.example-block')?.id)),
    id === 'states' ? ['scene-loading', 'scene-empty', 'scene-not-found'] : [],
    `${id}: theme notes belong to the explicit-theme examples.`,
  );
  for (const note of await page.locator('.example-theme-note').all())
    assert.equal(await note.innerText(), '示例自带 ThemeProvider，沿用源码中的主题设置。');
  assert.equal(
    await page.locator('details.example-assets').count(),
    assetGroupsByPage[id] ?? 0,
    `${id}: all original asset groups remain available.`,
  );
  for (const example of await examples.all()) {
    assert.equal(await example.locator('.component-source').count(), 1);
    const source = example.locator('.example-source');
    assert.equal(
      await source
        .locator(
          ':scope > :not(.component-source):not(details.example-assets):not(.example-theme-note)',
        )
        .count(),
      0,
      `${id}: source actions contain only source and optional assets.`,
    );
    const downloads = example.locator('.example-source a[download]');
    const count = await downloads.count();
    const assets = example.locator('details.example-assets');
    assert.equal(await assets.count(), count > 0 ? 1 : 0);
    if (count > 0) {
      assert.match(
        await assets.locator(':scope > summary').innerText(),
        new RegExp(`示例素材\\s*${count}\\s*个文件`),
      );
      assert.match(
        await assets.locator('.example-assets-content').textContent(),
        /路径相对于 Example\.tsx，保持源码的相对导入/,
      );
      assert.equal(await assets.getAttribute('open'), null, 'Assets start closed.');
    }
  }
  return {
    id,
    examples: await examples.count(),
    assetGroups: await page.locator('details.example-assets').count(),
  };
}

async function verifyEntryCopy(page, entry, scope) {
  const source = createExampleEntry(scope);
  assert.equal(await entry.locator('pre').textContent(), source);
  assert.equal(
    await entry.locator('pre').isVisible(),
    true,
    'Shared entry source is immediately readable.',
  );
  assert.match(source, /import ['"]yahha-ui\/style\.css['"]/);
  assert.match(source, /import Example from ['"]\.\/Example['"]/);
  if (scope === 'inherited') assert.match(source, /<ThemeProvider theme="pink">/);
  else assert.doesNotMatch(source, /ThemeProvider/);
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__sharedSetupCopied = text;
        },
      },
    }),
  );
  await entry.getByRole('button', { name: '复制代码', exact: true }).click();
  await entry.getByText('已复制', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.__sharedSetupCopied), source);
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('Clipboard access denied')) },
    }),
  );
  await entry.getByRole('button', { name: '复制代码', exact: true }).click();
  const manual = entry.getByRole('textbox', { name: '手动复制代码', exact: true });
  await manual.waitFor();
  await page.waitForFunction(
    (node) => node === document.activeElement,
    await manual.elementHandle(),
  );
  assert.equal(await manual.inputValue(), source);
  assert.equal(await manual.getAttribute('readonly'), '');
  assert.deepEqual(await manual.evaluate((node) => [node.selectionStart, node.selectionEnd]), [
    0,
    source.length,
  ]);
}

/** Targeted setup regression, also reusable without the complete documentation suite. */
export async function verifySharedExampleSetup(browser, baseURL) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const report = [];
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    for (const [kind, id] of [
      ...componentCatalog.map(({ id }) => ['components', id]),
      ...exampleGuides.map((id) => ['guides', id]),
    ]) {
      await page.goto(`${baseURL}#/${kind}/${id}`);
      await page.locator('main h1').waitFor();
      report.push(await verifyExampleSetupStructure(page, id));
    }
    await page.goto(`${baseURL}#/components/button`);
    await page.locator('.doc-example-help a').click();
    await page.waitForFunction(() => document.activeElement?.id === 'copy-example');
    const section = page.locator('.doc-section').filter({ has: page.locator('#copy-example') });
    assert.equal(await section.locator('details.doc-disclosure').count(), 0);
    assert.match(await section.innerText(), /Example\.tsx/);
    assert.match(await section.innerText(), /App\.tsx/);
    assert.equal(await section.locator('.example-entry').count(), 2);
    for (const scope of ['inherited', 'explicit']) {
      const entry = section.locator(`.example-entry[data-theme-scope="${scope}"]`);
      assert.equal(await entry.count(), 1);
      await verifyEntryCopy(page, entry, scope);
    }
    assert.deepEqual(errors, [], 'Shared example setup has no browser runtime errors.');
    return report;
  } finally {
    await context.close();
  }
}

/** Preserve original bytes, filenames and Example.tsx-relative paths for real asset downloads. */
export async function verifyExampleAssets(example, assets) {
  const details = example.locator('details.example-assets');
  assert.equal(await details.count(), 1);
  assert.equal(await details.getAttribute('open'), null);
  assert.match(
    await details.locator('summary').innerText(),
    new RegExp(`示例素材\\s*${assets.length}\\s*个文件`),
  );
  await details.locator('summary').click();
  assert.match(await details.innerText(), /路径相对于 Example\.tsx/);
  assert.match(await details.innerText(), /保持源码的相对导入/);
  assert.equal(await details.locator('a[download]').count(), assets.length);
  try {
    for (const { name, contents, path = `artwork/${name}` } of assets) {
      const link = details.getByRole('link', { name: `下载 ${name}`, exact: true });
      assert.equal(await link.getAttribute('download'), name);
      assert.equal(await details.getByText(path, { exact: true }).count(), 1);
      const response = await example
        .page()
        .request.get(new URL(await link.getAttribute('href'), example.page().url()).href);
      assert.equal(response.ok(), true, `${name} must download from a nested site.`);
      assert.match(
        response.headers()['content-type'] ?? '',
        name.endsWith('.svg') ? /^image\/svg\+xml(?:;|$)/ : /^image\/png(?:;|$)/,
      );
      assert.deepEqual(
        await response.body(),
        contents,
        `${name} must retain the original source bytes.`,
      );
    }
  } finally {
    await details.locator('summary').click();
  }
}
