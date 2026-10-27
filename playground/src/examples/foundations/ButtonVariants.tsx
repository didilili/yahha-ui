import { Button } from 'yahha-ui';

export default function ButtonVariants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button variant="primary">主要操作</Button>
      <Button variant="secondary">次要操作</Button>
      <Button variant="ghost">文字操作</Button>
    </div>
  );
}
