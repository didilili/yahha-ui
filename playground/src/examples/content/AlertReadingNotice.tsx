import { useId, useRef, useState } from 'react';
import { Alert, Button, Heading, Text } from 'yahha-ui';

export default function AlertReadingNotice() {
  const [visible, setVisible] = useState(true);
  const id = useId();
  const headingId = `${id}-heading`;
  const toggleId = `${id}-toggle`;
  const noticeId = `${id}-notice`;
  const toggle = useRef<HTMLButtonElement>(null);
  const notice = useRef<HTMLDivElement>(null);

  function changeVisibility(next: boolean) {
    const focusInside = notice.current?.contains(document.activeElement) ?? false;
    setVisible(next);
    if (!next && focusInside) toggle.current?.focus();
  }

  return (
    <article
      aria-labelledby={headingId}
      style={{ display: 'grid', gap: 16, maxWidth: 540, minWidth: 0 }}
    >
      <header style={{ display: 'grid', gap: 8 }}>
        <Heading level={3} id={headingId}>
          那天沿着河岸，慢慢走回家
        </Heading>
        <Text size="sm" tone="muted">
          <time dateTime="2022-04-16">2022年4月16日</time>
        </Text>
      </header>
      <Button
        ref={toggle}
        id={toggleId}
        variant="secondary"
        aria-expanded={visible}
        aria-controls={noticeId}
        style={{ justifySelf: 'start' }}
        onClick={() => changeVisibility(!visible)}
      >
        阅读提醒
      </Button>
      <Alert
        ref={notice}
        id={noticeId}
        tone="warning"
        title="读旧手记前，先看一眼"
        aria-labelledby={toggleId}
        hidden={!visible}
      >
        <div style={{ display: 'grid', gap: 12, minWidth: 0 }}>
          <p style={{ margin: 0 }}>
            这篇手记记录的是2022年的一次散步，沿途店铺信息可能变化，出发前请再确认。
          </p>
          <div>
            <Button variant="ghost" onClick={() => changeVisibility(false)}>
              隐藏阅读提醒
            </Button>
          </div>
        </div>
      </Alert>
      <Text>那天下午，我们沿着河岸走了一段。朋友在桥边停下来，给鞋带重新打了一个结。</Text>
      <Text>回家时天还亮着。口袋里除了路线图，还多出一张面包店的小票。</Text>
    </article>
  );
}
