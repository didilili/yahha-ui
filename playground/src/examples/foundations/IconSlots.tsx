import { Button, SearchIcon, TextField } from 'yahha-ui';

export default function IconSlots() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16, maxWidth: 360 }}>
      <Button startIcon={<SearchIcon />}>搜索手记</Button>
      <TextField label="搜索关键词" leading={<SearchIcon />} defaultValue="散步" />
    </div>
  );
}
