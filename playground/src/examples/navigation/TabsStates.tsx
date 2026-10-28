import { Tabs } from 'yahha-ui';

export default function TabsStates() {
  return (
    <Tabs
      label="小站阅读说明"
      items={[
        {
          value: 'about',
          label: '关于这个小站与慢慢更新的日常记录',
          content: <p>这里收集散步、阅读和窗边的小小日常。</p>,
        },
        {
          value: 'contact',
          label: '来信方式',
          content: <p>可以在文章末尾找到作者留下的联系方式。</p>,
        },
        {
          value: 'archive',
          label: '旧站归档（整理中）',
          content: <p>旧文章正在整理。</p>,
          disabled: true,
        },
      ]}
    />
  );
}
