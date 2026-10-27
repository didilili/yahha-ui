import { useState } from 'react';
import { Button, IconButton } from 'yahha-ui';

export default function IconButtonBasic() {
  const [visible, setVisible] = useState(true);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      {visible ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>欢迎来到我的小站。</span>
          <IconButton aria-label="关闭欢迎提示" variant="ghost" onClick={() => setVisible(false)}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M6 18 18 6" strokeLinecap="round" />
            </svg>
          </IconButton>
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setVisible(true)}>
          重新显示欢迎提示
        </Button>
      )}
    </div>
  );
}
