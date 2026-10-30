import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, Menu, Search, X } from 'lucide-react';
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
import { guidePages } from './docs/guides';
import { loadComponentPage } from './docs/component-pages';
import { componentCatalog, componentGroups, configurationGroups } from './docs/component-catalog';
import type { DocPage } from './docs/types';
import brandLogo from './assets/brand/yahha-ui-logo.png';
import NotFoundScene from './examples/scenes/NotFoundScene';
import HomePage from './site/HomePage';
import DocScene from './site/DocScene';
import Motif from './site/Motif';
import { blogHref } from './site/site-links';

/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- API tables need keyboard focus for horizontal scrolling on narrow screens. */

const overviewSummary = {
  id: 'component-overview',
  name: '组件总览',
  chinese: '',
  group: '开始使用',
  description: '朋友们把组件摆好了。按分类挑选，查看交互示例、使用方法与 API。',
} as const;
const pages = [...guidePages, overviewSummary, ...componentCatalog];
const groups = ['开始使用', ...componentGroups, ...configurationGroups] as const;
const groupMotifs = {
  开始使用: 'flower',
  通用: 'star',
  排版: 'letter',
  布局: 'cloud',
  表单: 'sprout',
  内容展示: 'flower',
  导航: 'star',
  浮层: 'cloud',
  反馈: 'letter',
  主题配置: 'sprout',
} as const;
const componentAliases = new Map(componentCatalog.map((page) => [page.id, page.aliases ?? []]));
const legacy: Record<string, string> = {
  buttons: 'button',
  fields: 'text-field',
  choices: 'segmented-control',
  dialog: 'dialog',
  empty: 'empty-state',
  feedback: 'toast',
};
const pathFor = (page: Pick<DocPage, 'id' | 'group'>) =>
  page.id === overviewSummary.id
    ? '#/components'
    : `#/${page.group === '开始使用' ? 'guides' : 'components'}/${page.id}`;
function currentRoute() {
  const hash = window.location.hash;
  if (legacy[hash.slice(1)]) return { path: `/components/${legacy[hash.slice(1)]}`, section: '' };
  const [path, query] = (hash.slice(1) || '/').split('?');
  return { path, section: new URLSearchParams(query).get('section') ?? '' };
}
function titleFor(page: Pick<DocPage, 'name' | 'chinese'>) {
  return [page.name, page.chinese].filter(Boolean).join(' ');
}

function focusSection(id: string) {
  const target = document.getElementById(id);
  target?.focus({ preventScroll: true });
  target?.scrollIntoView();
}

type ComponentPageLoad =
  | { id: string; attempt: number; status: 'error' }
  | { id: string; attempt: number; status: 'ready'; page: DocPage };
