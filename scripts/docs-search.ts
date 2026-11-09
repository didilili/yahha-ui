import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { apiRowAnchor } from '../playground/src/docs/api-anchor.ts';
import type { DocumentationSearchEntry } from '../playground/src/docs/search';

function plainText(value: string): string {
  return value
    .replace(/<!--.*?-->/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/[`*_]/g, '')
    .replace(/\\\|/g, '|')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Consume the synchronized documentation, keeping anchors/prose but discarding source fences. */
export function markdownSearchEntries(
  markdown: string,
  pageId: string,
): DocumentationSearchEntry[] {
  const entries: DocumentationSearchEntry[] = [];
  const lines = markdown.split(/\r?\n/);
  let pageTitle = pageId;
  let anchor = '';
  let current: DocumentationSearchEntry | undefined;
  let apiName = '';
  let fence = '';
  for (const line of lines) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = '';
      continue;
    }
    if (fence) continue;
    const title = line.match(/^# (.+)$/);
    if (title) {
      pageTitle = plainText(title[1]);
      continue;
    }
    const explicitAnchor = line.match(/^<a id="([^"]+)"><\/a>$/);
    if (explicitAnchor) {
      anchor = explicitAnchor[1];
      continue;
    }
    const heading = line.match(/^(#{2,3}) (.+)$/);
    if (heading && anchor) {
      apiName = '';
      current = {
        id: `component:${pageId}:${anchor}`,
        pageId,
        pageTitle,
        title: plainText(heading[2]),
        description: '',
        text: '',
        kind: heading[1] === '###' ? 'example' : 'section',
        href: `#/components/${pageId}?section=${encodeURIComponent(anchor)}`,
      };
      entries.push(current);
      anchor = '';
      continue;
    }
    if (!current) continue;
    if (heading?.[1] === '###' && current.href.endsWith('section=api')) {
      // API names are generated verbatim, including generic signatures such as Props<T>.
      apiName = heading[2].trim();
      continue;
    }
    // The generator writes property names as inline code in the first table column.
    if (apiName && /^\|\s*`/.test(line) && current.href.endsWith('section=api')) {
      const columns = line.split(/(?<!\\)\|/).slice(1, -1);
      const property = (columns[0].match(/^\s*(`+)(.*?)\1(?:\s|$)/)?.[2] ?? '')
        .trim()
        .replace(/\\\|/g, '|');
      const description = plainText(columns[1] ?? '');
      const rowAnchor = apiRowAnchor(apiName, property);
      entries.push({
        id: `component:${pageId}:${rowAnchor}`,
        pageId,
        pageTitle,
        title: `API · ${apiName} · ${property}`,
        description,
        kind: 'api',
        href: `#/components/${pageId}?section=${encodeURIComponent(rowAnchor)}`,
        keywords: [property, apiName],
      });
      continue;
    }
    if (
      heading ||
      line.startsWith('[查看示例文件]') ||
      line.startsWith('<!--') ||
      /^\|\s*[-:]/.test(line)
    )
      continue;
    const text = plainText(line);
    if (!text) continue;
    current.text = `${current.text} ${text}`.trim();
    current.description = current.text.slice(0, 160);
  }
  return entries;
}

const moduleId = 'virtual:yahha-doc-search';
const resolvedId = `\0${moduleId}`;

/** Build a data-only module: importing search never imports the component page bodies. */
export function docsSearchIndex(directory: URL): Plugin {
  const directoryPath = resolve(fileURLToPath(directory));
  return {
    name: 'yahha-doc-search',
    resolveId(id) {
      if (id === moduleId) return resolvedId;
    },
    async load(id) {
      if (id !== resolvedId) return;
      const files = (await readdir(directoryPath))
        .filter((file) => file.endsWith('.md') && file !== 'text-field.md')
        .sort();
      const entries = await Promise.all(
        files.map(async (file) => {
          const path = resolve(directoryPath, file);
          this.addWatchFile(path);
          const pageId = file === 'theme.md' ? 'theme-provider' : file.slice(0, -3);
          return markdownSearchEntries(await readFile(path, 'utf8'), pageId);
        }),
      );
      return `export default ${JSON.stringify(entries.flat())};`;
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(`${directoryPath}/`) || !file.endsWith('.md')) return;
      const module = server.moduleGraph.getModuleById(resolvedId);
      if (module) {
        server.moduleGraph.invalidateModule(module);
        return [module];
      }
    },
  };
}
