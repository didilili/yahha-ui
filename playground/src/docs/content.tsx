import type { ReactNode } from 'react';
import { Link } from 'yahha-ui';
import type { ApiRow, DocExample, DocPage } from './types';
import TextExample from '../examples/content/TextExample';
import textSource from '../examples/content/TextExample.tsx?raw';
import HeadingExample from '../examples/content/HeadingExample';
import headingSource from '../examples/content/HeadingExample.tsx?raw';
import LinkExample from '../examples/content/LinkExample';
import linkSource from '../examples/content/LinkExample.tsx?raw';
import DividerExample from '../examples/content/DividerExample';
import dividerSource from '../examples/content/DividerExample.tsx?raw';
import AvatarExample from '../examples/content/AvatarExample';
import avatarSource from '../examples/content/AvatarExample.tsx?raw';
import AvatarPicture from '../examples/content/AvatarPicture';
import avatarPictureSource from '../examples/content/AvatarPicture.tsx?raw';
import ImageExample from '../examples/content/ImageExample';
import imageSource from '../examples/content/ImageExample.tsx?raw';
import ImageFallback from '../examples/content/ImageFallback';
import imageFallbackSource from '../examples/content/ImageFallback.tsx?raw';
import SkeletonExample from '../examples/content/SkeletonExample';
import skeletonSource from '../examples/content/SkeletonExample.tsx?raw';
import SpinnerExample from '../examples/content/SpinnerExample';
import spinnerSource from '../examples/content/SpinnerExample.tsx?raw';
import AlertExample from '../examples/content/AlertExample';
import alertSource from '../examples/content/AlertExample.tsx?raw';
import AlertAction from '../examples/content/AlertAction';
import alertActionSource from '../examples/content/AlertAction.tsx?raw';

function nativeRows(tag: string, element = tag): ApiRow[] {
  return [
    {
      name: 'className / style',
      type: 'string / CSSProperties',
      description: `作用于根 ${element} 元素。`,
    },
    {
      name: 'ref',
      type: `ComponentPropsWithRef<'${tag}'>['ref']`,
      description: `指向真实 ${element} 元素。`,
    },
    {
      name: '其他原生属性 / 事件',
      type: `ComponentPropsWithRef<'${tag}'>`,
      description: '沿用对应原生元素的事件、aria-*、data-* 等属性；下表列出的组件属性优先。',
    },
  ];
}
function example(
  id: string,
  title: string,
  description: string,
  component: DocExample['component'],
  source: string,
): DocExample {
  return { id, title, description, component, source };
}
interface PageInput {
  id: string;
  name: string;
  chinese: string;
  group: DocPage['group'];
  description: string;
  usage: string;
  examples: DocExample[];
  design?: ReactNode;
  rows: ApiRow[];
  notes: string[];
}
function makePage({
  id,
  name,
  chinese,
  group,
  description,
  usage,
  examples,
  design,
  rows,
  notes,
}: PageInput): DocPage {
  return {
    id,
    name,
    chinese,
    group,
    description,
    importCode: `import { ${name} } from 'yahha-ui';`,
    sections: [
      { id: 'usage', title: '何时使用', content: <p>{usage}</p> },
      { id: 'examples', title: '代码演示', examples },
      ...(design ? [{ id: 'design', title: '设计与阅读', content: design }] : []),
      { id: 'api', title: 'API', api: [{ name: `${name}Props`, rows }] },
      {
        id: 'behavior',
        title: '语义与使用约定',
        content: (
          <ul>
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ),
      },
    ],
  };
}

