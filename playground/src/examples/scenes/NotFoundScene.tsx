import type { Ref } from 'react';
import { Heading, Text, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';
import notFoundArtwork from './artwork/little-days-friends-lost.svg?no-inline';

export default function NotFoundScene({
  asPage = false,
  headingRef,
}: { asPage?: boolean; headingRef?: Ref<HTMLHeadingElement> } = {}) {
  return (
    <ThemeProvider theme="chiikawa">
      <style>{`
        .story-not-found { max-width: 660px; padding: 24px 12px; margin: auto; text-align: center; }
        .story-not-found-art { display: block; width: min(320px, 100%); height: auto; margin: 0 auto 16px; }
        .story-not-found-number { display: block; margin-bottom: 8px; color: var(--chi-muted, #7a5c6d); font-size: var(--chi-font-size-body, 16px); font-weight: 650; letter-spacing: 4px; }
        .story-not-found-copy { margin-top: 14px; }
        .story-not-found-actions { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 14px 24px; margin-top: 24px; }
        .story-not-found-primary { display: inline-flex; align-items: center; justify-content: center; min-height: var(--chi-control-height, 44px); padding: 10px var(--chi-space-5, 20px); border: var(--chi-control-border-width, 2px) solid var(--chi-contour, #684150); border-radius: var(--chi-radius-control, 22px 28px 24px 23px / 52% 48% 52% 48%); font-size: var(--chi-font-size-md, 14px); line-height: var(--chi-leading-control, 20px); background: var(--chi-accent, #ffc3d9); color: var(--chi-ink, #49313d); font-weight: 650; text-decoration: none; }
        .story-not-found-secondary { display: inline-flex; align-items: center; min-height: var(--chi-control-height, 44px); text-decoration: underline; text-underline-offset: 0.24em; }
      `}</style>
      <section className="story-not-found">
        <img
          className="story-not-found-art"
          src={notFoundArtwork}
          alt=""
          width="480"
          height="320"
          loading="lazy"
        />
        <span className="story-not-found-number" aria-hidden="true">
          404
        </span>
        <Heading
          level={asPage ? 1 : 3}
          ref={headingRef}
          tabIndex={-1}
          className={asPage ? 'doc-title' : undefined}
        >
          页面未找到
        </Heading>
        <Text className="story-not-found-copy" tone="muted">
          这个地址没有对应的页面。朋友们在路口等你，可以从使用指南或组件总览继续逛逛。
        </Text>
        <nav className="story-not-found-actions" aria-label="找回文档">
          <a className="story-not-found-primary" href="#/guides/getting-started">
            开始使用
          </a>
          <a className="story-not-found-secondary" href="#/components">
            浏览组件
          </a>
        </nav>
      </section>
    </ThemeProvider>
  );
}
