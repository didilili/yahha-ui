import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { format, resolveConfig } from 'prettier';
import { createServer } from 'vite';
import {
  apiMarkdown,
  markdownFile,
  proseToMarkdown,
  sourceFence,
  validateDocumentation,
} from './documentation-contract.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');
const exampleSources = new Map();
async function collectExamples(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await collectExamples(path);
    else if (entry.name.endsWith('.tsx')) {
      exampleSources.set(await readFile(path, 'utf8'), relative(root, path));
    }
  }
}

await collectExamples(resolve(root, 'playground/src/examples'));
// This loads the actual page model, including raw TSX imports, without listening on a port.
const server = await createServer({
  configFile: resolve(root, 'vite.config.ts'),
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  logLevel: 'error',
});
let stale = 0;
try {
  const { componentCatalog } = await server.ssrLoadModule('/src/docs/component-catalog.ts');
  const { loadComponentPage } = await server.ssrLoadModule('/src/docs/component-pages.ts');
  const pages = await Promise.all(componentCatalog.map((item) => loadComponentPage(item.id)));
  validateDocumentation(pages);
  const { loadGuidePage } = await server.ssrLoadModule('/src/docs/guide-pages.ts');
  const guideExports = [
    { id: 'interactions', directory: 'recipes' },
    { id: 'forms', directory: 'guides' },
  ];
  const guides = await Promise.all(guideExports.map(({ id }) => loadGuidePage(id)));
  for (const guide of guides) {
    const guideAnchors = guide.sections.flatMap((section) => [
      section.id,
      ...(section.examples ?? []).map((example) => example.id),
    ]);
    assert.equal(
      new Set(guideAnchors).size,
      guideAnchors.length,
      `Duplicate ${guide.id} guide anchor.`,
    );
  }
  for (const page of [...pages, ...guides]) {
    const guide = guideExports.find(({ id }) => id === page.id);
    const isGuide = !!guide;
    const directory = guide?.directory ?? 'components';
    const parts = [
      `<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/${isGuide ? `guides/${page.id}.tsx` : 'components/ 中对应页面'}。 -->`,
      `# ${[page.name, page.chinese].filter(Boolean).join(' ')}`,
      page.description,
      '[安装与接入](../../README.md#安装与接入)',
      ...(page.importCode ? [sourceFence(page.importCode)] : []),
    ];
    for (const section of page.sections) {
      parts.push(`<a id="${section.id}"></a>`, `## ${section.title}`);
      if (section.content) {
        parts.push(
          proseToMarkdown(renderToStaticMarkup(section.content), { fromDirectory: directory }),
        );
      }
      for (const example of section.examples ?? []) {
        const sourcePath = exampleSources.get(example.source);
        if (!sourcePath)
          throw new Error(
            `${page.id}/${example.id}: example source does not match a real TSX file.`,
          );
        parts.push(
          `<a id="${example.id}"></a>`,
          `### ${example.title}`,
          example.description,
          `[查看示例文件](../../${sourcePath})`,
          `<!-- example-source: ${sourcePath} -->\n${sourceFence(example.source)}`,
        );
      }
      for (const api of section.api ?? []) parts.push(apiMarkdown(api));
    }
    const documents = [{ filename: markdownFile(page.id), parts }];
    if (page.id === 'input') {
      // Keep a short entry for the compatible public name.
      documents.push({
        filename: 'text-field.md',
        parts: [
          parts[0],
          '# TextField 单行输入',
          '`TextField` / `TextFieldProps` 是 `Input` / `InputProps` 的兼容别名。用法、示例与 API 见 [Input 输入框](input.md)。',
        ],
      });
    }
    for (const document of documents) {
      const path = resolve(root, 'docs', directory, document.filename);
      const expected = await format(document.parts.filter(Boolean).join('\n\n') + '\n', {
        ...(await resolveConfig(path)),
        parser: 'markdown',
        embeddedLanguageFormatting: 'off',
      });
      let current;
      try {
        current = await readFile(path, 'utf8');
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
      if (expected !== current) {
        if (check) {
          console.error(`Outdated documentation: ${relative(root, path)}`);
          stale++;
        } else {
          await mkdir(dirname(path), { recursive: true });
          await writeFile(path, expected);
        }
      }
    }
  }

  if (stale) throw new Error(`${stale} documents are out of sync. Run npm run sync:docs.`);
  console.log(
    `${check ? 'Checked' : 'Generated'} ${pages.length} component documents, 1 TextField alias entry and ${guides.length} guides.`,
  );
} finally {
  await server.close();
}
