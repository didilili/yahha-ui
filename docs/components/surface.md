<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Surface 内容容器

用于组织文章摘要、作者介绍等内容，提供背景、边框、圆角与内边距。

[安装与接入](../../README.md#安装与接入) · [接入示例](../guides/examples.md)

```tsx
import { Surface } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于组织文章摘要、作者介绍和阅读提示等内容。Surface 提供平整纸面与轻边框，标题、正文和操作可按内容需要组合。

<a id="examples"></a>

## 代码演示

<a id="surface-basic"></a>

### 基础用法

标题与正文的静态组合。

[查看示例文件](../../playground/src/examples/foundations/SurfaceBasic.tsx)

<!-- example-source: playground/src/examples/foundations/SurfaceBasic.tsx -->

```tsx
import { Heading, Surface, Text } from 'yahha-ui';

export default function SurfaceBasic() {
  return (
    <Surface style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <Heading level={3}>给路过的小星星写封信</Heading>
      <Text>
        在 Yahha
        星球的云朵邮局，信纸可以借，铅笔也可以借。写好后，别忘了告诉小星星：下次来，给你留块饼干。
      </Text>
    </Surface>
  );
}
```

<a id="surface-notes"></a>

### 便笺样式

用 note 纸面呈现一段后记。

[查看示例文件](../../playground/src/examples/foundations/SurfaceNotes.tsx)

<!-- example-source: playground/src/examples/foundations/SurfaceNotes.tsx -->

```tsx
import { useId } from 'react';
import { Heading, Surface, Text } from 'yahha-ui';

export default function SurfaceNotes() {
  const id = useId();
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 560 }}>
      <Surface
        variant="note"
        role="note"
        aria-labelledby={`${id}-afterword`}
        style={{ display: 'grid', gap: 12 }}
      >
        <Heading level={3} id={`${id}-afterword`}>
          写在手记后面
        </Heading>
        <Text>
          写手记时总有人凑过来看。小八检查点心有没有写漏，吉伊添了一幅画，乌萨奇的字挤到了纸边。
        </Text>
      </Surface>
    </div>
  );
}
```

<a id="surface-composition"></a>

### 内容与操作组合

在容器中组合分类、标题、正文与独立操作区。

[查看示例文件](../../playground/src/examples/foundations/SurfaceComposition.tsx)

<!-- example-source: playground/src/examples/foundations/SurfaceComposition.tsx -->

```tsx
import { useId, useState } from 'react';
import { Badge, Button, Heading, Surface, Text } from 'yahha-ui';

export default function SurfaceComposition() {
  const headingId = useId();
  const [saved, setSaved] = useState(false);

  return (
    <Surface
      role="region"
      aria-labelledby={headingId}
      style={{ display: 'grid', gap: 24, maxWidth: 560 }}
    >
      <header style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Badge>生活随笔</Badge>
        <Heading level={3} id={headingId}>
          路线图上没有的面包店
        </Heading>
        <Text>原本打算沿河散步，走到一半，小八已经选好了面包。</Text>
      </header>
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Button
          variant="secondary"
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
        >
          收藏文章
        </Button>
        <Text role="status" size="sm" tone="muted">
          {saved ? '已加入收藏' : '尚未收藏'}
        </Text>
      </div>
    </Surface>
  );
}
```

<a id="surface-cover"></a>

### 贴边封面与内容分区

封面贴齐容器边缘，正文保留内距。

[查看示例文件](../../playground/src/examples/foundations/SurfaceCover.tsx)

<!-- example-source: playground/src/examples/foundations/SurfaceCover.tsx -->

```tsx
import { useId } from 'react';
import { Heading, Image, Link, Surface, Text } from 'yahha-ui';

const cover =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="800" height="450" fill="#fff6f7"/><rect x="48" y="48" width="704" height="354" rx="12" fill="#fffefa" stroke="#d7c3c0"/><text x="400" y="215" text-anchor="middle" fill="#462e31" font-family="sans-serif" font-size="42">周末手记</text><text x="400" y="275" text-anchor="middle" fill="#79656a" font-family="sans-serif" font-size="22">给喜欢的事情，留一点位置。</text></svg>',
  );

export default function SurfaceCover() {
  const titleId = useId();

  return (
    <article aria-labelledby={titleId} style={{ maxWidth: 560 }}>
      <style>{`
        .yahha-surface-cover-body { display: grid; gap: 16px; padding: 24px; }
        @media (max-width: 480px) { .yahha-surface-cover-body { padding: 16px; } }
      `}</style>
      <Surface style={{ padding: '0', overflow: 'hidden' }}>
        <Image
          src={cover}
          alt="写着周末手记的纸面封面"
          aspectRatio="16 / 9"
          loading="eager"
          fallback="封面暂不可用，正文仍可阅读。"
        />
        <div className="yahha-surface-cover-body">
          <Heading level={3} id={titleId}>
            <Link href="#/guides/reading?section=reading-example">沿着河边，慢慢走</Link>
          </Heading>
          <Text>说好沿河散步，小八却先闻到了面包香。</Text>
        </div>
      </Surface>
    </article>
  );
}
```

<a id="design"></a>

## 内容布局

默认内边距为 24px，容器宽度与内容间距由使用方安排。通过 style 或 className 设置 `maxWidth`、`display: grid` 与 `gap`，组织标题与正文。

连续正文按阅读顺序排布，只在需要独立纸面时使用容器。完整用法见[阅读组合中的文末便笺](../README.md#站内指南)。

paper 保留默认白纸；note 使用轻底便笺与一处纸角，字阶、轮廓和 24px 内边距保持。纸角跟随文字方向镜像，支持继承的 dir 与 style.direction。 封面示例通过公开 style 将 Surface 的 padding 设为 0，由内部内容区安排桌面 24px、窄屏 16px 留白；标题链接独立导航，图片区域保留 16:9 比例。

<a id="api"></a>

## API

### SurfaceProps

| 属性                | 说明                                                         | 类型                           | 默认值    |
| ------------------- | ------------------------------------------------------------ | ------------------------------ | --------- |
| `variant`           | 白纸或轻底便笺，仅影响视觉，不自动赋予 note 或 region 语义。 | `'paper' \| 'note'`            | `'paper'` |
| `children`          | 容器内容。                                                   | `ReactNode`                    | —         |
| `className / style` | 作用于根 div，可调整布局与外观。                             | `string / CSSProperties`       | —         |
| `ref`               | 指向根 div。                                                 | `Ref<HTMLDivElement>`          | —         |
| `其余原生属性`      | 透传 div 属性，例如 role、aria-labelledby、id、data-\*。     | `ComponentPropsWithRef<'div'>` | —         |

<a id="accessibility"></a>

## 为内容区域命名

Surface 默认是普通 div。内容确实构成需要单独导航的区域时，再提供 role="region"，并用 aria-labelledby 关联内部标题；标题层级应接续所在页面。

阅读文章使用标题链接，收藏文章使用独立按钮。仅给整个 Surface 绑定点击事件，不会提供相应的键盘操作或链接语义。

<a id="related"></a>

## 相关组件

- [Divider 分隔线](divider.md)：用于内容的主题或视觉分隔，支持水平、垂直和装饰模式。
- [Text 段落正文](text.md)：固定使用 p 元素的段落正文，统一字号、行高与语义颜色。
- [Dialog 弹窗](dialog.md)：用于模态展示确认、简短表单或补充内容，管理弹窗焦点。
