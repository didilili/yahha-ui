import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { version as packageVersion } from '../../package.json';
import {
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { Alert, Button, Heading, IconButton, Link, Spinner, Text, ThemeProvider } from 'yahha-ui';
import { CodeBlock } from './docs/CodeBlock';
import { ExampleSource } from './docs/ExampleSource';
import { DocumentationSearchDialog } from './docs/DocumentationSearchDialog';
import { apiRowAnchor } from './docs/api-anchor';
import { guideCatalog } from './docs/guide-catalog';
import { loadGuidePage } from './docs/guide-pages';
import { loadComponentPage } from './docs/component-pages';
import { componentCatalog } from './docs/component-catalog';
import {
  createDocumentationPages,
  navigationForArea,
  currentNavigationItem,
  adjacentNavigation,
  canonicalRoute,
  documentationAreas,
} from './docs/navigation';
import {
  buildDocumentationSearchIndex,
  searchDocumentationMatches,
  type DocumentationSearchResult,
} from './docs/search';
import type { DocPage, DocumentationArea } from './docs/types';
import BrandLogo from './site/BrandLogo';
import NotFoundScene from './examples/scenes/NotFoundScene';
import HomePage from './site/HomePage';
import DocScene from './site/DocScene';
import Motif from './site/Motif';
import CategoryIcon from './site/CategoryIcon';
import SectionIcon from './site/SectionIcon';
import { categoryIconFor } from './site/category-icons';
import { repositoryHref } from './site/site-links';
import './site/guide-layout.css';

/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- API tables need keyboard focus for horizontal scrolling on narrow screens. */

const pages = createDocumentationPages(guideCatalog);
const areaMotifs: Record<string, 'flower' | 'letter' | 'sprout'> = {
  开始使用: 'flower',
  组合示例: 'letter',
  设计与素材: 'sprout',
};
const legacy: Record<string, string> = {
  buttons: 'button',
  fields: 'input',
  choices: 'segmented-control',
  dialog: 'dialog',
  empty: 'empty-state',
  feedback: 'toast',
};
const pathFor = (page: { id: string }) => pages.find((item) => item.id === page.id)?.href ?? '#/';
function currentRoute() {
  const hash = window.location.hash;
  if (legacy[hash.slice(1)]) return { path: `/components/${legacy[hash.slice(1)]}`, section: '' };
  const [path, query] = (hash.slice(1) || '/').split('?');
  return canonicalRoute(path, new URLSearchParams(query).get('section') ?? '');
}
function canonicalizeLocation() {
  const [path, query] = window.location.hash.slice(1).split('?');
  const params = new URLSearchParams(query);
  const section = params.get('section') ?? '';
  const canonical = canonicalRoute(path, section);
  if (canonical.path !== path || canonical.section !== section) {
    if (canonical.section) params.set('section', canonical.section);
    else params.delete('section');
    window.history.replaceState(
      window.history.state,
      '',
      `#${canonical.path}${params.size ? `?${params}` : ''}`,
    );
  }
}
function titleFor(page: Pick<DocPage, 'name' | 'chinese'>) {
  return [page.name, page.chinese].filter(Boolean).join(' ');
}

function focusSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  for (let parent = target.parentElement; parent; parent = parent.parentElement) {
    if (parent instanceof HTMLDetailsElement) parent.open = true;
  }
  const disclosure = target
    .closest('.doc-section')
    ?.querySelector<HTMLDetailsElement>(':scope > .doc-disclosure');
  if (disclosure) disclosure.open = true;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: 'start', inline: 'nearest' });
  const table = target.closest<HTMLElement>('.table-scroll');
  if (table) table.scrollLeft = 0;
  const headerBottom = document.querySelector('.docs-header')?.getBoundingClientRect().bottom ?? 0;
  const localToc = document.querySelector<HTMLElement>('.mobile-doc-toc');
  const tocHeight = localToc?.getClientRects().length
    ? (localToc.querySelector('summary')?.getBoundingClientRect().height ?? 0)
    : 0;
  const top = target.getBoundingClientRect().top;
  if (top < headerBottom + tocHeight + 24)
    window.scrollBy({ top: top - headerBottom - tocHeight - 24 });
}

function SectionBody({
  disclosure,
  children,
}: {
  disclosure?: boolean | string;
  children: ReactNode;
}) {
  return disclosure ? (
    <details className="doc-disclosure">
      <summary>
        {typeof disclosure === 'string' ? disclosure : '查看组合示例与代码'}
        <ChevronRight size={16} aria-hidden="true" />
      </summary>
      <div className="doc-disclosure-content">{children}</div>
    </details>
  ) : (
    children
  );
}

type ComponentPageLoad =
  | { id: string; attempt: number; status: 'error' }
  | { id: string; attempt: number; status: 'ready'; page: DocPage };
