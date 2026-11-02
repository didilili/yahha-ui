import { useState } from 'react';
import { Button, Dialog } from 'yahha-ui';

export default function DialogBasic() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>查看阅读提示</Button>}
      title="长文阅读建议"
      description="先浏览目录，再选择要读的章节。"
    >
      <p>文章较长时，可以按章节分次阅读。</p>
    </Dialog>
  );
}
