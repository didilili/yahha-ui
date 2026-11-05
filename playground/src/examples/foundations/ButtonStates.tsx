import { Button } from 'yahha-ui';

export default function ButtonStates() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      <Button disabled>保存草稿</Button>
      <Button loading>保存草稿</Button>
    </div>
  );
}
