import { Textarea } from 'yahha-ui';

export default function TextareaReadonlyDisabled() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 480 }}>
      <Textarea label="已发布简介" value="认真记录生活里的小事情。" readOnly rows={2} />
      <fieldset disabled style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <Textarea label="暂时关闭留言" defaultValue="稍后再来看看吧。" rows={2} />
      </fieldset>
    </div>
  );
}
