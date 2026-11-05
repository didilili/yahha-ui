import { TextField } from 'yahha-ui';

export default function TextFieldStates() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <TextField label="暂不可编辑" disabled defaultValue="等待同步" />
      <TextField
        label="公开地址"
        readOnly
        defaultValue="https://example.com"
        hint="可以复制此地址。"
      />
    </div>
  );
}
