<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Avatar 头像

展示作者头像，支持姓名缩写、自定义回退与图片加载失败处理。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Avatar } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于文章署名、作者介绍和个人资料，以图片或姓名标识人物。作者页导航通过独立链接提供。

<a id="examples"></a>

## 代码演示

<a id="avatar-basic"></a>

### 图片头像

通过 src 显示图片，name 提供头像名称。

[查看示例文件](../../playground/src/examples/content/AvatarBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/AvatarBasic.tsx -->

```tsx
import { Avatar } from 'yahha-ui';

const picture =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#d7eaf5"/><text x="40" y="53" text-anchor="middle" font-size="40" fill="#462e31">米</text></svg>',
  );

export default function AvatarBasic() {
  return <Avatar name="库米" src={picture} />;
}
```

<a id="avatar-fallback"></a>

### 姓名与自定义回退

未提供图片时，查看姓名缩写、空姓名和指定的回退内容。

[查看示例文件](../../playground/src/examples/content/AvatarExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/AvatarExample.tsx -->

```tsx
import { Avatar, Text } from 'yahha-ui';

export default function AvatarExample() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
        <Avatar name="库米" />
        <Text size="sm" tone="muted">
          姓名缩写
        </Text>
      </div>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
        <Avatar name=" " />
        <Text size="sm" tone="muted">
          空姓名
        </Text>
      </div>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
        <Avatar name="把散步写成手记的作者库米" fallback="米" />
        <Text size="sm" tone="muted">
          自定义回退
        </Text>
      </div>
    </div>
  );
}
```

<a id="avatar-sizes"></a>

### 尺寸

使用同一姓名对比三档尺寸。

[查看示例文件](../../playground/src/examples/content/AvatarSizes.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/AvatarSizes.tsx -->

```tsx
import { Avatar, Text } from 'yahha-ui';

export default function AvatarSizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'end', flexWrap: 'wrap', gap: 24 }}>
      {(
        [
          { size: 'sm', label: '小号 sm' },
          { size: 'md', label: '中号 md（默认）' },
          { size: 'lg', label: '大号 lg' },
        ] as const
      ).map(({ size, label }) => (
        <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Avatar name="库米" size={size} />
          <Text size="sm" tone="muted">
            {label}
          </Text>
        </div>
      ))}
    </div>
  );
}
```

<a id="avatar-picture"></a>

### 图片失败与恢复

模拟图片失效与恢复，展示姓名回退。

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
        {broken ? '图片暂不可用，已显示姓名回退。' : '当前选择：本地图片。'}
      </Text>
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

<a id="avatar-author"></a>

### 作者身份与弹窗

通过独立按钮查看介绍，关闭后返回入口。

[查看示例文件](../../playground/src/examples/content/AvatarAuthor.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/AvatarAuthor.tsx -->

```tsx
import { useId, useRef, useState } from 'react';
import { Avatar, Button, Dialog, Text } from 'yahha-ui';

export default function AvatarAuthor() {
  const [open, setOpen] = useState(false);
  const authorNameId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 480 }}>
      <div
        role="group"
        aria-labelledby={authorNameId}
        style={{ display: 'grid', gap: 12, minWidth: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
          <Avatar name="把散步写成手记的作者库米" fallback="米" aria-hidden="true" />
          <div style={{ minWidth: 0 }}>
            <Text id={authorNameId}>把散步写成手记的作者库米</Text>
            <Text size="sm" tone="muted">
              手记作者
            </Text>
          </div>
        </div>
        <div>
          <Button
            ref={triggerRef}
            variant="ghost"
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
          >
            查看作者介绍
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="关于库米"
        description="散步、阅读与日常手记。"
        initialFocus={closeRef}
        finalFocus={triggerRef}
        footer={
          <Button ref={closeRef} variant="secondary" onClick={() => setOpen(false)}>
            关闭介绍
          </Button>
        }
      >
        <Text>
          你好，我是库米。散步时会记下花店几点开门，也常常被面包香带着拐弯。手记里有路边的发现，偶尔也有点心的碎屑。
        </Text>
      </Dialog>
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

| 属性                  | 说明                                                                                                    | 类型                                              | 默认值                            |
| --------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------- |
| `name` **必填**       | 去除首尾空白后作为可访问名称；为空时使用匿名用户。默认回退取前两个完整字符，保留组合 emoji 和附加符号。 | `string`                                          | —                                 |
| `src`                 | 去除首尾空白后的图片地址；为空不创建 img，地址变化后重新尝试加载。                                      | `string`                                          | —                                 |
| `fallback`            | 图片缺失、加载中或失败时的装饰内容。                                                                    | `ReactNode`                                       | `name 前两个完整字符；空姓名为 ?` |
| `size`                | 默认 32 / 44 / 64px。                                                                                   | `'sm' \| 'md' \| 'lg'`                            | `'md'`                            |
| `className / style`   | 作用于根 span。                                                                                         | `string / CSSProperties`                          | —                                 |
| `ref`                 | 指向根 span。                                                                                           | `Ref<HTMLSpanElement>`                            | —                                 |
| `其他原生属性 / 事件` | 事件、data-\* 等作用于根 span；固定 role="img"，aria-label 由 name 提供，不能通过同名属性覆盖。         | `Omit<ComponentPropsWithRef<"span">, "children">` | —                                 |

<a id="behavior"></a>

## 姓名、图片回退与恢复

- name 为整个头像提供可访问名称，内部图片和回退内容均为装饰。空白姓名的可访问名称为“匿名用户”，默认显示问号。
- 作者行已有完整姓名时，可将头像设为 aria-hidden，避免重复表达同一身份；介绍操作使用独立按钮，关闭后返回该入口。
- 缺图、加载中和加载失败时保留回退内容；更换 src 后重新加载，新图片就绪后移除回退，透明图片不会透出姓名。头像尺寸在这个过程中保持不变。
- 默认按完整字素取姓名的前两项；不支持 Intl.Segmenter 的旧环境按 Unicode 码点降级，需要固定缩写时可显式传入 fallback。
- fallback 只放展示内容，不放链接或按钮。头像不接收 children，也不透传原生 img 属性。

<a id="related"></a>

## 相关组件

- [Image 图片](image.md)：用于内容图片和封面，支持替代文字、比例容器与失败回退。
- [Text 正文](text.md)：用于正文、摘要和辅助说明，统一字号、行高与语义颜色。
