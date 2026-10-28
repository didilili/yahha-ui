import { Button, Popover } from 'yahha-ui';

export default function PopoverBasic() {
  return (
    <Popover
      trigger={<Button variant="secondary">关于这份手记</Button>}
      title="手记说明"
      description="一些适合停下来慢慢读的记录。"
    >
      <p>每周整理一篇，记录散步、阅读和日常发现。</p>
    </Popover>
  );
}
