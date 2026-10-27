import { Checkbox } from 'yahha-ui';

export default function CheckboxBasic() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 440 }}>
      <Checkbox label="接收每月阅读来信" hint="每月一封，随时可以取消。" defaultChecked />
      <Checkbox label="在个人主页展示收藏，并允许读者查看我分享的阅读清单与文章分类" />
      <Checkbox label="站内消息提醒" disabled defaultChecked hint="此设置暂不可更改。" />
      <Checkbox label="接收每日来信" disabled hint="每日来信暂未开放。" />
    </div>
  );
}