type OverviewPage = (typeof import('./site/ComponentOverview'))['default'];
type ReadingPosition = {
  y: number;
  expanded: string[];
  details: boolean[];
  focusId?: string;
};

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const [query, setQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState<DocumentationSearchResult[]>();
  const [searchFailed, setSearchFailed] = useState(false);
  const [searchAttempt, setSearchAttempt] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchRequested, setSearchRequested] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState({ pageId: '', id: '' });
  const [componentLoad, setComponentLoad] = useState<ComponentPageLoad>();
  const [expandedExamples, setExpandedExamples] = useState<{ pageId?: string; ids: string[] }>({
    ids: [],
  });
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [Overview, setOverview] = useState<OverviewPage>();
  const [failedOverviewAttempt, setFailedOverviewAttempt] = useState<number | null>(null);
  const overviewFailed = failedOverviewAttempt === loadAttempt;
  const menuButton = useRef<HTMLButtonElement>(null);
  const backToTop = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const shortcuts = useRef<HTMLElement>(null);
  const tocRef = useRef<HTMLElement>(null);
  const mobileToc = useRef<HTMLDetailsElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const sidebarSearchButton = useRef<HTMLButtonElement>(null);
  const headerSearchButton = useRef<HTMLButtonElement>(null);
  const searchReturnFocus = useRef<HTMLElement | null>(null);
  const searchNavigating = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const allowRouteFocus = useRef(true);
  const readingPositions = useRef(new Map<string, ReadingPosition>());
  const readingEntry = useRef({ key: '', hash: '' });
  const pendingReadingPosition = useRef<ReadingPosition | undefined>(undefined);
  const sidebarPositions = useRef(new Map<DocumentationArea, number>());
  const sidebarArea = useRef<DocumentationArea | undefined>(undefined);
  const isHome = route.path === '/';
  const isOverview = route.path === '/components';
  const searchShortcutLabel = /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  const pageSummary = pages.find((item) => item.href.slice(1) === route.path);
  const area =
    pageSummary?.area ?? (route.path.startsWith('/components') ? 'components' : 'getting-started');
  const areaCaption = {
    'getting-started': '使用指南',
    components: '组件文档',
    recipes: '组合示例',
    design: '设计与素材',
  }[area];
  const areaName = documentationAreas.find((item) => item.id === area)?.name ?? '开始使用';
  const isGallery = pageSummary?.presentation === 'gallery';
  const isCompact = pageSummary?.presentation === 'compact';
  const navigationGroups = isHome ? [] : navigationForArea(area, pages);
  const navigationSection =
    route.path === '/guides/states' && activeSection.pageId === 'states'
      ? activeSection.id
      : route.section;
  const currentItem = currentNavigationItem(navigationGroups, route.path, navigationSection);
  const adjacent = adjacentNavigation(navigationGroups, currentItem);
  const componentId =
    !isOverview && pageSummary?.area === 'components' ? pageSummary.id : undefined;
  const documentationId = !isOverview ? pageSummary?.id : undefined;
  const currentComponentLoad =
    componentLoad && componentLoad.id === documentationId && componentLoad.attempt === loadAttempt
      ? componentLoad
      : undefined;
  const page = currentComponentLoad?.status === 'ready' ? currentComponentLoad.page : undefined;
  // A new page starts folded; section links within the same page retain reader choices.
  if (expandedExamples.pageId !== documentationId)
    setExpandedExamples({ pageId: documentationId, ids: [] });
  const exampleIds =
    page?.sections.flatMap((section) => section.examples?.map(({ id }) => id) ?? []) ?? [];
  const codeControlSection = componentId
    ? 'examples'
    : exampleIds.length > 1
      ? page?.sections.find((section) => section.examples?.length)?.id
      : undefined;
  const expandedIds = expandedExamples.pageId === documentationId ? expandedExamples.ids : [];
  const allCodeExpanded =
    exampleIds.length > 0 && exampleIds.every((id) => expandedIds.includes(id));
  function setExampleExpanded(id: string, expanded: boolean) {
    setExpandedExamples((current) => {
      // A clipboard request from an unmounted page must not change the current page.
      if (current.pageId !== documentationId) return current;
      return {
        pageId: documentationId,
        ids: expanded
          ? [...new Set([...current.ids, id])]
          : current.ids.filter((entry) => entry !== id),
      };
    });
  }
  const loadFailed = isOverview ? overviewFailed : currentComponentLoad?.status === 'error';
  const contentReady = isOverview
    ? !!Overview || overviewFailed
    : !!page || !pageSummary || loadFailed;
  const searchResults = searchIndex ? searchDocumentationMatches(searchIndex, query) : [];
  const toc =
    page?.sections
      .filter((section) => section.toc !== false)
      .flatMap((section) => [
        { id: section.id, title: section.tocTitle ?? section.title, nested: false },
        ...(section.examples ?? [])
          .filter((example) => example.toc !== false)
          .map((example) => ({
            id: example.id,
            title: example.tocTitle ?? example.title,
            nested: true,
          })),
      ]) ?? [];
  const observedSection =
    activeSection.pageId === page?.id ? activeSection.id : page?.sections[0]?.id;
  const activeTocId = observedSection?.startsWith('api-')
    ? 'api'
    : toc.some((item) => item.id === observedSection)
      ? observedSection
      : page?.sections.find((section) =>
          section.examples?.some((example) => example.id === observedSection),
        )?.id;

  const dismissDirectory = useCallback(() => {
    setMenuOpen(false);
    requestAnimationFrame(() => {
      if (isHome && matchMedia('(min-width: 961px)').matches)
        headingRef.current?.focus({ preventScroll: true });
      else menuButton.current?.focus({ preventScroll: true });
    });
  }, [isHome]);

  const requestSearch = useCallback(
    (origin?: HTMLElement) => {
      if (!searchOpen) {
        searchReturnFocus.current =
          origin ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      }
      searchNavigating.current = false;
      if (menuOpen) {
        setMenuOpen(false);
        setSearchRequested(true);
      } else {
        setSearchOpen(true);
        requestAnimationFrame(() => {
          searchRef.current?.focus();
          searchRef.current?.select();
        });
      }
    },
    [menuOpen, searchOpen],
  );

  useEffect(() => {
    if (!searchRequested || menuOpen) return;
    // Let the directory release its scroll lock before opening the search dialog.
    const frame = requestAnimationFrame(() => {
      setSearchRequested(false);
      setSearchOpen(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [searchRequested, menuOpen]);

  useEffect(() => {
    function openSearch(event: KeyboardEvent) {
      const activeDialog = document.activeElement?.closest(
        '[role="dialog"][data-open], [role="alertdialog"][data-open], dialog[open]',
      );
      if (activeDialog && !activeDialog.classList.contains('doc-search-dialog')) return;
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== 'k'
      )
        return;
      event.preventDefault();
      requestSearch();
    }
    window.addEventListener('keydown', openSearch);
    return () => window.removeEventListener('keydown', openSearch);
  }, [requestSearch]);
  useEffect(() => {
    function updateBackToTop() {
      const visible = window.scrollY > 600;
      if (!visible && document.activeElement === backToTop.current)
        headingRef.current?.focus({ preventScroll: true });
      setShowBackToTop(visible);
    }
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    return () => window.removeEventListener('scroll', updateBackToTop);
  }, []);

  useEffect(() => {
    if (isHome || (!menuOpen && !matchMedia('(min-width: 961px)').matches)) return;
    const frame = requestAnimationFrame(() => {
      const container = sidebar.current?.querySelector<HTMLElement>('.docs-sidebar-scroll');
      if (!container) return;
      if (sidebarArea.current !== area) {
        container.scrollTop = sidebarPositions.current.get(area) ?? 0;
        sidebarArea.current = area;
      }
      const selected = container.querySelector<HTMLElement>('.nav-group a[aria-current="page"]');
      if (!selected) return;
      const item = selected.getBoundingClientRect(),
        panel = container.getBoundingClientRect();
      if (item.top < panel.top + 8) container.scrollTop -= panel.top + 8 - item.top;
      else if (item.bottom > panel.bottom - 8)
        container.scrollTop += item.bottom - panel.bottom + 8;
    });
    return () => cancelAnimationFrame(frame);
  }, [area, currentItem?.id, isHome, menuOpen]);
  useEffect(() => {
    if (!searchOpen || searchIndex || searchFailed) return;
    let cancelled = false;
    Promise.all([import('virtual:yahha-doc-search'), import('./docs/guides')]).then(
      ([{ default: sections }, { guidePages }]) => {
        if (!cancelled)
          setSearchIndex(
            buildDocumentationSearchIndex(componentCatalog, sections, guidePages, pages),
          );
      },
      () => {
        if (!cancelled) setSearchFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [searchOpen, searchIndex, searchFailed, searchAttempt]);
  useEffect(() => {
    canonicalizeLocation();
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const initialKey = window.history.state?.yahhaReadingKey ?? crypto.randomUUID();
    window.history.replaceState({ ...window.history.state, yahhaReadingKey: initialKey }, '');
    readingEntry.current = { key: initialKey, hash: window.location.hash };
    function rememberPosition() {
      const active = document.activeElement;
      readingPositions.current.set(readingEntry.current.key, {
        y: window.scrollY,
        expanded: Array.from(document.querySelectorAll<HTMLElement>('.example-block')).flatMap(
          (example) =>
            example.querySelector('.component-source button[aria-expanded="true"]')
              ? [example.id]
              : [],
        ),
        details: Array.from(
          document.querySelectorAll<HTMLDetailsElement>(
            'article .doc-disclosure, article .example-setup',
          ),
          (details) => details.open,
        ),
        focusId:
          active?.closest('.example-block')?.id ??
          active?.closest('.doc-section')?.querySelector<HTMLElement>('[data-doc-heading]')?.id,
      });
    }
    function onNavigation() {
      canonicalizeLocation();
      const hash = window.location.hash;
      const storedKey = window.history.state?.yahhaReadingKey;
      if (storedKey === readingEntry.current.key && hash === readingEntry.current.hash) return;
      rememberPosition();
      // Hash links create fresh entries; existing keys identify Back/Forward visits.
      const key =
        storedKey && storedKey !== readingEntry.current.key ? storedKey : crypto.randomUUID();
      window.history.replaceState({ ...window.history.state, yahhaReadingKey: key }, '');
      const saved = readingPositions.current.get(key);
      pendingReadingPosition.current = saved;
      readingEntry.current = { key, hash };
      const nextRoute = currentRoute();
      if (saved) {
        const summary = pages.find((item) => item.href.slice(1) === nextRoute.path);
        setExpandedExamples({ pageId: summary?.id, ids: saved.expanded });
      }
      allowRouteFocus.current = true;
      setRoute(nextRoute);
      setMenuOpen(false);
      searchNavigating.current = true;
      setSearchOpen(false);
      setSearchRequested(false);
    }
    function onHistoryVisit(event: PopStateEvent) {
      // Fresh fragment links can emit popstate during an Enter handler. Handle
      // those at hashchange, after the input event has finished bubbling.
      if (readingPositions.current.has(event.state?.yahhaReadingKey)) onNavigation();
    }
    window.addEventListener('popstate', onHistoryVisit);
    window.addEventListener('hashchange', onNavigation);
    return () => {
      window.removeEventListener('popstate', onHistoryVisit);
      window.removeEventListener('hashchange', onNavigation);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);
  useEffect(() => {
    if (!isOverview || Overview || overviewFailed) return;
    let cancelled = false;
    import('./site/ComponentOverview').then(
      (module) => {
        if (!cancelled) setOverview(() => module.default);
      },
      () => {
        if (!cancelled) setFailedOverviewAttempt(loadAttempt);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [isOverview, loadAttempt, Overview, overviewFailed]);
  useEffect(() => {
    if (!documentationId) return;
    let cancelled = false;
    (componentId ? loadComponentPage(documentationId) : loadGuidePage(documentationId)).then(
      (loadedPage) => {
        if (!cancelled)
          setComponentLoad({
            id: documentationId,
            attempt: loadAttempt,
            status: 'ready',
            page: loadedPage,
          });
      },
      () => {
        if (!cancelled)
          setComponentLoad({ id: documentationId, attempt: loadAttempt, status: 'error' });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [componentId, documentationId, loadAttempt]);
  useEffect(() => {
    if (!contentReady) return;
    const frame = requestAnimationFrame(() => {
      // A cancelled frame must not consume the initial render (including Strict Mode replay).
      const wasFirst = firstRender.current;
      firstRender.current = false;
      if (!allowRouteFocus.current) return;
      const saved = pendingReadingPosition.current;
      if (saved) {
        pendingReadingPosition.current = undefined;
        document
          .querySelectorAll<HTMLDetailsElement>('article .doc-disclosure, article .example-setup')
          .forEach((details, index) => {
            details.open = saved.details[index] ?? false;
          });
        window.scrollTo({ top: saved.y, behavior: 'instant' });
        const target = document.getElementById(saved.focusId ?? '') ?? headingRef.current;
        target?.focus({ preventScroll: true });
        return;
      }
      if (route.section && !loadFailed && document.getElementById(route.section))
        focusSection(route.section);
      else {
        window.scrollTo({ top: 0 });
        if (!wasFirst) headingRef.current?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [route, page, contentReady, loadFailed]);
  useEffect(() => {
    if (!page) return;
    let frame = 0;
    function scheduleUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const header = document.querySelector('.docs-header')?.getBoundingClientRect().bottom ?? 0;
        const local = mobileToc.current;
        const tocHeight = local?.getClientRects().length
          ? (local.querySelector('summary')?.getBoundingClientRect().height ?? 0)
          : 0;
        const headings = Array.from(
          document.querySelectorAll<HTMLElement>('article [data-doc-heading]:not([data-api-row])'),
        ).filter((heading) => heading.getClientRects().length > 0);
        let id = headings[0]?.id ?? '';
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top > header + tocHeight + 40) break;
          id = heading.id;
        }
        setActiveSection((current) =>
          current.pageId === page?.id && current.id === id
            ? current
            : { pageId: page?.id ?? '', id },
        );
      });
    }
    const observer = new ResizeObserver(scheduleUpdate);
    const article = document.querySelector('main article');
    if (article) observer.observe(article);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    scheduleUpdate();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [page]);
  useEffect(() => {
    let frame = 0;
    function revealCurrentItem() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const container = tocRef.current;
        const selected = container?.querySelector<HTMLElement>('a[aria-current="location"]');
        if (!container?.getClientRects().length || !selected) return;
        const panel = container.getBoundingClientRect(),
          item = selected.getBoundingClientRect();
        if (item.top < panel.top + 8) container.scrollTop -= panel.top + 8 - item.top;
        else if (item.bottom > panel.bottom - 8)
          container.scrollTop += item.bottom - panel.bottom + 8;
      });
    }
    revealCurrentItem();
    window.addEventListener('resize', revealCurrentItem);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', revealCurrentItem);
    };
  }, [activeTocId, page]);
  useEffect(() => {
    if ((menuOpen || searchOpen) && mobileToc.current) mobileToc.current.open = false;
  }, [menuOpen, searchOpen]);
  useEffect(() => {
    const details = mobileToc.current;
    if (!details) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && details?.open) {
        event.preventDefault();
        details.open = false;
        details.querySelector('summary')?.focus();
      }
    }
    function onFocusOut(event: FocusEvent) {
      if (!details?.contains(event.relatedTarget as Node | null)) details!.open = false;
    }
    function onPointerDown(event: PointerEvent) {
      if (!details?.contains(event.target as Node)) details!.open = false;
    }
    details.addEventListener('keydown', onKeyDown);
    details.addEventListener('focusout', onFocusOut);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      details.removeEventListener('keydown', onKeyDown);
      details.removeEventListener('focusout', onFocusOut);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [page]);
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sidebarSearchButton.current?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      if (event.key === 'Escape') {
        dismissDirectory();
      }
      if (event.key === 'Tab') {
        const controls = [
          menuButton.current,
          ...Array.from(sidebar.current?.querySelectorAll<HTMLElement>('a, input, button') ?? []),
        ].filter(
          (element): element is HTMLElement => !!element && element.getClientRects().length > 0,
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen, dismissDirectory]);
  useEffect(() => {
    const media = matchMedia('(min-width: 961px)');
    const tocDesktop = matchMedia('(min-width: 1201px)');
    const inCollapsibleNavigation = (target: EventTarget | null) =>
      target instanceof Node &&
      (!!sidebar.current?.contains(target) || !!shortcuts.current?.contains(target));
    let navigationHadFocus = inCollapsibleNavigation(document.activeElement);
    const inToc = (target: EventTarget | null) =>
      target instanceof Node && !!tocRef.current?.contains(target);
    const inMobileToc = (target: EventTarget | null) =>
      target instanceof Node && !!mobileToc.current?.contains(target);
    let tocHadFocus = inToc(document.activeElement);
    let mobileTocHadFocus = inMobileToc(document.activeElement);
    let menuHadFocus = document.activeElement === menuButton.current;
    function rememberFocus(event: FocusEvent) {
      allowRouteFocus.current = false;
      navigationHadFocus = inCollapsibleNavigation(event.target);
      tocHadFocus = inToc(event.target);
      mobileTocHadFocus = inMobileToc(event.target);
      menuHadFocus = event.target === menuButton.current;
    }
    function rememberPointer(event: PointerEvent) {
      allowRouteFocus.current = false;
      if (!inCollapsibleNavigation(event.target)) navigationHadFocus = false;
      if (!inToc(event.target)) tocHadFocus = false;
      if (!inMobileToc(event.target)) mobileTocHadFocus = false;
      if (
        event.target !== menuButton.current &&
        (!(event.target instanceof Node) || !menuButton.current?.contains(event.target))
      )
        menuHadFocus = false;
    }
    function handleBreakpointChange() {
      const active = document.activeElement;
      if (media.matches) {
        setMenuOpen(false);
        if (
          tocDesktop.matches &&
          (inMobileToc(active) || (mobileTocHadFocus && active === document.body))
        ) {
          const links = tocRef.current?.querySelectorAll<HTMLAnchorElement>('a');
          const link =
            Array.from(links ?? []).find((item) => item.hash === window.location.hash) ??
            links?.[0];
          link?.focus({ preventScroll: true });
          return;
        }
        const directoryHidden = !sidebar.current?.getClientRects().length;
        const lostDirectoryFocus =
          (sidebar.current?.contains(active) &&
            (directoryHidden ||
              (active instanceof HTMLElement && !active.getClientRects().length))) ||
          (navigationHadFocus && active === document.body);
        if (
          active === menuButton.current ||
          (menuHadFocus && active === document.body) ||
          lostDirectoryFocus
        )
          (directoryHidden ? headingRef.current : sidebarSearchButton.current)?.focus({
            preventScroll: true,
          });
        else if (
          !tocDesktop.matches &&
          (inToc(active) || (tocHadFocus && active === document.body))
        ) {
          const currentLink = sidebar.current?.querySelector<HTMLElement>(
            '.nav-group a[aria-current="page"]',
          );
          (currentLink ?? sidebarSearchButton.current)?.focus();
        }
      } else if (
        inCollapsibleNavigation(active) ||
        inToc(active) ||
        ((navigationHadFocus || tocHadFocus) && active === document.body)
      ) {
        menuButton.current?.focus({ preventScroll: true });
      }
    }
    function cancelPendingRouteFocus() {
      allowRouteFocus.current = false;
    }
    document.addEventListener('focusin', rememberFocus);
    document.addEventListener('pointerdown', rememberPointer);
    document.addEventListener('keydown', cancelPendingRouteFocus);
    media.addEventListener('change', handleBreakpointChange);
    tocDesktop.addEventListener('change', handleBreakpointChange);
    return () => {
      document.removeEventListener('focusin', rememberFocus);
      document.removeEventListener('pointerdown', rememberPointer);
      document.removeEventListener('keydown', cancelPendingRouteFocus);
      media.removeEventListener('change', handleBreakpointChange);
      tocDesktop.removeEventListener('change', handleBreakpointChange);
    };
  }, []);

  return (
    <ThemeProvider theme="pink" className="docs-app docs-site docs-cartoon">
      <title>
        {isHome
          ? 'Yahha UI · 漫画手账风 React 组件库'
          : `${pageSummary ? titleFor(pageSummary) : '页面未找到'} · Yahha UI`}
      </title>
      <a
        className="skip-link"
        href="#doc-content"
        onClick={(event) => {
          event.preventDefault();
          headingRef.current?.focus();
        }}
      >
        跳到主要内容
      </a>
      <header className="docs-header">
        <a className="docs-brand" href="#/" aria-label="Yahha UI 首页" inert={menuOpen}>
          <BrandLogo inactive={menuOpen} />
        </a>
        <span className="header-divider" />
        <span className="header-caption">
          {isHome ? 'React 组件库' : areaCaption} <span className="version">{packageVersion}</span>
        </span>
        <nav ref={shortcuts} className="header-links" aria-label="快捷导航" inert={menuOpen}>
          <Link href="#/" className="header-link" aria-current={isHome ? 'page' : undefined}>
            首页
          </Link>
          {documentationAreas.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="header-link"
              aria-current={!isHome && pageSummary?.area === item.id ? 'page' : undefined}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <IconButton
          ref={headerSearchButton}
          variant="ghost"
          className="header-search"
          aria-label="搜索文档"
          aria-haspopup="dialog"
          aria-keyshortcuts="Meta+K Control+K"
          title={`搜索文档（${searchShortcutLabel}）`}
          inert={menuOpen}
          onClick={(event) => requestSearch(event.currentTarget)}
        >
          <Search size={20} aria-hidden="true" />
        </IconButton>
        <IconButton
          ref={menuButton}
          className="mobile-menu"
          variant="secondary"
          aria-label={menuOpen ? '关闭文档目录' : '打开文档目录'}
          aria-expanded={menuOpen}
          aria-controls="docs-directory"
          onClick={() => (menuOpen ? dismissDirectory() : setMenuOpen(true))}
        >
          {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </IconButton>
      </header>
      <div
        className={`docs-layout${isHome ? ' is-home' : isOverview ? ' is-overview' : isGallery ? ' is-gallery' : ''}${isCompact ? ' is-compact-guide' : ''}${area === 'design' ? ' is-design-area' : ''}`}
      >
        {menuOpen && (
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="关闭文档目录遮罩"
            tabIndex={-1}
            onClick={dismissDirectory}
          />
        )}
        <aside
          ref={sidebar}
          id="docs-directory"
          className={`docs-sidebar ${menuOpen ? 'is-open' : ''}`}
          inert={isHome && !menuOpen}
        >
          <div className="docs-sidebar-inner">
            <div className="docs-sidebar-tools">
              <Button
                ref={sidebarSearchButton}
                variant="secondary"
                className="doc-search-trigger"
                aria-label="搜索文档"
                aria-haspopup="dialog"
                aria-keyshortcuts="Meta+K Control+K"
                startIcon={<Search size={17} aria-hidden="true" />}
                onClick={(event) => requestSearch(event.currentTarget)}
              >
                <span>搜索文档…</span>
                <kbd className="doc-search-shortcut" aria-hidden="true">
                  {searchShortcutLabel}
                </kbd>
              </Button>
              <nav className="mobile-area-links" aria-label="栏目切换">
                <p>切换栏目</p>
                {documentationAreas.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={!isHome && area === item.id ? 'page' : undefined}
                    onClick={() => {
                      setMenuOpen(false);
                      if (window.location.hash === item.href)
                        requestAnimationFrame(() => headingRef.current?.focus());
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div
              className="docs-sidebar-scroll"
              onScroll={(event) => {
                if (!isHome) sidebarPositions.current.set(area, event.currentTarget.scrollTop);
              }}
            >
              <nav aria-label="文档目录">
                {navigationGroups.map((group) => {
                  const items = group.items;
                  const categoryIcon = categoryIconFor(group.name);
                  return items.length ? (
                    <div className="nav-group" key={group.id}>
                      <p>
                        {categoryIcon ? (
                          <CategoryIcon name={categoryIcon} size="compact" />
                        ) : (
                          <Motif name={areaMotifs[group.name] ?? 'flower'} />
                        )}
                        {group.name}
                      </p>
                      {items.map((item) => (
                        <a
                          key={item.id}
                          href={item.href}
                          aria-current={currentItem?.id === item.id ? 'page' : undefined}
                          onClick={() => {
                            setMenuOpen(false);
                            if (window.location.hash === item.href)
                              requestAnimationFrame(() => {
                                const section = new URLSearchParams(item.href.split('?')[1]).get(
                                  'section',
                                );
                                if (section) focusSection(section);
                                else headingRef.current?.focus();
                              });
                          }}
                        >
                          <span>{item.name}</span>
                          {item.chinese && <span className="nav-chinese">{item.chinese}</span>}
                        </a>
                      ))}
                    </div>
                  ) : null;
                })}
              </nav>
            </div>
          </div>
        </aside>
        <main
          id="doc-content"
          className={`docs-content${isHome ? ' is-home' : isOverview ? ' is-overview' : ''}`}
          inert={menuOpen}
        >
          {isHome ? (
            <HomePage headingRef={headingRef} />
          ) : isOverview && Overview ? (
            <Overview headingRef={headingRef} />
          ) : page ? (
            <article key={page.id}>
              <header className="doc-heading">
                <div className="doc-title-row">
                  <div className="doc-title-copy">
                    <p className="doc-eyebrow">
                      {page.area && page.area !== 'components'
                        ? areaName
                        : `${page.group} / COMPONENT`}
                    </p>
                    <Heading level={1} tabIndex={-1} ref={headingRef} className="doc-title">
                      <span className="doc-title-name">{page.name}</span>
                      {page.chinese && (
                        <>
                          {' '}
                          <span className="doc-title-chinese">{page.chinese}</span>
                        </>
                      )}
                    </Heading>
                    <Text className="doc-description">{page.description}</Text>
                  </div>
                  {isCompact ? (
                    <Motif name={area === 'design' ? 'sprout' : 'flower'} />
                  ) : (
                    <DocScene />
                  )}
                </div>
                {page.importCode && <CodeBlock source={page.importCode} compact />}
              </header>
              {!isGallery && (
                <details className="mobile-doc-toc" ref={mobileToc}>
                  <summary>
                    <span>本页内容</span>
                    <span className="mobile-doc-toc-current">
                      {toc.find((item) => item.id === activeTocId)?.title}
                    </span>
                    <ChevronDown size={16} aria-hidden="true" />
                  </summary>
                  <nav aria-label="本页内容（窄屏）">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        className={item.nested ? 'toc-nested' : undefined}
                        aria-current={activeTocId === item.id ? 'location' : undefined}
                        href={`${pathFor(page)}?section=${item.id}`}
                        onClick={() => {
                          if (mobileToc.current) mobileToc.current.open = false;
                          if (route.section === item.id)
                            requestAnimationFrame(() => focusSection(item.id));
                        }}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </details>
              )}
              {page.sections.map((section) => (
                <section className="doc-section" key={section.id}>
                  <div className="doc-section-header">
                    <Heading
                      level={2}
                      className={`section-title${section.kind ? ' has-section-icon' : ''}`}
                      id={section.id}
                      data-doc-heading
                      tabIndex={-1}
                    >
                      {section.kind && <SectionIcon name={section.kind} />}
                      {section.title}
                      <a
                        className="heading-anchor"
                        href={`${pathFor(page)}?section=${section.id}`}
                        aria-label={`链接到${section.title}`}
                        onClick={() => {
                          if (route.section === section.id) focusSection(section.id);
                        }}
                      >
                        #
                      </a>
                    </Heading>
                    {section.id === codeControlSection && exampleIds.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="doc-code-toggle"
                        startIcon={<Code2 size={16} aria-hidden="true" />}
                        aria-expanded={allCodeExpanded}
                        onClick={() => {
                          if (!allCodeExpanded) {
                            document
                              .querySelectorAll<HTMLDetailsElement>('.doc-disclosure')
                              .forEach((details) => {
                                if (details.querySelector('.component-source')) details.open = true;
                              });
                          }
                          setExpandedExamples({
                            pageId: documentationId,
                            ids: allCodeExpanded ? [] : exampleIds,
                          });
                        }}
                      >
                        {allCodeExpanded ? '收起全部代码' : '展开全部代码'}
                      </Button>
                    )}
                  </div>
                  <SectionBody disclosure={section.disclosure}>
                    {section.content && <div className="doc-prose">{section.content}</div>}
                    {section.examples?.map(
                      ({
                        id,
                        title,
                        description,
                        component: Example,
                        source,
                        themeScope,
                        assets,
                        previewAlign,
                      }) => (
                        <section
                          id={id}
                          data-doc-heading
                          tabIndex={-1}
                          className="example-block"
                          key={id}
                          aria-labelledby={`${id}-label`}
                        >
                          <header className="example-description">
                            <Heading level={3} className="example-title">
                              <span id={`${id}-label`}>{title}</span>
                              <a
                                className="heading-anchor"
                                href={`${pathFor(page)}?section=${id}`}
                                aria-label={`链接到${title}`}
                                onClick={() => {
                                  if (route.section === id) focusSection(id);
                                }}
                              >
                                #
                              </a>
                            </Heading>
                            <Text className="example-caption">{description}</Text>
                          </header>
                          <div className="example-frame">
                            <div
                              className={`example-preview${previewAlign === 'center' ? ' is-centered' : ''}`}
                            >
                              <Example />
                            </div>
                            <ExampleSource
                              source={source}
                              themeScope={themeScope}
                              assets={assets}
                              expanded={expandedIds.includes(id)}
                              onExpandedChange={(expanded) => setExampleExpanded(id, expanded)}
                            />
                          </div>
                        </section>
                      ),
                    )}
                    {section.api?.map((api) => (
                      <div className="api-group" key={api.name}>
                        <Heading level={3} className="api-title">
                          {api.name}
                        </Heading>
                        <Text size="sm" tone="muted" className="api-scroll-hint">
                          左右滑动查看完整表格；键盘聚焦后可用左右方向键。
                        </Text>
                        <div
                          className="table-scroll"
                          tabIndex={0}
                          role="region"
                          aria-label={`${api.name} API 表格`}
                        >
                          <table className="api-table">
                            <thead>
                              <tr>
                                <th scope="col">属性</th>
                                <th scope="col">说明</th>
                                <th scope="col">类型</th>
                                <th scope="col">默认值</th>
                              </tr>
                            </thead>
                            <tbody>
                              {api.rows.map((row) => (
                                <tr
                                  key={row.name}
                                  id={apiRowAnchor(api.name, row.name)}
                                  data-doc-heading
                                  data-api-row
                                  tabIndex={-1}
                                >
                                  <th scope="row">
                                    <code>{row.name}</code>
                                    {row.required && <span className="required-tag">必填</span>}
                                  </th>
                                  <td>{row.description}</td>
                                  <td>
                                    <code>{row.type}</code>
                                  </td>
                                  <td>
                                    <code>{row.defaultValue ?? '—'}</code>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </SectionBody>
                </section>
              ))}
              <nav className="page-pagination" aria-label="相邻文档">
                {adjacent.previous ? (
                  <a href={adjacent.previous.href}>
                    <span>
                      <ChevronLeft size={14} />
                      上一篇
                    </span>
                    <strong>{titleFor(adjacent.previous)}</strong>
                  </a>
                ) : (
                  <span />
                )}
                {adjacent.next && (
                  <a href={adjacent.next.href}>
                    <span>
                      下一篇
                      <ChevronRight size={14} />
                    </span>
                    <strong>{titleFor(adjacent.next)}</strong>
                  </a>
                )}
              </nav>
            </article>
          ) : pageSummary ? (
            <article key={pageSummary.id}>
              <header className="doc-heading">
                <div className="doc-title-row">
                  <div className="doc-title-copy">
                    <p className="doc-eyebrow">
                      {isOverview
                        ? 'CATALOG / 组件总览'
                        : componentId
                          ? `${pageSummary.group} / COMPONENT`
                          : areaName}
                    </p>
                    <Heading level={1} tabIndex={-1} ref={headingRef} className="doc-title">
                      <span className="doc-title-name">{pageSummary.name}</span>
                      {pageSummary.chinese && (
                        <>
                          {' '}
                          <span className="doc-title-chinese">{pageSummary.chinese}</span>
                        </>
                      )}
                    </Heading>
                    <Text className="doc-description">{pageSummary.description}</Text>
                  </div>
                  {isCompact ? (
                    <Motif name={area === 'design' ? 'sprout' : 'flower'} />
                  ) : (
                    <DocScene />
                  )}
                </div>
              </header>
              {loadFailed ? (
                <Alert
                  tone="error"
                  role="alert"
                  title={
                    isOverview
                      ? '组件总览加载失败'
                      : componentId
                        ? '组件文档加载失败'
                        : '指南文档加载失败'
                  }
                  className="doc-load-error"
                >
                  <Text>请重新加载；如果仍未打开，再刷新页面试试。</Text>
                  <Button
                    variant="secondary"
                    className="doc-retry"
                    onClick={() => {
                      allowRouteFocus.current = true;
                      setLoadAttempt((attempt) => attempt + 1);
                    }}
                  >
                    {isOverview ? '重新加载总览' : '重新加载文档'}
                  </Button>
                </Alert>
              ) : (
                <div className="doc-loading">
                  <Spinner
                    label={
                      isOverview
                        ? '正在加载组件总览'
                        : componentId
                          ? '正在加载组件文档'
                          : '正在加载指南文档'
                    }
                  />
                  <span aria-hidden="true">
                    {isOverview
                      ? '正在加载组件总览…'
                      : componentId
                        ? '正在加载组件文档…'
                        : '正在加载指南文档…'}
                  </span>
                </div>
              )}
            </article>
          ) : (
            <article className="not-found">
              <NotFoundScene asPage headingRef={headingRef} />
            </article>
          )}
          <footer className="docs-footer">
            <span>Yahha UI · 把可爱，搭进你的世界。</span>
            <span>
              <Link href="#/guides/getting-started">使用方式</Link>
              {' · '}
              <Link href={repositoryHref} external>
                源码仓库
              </Link>
              {' · '}
              <Link href="#/guides/getting-started?section=feedback">问题反馈</Link>
            </span>
          </footer>
        </main>
        {page && !isGallery && (
          <aside ref={tocRef} className="docs-toc" inert={menuOpen}>
            <p>本页内容</p>
            <nav aria-label="本页内容">
              {toc.map((item) => (
                <a
                  key={item.id}
                  className={item.nested ? 'toc-nested' : ''}
                  aria-current={activeTocId === item.id ? 'location' : undefined}
                  href={`${pathFor(page)}?section=${item.id}`}
                  onClick={() => {
                    if (route.section === item.id) focusSection(item.id);
                  }}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>
      <DocumentationSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        query={query}
        onQueryChange={setQuery}
        results={searchResults}
        loading={!searchIndex && !searchFailed}
        error={searchFailed}
        onRetry={() => {
          setSearchFailed(false);
          setSearchAttempt((attempt) => attempt + 1);
        }}
        inputRef={searchRef}
        onSelect={(result) => {
          searchNavigating.current = true;
          allowRouteFocus.current = true;
          setSearchOpen(false);
          if (window.location.hash === result.href) {
            const section = new URLSearchParams(result.href.split('?')[1]).get('section');
            requestAnimationFrame(() =>
              section ? focusSection(section) : headingRef.current?.focus(),
            );
          }
        }}
        finalFocus={() => {
          if (searchNavigating.current) return false;
          const origin = searchReturnFocus.current;
          if (origin?.isConnected && origin.getClientRects().length && !origin.closest('[inert]'))
            return origin;
          if (menuButton.current?.getClientRects().length) return menuButton.current;
          return headerSearchButton.current ?? headingRef.current ?? false;
        }}
      />
      {!isHome && showBackToTop && !menuOpen && (
        <IconButton
          ref={backToTop}
          variant="secondary"
          className="docs-back-to-top"
          aria-label="返回顶部"
          title="返回顶部"
          onClick={() => {
            headingRef.current?.focus({ preventScroll: true });
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </IconButton>
      )}
    </ThemeProvider>
  );
}
