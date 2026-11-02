import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Menu, Search, X } from 'lucide-react';
import {
  Alert,
  Button,
  EmptyState,
  Heading,
  IconButton,
  Link,
  Spinner,
  Text,
  TextField,
  ThemeProvider,
} from 'yahha-ui';
import { CodeBlock } from './docs/CodeBlock';
import { ExampleSource } from './docs/ExampleSource';
import { SearchResults } from './docs/SearchResults';
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
import brandLogo from './assets/brand/yahha-ui-logo.webp';
import NotFoundScene from './examples/scenes/NotFoundScene';
import HomePage from './site/HomePage';
import DocScene from './site/DocScene';
import Motif from './site/Motif';
import { blogHref, repositoryHref } from './site/site-links';
import './site/guide-layout.css';

/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- API tables need keyboard focus for horizontal scrolling on narrow screens. */

const pages = createDocumentationPages(guideCatalog);
const groupMotifs: Record<string, 'flower' | 'letter' | 'sprout' | 'star' | 'cloud'> = {
  组件: 'star',
  开始使用: 'flower',
  组合示例: 'letter',
  设计与素材: 'sprout',
  通用: 'star',
  排版: 'letter',
  布局: 'cloud',
  表单: 'sprout',
  内容展示: 'flower',
  导航: 'star',
  浮层: 'cloud',
  反馈: 'letter',
  主题配置: 'sprout',
};
const legacy: Record<string, string> = {
  buttons: 'button',
  fields: 'text-field',
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
    ?.querySelector<HTMLDetailsElement>('.doc-disclosure');
  if (disclosure) disclosure.open = true;
  target.focus({ preventScroll: true });
  target.scrollIntoView();
}

