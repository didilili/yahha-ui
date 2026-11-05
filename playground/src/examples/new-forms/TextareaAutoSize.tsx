import { Textarea } from 'yahha-ui';

export default function TextareaAutoSize() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Textarea
        label="文章摘要"
        name="summary"
        defaultValue="小八说沿河走一会儿，结果先带大家拐进了面包店。"
        autoSize={{ minRows: 2, maxRows: 8 }}
      />
    </div>
  );
}
