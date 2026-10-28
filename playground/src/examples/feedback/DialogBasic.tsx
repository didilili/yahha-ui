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
      description="忙碌的时候，也可以留下一小段安静的阅读时间。"
    >
      <p>挑一篇喜欢的文章，从今天最想读的段落开始。</p>
    </Dialog>
  );
}
