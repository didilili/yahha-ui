import { Textarea } from 'yahha-ui';

export default function TextareaBasic() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Textarea
        label="给作者留言"
        name="message"
        placeholder="写下想对作者说的话"
        rows={4}
        hint="桌面端可拖动角落的调整手柄。"
      />
    </div>
  );
}
