import { useId, useState } from 'react';
import { Badge, Button, Checkbox, Heading, Link, SegmentedControl, Text } from 'yahha-ui';
import searchEmpty from './artwork/little-days-search-empty.svg?no-inline';
import collectionSaved from './artwork/little-days-collection-saved.svg?no-inline';
import collectionSavedMotion from './artwork/little-days-collection-saved-motion.svg?no-inline';
import loadError from './artwork/little-days-load-error.svg?no-inline';
import loadErrorMotion from './artwork/little-days-load-error-motion.svg?no-inline';
import friendsLost from './artwork/little-days-friends-lost.svg?no-inline';

const states = [
  { value: 'search', label: '搜索无结果' },
  { value: 'saved', label: '收藏成功' },
  { value: 'error', label: '加载失败' },
  { value: 'not-found', label: '404 找路' },
] as const;

type State = (typeof states)[number]['value'];

const scenes: Record<
  State,
  {
    title: string;
    description: string;
    image: string;
    motion?: string;
    width: number;
    height: number;
  }
> = {
  search: {
    title: '草芽边，再找找',
    description: '没有找到对应的手记。换个关键词，或清空筛选，就能继续翻看其他日常。',
    image: searchEmpty,
    width: 240,
    height: 180,
  },
  saved: {
    title: '星星纸签，收好啦',
    description: '把喜欢的一页收进口袋。下一次想起时，还能回来慢慢读。',
    image: collectionSaved,
    motion: collectionSavedMotion,
    width: 240,
    height: 180,
  },
  error: {
    title: '这一页，暂时没能过来',
    description: '加载没有完成，已经写下的内容仍然保留。可以重新尝试，也可以先看看其他页面。',
    image: loadError,
    motion: loadErrorMotion,
    width: 240,
    height: 180,
  },
  'not-found': {
    title: '和朋友们，看看该往哪走',
    description: '这条小路暂时没有页面。从首页或目录重新出发，还能找到其他有趣的内容。',
    image: friendsLost,
    width: 480,
    height: 320,
  },
};

export default function LittleDaysStates() {
  const [state, setState] = useState<State>('search');
  const [motion, setMotion] = useState(false);
  const [revision, setRevision] = useState(0);
  const previewId = useId();
  const hintId = useId();
  const scene = scenes[state];
  const animated = motion && !!scene.motion;

  function choose(next: State) {
    setState(next);
    setRevision((value) => value + 1);
  }

  return (
    <div className="little-days-states" role="region" aria-label="小日常状态交互示例">
      <style>{`
        .little-days-states { display: grid; gap: 24px; }
        .little-days-state-tools { display: grid; justify-items: start; gap: 16px; min-width: 0; }
        .little-days-state-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; }
        .little-days-state-preview { display: grid; justify-items: center; gap: 20px; padding: 24px; border: 1px solid var(--chi-paper-line, #e4d9d3); border-radius: 22px 18px 24px 20px; background: var(--chi-surface, #fffefa); text-align: center; min-width: 0; }
        .little-days-state-picture { display: grid; place-items: center; width: 100%; min-height: 180px; }
        .little-days-state-image { display: block; max-width: 100%; height: auto; }
        .little-days-state-copy { display: grid; justify-items: center; gap: 12px; max-width: 46ch; }
        .little-days-state-links { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 24px; padding-top: 4px; }
        @media (max-width: 480px) {
          .little-days-state-preview { padding: 20px 12px; gap: 16px; }
          .little-days-state-picture { min-height: 0; }
        }
      `}</style>

      <div className="little-days-state-tools">
        <SegmentedControl
          label="状态素材预览"
          aria-describedby={hintId}
          options={states}
          value={state}
          onValueChange={choose}
        />
        <Text id={hintId} size="sm" tone="muted">
          这里只切换本页演示状态，不发起请求或保存收藏。成功与失败提供一次性动作，搜索与找路保持静态。
        </Text>
        <div className="little-days-state-controls">
          <Checkbox
            label="使用单次动效"
            checked={motion}
            onChange={(event) => {
              setMotion(event.currentTarget.checked);
              setRevision((value) => value + 1);
            }}
          />
          <Button
            variant="secondary"
            disabled={!animated}
            aria-controls={previewId}
            onClick={() => setRevision((value) => value + 1)}
          >
            重播当前动效
          </Button>
          <Button variant="ghost" aria-controls={previewId} onClick={() => choose('saved')}>
            演示完成结果
          </Button>
        </div>
      </div>

      <section id={previewId} className="little-days-state-preview" aria-label="小日常状态画面">
        <div className="little-days-state-picture" aria-hidden="true">
          <img
            key={`${state}-${motion}-${revision}`}
            className="little-days-state-image"
            src={animated ? scene.motion : scene.image}
            alt=""
            width={scene.width}
            height={scene.height}
          />
        </div>
        <div className="little-days-state-copy">
          <Badge>{animated ? '动作播放一次后停止' : '静态 SVG'}</Badge>
          <Heading level={3}>{scene.title}</Heading>
          <Text tone="muted">{scene.description}</Text>
        </div>
      </section>

      <Text role="status" aria-atomic="true" size="sm" tone="muted">
        当前预览：{states.find((item) => item.value === state)?.label}。
        {animated ? '单次动效开启，结束后保留完整结果；系统减少动效时显示静帧。' : '显示静态画面。'}
      </Text>
      <div className="little-days-state-links">
        <Link href="#/guides/states?section=loading">查看完整加载与恢复流程 →</Link>
        <Link href="#/guides/states?section=archive">看看归档与搜索 →</Link>
        <Link href="#/guides/getting-started">从开始使用重新出发 →</Link>
      </div>
    </div>
  );
}
