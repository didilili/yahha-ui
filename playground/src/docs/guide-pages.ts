import type { DocPage } from './types';

const loaders: Record<string, () => Promise<DocPage>> = {
  introduction: () => import('./guides/introduction').then((module) => module.default),
  'getting-started': () => import('./guides/getting-started').then((module) => module.default),
  styling: () => import('./guides/styling').then((module) => module.default),
  reading: () => import('./guides/reading').then((module) => module.default),
  states: () => import('./guides/states').then((module) => module.default),
  'design-baseline': () => import('./guides/design-baseline').then((module) => module.default),
  recipes: () => import('./recipe-guide').then((module) => module.recipeGuide),
  artwork: () => import('./artwork-guide').then((module) => module.artworkGuide),
};
const loaded = new Map<string, Promise<DocPage>>();

export function loadGuidePage(id: string): Promise<DocPage> {
  const loader = Object.hasOwn(loaders, id) ? loaders[id] : undefined;
  if (!loader) return Promise.reject(new Error(`Unknown guide: ${id}`));
  let pending = loaded.get(id);
  if (!pending) {
    pending = loader().catch((error) => {
      loaded.delete(id);
      throw error;
    });
    loaded.set(id, pending);
  }
  return pending;
}
