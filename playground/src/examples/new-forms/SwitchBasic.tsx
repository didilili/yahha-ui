import { Switch } from 'yahha-ui';

export default function SwitchBasic() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          maxWidth: 640,
          gap: 12,
        }}
      >
        <Switch label="显示文章封面" defaultChecked hint="初始开启，可以点击文字或按空格切换。" />
        <Switch label="显示阅读时长" hint="初始关闭，标签始终表示同一个设置。" />
        <Switch label="显示作者署名" disabled defaultChecked hint="已开启；此设置暂不可更改。" />
        <Switch label="推送通知" disabled hint="已关闭；此功能尚未开放。" />
      </div>
      <Switch
        label="在个人主页展示文章封面、分类与阅读时长，让来访的人先看看内容，再决定从哪里读起"
        hint="长标签自然换行，轨道尺寸和首行位置保持稳定；本例不会保存偏好。"
      />
    </div>
  );
}
