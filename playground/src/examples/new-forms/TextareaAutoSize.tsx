import { Textarea } from 'yahha-ui';

export default function TextareaAutoSize() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Textarea
        label="文章摘要"
        name="summary"
        defaultValue="把今天的小事，慢慢写进手记。"
        autoSize={{ minRows: 2, maxRows: 8 }}
      />
    </div>
  );
}
