import { useState } from 'react';
import { Button, Tooltip } from 'yahha-ui';

export default function TooltipOptions() {
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState('可以先悬停或用 Tab 聚焦，再执行操作');
  return (
    <div>
      <p>
        <Tooltip
          disabled={disabled}
          delay={800}
          side="bottom"
          content="加入稍后阅读"
          trigger={
            <Button variant="secondary" onClick={() => setMessage('已加入稍后阅读')}>
              加入稍后阅读
            </Button>
          }
        />
      </p>
      <Button
        variant="ghost"
        aria-pressed={disabled}
        onClick={() => setDisabled((value) => !value)}
      >
        关闭文字提示
      </Button>
      <p role="status">{message}</p>
      <p>当前文字提示：{disabled ? '已关闭' : '已开启'}。</p>
      <p>关闭 Tooltip 只关闭提示，原按钮仍能使用。</p>
    </div>
  );
}
