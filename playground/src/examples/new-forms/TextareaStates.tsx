import { Button, Textarea } from 'yahha-ui';

export default function TextareaStates() {
  return (
    <form style={{ display: 'grid', gap: 20, maxWidth: 480 }}>
      <Textarea
        label="草稿"
        name="draft"
        defaultValue="今天在河边遇见了一只小鸟。"
        rows={3}
        hint="修改后点击重置，恢复初始内容。"
      />
      <Button type="reset" variant="secondary">
        重置草稿
      </Button>
    </form>
  );
}
