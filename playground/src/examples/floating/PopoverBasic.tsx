import { Button, Popover } from 'yahha-ui';

export default function PopoverBasic() {
  return (
    <Popover
      trigger={<Button variant="secondary">关于这份手记</Button>}
      title="手记说明"
      description="在 Yahha 星球，散步也能攒出一页故事。"
    >
      <p>有时是大家在桥边等人，有时是把最后一块饼干分着吃。字写歪一点，也先记下来。</p>
    </Popover>
  );
}
