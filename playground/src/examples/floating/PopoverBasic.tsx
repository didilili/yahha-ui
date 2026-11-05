import { Button, Popover } from 'yahha-ui';

export default function PopoverBasic() {
  return (
    <Popover
      trigger={<Button variant="secondary">关于这份手记</Button>}
      title="手记说明"
      description="这是一篇虚构的散步手记。"
    >
      <p>路走到一半，先被面包香带进小店；回家再把店名补到路线图上。</p>
    </Popover>
  );
}
