import { componentCatalog, type ComponentPageModule } from './component-catalog';
import type { DocPage } from './types';

const loaders: Record<ComponentPageModule, () => Promise<DocPage[]>> = {
  foundations: () => import('./foundations').then((module) => module.foundationPages),
  forms: () => import('./forms').then((module) => module.formPages),
  'new-forms': () => import('./new-forms').then((module) => module.newFormPages),
  content: () => import('./content').then((module) => module.contentPages),
  navigation: () => import('./navigation').then((module) => module.navigationPages),
  floating: () => import('./floating').then((module) => module.floatingPages),
  feedback: () => import('./feedback').then((module) => module.feedbackPages),
};

const loadedPages = new Map<string, DocPage>();

/** Load examples and API content only for the requested component's documentation group. */
export async function loadComponentPage(id: string): Promise<DocPage> {
  const cached = loadedPages.get(id);
  if (cached) return cached;
  const summary = componentCatalog.find((page) => page.id === id);
  if (!summary) throw new Error(`Unknown component documentation: ${id}`);
  const pages = await loaders[summary.module]();
  for (const page of pages) loadedPages.set(page.id, page);
  const page = loadedPages.get(id);
  if (!page) throw new Error(`Missing component documentation: ${id}`);
  return page;
}
