import { useEffect, useId, useRef, useState } from 'react';
import { Button, Heading, Text, Toast } from 'yahha-ui';

const article = {
  title: '窗边那半本书，留给周末的一页',
  summary: '把读到一半的段落留给周末，先将手记收进稍后阅读清单。',
};

export default function ToastBasic() {
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const listHeading = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef(false);
  const listId = useId();

  useEffect(() => {
    if (open || !returnFocus.current) return;
    returnFocus.current = false;
    if (document.activeElement === document.body) trigger.current?.focus();
  }, [open]);

  function viewList() {
    returnFocus.current = false;
    setOpen(false);
    listHeading.current?.focus();
    listHeading.current?.scrollIntoView({ block: 'nearest' });
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 20,
        maxWidth: 640,
        minWidth: 0,
        overflowWrap: 'anywhere',
      }}
    >
      <article aria-label="示例手记" style={{ display: 'grid', gap: 12, minWidth: 0 }}>
        <Heading level={3}>{article.title}</Heading>
        <Text>{article.summary}</Text>
        <Text size="sm" tone="muted">
          {saved ? '已在稍后阅读清单中。' : '尚未加入稍后阅读。'}
        </Text>
      </article>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button
          ref={trigger}
          onClick={() => {
            returnFocus.current = false;
            setSaved((current) => !current);
            setOpen(true);
          }}
        >
          {saved ? '移出稍后阅读' : '加入稍后阅读'}
        </Button>
        <Button variant="secondary" onClick={viewList}>
          查看阅读清单
        </Button>
      </div>
      <div ref={message}>
        <Toast
          open={open}
          onClose={() => {
            returnFocus.current = message.current?.contains(document.activeElement) ?? false;
            setOpen(false);
          }}
          tone={saved ? 'success' : 'info'}
          title={saved ? '已加入稍后阅读' : '已移出稍后阅读'}
          description={article.title}
          action={
            <Button variant="ghost" onClick={viewList}>
              查看阅读清单
            </Button>
          }
        />
      </div>
      <section aria-labelledby={listId} style={{ display: 'grid', gap: 12, minWidth: 0 }}>
        <Heading id={listId} ref={listHeading} level={3} tabIndex={-1}>
          稍后阅读清单
        </Heading>
        <Text size="sm" tone="muted">
          共 {saved ? 1 : 0} 篇手记。
        </Text>
        {saved ? (
          <ul style={{ margin: 0, paddingInlineStart: 24, minWidth: 0 }}>
            <li>{article.title}</li>
          </ul>
        ) : (
          <Text>还没有稍后阅读的手记。</Text>
        )}
      </section>
    </div>
  );
}
