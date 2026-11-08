import { ArrowRightIcon, Button, PlusIcon } from 'yahha-ui';

export default function ButtonLayout() {
  return (
    <div style={{ display: 'grid', gap: 16, width: 'min(100%, 240px)' }}>
      <Button style={{ width: '100%' }}>保存草稿</Button>
      <Button
        variant="secondary"
        startIcon={<PlusIcon />}
        endIcon={<ArrowRightIcon />}
        style={{ width: '100%' }}
      >
        将这篇周末散步记录加入稍后阅读
      </Button>
    </div>
  );
}