export const contentPages: DocPage[] = [
  makePage({
    id: 'text',
    name: 'Text',
    chinese: '正文',
    group: '排版',
    description: '为段落提供统一的字号、行高和语义文字颜色。',
    usage: '用于正文、摘要和阅读提示。固定渲染为 p，按内容组织段落；布局仍由外层容器决定。',
    examples: [
      example(
        'text-sizes',
        '字号与次要文字',
        '比较三个字号、行内纸签与链接，以及中英文长内容在窄栏中的换行。',
        TextExample,
        textSource,
      ),
    ],
    design: (
      <p>
        正文使用 14 / 16 / 18px 独立字阶，默认 16px；连续阅读保持 1.8 行高。完整阅读示例用外层 68ch
        栏宽和段落留白建立节奏，组件本身不固定行长或段距；行内链接和纸签仍保留各自语义。
      </p>
    ),
    rows: [
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: '正文独立字阶 14 / 16 / 18px，默认 md 为 16px；不改变控件字号。',
      },
      {
        name: 'tone',
        type: "'default' | 'muted'",
        defaultValue: "'default'",
        description: '正文与次要文字。',
      },
      { name: 'children', type: 'ReactNode', description: '段落内容，支持行内元素。' },
      ...nativeRows('p'),
    ],
    notes: [
      'className、style 和 ref 均作用于 p。不要在段落内嵌套 div 或另一个 p。',
      '无点击、截断或展开行为。长单词默认换行；阅读宽度由调用方控制。',
    ],
  }),
  makePage({
    id: 'heading',
    name: 'Heading',
    chinese: '标题',
    group: '排版',
    description: '通过真实 h1–h6 元素建立清楚的文档层级。',
    usage: '用于页面、文章和章节标题。先确定标题层级，再调整视觉；不能仅因字号而选择不合适的语义。',
    examples: [
      example(
        'heading-levels',
        '标题层级',
        '按 h2、h3、h4 组织章节，比较节前留白与长标题自然换行。',
        HeadingExample,
        headingSource,
      ),
    ],
    design: (
      <p>
        文章标题与章节标题按语义逐级安排，仅 h2
        带有短墨弧。标题前的分组留白应大于标题到正文的间距；长标题完整换行，不为了单行而临时缩字。
      </p>
    ),
    rows: [
      {
        name: 'level',
        type: '1 | 2 | 3 | 4 | 5 | 6',
        defaultValue: '2',
        description: '渲染的标题层级，默认字号依次为 32 / 24 / 20 / 18 / 16 / 14px。',
      },
      { name: 'children', type: 'ReactNode', description: '标题内容。' },
      ...nativeRows('h2', '标题'),
    ],
    notes: [
      'ref 指向由 level 选定的 HTMLHeadingElement，属性沿用 React 原生标题元素类型。',
      '标题不管理折叠、锚点或导航。默认没有外边距，布局使用调用方的容器间距。',
    ],
  }),
  makePage({
    id: 'link',
    name: 'Link',
    chinese: '链接',
    group: '排版',
    description: '保留原生链接行为，统一下划线与键盘焦点。',
    usage: '用于页面跳转、文章阅读和外部资源入口；执行动作使用 Button。内部路由仍由应用决定。',
    examples: [
      example(
        'link-native',
        '站内与外部链接',
        '外部示例打开 example.com；新窗口会补上安全 rel，不拦截浏览器默认导航。',
        LinkExample,
        linkSource,
      ),
    ],
    design: (
      <p>
        链接使用墨色下划线，跨行仍可辨认；hover 加强下划线，键盘聚焦时显示清楚的轮廓。新窗口通过
        external 或 target 明确指定；长地址可换行，链接文字应说明目标内容。
      </p>
    ),
    rows: [
      { name: 'href', type: 'string', required: true, description: '链接目标。' },
      {
        name: 'external',
        type: 'boolean',
        defaultValue: 'false',
        description: '未指定 target 时使用 _blank。',
      },
      {
        name: 'target / rel',
        type: '原生 anchor 属性',
        description: 'target=_blank 时保留原 rel 并补充 noopener noreferrer。',
      },
      { name: 'children', type: 'ReactNode', description: '清楚描述目标的链接内容。' },
      ...nativeRows('a'),
    ],
    notes: [
      'Enter 激活链接。支持浏览器新窗口、复制链接与打开方式，组件不替换路由器。',
      '没有 disabled 模式。不可访问的目标应由页面提供说明或不渲染链接。',
    ],
  }),
  makePage({
    id: 'divider',
    name: 'Divider',
    chinese: '分隔线',
    group: '布局',
    description: '用细线区分内容，支持水平、垂直和纯装饰模式。',
    usage: '用于段落或并列元信息之间的分隔。语义分隔默认保留 hr；仅为装饰时设置 decorative。',
    examples: [
      example(
        'divider-directions',
        '水平与垂直',
        '正文使用语义分隔；元信息使用隐藏于辅助技术的装饰分隔。',
        DividerExample,
        dividerSource,
      ),
    ],
    design: (
      <p>
        分隔线使用 1px
        轻纸线，支持水平和垂直方向。阅读示例在后记与收藏反馈之间使用装饰分隔；用于正文内容分组时，应保留语义分隔，间距由页面布局安排。
      </p>
    ),
    rows: [
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        defaultValue: "'horizontal'",
        description: '方向，垂直默认高度 1.5em。',
      },
      {
        name: 'decorative',
        type: 'boolean',
        defaultValue: 'false',
        description: 'true 时 role=presentation、aria-hidden=true。',
      },
      ...nativeRows('hr'),
    ],
    notes: [
      '不接收 children，不获取焦点，没有键盘操作。',
      '水平默认宽度 100%，上下间距 20px；垂直布局可通过 style 调整高度与间距。',
    ],
  }),
  makePage({
    id: 'avatar',
    name: 'Avatar',
    chinese: '头像',
    group: '内容展示',
    description: '展示作者图片，并在缺图或失败时保留姓名缩写。',
    usage: '用于文章署名、作者介绍和个人资料。组件本身没有点击行为，可按需要与链接或按钮组合。',
    examples: [
      example(
        'avatar-fallback',
        '尺寸与文字回退',
        '比较三档尺寸、完整长姓名与匿名回退；姓名放在头像旁，图形保留短标记。',
        AvatarExample,
        avatarSource,
      ),
      example(
        'avatar-picture',
        '图片失败与恢复',
        '点击按钮模拟解码失败，再恢复有效的本地图片。',
        AvatarPicture,
        avatarPictureSource,
      ),
    ],
    design: (
      <p>
        头像保留 32 / 44 / 64px
        与不规则圆形暖墨边，姓名回退使用主题强调色纸面。头像、姓名和简介构成身份行，作者动作另行分组。完整姓名放在旁边，缺图、加载中和失败时保留回退；空白姓名使用“匿名用户”，不让一个空标签承担署名。
      </p>
    ),
    rows: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          '去除首尾空白后作为可访问名称；为空时使用匿名用户。默认回退取前两个 Unicode 字符。',
      },
      {
        name: 'src',
        type: 'string',
        description: '去除首尾空白后的图片地址；为空不创建 img，地址变化后重新尝试加载。',
      },
      {
        name: 'fallback',
        type: 'ReactNode',
        defaultValue: 'name 前两个字符',
        description: '图片缺失、加载中或失败时的装饰内容。',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: '默认 32 / 44 / 64px。',
      },
      ...nativeRows('span'),
    ],
    notes: [
      '根 span 使用 role=img 和 name 提供名称，内部图片和回退内容均为装饰。',
      '不接受 children；自定义回退内容使用 fallback。',
      'ref、style、原生事件作用于 span；不透传原生 img 属性。不在 fallback 中放交互元素。',
    ],
  }),
  makePage({
    id: 'image',
    name: 'Image',
    chinese: '图片',
    group: '内容展示',
    description: '为图片提供明确的替代文字、比例容器与失败回退。',
    usage:
      '用于文章封面和内容图片。提供准确 alt，纯装饰图片使用空字符串；失败时也要保持区域高度，请显式设置 aspectRatio。',
    examples: [
      example(
        'image-cover',
        '文章封面',
        '原生 figure 与 figcaption 组织图片和图注，aspectRatio 预留 16:9 区域。',
        ImageExample,
        imageSource,
      ),
      example(
        'image-failure',
        '失败与新地址恢复',
        '通过 onLoad / onError 显示实际状态；失败和恢复保留相同比例，src 或 srcSet 改变会重新加载。',
        ImageFallback,
        imageFallbackSource,
      ),
    ],
    design: (
      <p>
        图片使用与内容容器同族的纸面圆角，图注由原生 figcaption 承担。aspectRatio
        负责加载与失败时的稳定占位；width / height 仍是原生 img
        尺寸，不自动定义失败回退比例。失败回退用不占几何空间的 1px
        轻纸内边标记区域，正常图片不增加边线。首屏关键图片可用 eager，其余沿用 lazy。
      </p>
    ),
    rows: [
      {
        name: 'alt',
        type: 'string',
        required: true,
        description: '原生替代文字；失败回退也以此作为名称。',
      },
      {
        name: 'src / srcSet / sizes',
        type: '原生 img 属性',
        description: '图片地址与响应式资源选择。',
      },
      {
        name: 'aspectRatio',
        type: "CSSProperties['aspectRatio']",
        description: '可选比例，设置在外层容器，在加载、失败和恢复期间保持预留区域。',
      },
      {
        name: 'fallback',
        type: 'ReactNode',
        defaultValue: '图片暂时无法显示',
        description: '失败后的装饰内容；可访问名称仍使用 alt。',
      },
      {
        name: 'loading',
        type: "'lazy' | 'eager'",
        defaultValue: "'lazy'",
        description: '原生加载策略；首屏关键图片可设 eager。',
      },
      { name: 'className', type: 'string', description: '作用于外层比例容器。' },
      {
        name: 'classNames',
        type: '{ image?: string; fallback?: string }',
        description: '附加到真实 img 与失败容器。',
      },
      {
        name: 'style / ref',
        type: 'CSSProperties / Ref<HTMLImageElement>',
        description: '作用于真实 img，失败时 img 仍保留但隐藏。',
      },
      {
        name: 'onLoad / onError',
        type: '原生 img 事件',
        description: '更新内部加载状态后继续调用传入事件。',
      },
      {
        name: 'hidden / aria-hidden',
        type: '原生对应属性',
        description: '作用于整个图片呈现，包括失败回退；aria-hidden 不改变可见性。',
      },
      {
        name: '其他原生图片属性',
        type: "Omit<ComponentPropsWithRef<'img'>, 'alt'>",
        description: '包括 width、height、decoding 等，传给 img。',
      },
    ],
    notes: [
      '无自动重试、预览灯箱或裁剪编辑功能；修改地址可重新加载。',
      'fallback 仅放展示内容；交互或重试按钮放在组件外。设置 aspectRatio 时，图片使用 object-fit:cover。',
      'width / height 用于原生图片尺寸；需要失败回退也保持相同占位时，显式设置 aspectRatio。图注请放在外部 figcaption。',
      'hidden 隐藏外层容器；aria-hidden 同步容器与 img，缺源或失败回退也遵守隐藏语义。其他原生属性、style 和 ref 仍指向 img。',
      'alt="" 的失败回退保持装饰性，即使 aria-hidden={false} 也不会补出可访问图像名称。',
    ],
  }),
  makePage({
    id: 'skeleton',
    name: 'Skeleton',
    chinese: '骨架占位',
    group: '浮层与反馈',
    description: '为即将出现的内容预留形状，减少布局跳动。',
    usage:
      '用于文章摘要、头像或图片的加载阶段。调用方决定何时替换成真实内容，在内容区域设置 aria-busy。',
    examples: [
      example(
        'skeleton-content',
        '从占位到内容',
        '头像、标题和两行摘要共用布局，切换时保留同一预留空间；等待说明放在占位外。',
        SkeletonExample,
        skeletonSource,
      ),
    ],
    design: (
      <p>
        骨架默认使用 neutral-line 中性纸色与呼吸动效；强制颜色下通过 CanvasText 的 1px
        内轮廓保持可见，不改变占位尺寸。示例让骨架与头像、标题及摘要共用布局，长内容允许增高；调用方应按实际内容预留空间，并将
        aria-busy 放在内容区域。骨架保持装饰语义，减少动效时静止。只需表达等待时使用
        <Link href="#/components/spinner">Spinner</Link>；确认没有内容时使用
        <Link href="#/components/empty-state">EmptyState</Link>。
      </p>
    ),
    rows: [
      {
        name: 'variant',
        type: "'text' | 'rect' | 'circle'",
        defaultValue: "'text'",
        description: '文本行、矩形或圆形。',
      },
      {
        name: 'width / height',
        type: 'CSSProperties 尺寸',
        description:
          '文本默认 100% × 1em，矩形默认高度100px，圆形默认44px。style 中的同名属性优先。',
      },
      ...nativeRows('span'),
    ],
    notes: [
      'aria-hidden 固定为 true，不接受 children。必要的加载说明放在占位外。',
      '响应减少动态效果设置；组件不会发起请求、自动结束或管理内容尺寸。hidden=true 隐藏组件并移除占位。',
    ],
  }),
  makePage({
    id: 'spinner',
    name: 'Spinner',
    chinese: '加载指示',
    group: '浮层与反馈',
    description: '表达正在进行的等待，提供可读的状态文字。',
    usage: '适合内容区域的短暂等待。按钮请求直接使用 Button 的 loading，避免重复渲染指示器。',
    examples: [
      example(
        'spinner-sizes',
        '尺寸与状态说明',
        '标明 16 / 24 / 36px 三档尺寸；区块等待提供可见文字，避免重复播报。',
        SpinnerExample,
        spinnerSource,
      ),
    ],
    design: (
      <p>
        三枚墨点提供 16 / 24 / 36px 三档尺寸，与 Button 共用 1.2
        秒节拍；减少动效时静止，强制颜色下保持可见。仅表达等待，区块等待提供可见文字；外层已有
        status 时，可将内部 Spinner 设为装饰，避免重复播报。需要预留内容形状时使用
        <Link href="#/components/skeleton">Skeleton</Link>；确认没有内容时使用
        <Link href="#/components/empty-state">EmptyState</Link>。
      </p>
    ),
    rows: [
      {
        name: 'label',
        type: 'string',
        defaultValue: '加载中',
        description: '在 status 内提供的屏幕阅读器文字。',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: '默认 16 / 24 / 36px。',
      },
      {
        name: 'role',
        type: 'AriaRole',
        defaultValue: "'status'",
        description: '原生角色，通常保留 status。',
      },
      ...nativeRows('span'),
    ],
    notes: [
      '不接受 children；label 应描述正在等待的内容。图形是装饰，状态文字参与播报。',
      '不获取焦点，减少动态效果时保留静止墨点；组件本身没有计时或请求行为。hidden=true 隐藏组件且不占布局空间。',
    ],
  }),
  makePage({
    id: 'alert',
    name: 'Alert',
    chinese: '静态提示',
    group: '浮层与反馈',
    description: '持续展示阅读说明、完成结果或需要处理的问题。',
    usage:
      '用于页面内持续可见的说明。与 Toast 的短暂反馈不同，Alert 跟随文档布局，默认没有自动播报或消失。',
    examples: [
      example(
        'alert-tones',
        '四种说明类型',
        'info、success、warning、error 使用不同语义颜色，文字说明具体原因。',
        AlertExample,
        alertSource,
      ),
      example(
        'alert-action',
        '与操作组合',
        '首次模拟保存失败，再重试成功；选项保留，按钮加载和后续焦点由示例管理。',
        AlertAction,
        alertActionSource,
      ),
    ],
    design: (
      <p>
        持续说明使用平面提示纸，24px
        图标与首行文字对齐。保存状态、失败重试与操作后的焦点位置由调用方管理；失败时应保留用户选项，并提供明确的重试操作。组件默认使用
        note，不因颜色自动切换播报方式；hidden=true 隐藏整个提示和其中的操作，且不占布局空间。
      </p>
    ),
    rows: [
      {
        name: 'tone',
        type: "'info' | 'success' | 'warning' | 'error'",
        defaultValue: "'info'",
        description: '说明类型，决定图标与背景颜色。',
      },
      {
        name: 'title',
        type: 'ReactNode',
        description: '可选标题，渲染为 p，不是原生 title 属性。',
      },
      { name: 'children', type: 'ReactNode', description: '内容，可组合正文、链接或按钮。' },
      {
        name: 'role',
        type: 'AriaRole',
        defaultValue: "'note'",
        description: '静态说明默认 note；紧急动态结果可显式使用 alert。',
      },
      ...nativeRows('div'),
    ],
    notes: [
      '不会主动抢焦点、自动关闭或自动滚动。动态播报策略由调用方选择 role / aria-live。',
      'className、style 与 ref 作用于根 div；没有内置关闭按钮或额外插槽样式API。',
    ],
  }),
];
