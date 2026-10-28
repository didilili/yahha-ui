import { readFile, readdir, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
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
  for (const page of pages) {
    const parts = [
      '<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->',
      `# ${page.name} ${page.chinese}`,
      page.description,
      '首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。',
      ...(page.importCode ? [sourceFence(page.importCode)] : []),
    ];
    for (const section of page.sections) {
      parts.push(`<a id="${section.id}"></a>`, `## ${section.title}`);
      if (section.content) {
        parts.push(proseToMarkdown(renderToStaticMarkup(section.content)));
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
          `[查看示例文件](../../${sourcePath})。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。`,
          `<!-- example-source: ${sourcePath} -->\n${sourceFence(example.source)}`,
        );
      }
      for (const api of section.api ?? []) parts.push(apiMarkdown(api));
    }
    const path = resolve(root, 'docs/components', markdownFile(page.id));
    const expected = await format(parts.filter(Boolean).join('\n\n') + '\n', {
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
        console.error(`Outdated component documentation: ${relative(root, path)}`);
        stale++;
      } else await writeFile(path, expected);
    }
  }
  if (stale)
    throw new Error(`${stale} component documents are out of sync. Run npm run sync:docs.`);
  console.log(
    `${check ? 'Checked' : 'Generated'} ${pages.length} component documents from the website page model; API, prose, anchors and original example source stay synchronized.`,
  );
} finally {
  await server.close();
}
