import type { DocPage } from './types';

const loaders: Record<string, () => Promise<{ default: DocPage }>> = {
  button: () => import('./components/button'),
  'icon-button': () => import('./components/icon-button'),
  badge: () => import('./components/badge'),
  surface: () => import('./components/surface'),
  'theme-provider': () => import('./components/theme-provider'),
  'text-field': () => import('./components/text-field'),
  'segmented-control': () => import('./components/segmented-control'),
  select: () => import('./components/select'),
  textarea: () => import('./components/textarea'),
  checkbox: () => import('./components/checkbox'),
  'radio-group': () => import('./components/radio-group'),
  switch: () => import('./components/switch'),
  text: () => import('./components/text'),
  heading: () => import('./components/heading'),
  link: () => import('./components/link'),
  divider: () => import('./components/divider'),
  avatar: () => import('./components/avatar'),
  image: () => import('./components/image'),
  skeleton: () => import('./components/skeleton'),
  spinner: () => import('./components/spinner'),
  alert: () => import('./components/alert'),
  tabs: () => import('./components/tabs'),
  pagination: () => import('./components/pagination'),
  accordion: () => import('./components/accordion'),
  'dropdown-menu': () => import('./components/dropdown-menu'),
  popover: () => import('./components/popover'),
  tooltip: () => import('./components/tooltip'),
  dialog: () => import('./components/dialog'),
  'empty-state': () => import('./components/empty-state'),
  toast: () => import('./components/toast'),
};
const loadedPages = new Map<string, Promise<DocPage>>();

/** Load only the requested component page and its unchanged examples. */
export async function loadComponentPage(id: string): Promise<DocPage> {
  const loader = Object.hasOwn(loaders, id) ? loaders[id] : undefined;
  if (!loader) throw new Error(`Unknown component documentation: ${id}`);
  let pending = loadedPages.get(id);
  if (!pending) {
    pending = loader()
      .then((module) => module.default)
      .catch((error) => {
        loadedPages.delete(id);
        throw error;
      });
    loadedPages.set(id, pending);
  }
  return pending;
}
