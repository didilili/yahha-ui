import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Badge, Button, EmptyState } from '../../../src/index';
import rest from '../assets/rest.png';
import { Art, DemoSection } from '../shared';

export function EmptyDemo() {
  const [hasMemory, setHasMemory] = useState(false);
  return (
    <DemoSection
      id="empty"
      title="空空的，也没关系。"
      component="EmptyState"
      description="没有内容的时候，留一位小伙伴陪你，再给一个可以继续的入口。"
      code={
        '<EmptyState title="这里还空着呢"\n  description="把喜欢的小事，慢慢攒起来。"\n  illustration={<img src={characterArt} alt="" />}\n  action={<Button onClick={onAdd}>放入一件小事</Button>} />'
      }
    >
      <div className="empty-stage">
        {!hasMemory ? (
          <EmptyState
            title="这里还空着呢"
            description="把喜欢的小事，慢慢攒起来。"
            illustration={<Art src={rest} />}
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setHasMemory(true)}
                endIcon={<ArrowRight size={15} />}
              >
                放入一件小事
              </Button>
            }
          />
        ) : (
          <div className="memory-filled">
            <span className="memory-check">
              <Check size={24} />
            </span>
            <h3>第一件小事，已经在这里了。</h3>
            <p>和朋友一起，做一点喜欢的东西。</p>
            <Badge tone="success">今天的小小收获</Badge>
            <Button variant="ghost" size="sm" onClick={() => setHasMemory(false)}>
              清空，看看空状态
            </Button>
          </div>
        )}
      </div>
    </DemoSection>
  );
}
