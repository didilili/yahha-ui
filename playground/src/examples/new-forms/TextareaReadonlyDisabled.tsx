import { Textarea } from 'yahha-ui';

export default function TextareaReadonlyDisabled() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 480 }}>
      <Textarea
        label="已发布简介"
        value="写散步时的发现，也写没忍住多买的点心。"
        readOnly
        rows={2}
      />
      <fieldset disabled style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <Textarea label="暂时关闭留言" defaultValue="留言暂时关闭，当前内容不可编辑。" rows={2} />
      </fieldset>
    </div>
  );
}
