import { isValidElement, type ReactNode } from 'react';
import type { DocPage, DocumentationArea } from './types';

export interface DocumentationSearchEntry {
  id: string;
  pageId: string;
  pageTitle: string;
  title: string;
  description: string;
  kind: 'component' | 'guide' | 'section' | 'example' | 'api' | 'overview';
  href: string;
  keywords?: readonly string[];
  /** Searchable prose only: never example source or rendered component output. */
  text?: string;
}

export type DocumentationSearchArea = DocumentationArea;

export interface DocumentationSearchResult extends DocumentationSearchEntry {
  area: DocumentationSearchArea;
  areaLabel: string;
  label: string;
}

/** Route summaries are shared with navigation; search does not create another page catalog. */
export interface DocumentationSearchPage {
  id: string;
  name: string;
  chinese: string;
  description: string;
  area: DocumentationSearchArea;
  href: string;
  group?: string;
}

const areaLabels: Record<DocumentationSearchArea, string> = {
  'getting-started': '开始使用',
  components: '组件',
  recipes: '组合示例',
  design: '设计与素材',
};

function resultEntry(
  entry: DocumentationSearchEntry,
  area: DocumentationSearchArea,
): DocumentationSearchResult {
  let label: string;
  if (entry.kind === 'overview') label = '总览';
  else if (entry.kind === 'api') label = 'API';
  else if (entry.kind === 'component') label = '组件';
  else if (entry.kind === 'example') label = area === 'recipes' ? '组合示例' : '示例';
  else if (area === 'design') label = '设计/素材';
  else if (area === 'recipes') label = '场景指南';
  else if (area === 'components') label = '组件说明';
  else label = '指南';
  return { ...entry, area, areaLabel: areaLabels[area], label };
}

function guideArea(page: DocPage): DocumentationSearchArea {
  if (page.area) return page.area;
  // Older page models and small test fixtures predate explicit areas.
  return 'getting-started';
}

type CatalogEntry = Pick<DocPage, 'id' | 'name' | 'chinese' | 'description' | 'group'> & {
  aliases?: readonly string[];
};

/** Inspect existing element children; do not call components or read their source props. */
function staticText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(staticText).join(' ');
  if (!isValidElement<{ children?: ReactNode; 'aria-hidden'?: boolean | 'true' }>(node)) return '';
  if (
    (typeof node.type === 'string' &&
      ['pre', 'code', 'script', 'style', 'svg'].includes(node.type)) ||
    node.props['aria-hidden'] === true ||
    node.props['aria-hidden'] === 'true'
  )
    return '';
  return staticText(node.props.children);
}

