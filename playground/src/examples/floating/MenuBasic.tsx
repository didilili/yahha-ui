import { useState } from 'react';
import { Button, DropdownMenu } from 'yahha-ui';

export default function MenuBasic() {
  const [message, setMessage] = useState('还没有执行操作');
  return (
    <div>
      <DropdownMenu
        trigger={<Button variant="secondary">文章操作</Button>}
        items={[
          { id: 'save', label: '收藏文章', onSelect: () => setMessage('已收藏这篇文章') },
          { id: 'share', label: '生成分享摘要', onSelect: () => setMessage('已生成分享摘要') },
        ]}
      />
      <p role="status">{message}</p>
    </div>
  );
}
