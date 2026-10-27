# Avatar 头像

展示作者图片，并在缺图或失败时保留姓名缩写。

本页示例按[入门指南](../../README.md#构建与本地安装)（站内路由 `#/guides/getting-started`）在应用入口导入一次 `yahha-ui/style.css` 并包裹 ThemeProvider。交互示例和更多状态见[文档站](../../README.md#本地开发)（站内路由 `#/components/avatar`）。

头像采用圆钝的不对称轮廓与暖墨细边，姓名缩写回退使用主题强调色纸面。姓名缩写和图片占用相同空间，切换时不改变作者信息行的布局。

## 设计与状态

- 三档尺寸固定为 32 / 44 / 64px；加载中、失败和新地址恢复都占用同一空间，不把完整长姓名塞进图形。完整姓名放在头像旁，自定义 `fallback` 可使用简短的字。
- 空白或空字符串 `name` 使用问号回退，并以“匿名用户”提供可访问名称。普通姓名先去掉首尾空白，再取前两个 Unicode 码点作为缩写。
- 缺少图片或 `src` 只有空白时直接显示姓名回退；有效地址加载中也保留回退，失败后不显示浏览器的破图标记，换新地址或清空后恢复原地址可重新尝试。旧地址的加载事件不改变当前图片状态。
- 可将头像与作者姓名、简介组织为身份行，联系等动作另行分组。头像尺寸和可访问名称不随布局或图片状态改变。

## API

| 参数                | 类型                                 | 默认值          | 说明                                                                              |
| ------------------- | ------------------------------------ | --------------- | --------------------------------------------------------------------------------- |
| name（必填）        | string                               | —               | 头像的可访问名称；去掉首尾空白后，默认取前两个 Unicode 码点，空白姓名为匿名用户。 |
| src                 | string                               | —               | 图片地址，首尾空白会去除，空白地址按缺图处理；变更后重新尝试加载。                |
| fallback            | ReactNode                            | name 前两个字符 | 图片缺失、加载中或失败时的装饰内容。                                              |
| size                | 'sm' \| 'md' \| 'lg'                 | 'md'            | 默认 32 / 44 / 64px。                                                             |
| className / style   | string / CSSProperties               | —               | 作用于根 span 元素。                                                              |
| ref                 | ComponentPropsWithRef<'span'>['ref'] | —               | 指向真实 span 元素。                                                              |
| 其他原生属性 / 事件 | ComponentPropsWithRef<'span'>        | —               | 沿用对应原生元素的事件、`aria-*`、`data-*` 等属性；下表列出的组件属性优先。       |

## 使用约定

- 根 span 使用 role=img 和 name 提供名称，内部图片和回退内容均为装饰。
- 不接受 `children`；自定义回退内容使用 `fallback`。
- ref、style、原生事件作用于 span；不透传原生 img 属性。不在 fallback 中放交互元素。

## 示例

```tsx
import { Avatar, Text } from 'yahha-ui';

const sizes = [
  { name: '小八', size: 'sm', description: '小号 · 32px' },
  { name: '吉伊', size: 'md', description: '常规 · 44px' },
  { name: '乌萨奇', size: 'lg', description: '大号 · 64px' },
] as const;

export default function AvatarExample() {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 480 }}>
      <div style={{ display: 'flex', alignItems: 'end', flexWrap: 'wrap', gap: 24 }}>
        {sizes.map(({ name, size, description }) => (
          <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
            <Avatar name={name} size={size} />
            <Text size="sm" tone="muted">
              {description}
            </Text>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
        <Avatar name="把散步写成手记的作者小林" fallback="林" />
        <div style={{ minWidth: 0 }}>
          <Text>把散步写成手记的作者小林</Text>
          <Text size="sm" tone="muted">
            完整姓名放在头像旁，图形中保留简短回退。
          </Text>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name=" " />
        <Text size="sm" tone="muted">
          没有填写昵称时，回退为问号，并提供“匿名用户”的名称。
        </Text>
      </div>
    </div>
  );
}
```
