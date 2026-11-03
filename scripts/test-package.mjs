import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
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
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { basename, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { verifyConsumer } from '../tests/package-consumer/browser.mjs';
import { verifyThemeAliases } from '../tests/package-consumer/theme-alias-checks.mjs';
import {
  verifyEdgeCases,
  verifyForcedColors,
  verifyReviewRegressions,
} from '../tests/package-consumer/edge-checks.mjs';
import { verifyBasics } from '../tests/package-consumer/basics-checks.mjs';
import { verifyNavigation } from '../tests/package-consumer/navigation-checks.mjs';
import { verifyFeedback } from '../tests/package-consumer/feedback-checks.mjs';
import {
  verifyDialogScrollbar,
  verifyFloatingScrollbars,
  verifyOverlays,
} from '../tests/package-consumer/overlay-checks.mjs';
import { verifyDesignContract } from '../tests/package-consumer/design-checks.mjs';
import { createExampleEntry } from '../playground/src/docs/example-source.ts';
import { markdownExamples } from './documentation-contract.mjs';
import { startStaticServer } from './static-server.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(new URL('../package.json', import.meta.url));
const exec = promisify(execFile);
const npmEntry = process.env.npm_execpath;
assert(npmEntry, 'Run this acceptance script with npm run test:package.');
const temporary = await realpath(await mkdtemp(join(tmpdir(), 'yahha-ui-consumer-')));
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
  assert.equal(packed.name, 'yahha-ui');
  const unexpected = files.filter(
    (path) =>
      !/^(?:dist\/|package\.json$|THIRD_PARTY_NOTICES\.md$|(?:readme|licen[sc]e|changelog)(?:\.|$))/i.test(
        path,
      ),
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
  const markdownDirectory = join(examplesDirectory, 'markdown');
  // Markdown contains the same unchanged TSX and relative assets as the website.
  await cp(join(root, 'playground/src/examples'), markdownDirectory, { recursive: true });
  let exampleCount = 0;
  for (const file of await readdir(join(root, 'docs/components'))) {
    if (!file.endsWith('.md')) continue;
    const markdown = await readFile(join(root, 'docs/components', file), 'utf8');
    for (const { sourcePath, source } of markdownExamples(markdown)) {
      assert(sourcePath.startsWith('playground/src/examples/'), `${file}: unexpected source path.`);
      const localPath = sourcePath.slice('playground/src/examples/'.length);
      const target = resolve(markdownDirectory, localPath);
      assert(
        target.startsWith(`${markdownDirectory}${sep}`),
        `${file}: source must remain in examples.`,
      );
      assert.equal(
        source,
        await readFile(join(root, sourcePath), 'utf8'),
        `${file}: Markdown example must retain the original source.`,
      );
      await writeFile(target, source);
      exampleCount++;
    }
  }
  // Compile the exact TSX modules shown by the documentation site against the
  // installed tarball too, so development aliases cannot hide missing exports.
  let siteExampleCount = 0;
  const artworkCopies = [];
  const fullExamplesDirectory = join(consumer, 'full-examples');
  await mkdir(fullExamplesDirectory);
  async function copySiteExamples(directory, prefix = 'site', relativeDirectory = '') {
    const entries = await readdir(directory, { withFileTypes: true });
    const siteDirectory = join(examplesDirectory, 'site', relativeDirectory);
    await mkdir(siteDirectory, { recursive: true });
    const hasArtwork = entries.some((entry) => entry.isDirectory() && entry.name === 'artwork');
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'artwork') {
          await cp(path, join(siteDirectory, entry.name), { recursive: true });
        } else {
          await copySiteExamples(
            path,
            `${prefix}-${entry.name}`,
            join(relativeDirectory, entry.name),
          );
        }
      } else if (entry.name.endsWith('.tsx')) {
        const source = await readFile(path);
        await writeFile(join(siteDirectory, entry.name), source);
        // Keep Example.tsx byte-for-byte intact. Separate entry modules cover both
        // provider ownership modes without parsing names or rewriting imports.
        const setupDirectory = join(
          fullExamplesDirectory,
          `${prefix}-${basename(entry.name, '.tsx')}`,
        );
        await mkdir(setupDirectory);
        await writeFile(join(setupDirectory, 'Example.tsx'), source);
        await writeFile(join(setupDirectory, 'App.tsx'), createExampleEntry('inherited'));
        await writeFile(join(setupDirectory, 'ExplicitApp.tsx'), createExampleEntry('explicit'));
        if (hasArtwork) {
          await cp(join(directory, 'artwork'), join(setupDirectory, 'artwork'), {
            recursive: true,
          });
        }
        for (const [, assetImport] of source
          .toString()
          .matchAll(/from\s+['"](\.\/artwork\/[^'"]+)['"]/g)) {
          // Vite's ?no-inline keeps downloadable SVGs as files; it is not part of the filename.
          const asset = assetImport.split('?')[0];
          artworkCopies.push([
            join(directory, asset),
            join(siteDirectory, asset),
            join(setupDirectory, asset),
          ]);
        }
        siteExampleCount++;
      }
    }
  }
  await copySiteExamples(join(root, 'playground/src/examples'));
  for (const [originalPath, ...copies] of artworkCopies) {
    const original = await readFile(originalPath);
    for (const copy of copies) {
      assert.deepEqual(await readFile(copy), original, `${copy} must retain the imported artwork.`);
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
        name: 'yahha-ui-package-consumer',
        private: true,
        type: 'module',
        dependencies: {
          ...dependencies,
          'yahha-ui': `file:${join(temporary, packed.filename)}`,
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
  const installedPackage = join(consumer, 'node_modules/yahha-ui');
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
    `Checking published declarations, ${exampleCount} Markdown examples, ${siteExampleCount} live documentation examples, and the standalone consumer.`,
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
  // The displayed App.tsx uses bundler-style ./Example imports. Compile it with
  // its documented mode while retaining NodeNext checks for the original sources.
  await writeFile(
    join(consumer, 'tsconfig.full-examples.json'),
    JSON.stringify({
      extends: './tsconfig.json',
      compilerOptions: { module: 'ESNext', moduleResolution: 'Bundler' },
      include: ['full-examples/**/*.tsx'],
    }),
  );
  await run(process.execPath, [
    join(consumer, 'node_modules/typescript/bin/tsc'),
    '--project',
    'tsconfig.full-examples.json',
    '--noEmit',
  ]);
  console.log(
    `Compiled ${siteExampleCount} unchanged examples with both complete setup entry modes.`,
  );
  await run(process.execPath, [join(consumer, 'node_modules/vite/bin/vite.js'), 'build']);

  const output = join(consumer, 'dist');
  server = await startStaticServer([{ directory: output, prefix: '/' }], {
    contentTypes: { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' },
    favicon: true,
  });
  const { chromium, firefox, webkit } = await import('playwright');
  const url = `${server.origin}/`;
  if (process.argv.includes('--scrollbar-only')) {
    browser = await chromium.launch({ headless: true, ignoreDefaultArgs: ['--hide-scrollbars'] });
    await verifyDialogScrollbar(browser, url);
    await verifyFloatingScrollbars(browser, url);
  } else if (
    process.argv.includes('--feedback-only') ||
    process.argv.includes('--navigation-only') ||
    process.argv.includes('--overlays-only')
  ) {
    const feedbackOnly = process.argv.includes('--feedback-only');
    const overlaysOnly = process.argv.includes('--overlays-only');
    const family = feedbackOnly ? 'feedback' : overlaysOnly ? 'overlays' : 'navigation';
    for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
      browser = await engine.launch({ headless: true });
      try {
        if (feedbackOnly) await verifyFeedback(browser, url);
        else if (overlaysOnly) await verifyOverlays(browser, url);
        else await verifyNavigation(browser, url);
        if (name === 'chromium') await verifyForcedColors(browser, url);
        console.log(`${name}: installed ${family} package passed.`);
      } finally {
        await browser.close();
        browser = undefined;
      }
    }
  } else {
    browser = await chromium.launch({ headless: true });
    if (!process.argv.includes('--design-only')) {
      await verifyThemeAliases(browser, url);
      await verifyConsumer(browser, url);
      await verifyEdgeCases(browser, url);
      await verifyReviewRegressions(browser, url);
      await verifyBasics(browser, url);
      await verifyFeedback(browser, url);
    }
    await verifyDesignContract(browser, url);
  }
  if (
    !process.argv.includes('--scrollbar-only') &&
    !process.argv.includes('--feedback-only') &&
    !process.argv.includes('--navigation-only') &&
    !process.argv.includes('--design-only')
  ) {
    await browser?.close();
    browser = await chromium.launch({ headless: true, ignoreDefaultArgs: ['--hide-scrollbars'] });
    await verifyDialogScrollbar(browser, url);
    await verifyFloatingScrollbars(browser, url);
  }
  console.log(
    process.argv.includes('--scrollbar-only')
      ? 'Package overlay scrollbars passed: independent install and visible native scrollbar interaction.'
      : process.argv.includes('--feedback-only')
        ? 'Package feedback passed: independent install, types, docs compilation, all themes and three browser engines.'
        : process.argv.includes('--navigation-only')
          ? 'Package navigation passed: independent install, types, docs compilation, all themes and three browser engines.'
          : process.argv.includes('--overlays-only')
            ? 'Package overlays passed: independent install, types, docs compilation, all themes and three browser engines.'
            : process.argv.includes('--design-only')
              ? 'Package design contract passed: independent install, types, docs compilation, dimensions, and forced colors.'
              : 'Package consumer passed: independent install, types, docs, CSS, refs, keyboard, and edge cases.',
  );
} finally {
  try {
    await browser?.close();
  } finally {
    try {
      await server?.close();
    } finally {
      await rm(temporary, { recursive: true, force: true });
    }
  }
}