function compact(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** Component bodies come from the build-time index; guides reuse the existing page data. */
export function buildDocumentationSearchIndex(
  catalog: readonly CatalogEntry[],
  componentSections: readonly DocumentationSearchEntry[],
  guides: readonly DocPage[],
  pages: readonly DocumentationSearchPage[] = [],
): DocumentationSearchResult[] {
  const pageSummaries = new Map(pages.map((page) => [page.id, page]));
  const entries: DocumentationSearchResult[] = catalog.map((page) => {
    const summary = pageSummaries.get(page.id);
    return resultEntry(
      {
        id: `component:${page.id}`,
        pageId: page.id,
        pageTitle: `${page.name} ${page.chinese}`.trim(),
        title: `${page.name} ${page.chinese}`.trim(),
        description: page.description,
        kind: 'component',
        href: summary?.href ?? `#/components/${page.id}`,
        keywords: [page.name, page.chinese, page.group, ...(page.aliases ?? [])],
      },
      summary?.area ?? 'components',
    );
  });
  entries.push(
    ...componentSections.map((entry) => {
      const summary = pageSummaries.get(entry.pageId);
      const query = entry.href.includes('?') ? entry.href.slice(entry.href.indexOf('?')) : '';
      return resultEntry(
        { ...entry, href: summary ? `${summary.href}${query}` : entry.href },
        summary?.area ?? 'components',
      );
    }),
  );
  for (const page of guides) {
    const summary = pageSummaries.get(page.id);
    const area = summary?.area ?? guideArea(page);
    const pageTitle = `${page.name} ${page.chinese}`.trim();
    const href = summary?.href ?? `#/guides/${page.id}`;
    entries.push(
      resultEntry(
        {
          id: `guide:${page.id}`,
          pageId: page.id,
          pageTitle,
          title: pageTitle,
          description: page.description,
          kind: 'guide',
          href,
          keywords: [page.name, page.chinese].filter(Boolean),
        },
        area,
      ),
    );
    for (const section of page.sections) {
      const text = compact(staticText(section.content));
      entries.push(
        resultEntry(
          {
            id: `guide:${page.id}:${section.id}`,
            pageId: page.id,
            pageTitle,
            title: section.title,
            description: text.slice(0, 160),
            text,
            kind: 'section',
            href: `${href}?section=${encodeURIComponent(section.id)}`,
          },
          area,
        ),
      );
      for (const example of section.examples ?? []) {
        entries.push(
          resultEntry(
            {
              id: `guide:${page.id}:${example.id}`,
              pageId: page.id,
              pageTitle,
              title: example.title,
              description: example.description,
              kind: 'example',
              href: `${href}?section=${encodeURIComponent(example.id)}`,
            },
            area,
          ),
        );
      }
    }
  }
  const indexedPages = new Set(entries.map((entry) => entry.pageId));
  const indexedDestinations = new Set(entries.map((entry) => entry.href));
  for (const page of pages) {
    if (indexedPages.has(page.id) || indexedDestinations.has(page.href)) continue;
    const title = `${page.name} ${page.chinese}`.trim();
    entries.push(
      resultEntry(
        {
          id: `page:${page.id}`,
          pageId: page.id,
          pageTitle: title,
          title,
          description: page.description,
          kind: page.href === '#/components' ? 'overview' : 'guide',
          href: page.href,
          keywords: [page.name, page.chinese, page.group ?? ''].filter(Boolean),
        },
        page.area,
      ),
    );
    indexedPages.add(page.id);
    indexedDestinations.add(page.href);
  }
  return entries;
}

function normalize(value: string): string {
  return compact(value.normalize('NFKC')).toLocaleLowerCase();
}

/** AND-match words, favor exact names/API, and merge rows that share one destination. */
export function searchDocumentation(
  entries: readonly DocumentationSearchResult[],
  query: string,
  limit = 12,
): DocumentationSearchResult[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery || limit <= 0) return [];
  const terms = normalizedQuery.split(/\s+/);
  const matches = entries.flatMap((entry, order) => {
    const title = normalize(entry.title);
    const description = normalize(entry.description);
    const keywords = (entry.keywords ?? []).map(normalize);
    const ownText = [title, description, normalize(entry.text ?? ''), ...keywords].join(' ');
    const allText = `${normalize(entry.pageTitle)} ${ownText}`;
    if (!terms.every((term) => allText.includes(term))) return [];
    // A page name alone should not flood results with all of that page's sections.
    if (!terms.some((term) => ownText.includes(term))) return [];
    let score = ['component', 'guide', 'overview'].includes(entry.kind) ? 10 : 0;
    // An exact component name/alias is a destination, ahead of similarly named API subparts.
    if (entry.kind === 'component' && keywords.includes(normalizedQuery)) score += 40;
    if (keywords.includes(normalizedQuery)) score += 150;
    if (title === normalizedQuery) score += 120;
    for (const term of terms) {
      if (keywords.includes(term)) score += 40;
      if (title.includes(term)) score += 25;
      if (description.includes(term)) score += 8;
      if (ownText.includes(term)) score += 2;
    }
    return [{ entry, score, order }];
  });
  matches.sort((left, right) => right.score - left.score || left.order - right.order);
  const destinations = new Set<string>();
  const results: DocumentationSearchResult[] = [];
  for (const { entry } of matches) {
    if (destinations.has(entry.href)) continue;
    destinations.add(entry.href);
    results.push(entry);
    if (results.length >= limit) break;
  }
  return results;
}

/** Return every unique match so presentation can disclose the total before batching. */
export function searchDocumentationMatches(
  entries: readonly DocumentationSearchResult[],
  query: string,
): DocumentationSearchResult[] {
  return searchDocumentation(entries, query, Number.POSITIVE_INFINITY);
}
