import { useEffect, useRef, useState } from 'react';
import { Button, Heading, Text, Toast } from 'yahha-ui';

const messages = [
  { tone: 'success', title: '文章已保存', description: '改动已经记录在草稿中。' },
  { tone: 'info', title: '还有一件小事', description: '发布前可以补充文章摘要。' },
  { tone: 'error', title: '保存失败', description: '请检查网络连接后重试。' },
] as const;

export default function ToastTones() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const messagesRoot = useRef<HTMLDivElement>(null);
  const restoreButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef<'restore' | 'heading' | null>(null);

  useEffect(() => {
    const destination = pendingFocus.current;
    if (!destination) return;
    pendingFocus.current = null;
    if (
      document.activeElement === document.body ||
      (document.activeElement === restoreButton.current && restoreButton.current?.disabled)
    ) {
      if (destination === 'restore') restoreButton.current?.focus();
      else heading.current?.focus();
    }
  }, [dismissed]);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Heading level={3} ref={heading} tabIndex={-1}>
        三种结果说明
      </Heading>
      <div ref={messagesRoot} style={{ display: 'grid', gap: 16 }}>
        {messages.map((message) => (
          <div key={message.tone} style={{ display: 'grid', gap: 8 }}>
            <Text size="sm" tone="muted">
              {message.tone === 'success' ? '成功' : message.tone === 'info' ? '信息' : '错误'}
              {message.tone === 'success' ? '（默认）' : ''}
              {dismissed.includes(message.tone) ? ' · 已关闭' : ''}
            </Text>
            <Toast
              {...message}
              open={!dismissed.includes(message.tone)}
              onClose={() => {
                if (messagesRoot.current?.contains(document.activeElement))
                  pendingFocus.current = 'restore';
                setDismissed((current) => [...current, message.tone]);
              }}
            />
          </div>
        ))}
      </div>
      <div>
        <Button
          ref={restoreButton}
          variant="secondary"
          disabled={dismissed.length === 0}
          onClick={() => {
            if (document.activeElement === restoreButton.current) pendingFocus.current = 'heading';
            setDismissed([]);
          }}
        >
          恢复已关闭的提示
        </Button>
      </div>
    </div>
  );
}
