import { useSyncExternalStore } from 'react';
import type { Category } from './data/posts';

export interface ArchiveRoute {
  kind: 'archive';
  query: string;
  category: 'all' | Category;
  sort: 'newest' | 'oldest';
  page: number;
  savedOnly: boolean;
}

type Route =
  | { kind: 'home'; section: string }
  | ArchiveRoute
  | { kind: 'post'; id: string; returnTo: string; section: string }
  | { kind: 'not-found' };

interface NavigationOptions {
  replace?: boolean;
  focus?: 'page' | 'results' | 'preserve';
  scroll?: 'top' | 'preserve';
  /** Keep the current result only when correcting the page after a local collection change. */
  preserveNotice?: boolean;
  restoreReadingPosition?: boolean;
}

interface EntryState {
  blogEntry?: string;
  blogScroll?: number;
  blogFocus?: string;
}

export let navigation = {
  kind: 'initial' as 'initial' | 'push' | 'pop',
  focus: 'page' as 'page' | 'results' | 'preserve',
  scroll: 'top' as 'top' | 'preserve',
  preserveNotice: false,
  restoreReadingPosition: false,
};
let readingReturn: { href: string; entry: EntryState } | undefined;
const subscribers = new Set<() => void>();
let snapshot = window.location.hash || '#/';
const positions = new Map<string, EntryState>();
const entryPrefix = Math.random().toString(36).slice(2);
let entrySequence = 0;
const createEntryId = () => `${entryPrefix}-${entrySequence++}`;
let currentEntryId = identifyEntry();
let positionReady = true;

function identifyEntry() {
  const state = (history.state ?? {}) as EntryState;
  if (state.blogEntry) return state.blogEntry;
  const id = createEntryId();
  history.replaceState({ ...state, blogEntry: id }, '');
  return id;
}

function currentPosition(): EntryState {
  return {
    blogScroll: window.scrollY,
    blogFocus: document.activeElement instanceof HTMLElement ? document.activeElement.id : '',
  };
}

function changed(kind: 'push' | 'pop') {
  const next = window.location.hash || '#/';
  if (next === snapshot) return;
  if (kind === 'pop') {
    // history.state already belongs to the destination; the DOM still shows the page we left.
    if (positionReady) positions.set(currentEntryId, currentPosition());
    currentEntryId = identifyEntry();
    navigation = {
      kind,
      focus: 'page',
      scroll: 'preserve',
      preserveNotice: false,
      restoreReadingPosition: false,
    };
  }
  positionReady = false;
  snapshot = next;
  subscribers.forEach((callback) => callback());
}

window.history.scrollRestoration = 'manual';
window.addEventListener('popstate', () => changed('pop'));
window.addEventListener('hashchange', () => changed('pop'));

function rememberEntry() {
  if (!positionReady) return;
  const state = (history.state ?? {}) as EntryState;
  const position = { ...state, ...currentPosition() };
  positions.set(currentEntryId, position);
  history.replaceState(position, '');
}

export function finishNavigation(location: string) {
  if (location === snapshot) positionReady = true;
}

export function navigate(to: string, options: NavigationOptions = {}) {
  if (!to.startsWith('#/')) return;
  if (to === snapshot) {
    const section = sectionTarget(parseRoute(to));
    if (section) {
      section.focus({ preventScroll: true });
      section.scrollIntoView({ block: 'start' });
    } else {
      const target =
        options.focus === 'results'
          ? document.getElementById('archive-results-heading')
          : document.querySelector<HTMLElement>('#blog-main h1');
      if (options.focus !== 'preserve') target?.focus({ preventScroll: true });
      if (options.scroll !== 'preserve') window.scrollTo(0, 0);
      else if (options.focus === 'results') target?.scrollIntoView({ block: 'start' });
    }
    return;
  }
  rememberEntry();
  const current = parseRoute(snapshot);
  const destination = parseRoute(to);
  if (
    destination.kind === 'post' &&
    ((current.kind === 'home' && destination.returnTo === '#/') ||
      (current.kind === 'archive' && destination.returnTo === archiveHref(current)))
  )
    readingReturn = { href: destination.returnTo, entry: restoredPosition() };
  const remembered =
    options.restoreReadingPosition &&
    current.kind === 'post' &&
    current.returnTo === to &&
    readingReturn?.href === to
      ? readingReturn.entry
      : undefined;
  if (destination.kind !== 'post') readingReturn = undefined;
  navigation = {
    kind: 'push',
    focus: options.focus ?? 'page',
    scroll: options.scroll ?? 'top',
    preserveNotice: options.preserveNotice ?? false,
    restoreReadingPosition: !!remembered,
  };
  const state: EntryState = {
    ...(remembered ?? { blogScroll: options.scroll === 'preserve' ? window.scrollY : 0 }),
    blogEntry: createEntryId(),
  };
  history[options.replace ? 'replaceState' : 'pushState'](state, '', to);
  currentEntryId = state.blogEntry!;
  changed('push');
}

export function useLocation() {
  return useSyncExternalStore(
    (callback) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    () => snapshot,
  );
}

export function parseRoute(hash: string): Route {
  let url: URL;
  try {
    url = new URL(hash.slice(1) || '/', 'https://example.invalid');
  } catch {
    return { kind: 'not-found' };
  }
  const params = url.searchParams;
  if (url.pathname === '/' || url.pathname === '')
    return { kind: 'home', section: params.get('section') ?? '' };
  if (url.pathname === '/archive') {
    const category = params.get('category');
    const value = Number(params.get('page') || 1);
    return {
      kind: 'archive',
      query: params.get('q') ?? '',
      category:
        category === 'daily' || category === 'reading' || category === 'walk' ? category : 'all',
      sort: params.get('sort') === 'oldest' ? 'oldest' : 'newest',
      page: Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1,
      savedOnly: params.get('saved') === '1',
    };
  }
  if (url.pathname.startsWith('/posts/')) {
    let id: string;
    try {
      id = decodeURIComponent(url.pathname.slice(7));
    } catch {
      return { kind: 'not-found' };
    }
    const from = params.get('from') ?? '#/archive';
    return {
      kind: 'post',
      id,
      returnTo:
        from === '#/' || from === '#/archive' || from.startsWith('#/archive?') ? from : '#/archive',
      section: params.get('section') ?? '',
    };
  }
  return { kind: 'not-found' };
}

export function sectionTarget(route: Route): HTMLElement | null {
  if (route.kind === 'post' && route.section)
    return document.getElementById(`article-section-${route.section}`);
  if (route.kind === 'home' && route.section === 'about')
    return document.getElementById('about-heading');
  return null;
}

export function archiveHref(route: Partial<ArchiveRoute> = {}) {
  const params = new URLSearchParams();
  if (route.query) params.set('q', route.query);
  if (route.category && route.category !== 'all') params.set('category', route.category);
  if (route.sort === 'oldest') params.set('sort', route.sort);
  if (route.savedOnly) params.set('saved', '1');
  if (route.page && route.page > 1) params.set('page', String(route.page));
  return `#/archive${params.size ? `?${params}` : ''}`;
}

export function postHref(id: string, from = '#/archive') {
  return `#/posts/${encodeURIComponent(id)}?from=${encodeURIComponent(from)}`;
}

export function postSectionHref(id: string, from: string, section: string) {
  return `${postHref(id, from)}&section=${encodeURIComponent(section)}`;
}

export function restoredPosition() {
  const state = (history.state ?? {}) as EntryState;
  return positions.get(state.blogEntry ?? '') ?? state;
}
