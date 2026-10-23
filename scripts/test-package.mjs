import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { once } from 'node:events';
import {
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  writeFile,
} from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { basename, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(new URL('../package.json', import.meta.url));
const exec = promisify(execFile);
const npmEntry = process.env.npm_execpath;
assert(npmEntry, 'Run this acceptance script with npm run test:package.');
const temporary = await realpath(await mkdtemp(join(tmpdir(), 'chiikawa-ui-consumer-')));
const consumer = join(temporary, 'consumer');
let browser;
let server;

async function run(command, args, cwd = consumer) {
  try {
    const { stdout } = await exec(command, args, {
      cwd,
      env: { ...process.env, HUSKY: '0' },
      maxBuffer: 8 * 1024 * 1024,
      timeout: 180_000,
    });
    return stdout;
  } catch (error) {
    throw new Error(
      `${command} ${args.join(' ')} failed\n${error.stdout ?? ''}${error.stderr ?? ''}`,
      { cause: error },
    );
  }
}

function runNpm(args, cwd = consumer) {
  return run(process.execPath, [npmEntry, ...args], cwd);
}

try {
  console.log('Packing the built library (installation hooks disabled).');
  const packOutput = await runNpm(
    ['pack', '--json', '--ignore-scripts', '--pack-destination', temporary],
    root,
  );
  // npm may print lifecycle output before its JSON even with --ignore-scripts.
  const jsonStart = packOutput.search(/\[\s*\{/);
  assert.notEqual(jsonStart, -1, 'npm pack did not return its JSON file manifest.');
  const [packed] = JSON.parse(packOutput.slice(jsonStart));
  const files = packed.files.map(({ path }) => path);
  for (const entry of ['dist/index.js', 'dist/index.d.ts', 'dist/style.css']) {
    assert(files.includes(entry), `Package is missing ${entry}; run npm run build:lib first.`);
  }
  assert.equal(packed.name, 'chiikawa-ui');
  const unexpected = files.filter(
    (path) => !/^(?:dist\/|package\.json$|(?:readme|licen[sc]e|changelog)(?:\.|$))/i.test(path),
  );
  assert.deepEqual(unexpected, [], 'Package contains files outside its distribution whitelist.');
  assert.deepEqual(
    files.filter((path) =>
      /(?:^|\/)(?:node_modules|tests?|fixtures|scripts|assets)(?:\/|$)|\.(?:png|jpe?g|webp|gif|woff2?|command)$/i.test(
        path,
      ),
    ),
    [],
    'Package must exclude demo assets, tests, launch scripts, and bundled dependencies.',
  );

  await cp(join(root, 'tests/package-consumer'), consumer, { recursive: true });
  const examplesDirectory = join(consumer, 'doc-examples');
  await mkdir(examplesDirectory);
  let exampleCount = 0;
  for (const file of await readdir(join(root, 'docs/components'))) {
    if (!file.endsWith('.md')) continue;
    const markdown = await readFile(join(root, 'docs/components', file), 'utf8');
    for (const [index, match] of [...markdown.matchAll(/```tsx\r?\n([\s\S]*?)```/g)].entries()) {
      await writeFile(join(examplesDirectory, `${basename(file, '.md')}-${index}.tsx`), match[1]);
      exampleCount++;
    }
  }
  assert(exampleCount > 0, 'Component documentation must include typed usage examples.');
  const installedVersion = (name) => require(`${name}/package.json`).version;
  const dependencies = Object.fromEntries(
    ['react', 'react-dom'].map((name) => [name, installedVersion(name)]),
  );
  const devDependencies = Object.fromEntries(
    ['@types/react', '@types/react-dom', 'typescript', 'vite'].map((name) => [
      name,
      installedVersion(name),
    ]),
  );
  for (const [name, major] of [
    ['react', 19],
    ['react-dom', 19],
    ['typescript', 7],
    ['vite', 8],
  ]) {
    assert.equal(
      Number(installedVersion(name).split('.')[0]),
      major,
      `${name} must use major ${major}.`,
    );
  }
  await writeFile(
    join(consumer, 'package.json'),
    JSON.stringify(
      {
        name: 'chiikawa-ui-package-consumer',
        private: true,
        type: 'module',
        dependencies: {
          ...dependencies,
          'chiikawa-ui': `file:${join(temporary, packed.filename)}`,
        },
        devDependencies,
      },
      null,
      2,
    ),
  );
  console.log(
    'Installing the tarball and exact React 19 / Vite 8 / TypeScript 7 versions independently.',
  );
  await runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund']);
  const installedPackage = join(consumer, 'node_modules/chiikawa-ui');
  assert.equal(
    (await lstat(installedPackage)).isSymbolicLink(),
    false,
    'Consumer must install a tarball, not a symlink.',
  );
  assert.equal(await realpath(installedPackage), installedPackage);
  const manifest = JSON.parse(await readFile(join(installedPackage, 'package.json'), 'utf8'));
  for (const name of ['react', 'react-dom']) {
    assert(manifest.peerDependencies?.[name], `${name} must be a peer dependency.`);
    assert.equal(
      manifest.dependencies?.[name],
      undefined,
      `${name} must not be a runtime dependency.`,
    );
  }
  const reactPaths = (await runNpm(['ls', 'react', 'react-dom', '--all', '--parseable']))
    .trim()
    .split(/\r?\n/);
  for (const name of ['react', 'react-dom']) {
    assert.deepEqual(
      reactPaths.filter((path) => basename(path) === name),
      [join(consumer, 'node_modules', name)],
      `${name} must resolve to one shared consumer installation.`,
    );
  }
  console.log(
    `Checking published declarations, ${exampleCount} documentation examples, and the standalone consumer.`,
  );
  await run(process.execPath, [join(consumer, 'node_modules/typescript/bin/tsc'), '--noEmit']);
  await run(process.execPath, [
    join(consumer, 'node_modules/typescript/bin/tsc'),
    '--noEmit',
    '--module',
    'NodeNext',
    '--moduleResolution',
    'NodeNext',
  ]);
  await run(process.execPath, [join(consumer, 'node_modules/vite/bin/vite.js'), 'build']);

  const output = join(consumer, 'dist');
  const contentTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname === '/favicon.ico') {
        response.writeHead(204).end();
        return;
      }
      const path = resolve(output, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (!path.startsWith(`${output}${sep}`)) {
        response.writeHead(403).end();
        return;
      }
      const contents = await readFile(path);
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(path)] ?? 'application/octet-stream',
      });
      response.end(contents);
    } catch {
      response.writeHead(404).end();
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { chromium } = await import('playwright');
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.setDefaultTimeout(10_000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.getByRole('heading', { name: 'Standalone package consumer' }).waitFor();
  for (const [testId, tag] of [
    ['dialog-trigger', 'BUTTON'],
    ['ref-icon', 'BUTTON'],
    ['ref-input', 'INPUT'],
    ['consumer-badge', 'SPAN'],
    ['consumer-surface', 'DIV'],
  ]) {
    assert.equal(
      await page.getByTestId(testId).getAttribute('data-ref-checked'),
      tag,
      `${testId} ref must reach its DOM node.`,
    );
  }
  await page.getByTestId('ref-icon').click();
  assert(
    await page.getByTestId('ref-input').evaluate((node) => document.activeElement === node),
    'The input ref must support imperative focus.',
  );

  const themes = [
    ['chiikawa', 'rgb(248, 219, 226)', 'rgb(215, 195, 192)'],
    ['hachiware', 'rgb(215, 234, 245)', 'rgb(185, 206, 219)'],
    ['usagi', 'rgb(248, 229, 167)', 'rgb(218, 202, 159)'],
  ];
  const trigger = page.getByTestId('dialog-trigger');
  const dialog = page.getByRole('dialog', { name: 'Package consumer dialog' });
  for (const [theme, background, border] of themes) {
    await page.getByRole('radio', { name: theme, exact: true }).check();
    await page.mouse.move(0, 0);
    assert.deepEqual(
      await trigger.evaluate((node) => {
        const style = getComputedStyle(node);
        return [style.backgroundColor, style.minHeight, style.borderRadius];
      }),
      [background, '42px', '999px'],
      `${theme}: imported package CSS must style the button.`,
    );
    await trigger.click();
    await dialog.waitFor({ state: 'visible' });
    assert.deepEqual(
      await dialog.evaluate((node) => {
        const style = getComputedStyle(node);
        return [
          node.closest('[data-chiikawa-theme]')?.getAttribute('data-chiikawa-theme'),
          style.position,
          style.borderColor,
        ];
      }),
      [theme, 'fixed', border],
      `${theme}: the portalled dialog must retain its theme and CSS.`,
    );
    await page.getByRole('button', { name: '关闭弹窗', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
    assert(
      await trigger.evaluate((node) => document.activeElement === node),
      'Closing must restore trigger focus.',
    );
    await trigger.click();
    await dialog.waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert(
      await trigger.evaluate((node) => document.activeElement === node),
      'Escape must restore trigger focus.',
    );
    console.log(`Browser: ${theme} CSS, dialog close/Escape, and focus restoration passed.`);
  }
  const form = page.getByTestId('consumer-form');
  assert.equal(
    await form.evaluate((node) => node.checkValidity()),
    false,
    'A required empty radio group must be invalid.',
  );
  await page.getByRole('radio', { name: 'One source', exact: true }).check();
  await page.getByRole('button', { name: 'Submit scope', exact: true }).click();
  assert.equal(await page.getByRole('status', { name: 'Submitted scope' }).textContent(), 'one');
  await page.getByRole('button', { name: 'Toggle scope disabled', exact: true }).click();
  assert.equal(
    await form.evaluate((node) => new FormData(node).has('scope')),
    false,
    'Disabled group must not submit a value.',
  );
  assert.equal(
    await page.getByRole('radio', { name: 'One source', exact: true }).isDisabled(),
    true,
  );

  const customField = page.getByRole('textbox', { name: 'Custom themed input', exact: true });
  assert.equal(
    await customField.evaluate((node) => getComputedStyle(node).backgroundColor),
    'rgb(255, 244, 250)',
  );
  assert.equal(
    await page.locator('.consumer-field-error').evaluate((node) => getComputedStyle(node).color),
    'rgb(146, 59, 83)',
  );
  assert.equal(
    await page
      .locator('.consumer-error-toast > span > svg')
      .evaluate((node) => getComputedStyle(node).color),
    'rgb(146, 59, 83)',
  );
  assert.equal(
    await page
      .getByTestId('consumer-surface')
      .evaluate((node) => getComputedStyle(node).backgroundColor),
    'rgb(250, 245, 232)',
  );
  await page.getByRole('button', { name: 'Open custom dialog', exact: true }).click();
  const customDialog = page.getByRole('dialog', { name: 'Custom themed dialog', exact: true });
  await customDialog.waitFor({ state: 'visible' });
  assert.equal(await customDialog.getAttribute('data-ref-checked'), 'DIV');
  assert.equal(await page.getByTestId('consumer-portal').getByRole('dialog').count(), 1);
  // Popup visibility precedes Base UI's scheduled initial focus.
  await page.waitForFunction(
    (node) => document.activeElement === node,
    await customDialog.getByRole('textbox', { name: 'Dialog input', exact: true }).elementHandle(),
  );
  assert.deepEqual(
    await customDialog.evaluate((node) => {
      const style = getComputedStyle(node);
      return [
        style.backgroundColor,
        style.width,
        style.getPropertyValue('--chi-accent').trim(),
        node.closest('.custom-theme-root') === null,
      ];
    }),
    ['rgb(250, 245, 232)', '360px', '#b9dcca', true],
  );
  await page.getByRole('button', { name: 'Update custom tokens', exact: true }).click();
  assert.equal(
    await customDialog.evaluate((node) =>
      getComputedStyle(node).getPropertyValue('--chi-accent').trim(),
    ),
    '#e0c9f2',
  );
  await page.mouse.click(0, 0);
  assert.equal(await customDialog.isVisible(), true, 'Pointer dismissal must be disabled.');
  await page.getByRole('button', { name: 'Close custom dialog', exact: true }).click();
  await customDialog.waitFor({ state: 'hidden' });
  assert.equal(
    await page
      .getByRole('button', { name: 'Open custom dialog', exact: true })
      .evaluate((node) => document.activeElement === node),
    true,
  );
  console.log(
    'Browser: native form submission, new refs, custom theme/portal, focus and dismissal contracts passed.',
  );
  assert.deepEqual(errors, [], 'Standalone consumer emitted browser errors.');
  console.log(
    'Package consumer passed: tarball contents, independent install, shared React, types, build, themes, dialogs, and refs.',
  );
} finally {
  try {
    await browser?.close();
  } finally {
    try {
      if (server) {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
      }
    } finally {
      await rm(temporary, { recursive: true, force: true });
    }
  }
}