type OverviewPage = (typeof import('./site/ComponentOverview'))['default'];

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const [query, setQuery] = useState('');
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
  const searchRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const allowRouteFocus = useRef(true);
  const isHome = route.path === '/';
  const isOverview = route.path === '/components';
  const pageSummary = pages.find((item) => pathFor(item).slice(1) === route.path);
  const componentId = pageSummary?.group === '开始使用' ? undefined : pageSummary?.id;
  const isGettingStarted =
    pageSummary?.id === 'introduction' || pageSummary?.id === 'getting-started';
  const isDesignGuide = pageSummary?.group === '开始使用' && !isOverview && !isGettingStarted;
  const currentComponentLoad =
    componentLoad && componentLoad.id === componentId && componentLoad.attempt === loadAttempt
      ? componentLoad
      : undefined;
  const page = componentId
    ? currentComponentLoad?.status === 'ready'
      ? currentComponentLoad.page
      : undefined
    : guidePages.find((item) => pathFor(item).slice(1) === route.path);
  const loadFailed = isOverview ? overviewFailed : currentComponentLoad?.status === 'error';
  const contentReady = isOverview
    ? !!Overview || overviewFailed
    : !!page || !pageSummary || loadFailed;
  const pageIndex = pageSummary ? pages.findIndex((item) => item.id === pageSummary.id) : -1;
  const filtered = pages.filter((item) =>
    `${item.name} ${item.chinese} ${item.description} ${item.group} ${(componentAliases.get(item.id) ?? []).join(' ')}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const toc =
    page?.sections.flatMap((section) => [
      { id: section.id, title: section.title, nested: false },
      ...(section.examples ?? []).map((example) => ({
        id: example.id,
        title: example.title,
        nested: true,
      })),
    ]) ?? [];

  useEffect(() => {
    function onHashChange() {
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
    if (!componentId) return;
    let cancelled = false;
    loadComponentPage(componentId).then(
      (loadedPage) => {
        if (!cancelled)
          setComponentLoad({
            id: componentId,
            attempt: loadAttempt,
            status: 'ready',
            page: loadedPage,
          });
      },
      () => {
        if (!cancelled)
          setComponentLoad({ id: componentId, attempt: loadAttempt, status: 'error' });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [componentId, loadAttempt]);
  useEffect(() => {
    if (!contentReady) return;
    const wasFirst = firstRender.current;
    firstRender.current = false;
    const frame = requestAnimationFrame(() => {
      if (!allowRouteFocus.current) return;
      if (route.section) focusSection(route.section);
      else {
        window.scrollTo({ top: 0 });
        if (!wasFirst) headingRef.current?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [route.path, route.section, page, contentReady]);
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
    let tocHadFocus = inToc(document.activeElement);
    let menuHadFocus = document.activeElement === menuButton.current;
    function rememberFocus(event: FocusEvent) {
      allowRouteFocus.current = false;
      navigationHadFocus = inCollapsibleNavigation(event.target);
      tocHadFocus = inToc(event.target);
      menuHadFocus = event.target === menuButton.current;
    }
    function rememberPointer(event: PointerEvent) {
      allowRouteFocus.current = false;
      if (!inCollapsibleNavigation(event.target)) navigationHadFocus = false;
      if (!inToc(event.target)) tocHadFocus = false;
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
          const currentLink = sidebar.current?.querySelector<HTMLElement>('a[aria-current="page"]');
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
    <ThemeProvider theme="chiikawa" className="docs-app docs-site docs-cartoon">
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
          {isHome ? 'React 组件库' : '组件文档'} <span className="version">0.0.1</span>
        </span>
        <nav ref={shortcuts} className="header-links" aria-label="快捷导航" inert={menuOpen}>
          <Link href="#/" className="header-link" aria-current={isHome ? 'page' : undefined}>
            首页
          </Link>
          <Link
            href="#/guides/getting-started"
            className="header-link"
            aria-current={isGettingStarted ? 'page' : undefined}
          >
            开始使用
          </Link>
          <Link
            href="#/components"
            className="header-link"
            aria-current={isOverview || componentId ? 'page' : undefined}
          >
            组件
          </Link>
          <Link
            href="#/guides/styling"
            className="header-link"
            aria-current={isDesignGuide ? 'page' : undefined}
          >
            设计与组合
          </Link>
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
      <div className={`docs-layout${isHome ? ' is-home' : isOverview ? ' is-overview' : ''}`}>
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
          <div className="docs-sidebar-scroll">
            <div className={`doc-search${query ? ' has-query' : ''}`}>
              <TextField
                ref={searchRef}
                label="搜索文档"
                leading={<Search size={17} />}
                type="search"
                placeholder="搜索组件或指南…"
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
            <nav aria-label="文档目录">
              {groups.map((group) => {
                const items = filtered.filter((item) => item.group === group);
                return items.length ? (
                  <div className="nav-group" key={group}>
                    <p>
                      <Motif name={groupMotifs[group]} />
                      {group}
                    </p>
                    {items.map((item) => (
                      <a
                        key={item.id}
                        href={pathFor(item)}
                        aria-current={pageSummary?.id === item.id ? 'page' : undefined}
                        onClick={() => {
                          setMenuOpen(false);
                          setQuery('');
                          if (menuOpen && item.id === pageSummary?.id)
                            requestAnimationFrame(() => headingRef.current?.focus());
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
            {filtered.length === 0 && (
              <div role="status" className="search-empty">
                <EmptyState
                  title="未找到相关文档"
                  description="试试其他关键词，或清空搜索查看全部文档。"
                  action={
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setQuery('');
                        searchRef.current?.focus();
                      }}
                    >
                      显示全部文档
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
            <div className="sidebar-foot">
              <BookOpen size={17} />
              <p>
                带上你的点子，
                <br />
                这里给你留了个位置。
              </p>
              <span>React · 非官方同人项目</span>
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
                      {page.group === '开始使用' ? 'GUIDE / 使用指南' : `${page.group} / COMPONENT`}
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
                  <DocScene />
                </div>
                {page.importCode && <CodeBlock source={page.importCode} compact />}
              </header>
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
                          <ExampleSource source={source} themeScope={themeScope} assets={assets} />
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
                </section>
              ))}
              <nav className="page-pagination" aria-label="相邻文档">
                {pageIndex > 0 ? (
                  <a href={pathFor(pages[pageIndex - 1])}>
                    <span>
                      <ChevronLeft size={14} />
                      上一篇
                    </span>
                    <strong>{titleFor(pages[pageIndex - 1])}</strong>
                  </a>
                ) : (
                  <span />
                )}
                {pageIndex < pages.length - 1 && (
                  <a href={pathFor(pages[pageIndex + 1])}>
                    <span>
                      下一篇
                      <ChevronRight size={14} />
                    </span>
                    <strong>{titleFor(pages[pageIndex + 1])}</strong>
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
                      {isOverview ? 'CATALOG / 组件总览' : `${pageSummary.group} / COMPONENT`}
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
                  <DocScene />
                </div>
              </header>
              {loadFailed ? (
                <Alert
                  tone="error"
                  role="alert"
                  title={isOverview ? '组件总览加载失败' : '组件文档加载失败'}
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
                  <Spinner label={isOverview ? '正在加载组件总览' : '正在加载组件文档'} />
                  <span aria-hidden="true">
                    {isOverview ? '正在加载组件总览…' : '正在加载组件文档…'}
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
            </span>
          </footer>
        </main>
        {page && (
          <aside ref={tocRef} className="docs-toc" inert={menuOpen}>
            <p>本页内容</p>
            <nav aria-label="本页内容">
              {toc.map((item) => (
                <a
                  key={item.id}
                  className={item.nested ? 'toc-nested' : ''}
                  aria-current={
                    (activeSection.pageId === page.id ? activeSection.id : page.sections[0]?.id) ===
                    item.id
                      ? 'location'
                      : undefined
                  }
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
