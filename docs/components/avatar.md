<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Avatar 头像

展示作者图片，并在缺图或失败时保留姓名缩写。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Avatar } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于文章署名、作者介绍和个人资料，以姓名或图片标识人物。需要进入作者页面时，在身份行中提供明确的链接。

<a id="examples"></a>

## 代码演示

<a id="avatar-fallback"></a>

### 尺寸与文字回退

比较三档尺寸、完整长姓名与匿名回退；姓名放在头像旁，图形保留短标记。空白姓名显示问号，并使用“匿名用户”作为可访问名称。

[查看示例文件](../../playground/src/examples/content/AvatarExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/AvatarExample.tsx -->

```tsx
import { Avatar, Text } from 'yahha-ui';

const sizes = [
  { name: '小八', size: 'sm', description: '小号 sm' },
  { name: '吉伊', size: 'md', description: '中号 md（默认）' },
  { name: '乌萨奇', size: 'lg', description: '大号 lg' },
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
            手记作者
          </Text>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name=" " />
        <Text size="sm" tone="muted">
          匿名用户
        </Text>
      </div>
    </div>
  );
}
```

<a id="avatar-picture"></a>

### 图片失败与恢复

点击按钮模拟解码失败，再恢复有效的本地图片。加载中或失败时保留姓名回退，头像区域保持 64px。

[查看示例文件](../../playground/src/examples/content/AvatarPicture.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/AvatarPicture.tsx -->

```tsx
import { useState } from 'react';
import { Avatar, Button, Text } from 'yahha-ui';

const picture =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#d7eaf5"/><text x="40" y="53" text-anchor="middle" font-size="40" fill="#462e31">八</text></svg>',
  );

export default function AvatarPicture() {
  const [broken, setBroken] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <Avatar name="小八" src={broken ? 'data:text/plain,unavailable' : picture} size="lg" />
        <Button variant="secondary" onClick={() => setBroken(!broken)}>
          {broken ? '恢复头像' : '模拟图片失效'}
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {broken ? '图片暂不可用，已显示姓名回退。' : '当前使用图片头像。'}
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 头像与完整署名

头像内保留简短标记，完整姓名和简介放在旁边。姓名较长时，可用 fallback 指定一个更容易辨认的字或缩写；关注、联系等操作放在身份信息之外。

<a id="api"></a>

## API

### AvatarProps

| 参数                  | 说明                                                                                                    | 类型                                   | 默认值                            |
| --------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------- |
| `name` **必填**       | 去除首尾空白后作为可访问名称；为空时使用匿名用户。默认回退取前两个完整字符，保留组合 emoji 和附加符号。 | `string`                               | —                                 |
| `src`                 | 去除首尾空白后的图片地址；为空不创建 img，地址变化后重新尝试加载。                                      | `string`                               | —                                 |
| `fallback`            | 图片缺失、加载中或失败时的装饰内容。                                                                    | `ReactNode`                            | `name 前两个完整字符；空姓名为 ?` |
| `size`                | 默认 32 / 44 / 64px。                                                                                   | `'sm' \| 'md' \| 'lg'`                 | `'md'`                            |
| `className / style`   | 作用于根 span 元素。                                                                                    | `string / CSSProperties`               | —                                 |
| `ref`                 | 指向真实 span 元素。                                                                                    | `ComponentPropsWithRef<'span'>['ref']` | —                                 |
| `其他原生属性 / 事件` | 支持对应原生元素的事件、aria-\*、data-\* 等属性；组件声明的同名属性优先。                               | `ComponentPropsWithRef<'span'>`        | —                                 |

<a id="behavior"></a>

## 姓名、图片回退与恢复

- name 为整个头像提供可访问名称，内部图片和回退内容均为装饰。空白姓名的可访问名称为“匿名用户”，默认显示问号。
- 缺图、加载中和加载失败时保留回退内容；更换 src 后重新加载，新图片就绪后移除回退，透明图片不会透出姓名。头像尺寸在这个过程中保持不变。
- 默认按完整字素取姓名的前两项；不支持 Intl.Segmenter 的旧环境按 Unicode 码点降级，需要固定缩写时可显式传入 fallback。
- fallback 只放展示内容，不放链接或按钮。头像不接收 children，也不透传原生 img 属性。

<a id="related"></a>

## 相关组件

- [Image 图片](image.md)：为图片提供明确的替代文字、比例容器与失败回退。
- [Text 正文](text.md)：为段落提供统一的字号、行高和语义文字颜色。
