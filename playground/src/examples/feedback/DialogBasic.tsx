import { useState } from 'react';
import { Button, Dialog } from 'yahha-ui';

export default function DialogBasic() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>查看阅读提示</Button>}
      title="留一点时间给阅读"
      description="这是一个受控弹窗。点击关闭按钮、按 Escape 或点击外部都可以关闭。"
    >
      <p>打开后，可以用 Tab 在弹窗内移动焦点；关闭后，焦点回到触发按钮。</p>
    </Dialog>
  );
}
