import { componentCatalog, componentGroups, configurationGroups } from './component-catalog.ts';
import type { DocPage, DocumentationArea } from './types.ts';

export type { DocumentationArea } from './types.ts';

export const documentationAreas = [
  { id: 'getting-started', name: '开始使用', href: '#/guides/getting-started' },
  { id: 'components', name: '组件', href: '#/components' },
  { id: 'recipes', name: '组合示例', href: '#/guides/recipes' },
  { id: 'design', name: '设计与素材', href: '#/guides/design-baseline' },
] as const;

export interface DocumentationPageSummary {
  id: string;
  pageId: string;
  name: string;
  chinese: string;
  description: string;
  group: DocPage['group'] | '组件';
  area: DocumentationArea;
  presentation?: DocPage['presentation'];
  href: string;
}

export interface DocumentationNavigationItem {
  id: string;
  pageId: string;
  name: string;
  chinese: string;
  href: string;
  /** A task can cover its chapter anchor and the corresponding runnable example. */
  sectionIds?: readonly string[];
}

export interface DocumentationNavigationGroup {
  id: string;
  name: string;
  items: DocumentationNavigationItem[];
}

/** Lightweight summaries are shared by route lookup, headings and scoped navigation. */
export function createDocumentationPages(
  guides: readonly Omit<DocPage, 'sections'>[],
): DocumentationPageSummary[] {
  return [
    ...guides.map(({ id, name, chinese, description, group, area, presentation }) => ({
      id,
      pageId: id,
      name,
      chinese,
      description,
      group,
      area: area ?? 'getting-started',
      ...(presentation ? { presentation } : {}),
      href: `#/guides/${id}`,
    })),
    {
      id: 'component-overview',
      pageId: 'component-overview',
      name: '组件总览',
      chinese: '',
      description: '按分类查看组件，进入文档操作示例、复制代码和查阅 API。',
      group: '组件',
      area: 'components',
      href: '#/components',
    },
    ...componentCatalog.map(({ id, name, chinese, description, group }) => ({
      id,
      pageId: id,
      name,
      chinese,
      description,
      group,
      area: 'components' as const,
      href: `#/components/${id}`,
    })),
  ];
}

function itemFor(page: DocumentationPageSummary): DocumentationNavigationItem {
  const { id, pageId, name, chinese, href } = page;
  return { id, pageId, name, chinese, href };
}

const recipeTasks = [
  { id: 'archive', name: '归档与搜索', example: 'scene-blog-archive' },
  { id: 'article-actions', name: '文章编辑与保存', example: 'scene-article-actions' },
  { id: 'loading', name: '加载与重试', example: 'scene-loading' },
  { id: 'empty', name: '空状态与下一步', example: 'scene-empty' },
  { id: 'not-found', name: '404 页面', example: 'scene-not-found' },
  { id: 'errors', name: '错误与恢复', example: 'errors' },
] as const;

/** Top-level areas own separate left-hand trees; URL groups stay backwards compatible. */
export function navigationForArea(
  area: DocumentationArea,
  pages: readonly DocumentationPageSummary[],
): DocumentationNavigationGroup[] {
  const areaPages = pages.filter((page) => page.area === area);
  if (area === 'components') {
    return ['组件', ...componentGroups, ...configurationGroups].flatMap((name) => {
      const items = areaPages.filter((page) => page.group === name).map(itemFor);
      return items.length ? [{ id: name, name, items }] : [];
    });
  }
  if (area === 'recipes') {
    const items = ['recipes', 'reading'].flatMap((id) => {
      const page = areaPages.find((candidate) => candidate.id === id);
      return page ? [itemFor(page)] : [];
    });
    const states = areaPages.find((page) => page.id === 'states');
    if (states)
      items.push(
        ...recipeTasks.map(({ id, name, example }) => ({
          id: `states:${id}`,
          pageId: states.id,
          name,
          chinese: '',
          href: `${states.href}?section=${example}`,
          sectionIds: [...new Set([id, example])],
        })),
      );
    return items.length ? [{ id: area, name: '组合示例', items }] : [];
  }
  const order =
    area === 'getting-started'
      ? ['introduction', 'getting-started', 'styling']
      : ['design-baseline', 'artwork'];
  const ordered = order.flatMap((id) => {
    const page = areaPages.find((candidate) => candidate.id === id);
    return page ? [page] : [];
  });
  const remaining = areaPages.filter((page) => !order.includes(page.id));
  const items = [...ordered, ...remaining].map(itemFor);
  return items.length
    ? [{ id: area, name: area === 'getting-started' ? '开始使用' : '设计与素材', items }]
    : [];
}

/** Keep old deep links attached to the content after the guide split. */
export function canonicalRoute(path: string, section = ''): { path: string; section: string } {
  if (path === '/guides/styling') {
    if (section === 'language') return { path: '/guides/design-baseline', section };
    if (section === 'reading' || section === 'reading-example')
      return { path: '/guides/reading', section };
  }
  return { path, section };
}

/** Select the task whose chapter/example owns the current anchor, or the page itself. */
export function currentNavigationItem(
  groups: readonly DocumentationNavigationGroup[],
  path: string,
  section = '',
): DocumentationNavigationItem | undefined {
  const route = canonicalRoute(path, section);
  const candidates = groups
    .flatMap((group) => group.items)
    .filter((item) => item.href.slice(1).split('?')[0] === route.path);
  return (
    candidates.find((item) => item.sectionIds?.includes(route.section)) ??
    candidates.find((item) => !item.sectionIds) ??
    candidates[0]
  );
}

/** Neighbors are flattened only within the supplied area's tree. */
export function adjacentNavigation(
  groups: readonly DocumentationNavigationGroup[],
  current: DocumentationNavigationItem | undefined,
): { previous?: DocumentationNavigationItem; next?: DocumentationNavigationItem } {
  if (!current) return {};
  const items = groups.flatMap((group) => group.items);
  const index = items.findIndex((item) => item.id === current.id);
  if (index === -1) return {};
  return {
    ...(index > 0 ? { previous: items[index - 1] } : {}),
    ...(index < items.length - 1 ? { next: items[index + 1] } : {}),
  };
}
