import { useId, useState } from 'react';
import { Button, Checkbox, EmptyState, Heading, Link, Text } from 'yahha-ui';
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
        .little-days-number { color: var(--yahha-muted, #7a5c6d); font-size: 12px; letter-spacing: .12em; }
        .little-days-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
        .little-days-icon-sizes { display: flex; align-items: center; gap: 12px; }
        .little-days-icon-sizes img { display: block; flex: 0 0 auto; }
        .little-days-tea { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; }
        .little-days-tea > img { display: block; flex: 0 0 auto; }
        .little-days-wait { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 240px); align-items: center; gap: 24px; padding: 24px; background: var(--yahha-surface, #ffffff); border: 1px solid var(--yahha-line, #c58ba1); border-radius: 18px 22px 19px 24px; }
        .little-days-wait-copy { display: grid; justify-items: start; gap: 16px; min-width: 0; }
        .little-days-wait-art { display: grid; place-items: center; min-width: 0; }
        .little-days-scene-image { display: block; max-width: 100%; height: auto; }
        .little-days-empty { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); align-items: center; gap: 24px; padding-top: 24px; border-top: 1px solid var(--yahha-line, #c58ba1); }
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
            <Heading level={3}>收藏书签</Heading>
          </header>
          <div className="little-days-tools">
            <Button
              variant="secondary"
              aria-pressed={saved}
              startIcon={<img src={bookmark} alt="" width={18} height={18} />}
              onClick={() => setSaved((value) => !value)}
            >
              收藏纸签
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
            <Heading level={3}>热茶</Heading>
          </header>
          <div className="little-days-tea">
            <img src={teaPlaying ? teaCupMotion : teaCup} alt="" width={96} height={96} />
            <Checkbox
              label="播放热茶动效"
              checked={teaPlaying}
              onChange={(event) => setTeaPlaying(event.currentTarget.checked)}
            />
          </div>
        </section>
      </div>

      <section className="little-days-wait" aria-label="翻页等待素材">
        <div className="little-days-wait-copy">
          <Heading level={3}>翻页等待</Heading>
          <Text size="sm">开始后循环翻页，结束后显示静态图。</Text>
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
          <Heading level={3}>收藏夹</Heading>
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
