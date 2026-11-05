<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Heading 标题

通过真实 h1–h6 元素建立清楚的文档层级。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Heading } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于页面、文章和章节标题。按内容结构选择标题层级，默认字号随层级变化。

<a id="examples"></a>

## 代码演示

<a id="heading-levels"></a>

### 标题层级对照

用相同文字比较一级至六级标题，观察各层级的默认字号。

[查看示例文件](../../playground/src/examples/content/HeadingExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/HeadingExample.tsx -->

```tsx
import { Heading, Text } from 'yahha-ui';

export default function HeadingExample() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: '65ch' }}>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <div key={level} style={{ display: 'grid', gap: 4 }}>
          <Text size="sm" tone="muted">
            {['一级标题', '二级标题', '三级标题', '四级标题', '五级标题', '六级标题'][level - 1]} h
            {level}
            {level === 2 ? '（默认）' : ''}
          </Text>
          <Heading level={level}>星球上的点心时间</Heading>
        </div>
      ))}
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

<a id="heading-reading-layout"></a>

### 文章层级与章节链接

定位章节、复制章节地址；复制失败时可手动复制。

[查看示例文件](../../playground/src/examples/content/HeadingArticle.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/HeadingArticle.tsx -->

```tsx
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Button, Heading, Link, Text, TextField } from 'yahha-ui';

export default function HeadingArticle({ hrefPrefix = '#' }: { hrefPrefix?: string }) {
  const replyId = 'heading-article-reply';
  const journalId = 'heading-article-journal';
  const replyRef = useRef<HTMLHeadingElement>(null);
  const journalRef = useRef<HTMLHeadingElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const copyRequest = useRef(0);
  const [copyMessage, setCopyMessage] = useState('');
  const [manualCopy, setManualCopy] = useState<{
    address: string;
    request: number;
    restoreFocus: boolean;
  } | null>(null);

  useEffect(
    () => () => {
      copyRequest.current += 1;
    },
    [],
  );

  useEffect(() => {
    if (!manualCopy?.restoreFocus || manualCopy.request !== copyRequest.current) return;
    addressRef.current?.focus();
    addressRef.current?.select();
  }, [manualCopy]);

  async function copySectionAddress() {
    const request = ++copyRequest.current;
    setCopyMessage('');
    setManualCopy(null);
    const address = new URL(`${hrefPrefix}${journalId}`, window.location.href).href;

    try {
      await navigator.clipboard.writeText(address);
      if (request !== copyRequest.current) return;
      setCopyMessage('章节地址已复制。');
    } catch {
      if (request !== copyRequest.current) return;
      setCopyMessage('未能复制，请选中下方地址手动复制。');
      setManualCopy({ address, request, restoreFocus: document.activeElement === copyRef.current });
    }
  }

  function focusHeading(event: MouseEvent<HTMLAnchorElement>, heading: HTMLHeadingElement | null) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !heading
    )
      return;
    event.preventDefault();
    heading.scrollIntoView({ block: 'center' });
    heading.focus({ preventScroll: true });
  }

  return (
    <div style={{ display: 'grid', gap: 32, maxWidth: '65ch' }}>
      <nav aria-label="手记目录" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <Link
          href={`${hrefPrefix}${replyId}`}
          onClick={(event) => focusHeading(event, replyRef.current)}
        >
          写封回信
        </Link>
        <Link
          href={`${hrefPrefix}${journalId}`}
          onClick={(event) => focusHeading(event, journalRef.current)}
        >
          长手记
        </Link>
      </nav>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          章节 h2
        </Text>
        <Heading level={2}>云朵邮局的第一封来信</Heading>
        <Text>
          Yahha
          星球的云朵邮局，今天收到一封字歪歪的来信。小八念给大家听，吉伊找来彩色铅笔，乌萨奇把邮票排成一行。
        </Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          小节 h3
        </Text>
        <Heading level={3} id={replyId} ref={replyRef} tabIndex={-1}>
          给远方的朋友写封回信
        </Heading>
        <Text>信纸上画一张草地野餐图，给还没来过的朋友也留一个位置。邮票贴歪了，就再按一按。</Text>
        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          <Text size="sm" tone="muted">
            小节内标题 h4
          </Text>
          <Heading level={4}>在信里给朋友留个位置</Heading>
          <Text size="sm" tone="muted">
            “下次一起吃点心吧。”大家画了三块饼干，又添上一块。
          </Text>
        </div>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          长标题 h3
        </Text>
        <Heading level={3} id={journalId} ref={journalRef} tabIndex={-1}>
          把云朵邮局里借来的铅笔、贴歪的邮票和分给朋友的半块饼干，写进今天的长手记
        </Heading>
        <Text>有些字擦了又写，信封也折得不太齐。寄出去之前，大家还是认认真真签上了名字。</Text>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Link href={`${hrefPrefix}${journalId}`}>本节永久链接</Link>
          <Button ref={copyRef} variant="ghost" onClick={copySectionAddress}>
            复制本节地址
          </Button>
        </div>
        <Text size="sm" tone="muted" role="status">
          {copyMessage}
        </Text>
        {manualCopy && (
          <TextField ref={addressRef} label="章节地址" readOnly value={manualCopy.address} />
        )}
      </section>
    </div>
  );
}
```

<a id="design"></a>

## 标题间距与长标题

标题默认没有外边距，使用外层布局区分章节之间与标题到正文的间距。长标题会自然换行，应保留完整文字；不要仅为缩小字号而改变标题层级。

<a id="api"></a>

## API

### HeadingProps

| 属性                  | 说明                                                                      | 类型                                 | 默认值 |
| --------------------- | ------------------------------------------------------------------------- | ------------------------------------ | ------ |
| `level`               | 渲染的标题层级，默认字号依次为 32 / 24 / 20 / 18 / 16 / 14px。            | `1 \| 2 \| 3 \| 4 \| 5 \| 6`         | `2`    |
| `children`            | 标题内容。                                                                | `ReactNode`                          | —      |
| `className / style`   | 作用于根 h1–h6 标题 元素。                                                | `string / CSSProperties`             | —      |
| `ref`                 | 指向真实 h1–h6 标题 元素。                                                | `ComponentPropsWithRef<'h2'>['ref']` | —      |
| `其他原生属性 / 事件` | 支持对应原生元素的事件、aria-\*、data-\* 等属性；组件声明的同名属性优先。 | `ComponentPropsWithRef<'h2'>`        | —      |

<a id="behavior"></a>

## 接续页面的标题层级

例如文章标题使用 h1 时，下一级章节使用 h2，小节使用 h3；嵌入已有页面时，接续所在页面的结构。

目录链接引用标题在页面内唯一的 id。定位后的滚动与焦点由页面处理；上例通过 ref 聚焦目标标题，并设置 tabIndex=-1，使其可被聚焦而不额外加入 Tab 顺序。

章节分享属于页面任务。示例复用固定 id 与 hrefPrefix 生成永久链接；剪贴板失败时显示可选中的只读地址， 仍可用浏览器原生方式复制。接入自己的路由时替换 hrefPrefix，不由 Heading 自动生成地址。 页面定位时为固定页头保留滚动留白，接入自己的站点时按路由与页头布局处理。

<a id="related"></a>

## 相关组件

- [Text 正文](text.md)：为段落提供统一的字号、行高和语义文字颜色。
- [Divider 分隔线](divider.md)：用细线区分内容，支持水平、垂直和纯装饰模式。
