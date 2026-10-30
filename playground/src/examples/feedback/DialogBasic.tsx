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
      description="书还没读完，也可以先坐下来。朋友在旁边给你留了个位置。"
    >
      <p>从今天最想读的一段开始。碰到不认识的字，就一起查一查。</p>
    </Dialog>
  );
}
