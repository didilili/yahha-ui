import { useId, useState } from 'react';
import { Badge, Button, Checkbox, EmptyState, Heading, Link, Text } from 'yahha-ui';
import bookmark from './artwork/little-days-bookmark.svg?no-inline';
import teaCup from './artwork/little-days-tea-cup.svg?no-inline';
import teaCupMotion from './artwork/little-days-tea-cup-motion.svg?no-inline';
import pageWait from './artwork/little-days-page-wait.svg?no-inline';
import pageWaitMotion from './artwork/little-days-page-wait-motion.svg?no-inline';
import emptyCollection from './artwork/little-days-empty-collection.svg?no-inline';

export default function LittleDaysArtwork() {
  const [saved, setSaved] = useState(false);
  const [teaPlaying, setTeaPlaying] = useState(false);
  const [waitingPhase, setWaitingPhase] = useState<'idle' | 'playing' | 'stopped'>('idle');
  const waitingId = useId();
  const waiting = waitingPhase === 'playing';

  return (
    <div className="little-days-demo" role="region" aria-label="小日常素材交互示例">
      <style>{`
        .little-days-demo { display: grid; gap: 32px; }
        .little-days-small { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 32px; }
        .little-days-specimen { display: grid; align-content: start; gap: 16px; min-width: 0; }
        .little-days-specimen > header { display: grid; justify-items: start; gap: 8px; }
        .little-days-number { color: var(--chi-muted, #7a5c6d); font-size: 12px; letter-spacing: .12em; }
        .little-days-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
        .little-days-icon-sizes { display: flex; align-items: center; gap: 12px; }
        .little-days-icon-sizes img { display: block; flex: 0 0 auto; }
        .little-days-tea { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; }
        .little-days-tea > img { display: block; flex: 0 0 auto; }
        .little-days-wait { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 240px); align-items: center; gap: 24px; padding: 24px; background: var(--chi-surface, #ffffff); border: 1px solid var(--chi-line, #c58ba1); border-radius: 18px 22px 19px 24px; }
        .little-days-wait-copy { display: grid; justify-items: start; gap: 16px; min-width: 0; }
        .little-days-wait-art { display: grid; place-items: center; min-width: 0; }
        .little-days-scene-image { display: block; max-width: 100%; height: auto; }
        .little-days-empty { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); align-items: center; gap: 24px; padding-top: 24px; border-top: 1px solid var(--chi-line, #c58ba1); }
        .little-days-empty-copy { display: grid; justify-items: start; gap: 12px; min-width: 0; }
        @media (max-width: 640px) {
          .little-days-small, .little-days-wait, .little-days-empty { grid-template-columns: minmax(0, 1fr); }
          .little-days-small { gap: 28px; }
          .little-days-wait { padding: 20px 16px; gap: 20px; }
          .little-days-wait-art { grid-row: 1; }
          .little-days-empty { gap: 16px; }
        }
      `}</style>

      <div className="little-days-small">
        <section className="little-days-specimen" aria-label="收藏书签图标">
          <header>
            <span className="little-days-number">01 / 操作图标</span>
            <Heading level={3}>收好这一枚纸签</Heading>
          </header>
          <Text size="sm" tone="muted">
            小尺寸保留清楚的书签轮廓。图形负责识别，按钮文字说明操作。
          </Text>
          <div className="little-days-tools">
            <Button
              variant="secondary"
              aria-pressed={saved}
              startIcon={<img src={bookmark} alt="" width={18} height={18} />}
              onClick={() => setSaved((value) => !value)}
            >
              {saved ? '已收藏' : '收藏纸签'}
            </Button>
            <div className="little-days-icon-sizes" aria-label="18、20、22 像素的图标样张">
              {[18, 20, 22].map((size) => (
                <img key={size} src={bookmark} alt="" width={size} height={size} />
              ))}
            </div>
          </div>
          <Text size="sm" tone="muted" role="status">
            {saved ? '这枚纸签已经收好。' : '纸签还没有收藏。'}
          </Text>
        </section>

        <section className="little-days-specimen" aria-label="热茶生活图案">
          <header>
            <span className="little-days-number">02 / 生活图案</span>
            <Heading level={3}>热茶，等一会儿</Heading>
          </header>
          <Text size="sm" tone="muted">
            96 × 96 的小图案。杯子稳稳放着，只有蒸汽轻轻升起。
          </Text>
          <div className="little-days-tea">
            <img src={teaPlaying ? teaCupMotion : teaCup} alt="" width={96} height={96} />
            <Checkbox
              label="播放热茶动效"
              checked={teaPlaying}
              onChange={(event) => setTeaPlaying(event.currentTarget.checked)}
            />
          </div>
          <Text size="sm" tone="muted">
            关闭后显示静态 SVG；开启时也遵循系统的减少动效设置。
          </Text>
        </section>
      </div>

      <section className="little-days-wait" aria-label="翻页等待素材">
        <div className="little-days-wait-copy">
          <span className="little-days-number">03 / 区块等待</span>
          <Heading level={3}>翻一页，稍等一下</Heading>
          <Text size="sm">
            240 × 168 的手记场景。开始与结束由你控制，本例不发起请求，也不让真实页面多等一会儿。
          </Text>
          <Badge>等待动效演示</Badge>
          <Button
            variant="secondary"
            aria-controls={waitingId}
            onClick={() => setWaitingPhase(waiting ? 'stopped' : 'playing')}
          >
            {waiting ? '结束等待' : '开始等待演示'}
          </Button>
          <Text size="sm" tone="muted" role="status">
            {waiting
              ? '等待演示进行中。'
              : waitingPhase === 'stopped'
                ? '等待演示已结束，手记停在这一页。'
                : '手记已经摊开，随时可以开始。'}
          </Text>
        </div>
        <div
          className="little-days-wait-art"
          id={waitingId}
          role="region"
          aria-label="翻页等待演示"
          aria-busy={waiting}
        >
          <img
            className="little-days-scene-image"
            src={waiting ? pageWaitMotion : pageWait}
            alt=""
            width={240}
            height={168}
          />
        </div>
      </section>

      <section className="little-days-empty" aria-label="空收藏素材">
        <div className="little-days-empty-copy">
          <span className="little-days-number">04 / 空内容场景</span>
          <Heading level={3}>给下一件小事留个位置</Heading>
          <Text size="sm" tone="muted">
            240 × 180 的口袋保留为空白。插画补充情境，原因和下一步仍用文字表达。
          </Text>
          <Badge>静态 SVG</Badge>
        </div>
        <EmptyState
          title="还没收进小口袋"
          description="喜欢的手记可以慢慢收集，先去翻翻朋友们的日常吧。"
          illustration={
            <img
              className="little-days-scene-image"
              src={emptyCollection}
              alt=""
              width={240}
              height={180}
            />
          }
          action={<Link href="#/guides/states?section=archive">看看归档示例 →</Link>}
        />
      </section>
    </div>
  );
}
