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
      <Textarea
        label="已发布简介"
        value="认真记录生活里的小事情。"
        readOnly
        rows={2}
        style={{ resize: 'none' }}
      />
      <fieldset disabled style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <Textarea label="暂时关闭留言" defaultValue="稍后再来看看吧。" rows={2} />
      </fieldset>
      <Button type="reset" variant="secondary">
        重置草稿
      </Button>
    </form>
  );
}
