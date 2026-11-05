import { useRef, useState } from 'react';
import { Button, Dialog, Image, Text } from 'yahha-ui';
import teaCup from './artwork/little-days-tea-cup.svg?no-inline';

const alternativeText = '冒着热气的茶杯插画';
const caption = '一杯热茶，陪你慢慢读手记。';

export default function ImageDetail() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16, minWidth: 0 }}>
      <figure
        style={{ display: 'grid', gap: 8, margin: 0, width: '100%', maxWidth: 160, minWidth: 0 }}
      >
        <Image
          src={teaCup}
          alt={alternativeText}
          width={96}
          height={96}
          aspectRatio="1"
          loading="eager"
        />
        <figcaption>
          <Text size="sm" tone="muted">
            {caption}
          </Text>
        </figcaption>
      </figure>
      <Button ref={triggerRef} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        查看热茶插画大图
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="热茶插画"
        initialFocus={closeRef}
        finalFocus={triggerRef}
        footer={
          <Button ref={closeRef} variant="secondary" onClick={() => setOpen(false)}>
            关闭大图
          </Button>
        }
      >
        <figure style={{ display: 'grid', gap: 8, margin: 0, minWidth: 0 }}>
          <Image
            src={teaCup}
            alt={alternativeText}
            width={96}
            height={96}
            aspectRatio="1"
            loading="eager"
          />
          <figcaption>
            <Text size="sm" tone="muted">
              {caption}
            </Text>
          </figcaption>
        </figure>
      </Dialog>
    </div>
  );
}
