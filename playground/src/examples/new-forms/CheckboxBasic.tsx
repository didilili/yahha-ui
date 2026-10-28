import { Checkbox } from 'yahha-ui';

export default function CheckboxBasic() {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 440 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>默认未勾选</p>
        <Checkbox label="接收每月阅读来信" />
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>初始勾选与禁用状态</p>
        <Checkbox label="在个人主页展示收藏" defaultChecked />
        <Checkbox label="站内消息提醒" disabled defaultChecked hint="暂不可更改。" />
        <Checkbox label="接收每日来信" disabled hint="此功能暂未开放。" />
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>长标签</p>
        <Checkbox label="在个人主页展示收藏，并允许读者查看我分享的阅读清单与文章分类" />
      </div>
    </div>
  );
}
