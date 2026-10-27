import { useEffect, useRef, useState } from 'react';
import { Button, Toast } from 'yahha-ui';

export default function ToastBasic() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (open || !returnFocus.current) return;
    returnFocus.current = false;
    if (document.activeElement === document.body) trigger.current?.focus();
  }, [open]);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <Button ref={trigger} onClick={() => setOpen(true)}>
          显示保存结果
        </Button>
      </div>
      <div ref={message}>
        <Toast
          open={open}
          onClose={() => {
            returnFocus.current = message.current?.contains(document.activeElement) ?? false;
            setOpen(false);
          }}
          title="保存成功"
          description="这条提示会保留到你主动关闭。关闭后可以再次显示。"
        />
      </div>
    </div>
  );
}
