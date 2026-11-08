import { Button } from 'yahha-ui';

export default function ButtonStates() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>禁用</span>
        <Button disabled>保存草稿</Button>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>加载</span>
        <Button loading>保存草稿</Button>
      </div>
    </div>
  );
}
