import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  EmptyState,
  Heading,
  Select,
  Spinner,
  Text,
  ThemeProvider,
  Toast,
} from 'yahha-ui';
import 'yahha-ui/style.css';
import loadingArtwork from './artwork/little-days-page-wait-motion.svg?no-inline';
import loadErrorArtwork from './artwork/little-days-load-error-motion.svg?no-inline';
import savedArtwork from './artwork/little-days-collection-saved-motion.svg?no-inline';

export default function LoadingScene() {
  const [phase, setPhase] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [outcome, setOutcome] = useState<'success' | 'empty' | 'error'>('success');
  const [saved, setSaved] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const retryButton = useRef<HTMLButtonElement>(null);
  const emptyButton = useRef<HTMLButtonElement>(null);
  const saveButton = useRef<HTMLButtonElement>(null);
  const toast = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);
  const loading = phase === 'loading';

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setPhase(outcome), 1800);
    return () => clearTimeout(timer);
  }, [loading, outcome]);

  useEffect(() => {
    if (loading || !pendingFocus.current) return;
    if (document.activeElement === content.current) {
      if (phase === 'success') resultHeading.current?.focus({ preventScroll: true });
      else if (phase === 'error') retryButton.current?.focus({ preventScroll: true });
      else emptyButton.current?.focus({ preventScroll: true });
    }
    pendingFocus.current = false;
  }, [loading, phase]);

  function load(next = outcome) {
    setOutcome(next);
    setSaved(false);
    setToastOpen(false);
    pendingFocus.current = true;
    setPhase('loading');
    content.current?.focus({ preventScroll: true });
  }

  function closeToast() {
    const restoreFocus = toast.current?.contains(document.activeElement);
    setToastOpen(false);
    if (restoreFocus) saveButton.current?.focus();
  }

  return (
    <ThemeProvider theme="pink">
      <style>{`
        .story-loading { max-width: 660px; margin: auto; }
        .story-loading-tools { display: grid; gap: 8px; margin-bottom: 16px; }
        .story-loading-status { display: flex; align-items: center; gap: 10px; min-height: 36px; }
        .story-loading-content { display: grid; place-content: center; justify-items: center; gap: 16px; min-height: 360px; padding: 24px 12px; text-align: center; }
        .story-loading-content[data-state='empty'] { padding: 0; }
        .story-loading-error { display: grid; gap: 12px; text-align: start; }
        .story-loading-error-result { display: grid; grid-template-columns: 112px minmax(0, 1fr); align-items: center; gap: 16px; width: 100%; }
        .story-loading-error-art { display: block; width: 112px; height: auto; max-width: 100%; }
        .story-loading-toast { margin-top: 16px; }
        .story-loading-saved-art { display: block; margin: 0 0 -6px 20px; pointer-events: none; }
        .story-loading-frame { display: block; width: 240px; max-width: 100%; height: auto; }
        .story-loading-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; padding-top: 16px; border-top: 1px solid var(--yahha-line, #c58ba1); }
        @media (max-width: 480px) { .story-loading-error-result { grid-template-columns: minmax(0, 1fr); } .story-loading-error-art { margin: auto; } }
      `}</style>
      <div className="story-loading">
        <div className="story-loading-tools">
          <Select
            label="下次加载结果"
            value={outcome}
            disabled={loading}
            options={[
              { value: 'success', label: '正常内容' },
              { value: 'empty', label: '没有结果' },
              { value: 'error', label: '加载失败' },
            ]}
            onValueChange={(value) => {
              if (value === 'success' || value === 'empty' || value === 'error') setOutcome(value);
            }}
          />
          <Text size="sm" tone="muted">
            选择一种结果，再按“重新加载文章”。首次演示会自动加载正常内容。
          </Text>
        </div>
        <div className="story-loading-status" role="status" aria-atomic="true">
          {loading && <Spinner size="sm" aria-hidden="true" role="presentation" />}
          <span>
            {loading
              ? '正在加载文章…'
              : phase === 'success'
                ? '文章已准备好'
                : phase === 'error'
                  ? '文章未能加载'
                  : '文章列表为空'}
          </span>
        </div>
        <div
          className="story-loading-content"
          ref={content}
          role="region"
          aria-label="文章预览"
          tabIndex={-1}
          aria-busy={loading}
          data-state={phase}
        >
          {loading ? (
            <>
              <img
                className="story-loading-frame"
                src={loadingArtwork}
                width={240}
                height={168}
                alt=""
              />
              <Text tone="muted">稍等一下，朋友们正把这一页送来。</Text>
            </>
          ) : phase === 'error' ? (
            <div className="story-loading-error-result">
              <img
                className="story-loading-error-art"
                src={loadErrorArtwork}
                alt=""
                width={112}
                height={84}
              />
              <Alert tone="error" title="文章加载失败">
                <div className="story-loading-error">
                  <p style={{ margin: 0 }}>
                    暂时无法显示文章内容。别着急，可以重新加载，再和朋友们一起读下去。
                  </p>
                  <div>
                    <Button ref={retryButton} variant="secondary" onClick={() => load('success')}>
                      重试加载
                    </Button>
                  </div>
                </div>
              </Alert>
            </div>
          ) : phase === 'empty' ? (
            <EmptyState
              title="这次没有找到手记"
              description="暂时没有可显示的手记，可以先看看示例内容。"
              action={
                <Button ref={emptyButton} variant="secondary" onClick={() => load('success')}>
                  查看示例手记
                </Button>
              }
            />
          ) : (
            <>
              <Badge tone="accent">周末手记</Badge>
              <Heading level={3} ref={resultHeading} tabIndex={-1}>
                今天，也有一件想记住的小事。
              </Heading>
              <Text>朋友走得慢，就在桥边等一等。最后一块饼干，也可以掰开分。</Text>
              <Button
                ref={saveButton}
                variant="secondary"
                aria-pressed={saved}
                onClick={() => {
                  setSaved(!saved);
                  setToastOpen(true);
                }}
              >
                收藏这篇手记
              </Button>
              <Text size="sm" tone="muted">
                {saved ? '已在当前示例中收藏。' : '收藏仅在当前演示页面生效。'}
              </Text>
            </>
          )}
        </div>
        <div className="story-loading-actions">
          <Button loading={loading} onClick={() => load()}>
            重新加载文章
          </Button>
          <Text size="sm" tone="muted">
            用 1.8 秒计时器模拟请求，不表示真实网络进度。
          </Text>
        </div>
        <div ref={toast} className="story-loading-toast">
          {toastOpen && saved && (
            <img
              className="story-loading-saved-art"
              src={savedArtwork}
              alt=""
              width={112}
              height={84}
            />
          )}
          <Toast
            open={toastOpen}
            onClose={closeToast}
            tone={saved ? 'success' : 'info'}
            title={saved ? '已收藏这篇手记' : '已取消收藏'}
            description="关闭提示后，正文和收藏状态仍然保留。"
            action={
              saved ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSaved(false);
                    closeToast();
                  }}
                >
                  撤销收藏
                </Button>
              ) : undefined
            }
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
