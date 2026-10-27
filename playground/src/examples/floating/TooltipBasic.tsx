import { useState } from 'react';
import { IconButton, Tooltip } from 'yahha-ui';

export default function TooltipBasic() {
  const [saved, setSaved] = useState(false);
  const label = '收藏文章';
  return (
    <div>
      <Tooltip
        content={label}
        trigger={
          <IconButton
            variant="secondary"
            aria-label={label}
            aria-pressed={saved}
            onClick={() => setSaved((value) => !value)}
          >
            <span aria-hidden="true">{saved ? '★' : '☆'}</span>
          </IconButton>
        }
      />
      <p role="status">{saved ? '文章已收藏' : '文章尚未收藏'}</p>
      <p>点击星星切换收藏；操作和结果都不依赖悬停提示。</p>
    </div>
  );
}
