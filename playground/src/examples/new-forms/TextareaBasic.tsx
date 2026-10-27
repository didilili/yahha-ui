import { Textarea } from 'yahha-ui';

export default function TextareaBasic() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Textarea
        label="给作者留言"
        name="message"
        placeholder="想说的话，可以慢慢写……"
        rows={4}
        hint="支持换行，可以拖动底边调整高度。"
      />
    </div>
  );
}
