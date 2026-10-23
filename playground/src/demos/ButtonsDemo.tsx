import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Heart } from 'lucide-react';
import { Button, IconButton } from '../../../src/index';
import type { Notify } from '../data';
import { DemoSection } from '../shared';

export function ButtonsDemo({ notify }: { notify: Notify }) {
  const [likes, setLikes] = useState(0);
  const [hearted, setHearted] = useState(false);
  return (
    <DemoSection
      id="buttons"
      title="点一下，出发！"
      component="Button"
      description="轻轻按下，就有回应。主要、次要和文字按钮，各有自己的分工。"
      code={
        '<Button onClick={onClick} endIcon={<ArrowRight />}>出发！</Button>\n<Button variant="secondary">慢慢来</Button>\n<Button loading>努力加载中</Button>'
      }
    >
      <div className="button-stage">
        <div className="button-main-row">
          <Button
            className="button-demo-action"
            onClick={() => setLikes((value) => value + 1)}
            endIcon={<ArrowRight size={17} />}
          >
            出发！
          </Button>
          <Button
            className="button-demo-action"
            variant="secondary"
            onClick={() => notify({ title: '慢慢来，也没关系。', tone: 'info' })}
          >
            慢慢来
          </Button>
          <Button
            className="button-demo-action"
            variant="ghost"
            onClick={() => notify({ title: '再看看，喜欢的就在前面。', tone: 'info' })}
          >
            再看看
            <ArrowUpRight size={15} />
          </Button>
          <IconButton
            className="button-demo-action button-demo-like"
            aria-label={hearted ? '取消喜欢' : '喜欢这个组件'}
            aria-pressed={hearted}
            variant="secondary"
            onClick={() => setHearted((value) => !value)}
          >
            <Heart size={19} fill={hearted ? 'currentColor' : 'none'} />
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
          {likes ? (
            <>
              收到你的第 <strong>{likes}</strong> 次点击啦。
            </>
          ) : (
            '试着点一下「出发」，看看会发生什么。'
          )}
        </p>
      </div>
    </DemoSection>
  );
}
