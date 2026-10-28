import { Switch } from 'yahha-ui';

export default function SwitchBasic() {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 640 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>默认关闭</p>
        <Switch label="显示阅读时长" />
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>初始开启与禁用状态</p>
        <Switch label="显示文章封面" defaultChecked />
        <Switch label="显示作者署名" disabled defaultChecked hint="已开启；此设置暂不可更改。" />
        <Switch label="推送通知" disabled hint="已关闭；此功能尚未开放。" />
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>长标签</p>
        <Switch label="在个人主页展示文章封面、分类与阅读时长，让来访的人先看看内容，再决定从哪里读起" />
      </div>
    </div>
  );
}
