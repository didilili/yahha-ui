import { useEffect, useRef, useState } from 'react';
import { Button, IconButton } from 'yahha-ui';

export default function IconButtonBasic() {
  const [visible, setVisible] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reopenRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    // 只在用户切换后移动焦点，初次展示时不抢走页面焦点。
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    (visible ? closeRef : reopenRef).current?.focus();
  }, [visible]);

  const changeVisibility = (nextVisible: boolean) => {
    restoreFocus.current = true;
    setVisible(nextVisible);
  };

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      {visible ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>点击关闭按钮可隐藏这条提示。</span>
          <IconButton
            ref={closeRef}
            aria-label="关闭提示"
            variant="ghost"
            onClick={() => changeVisibility(false)}
          >
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
        <Button ref={reopenRef} variant="secondary" onClick={() => changeVisibility(true)}>
          重新显示提示
        </Button>
      )}
    </div>
  );
}