function SectionBody({ disclosure, children }: { disclosure?: boolean; children: ReactNode }) {
  return disclosure ? (
    <details className="doc-disclosure">
      <summary>
        查看组合示例与代码 <ChevronRight size={16} aria-hidden="true" />
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

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const [query, setQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState<DocumentationSearchResult[]>();
  const [searchFailed, setSearchFailed] = useState(false);
  const [searchAttempt, setSearchAttempt] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState({ pageId: '', id: '' });
  const [componentLoad, setComponentLoad] = useState<ComponentPageLoad>();
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [Overview, setOverview] = useState<OverviewPage>();
  const [failedOverviewAttempt, setFailedOverviewAttempt] = useState<number | null>(null);
  const overviewFailed = failedOverviewAttempt === loadAttempt;
  const menuButton = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const shortcuts = useRef<HTMLElement>(null);
  const tocRef = useRef<HTMLElement>(null);
  const mobileToc = useRef<HTMLDetailsElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const allowRouteFocus = useRef(true);
  const sidebarPositions = useRef(new Map<DocumentationArea, number>());
  const sidebarArea = useRef<DocumentationArea | undefined>(undefined);
  const isHome = route.path === '/';
  const isOverview = route.path === '/components';
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
  const loadFailed = isOverview ? overviewFailed : currentComponentLoad?.status === 'error';
  const contentReady = isOverview
    ? !!Overview || overviewFailed
    : !!page || !pageSummary || loadFailed;
  const hasQuery = query.trim().length > 0;
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
  const activeTocId = toc.some((item) => item.id === observedSection)
    ? observedSection
    : page?.sections.find((section) =>
        section.examples?.some((example) => example.id === observedSection),
      )?.id;

  useEffect(() => {
    if (hasQuery || isHome || (!menuOpen && !matchMedia('(min-width: 961px)').matches)) return;
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
  }, [area, currentItem?.id, hasQuery, isHome, menuOpen]);
  useEffect(() => {
    if (!hasQuery || searchIndex || searchFailed) return;
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
  }, [hasQuery, searchIndex, searchFailed, searchAttempt]);
  useEffect(() => {
    canonicalizeLocation();
    function onHashChange() {
      canonicalizeLocation();
      allowRouteFocus.current = true;
      setRoute(currentRoute());
      setMenuOpen(false);
      setQuery('');
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
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
    const wasFirst = firstRender.current;
    firstRender.current = false;
    const frame = requestAnimationFrame(() => {
      if (!allowRouteFocus.current) return;
      if (route.section && !loadFailed && document.getElementById(route.section))
        focusSection(route.section);
      else {
        window.scrollTo({ top: 0 });
        if (!wasFirst) headingRef.current?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [route.path, route.section, page, contentReady, loadFailed]);
  useEffect(() => {
    if (!page) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection({ pageId: page?.id ?? '', id: visible[0].target.id });
      },
      { rootMargin: '-80px 0px -65% 0px' },
    );
    document.querySelectorAll('[data-doc-heading]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [page]);
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    searchRef.current?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
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
  }, [menuOpen]);
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
          (directoryHidden ? headingRef.current : searchRef.current)?.focus({
            preventScroll: true,
          });
        else if (
          !tocDesktop.matches &&
          (inToc(active) || (tocHadFocus && active === document.body))
        ) {
          const currentLink = sidebar.current?.querySelector<HTMLElement>(
            '.nav-group a[aria-current="page"]',
          );
          (currentLink ?? searchRef.current)?.focus();
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
          <img className="brand-logo" src={brandLogo} width="824" height="280" alt="" />
        </a>
        <span className="header-divider" />
        <span className="header-caption">
          {isHome ? 'React 组件库' : areaCaption} <span className="version">0.0.1</span>
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
          <Link href={blogHref} className="header-link" target="_blank" rel="noopener noreferrer">
            示例网站 <ArrowUpRight size={16} aria-hidden="true" />
            <span className="sr-only">（新标签页打开）</span>
          </Link>
        </nav>
        <IconButton
          ref={menuButton}
          className="mobile-menu"
          variant="secondary"
          aria-label={menuOpen ? '关闭文档目录' : '打开文档目录'}
          aria-expanded={menuOpen}
          aria-controls="docs-directory"
          onClick={() => setMenuOpen(!menuOpen)}
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
            onClick={() => {
              setMenuOpen(false);
              menuButton.current?.focus();
            }}
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
              <div className={`doc-search${query ? ' has-query' : ''}`}>
                <TextField
                  ref={searchRef}
                  label="搜索文档"
                  leading={<Search size={17} />}
                  type="search"
                  placeholder="搜索全部文档…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  classNames={{
                    label: 'sr-only',
                    inputWrapper: 'doc-search-control',
                    input: 'doc-search-input',
                  }}
                />
                {query && (
                  <IconButton
                    variant="ghost"
                    className="search-clear"
                    aria-label="清空搜索"
                    onClick={() => {
                      setQuery('');
                      searchRef.current?.focus();
                    }}
                  >
                    <X size={17} aria-hidden="true" />
                  </IconButton>
                )}
              </div>
              <nav className="mobile-area-links" aria-label="栏目切换">
                <p>切换栏目</p>
                {documentationAreas.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={!isHome && area === item.id ? 'page' : undefined}
                    onClick={() => {
                      setMenuOpen(false);
                      setQuery('');
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
                if (!hasQuery && !isHome)
                  sidebarPositions.current.set(area, event.currentTarget.scrollTop);
              }}
            >
              <nav aria-label="文档目录">
                {!hasQuery &&
                  navigationGroups.map((group) => {
                    const items = group.items;
                    return items.length ? (
                      <div className="nav-group" key={group.id}>
                        <p>
                          <Motif name={groupMotifs[group.name] ?? 'flower'} />
                          {group.name}
                        </p>
                        {items.map((item) => (
                          <a
                            key={item.id}
                            href={item.href}
                            aria-current={currentItem?.id === item.id ? 'page' : undefined}
                            onClick={() => {
                              setMenuOpen(false);
                              setQuery('');
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
                {hasQuery && searchIndex && searchResults.length > 0 && (
                  <SearchResults
                    query={query}
                    results={searchResults}
                    onSelect={(result) => {
                      setMenuOpen(false);
                      setQuery('');
                      if (window.location.hash === result.href) {
                        const section = new URLSearchParams(result.href.split('?')[1]).get(
                          'section',
                        );
                        requestAnimationFrame(() =>
                          section ? focusSection(section) : headingRef.current?.focus(),
                        );
                      }
                    }}
                  />
                )}
              </nav>
              {hasQuery && !searchIndex && !searchFailed && <p role="status">正在加载搜索索引…</p>}
              {hasQuery && searchFailed && (
                <Alert tone="error" title="搜索暂时不可用">
                  <p>请重试，或清空搜索浏览目录。</p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchFailed(false);
                      setSearchAttempt((attempt) => attempt + 1);
                    }}
                  >
                    重新加载搜索
                  </Button>
                </Alert>
              )}
              {hasQuery && searchIndex && searchResults.length === 0 && (
                <div role="status" className="search-empty">
                  <EmptyState
                    title="未找到相关文档"
                    description="试试其他关键词，或清空搜索返回目录。"
                    action={
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setQuery('');
                          searchRef.current?.focus();
                        }}
                      >
                        返回目录
                      </Button>
                    }
                  />
                </div>
              )}
              <nav className="mobile-site-links" aria-label="示例入口">
                <Link
                  href={blogHref}
                  className="sidebar-blog"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  示例网站 <ArrowUpRight size={16} aria-hidden="true" />
                  <span className="sr-only">（新标签页打开）</span>
                </Link>
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
                  <summary>本页内容</summary>
                  <nav aria-label="本页内容（窄屏）">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        className={item.nested ? 'toc-nested' : undefined}
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
                  <Heading
                    level={2}
                    className="section-title"
                    id={section.id}
                    data-doc-heading
                    tabIndex={-1}
                  >
                    <Motif name={section.id === 'examples' ? 'flower' : 'star'} />
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
                                <tr key={row.name}>
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
                  <Text>请重试，或刷新页面后再试。</Text>
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
              早期预览 · <Link href="#/guides/getting-started">使用方式</Link>
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
    </ThemeProvider>
  );
}
