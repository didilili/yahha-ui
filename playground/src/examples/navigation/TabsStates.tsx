import { Tabs, Text } from 'yahha-ui';

export default function TabsStates() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          禁用标签
        </Text>
        <Tabs
          label="小站栏目可用状态"
          items={[
            { value: 'notes', label: '手记', content: <p>今天想记下的一件小事。</p> },
            {
              value: 'archive',
              label: '旧站归档（整理中）',
              content: <p>旧文章正在整理。</p>,
              disabled: true,
            },
          ]}
        />
      </div>
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <Text size="sm" tone="muted">
          长标签换行
        </Text>
        <Tabs
          label="小站阅读说明"
          items={[
            {
              value: 'about',
              label: '关于这个小站与慢慢更新的日常记录',
              content: <p>这里记下散步绕过的路、书里的句子和没忍住多买的点心。</p>,
            },
            {
              value: 'contact',
              label: '来信方式',
              content: <p>可以在文章末尾找到作者留下的联系方式。</p>,
            },
          ]}
        />
      </div>
    </div>
  );
}
