import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, Heading, Link, Text, ThemeProvider, Toast } from 'yahha-ui';
import HomePage from './pages/HomePage';
import ArchivePage from './pages/ArchivePage';
import ArticlePage from './pages/ArticlePage';
import { artwork } from './assets';
import { getPost, posts } from './data/posts';
import { siteName, siteSubtitle } from './data/site';
import { SiteLink } from './SiteLink';
import {
  finishNavigation,
  navigation,
  parseRoute,
  restoredPosition,
  sectionTarget,
  useLocation,
} from './router';

const storageKey = 'chiikawa-ui-example-blog:saved:v1';
interface Notice {
  id: string;
  wasSaved: boolean;
  returnId: string;
  persisted: boolean;
}

function initialSaved() {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return new Set<string>(
      Array.isArray(stored)
        ? stored.filter((id): id is string => typeof id === 'string' && !!getPost(id))
        : [],
    );
  } catch {
    return new Set<string>();
  }
}

function persist(saved: ReadonlySet<string>) {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...saved]));
    return true;
  } catch {
    return false;
  }
}

export default function App() {
  const location = useLocation();
  const route = parseRoute(location);
  const post = route.kind === 'post' ? getPost(route.id) : undefined;
  const [savedIds, setSavedIds] = useState(initialSaved);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [noticeHovered, setNoticeHovered] = useState(false);
  const [noticeFocused, setNoticeFocused] = useState(false);
  const notification = useRef<HTMLDivElement>(null);
  const previousLocation = useRef(location);

  useEffect(() => {
    if (!notice || noticeHovered || noticeFocused) return;
    const timer = window.setTimeout(() => setNotice(null), 8000);
    return () => window.clearTimeout(timer);
  }, [notice, noticeHovered, noticeFocused]);

  useLayoutEffect(() => {
    const current = parseRoute(location);
    const currentPost = current.kind === 'post' ? getPost(current.id) : undefined;
    const title = current.kind === 'archive' ? '手记归档' : currentPost?.title || '页面未找到';
    document.title =
      current.kind === 'home' ? `${siteName} · ${siteSubtitle}` : `${title} · ${siteName}`;
    if (previousLocation.current !== location && !navigation.preserveNotice) {
      setNotice(null);
      setNoticeHovered(false);
      setNoticeFocused(false);
    }
    previousLocation.current = location;
    const movement = { ...navigation };
    const frame = requestAnimationFrame(() => {
      try {
        const heading = document.querySelector<HTMLElement>('#blog-main h1');
        if (heading) heading.tabIndex = -1;
        if (movement.kind === 'pop' || movement.restoreReadingPosition) {
          const saved = restoredPosition();
          window.scrollTo(0, saved.blogScroll ?? 0);
          (document.getElementById(saved.blogFocus ?? '') ?? heading)?.focus({
            preventScroll: true,
          });
          return;
        }
        const section = sectionTarget(current);
        if (section) {
          section.focus({ preventScroll: true });
          section.scrollIntoView({ block: 'start' });
          return;
        }
        if (movement.kind === 'initial') return;
        if (movement.focus === 'preserve') return;
        const target =
          movement.focus === 'results'
            ? document.getElementById('archive-results-heading')
            : heading;
        target?.focus({ preventScroll: true });
        if (movement.scroll === 'top') window.scrollTo(0, 0);
        else if (movement.focus === 'results') target?.scrollIntoView({ block: 'start' });
      } finally {
        finishNavigation(location);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [location]);

  function toggleSave(id: string, button: HTMLButtonElement) {
    const wasSaved = savedIds.has(id);
    const next = new Set(savedIds);
    if (wasSaved) next.delete(id);
    else next.add(id);
    const persisted = persist(next);
    setSavedIds(next);
    setNoticeHovered(false);
    setNoticeFocused(false);
    setNotice({ id, wasSaved, returnId: button.id, persisted });
    if (route.kind === 'archive' && route.savedOnly && wasSaved) {
      requestAnimationFrame(() => {
        if (document.activeElement === document.body)
          document.getElementById('archive-results-heading')?.focus();
      });
    }
  }

  function returnFromNotice(id: string) {
    requestAnimationFrame(() => {
      const fallback =
        document.getElementById('archive-results-heading') ??
        document.querySelector<HTMLElement>('#blog-main h1');
      (document.getElementById(id) ?? fallback)?.focus({ preventScroll: true });
    });
  }

  function closeNotice() {
    const shouldReturn = notification.current?.contains(document.activeElement);
    const target = notice?.returnId;
    setNotice(null);
    setNoticeHovered(false);
    setNoticeFocused(false);
    if (shouldReturn && target) returnFromNotice(target);
  }

  function undoNotice() {
    if (!notice) return;
    const shouldReturn = notification.current?.contains(document.activeElement);
    const next = new Set(savedIds);
    if (notice.wasSaved) next.add(notice.id);
    else next.delete(notice.id);
    persist(next);
    setSavedIds(next);
    setNotice(null);
    setNoticeHovered(false);
    setNoticeFocused(false);
    if (shouldReturn) returnFromNotice(notice.returnId);
  }

  return (
    <ThemeProvider theme="chiikawa">
      <Link
        href="#blog-main"
        className="blog-skip"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('blog-main')?.focus();
        }}
      >
        跳到主要内容
      </Link>
      <header className="blog-header">
        <div className="blog-header-inner">
          <SiteLink to="#/" className="blog-brand" aria-label={`${siteName}，返回首页`}>
            <img src={artwork.peek} width="76" height="48" alt="" />
            <span>
              {siteName}
              <small>{siteSubtitle}</small>
            </span>
          </SiteLink>
          <nav aria-label="主导航" className="blog-nav">
            <SiteLink
              to="#/"
              aria-current={route.kind === 'home' && !route.section ? 'page' : undefined}
            >
              首页
            </SiteLink>
            <SiteLink to="#/archive" aria-current={route.kind === 'archive' ? 'page' : undefined}>
              手记归档
            </SiteLink>
            <SiteLink
              to="#/?section=about"
              aria-current={
                route.kind === 'home' && route.section === 'about' ? 'location' : undefined
              }
            >
              关于小站
            </SiteLink>
          </nav>
        </div>
      </header>
      <main id="blog-main" tabIndex={-1}>
        {route.kind === 'home' ? (
          <HomePage savedIds={savedIds} onToggleSave={toggleSave} />
        ) : route.kind === 'archive' ? (
          <ArchivePage route={route} savedIds={savedIds} onToggleSave={toggleSave} />
        ) : route.kind === 'post' && post ? (
          <ArticlePage
            post={post}
            returnTo={route.returnTo}
            savedIds={savedIds}
            onToggleSave={toggleSave}
          />
        ) : (
          <div className="blog-not-found">
            <img
              className="blog-not-found-art"
              src={artwork.notFound}
              alt=""
              width={480}
              height={320}
            />
            <Text tone="muted" aria-hidden="true">
              404
            </Text>
            <Heading level={1} id="blog-not-found-heading" tabIndex={-1}>
              页面未找到
            </Heading>
            <Text tone="muted">这个地址没有对应的页面。回到首页，朋友们还在那里等你。</Text>
            <SiteLink to="#/" className="blog-action-link">
              返回首页 →
            </SiteLink>
          </div>
        )}
      </main>
      <footer className="blog-footer">
        <div>
          <strong>{siteName}</strong>
          <Text size="sm" tone="muted">
            散步、读书，还有一些值得记下的小事。
          </Text>
        </div>
        <div className="blog-footer-note">
          <Text size="sm" tone="muted">
            {posts.length} 篇虚构示例手记 · 收藏仅保留在当前浏览器，不会同步到其他设备
          </Text>
          <Text size="sm" tone="muted">
            使用 Yahha UI 搭建 · 非官方示例网站
          </Text>
        </div>
      </footer>
      <div
        ref={notification}
        className="blog-notice"
        onMouseEnter={() => setNoticeHovered(true)}
        onMouseLeave={() => setNoticeHovered(false)}
        onFocusCapture={() => setNoticeFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setNoticeFocused(false);
        }}
      >
        {notice && !notice.wasSaved && (
          <img
            key={notice.id}
            className="blog-notice-celebration"
            src={artwork.collectionSaved}
            alt=""
            width={112}
            height={84}
          />
        )}
        <Toast
          open={!!notice}
          onClose={closeNotice}
          title={
            notice?.persisted
              ? notice.wasSaved
                ? '已取消收藏'
                : '已收藏'
              : notice?.wasSaved
                ? '取消收藏未能保存'
                : '收藏未能保存'
          }
          description={
            notice?.persisted
              ? notice.wasSaved
                ? '已从当前浏览器的收藏中移除。'
                : '已保存到当前浏览器，下次可在收藏中找到。'
              : '本次操作未能保存到浏览器，当前页面仍可使用；刷新后可能恢复原状态。'
          }
          action={
            <Button size="sm" variant="ghost" onClick={undoNotice}>
              撤销这次收藏操作
            </Button>
          }
        />
      </div>
    </ThemeProvider>
  );
}
