import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Heart } from 'lucide-react';
import { Badge, Button, IconButton, Surface } from '../../../src/index';
import type { Notify } from '../data';
import { DemoSection } from '../shared';

export function ButtonsDemo({ notify }: { notify: Notify }) {
  const [notes, setNotes] = useState(0);
  const [saved, setSaved] = useState(false);
  return (
    <DemoSection
      id="buttons"
      title="从一篇手记开始。"
      component="Button · Badge · Surface"
      description="平静的阅读面，清楚的文字和一点按压反馈。没有角色插画，也能放下一段日常。"
      code={
        '<Surface>\n  <Badge tone="accent">散步</Badge>\n  <h3>周末在河边走了一会儿</h3>\n  <Button onClick={onClick}>记一笔</Button>\n  <Button variant="secondary" aria-pressed={saved}>留着再读</Button>\n</Surface>'
      }
    >
      <Surface className="button-stage">
        <div className="foundation-meta">
          <Badge tone="accent">散步</Badge>
          <span>2026.10.23 · 约6分钟</span>
          <Badge tone={saved ? 'success' : 'neutral'}>{saved ? '已收藏' : '随手记'}</Badge>
        </div>
        <h3 className="foundation-title">周末在河边走了一会儿</h3>
        <p className="foundation-description">
          沿着熟悉的路往前走，没有特别的目的。记下水声、落叶，还有桥下那只不着急的猫。
        </p>
        <div className="button-main-row">
          <Button onClick={() => setNotes((value) => value + 1)} endIcon={<ArrowRight size={17} />}>
            记一笔
          </Button>
          <Button
            variant="secondary"
            aria-pressed={saved}
            onClick={() => setSaved((value) => !value)}
          >
            {saved ? '已经收好' : '留着再读'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => notify({ title: '这是一篇用于展示阅读排版的示例手记。', tone: 'info' })}
          >
            查看说明
            <ArrowUpRight size={15} />
          </Button>
          <IconButton
            aria-label={saved ? '取消收藏手记' : '收藏这篇手记'}
            aria-pressed={saved}
            variant="secondary"
            onClick={() => setSaved((value) => !value)}
          >
            <Heart size={19} fill={saved ? 'currentColor' : 'none'} />
          </IconButton>
        </div>
        <div className="button-state-row">
          <span>也有这样的状态</span>
          <Button disabled size="sm">
            休息一下
          </Button>
          <Button loading size="sm" variant="secondary">
            努力加载中
          </Button>
        </div>
        <p className="click-response" aria-live="polite">
          {notes ? (
            <>
              已经记下第 <strong>{notes}</strong> 笔。
            </>
          ) : (
            '点一下「记一笔」，或把这篇手记留着再读。'
          )}
        </p>
      </Surface>
    </DemoSection>
  );
}
