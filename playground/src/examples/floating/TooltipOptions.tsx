import { useState } from 'react';
import { Button, Text, Tooltip } from 'yahha-ui';

export default function TooltipOptions() {
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState('尚未触发操作。');
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      <div>
        <Tooltip
          disabled={disabled}
          delay={800}
          side="bottom"
          content="加入稍后阅读"
          trigger={
            <Button variant="secondary" onClick={() => setMessage('已触发“加入稍后阅读”操作。')}>
              加入稍后阅读
            </Button>
          }
        />
      </div>
      <Button
        variant="ghost"
        aria-pressed={disabled}
        onClick={() => setDisabled((value) => !value)}
      >
        关闭文字提示
      </Button>
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
      <Text size="sm" tone="muted">
        当前文字提示：{disabled ? '已关闭' : '已开启'}。
      </Text>
    </div>
  );
}
