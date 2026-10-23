import { useState } from 'react';
import { ArrowUpRight, Heart } from 'lucide-react';
import { Button, Dialog } from '../../../src/index';
import reading from '../assets/reading.png';
import type { Notify } from '../data';
import { Art, DemoSection } from '../shared';

export function DialogDemo({ notify }: { notify: Notify }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <DemoSection
      id="dialog"
      title="有句话，想和你说。"
      component="Dialog"
      description="重要的小事，单独聊一聊。打开之后，也能轻松回到刚才的位置。"
      code={
        '<Dialog trigger={<Button>打开弹窗</Button>}\n  open={open} onOpenChange={setOpen}\n  title="今天也辛苦啦。" description="休息一下，再继续。" />'
      }
    >
      <div className="dialog-stage">
        <div className="little-envelope" aria-hidden="true">
          <Heart size={24} />
        </div>
        <div>
          <h3>一封来自小伙伴的问候</h3>
          <p>试试打开，再轻轻关上。</p>
        </div>
        <Dialog
          trigger={
            <Button
              className="dialog-demo-trigger"
              variant="secondary"
              endIcon={<ArrowUpRight size={15} />}
            >
              打开一个小弹窗
            </Button>
          }
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="今天也辛苦啦。"
          description="不管今天完成了多少，都可以先好好休息一下。明天的事情，明天再一起想。"
          illustration={<Art src={reading} />}
          footer={
            <>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                再坐一会儿
              </Button>
              <Button
                onClick={() => {
                  setDialogOpen(false);
                  notify({ title: '好好休息，明天见。', tone: 'success' });
                }}
              >
                嗯，明天见
                <Heart size={14} />
              </Button>
            </>
          }
        />
      </div>
    </DemoSection>
  );
}
