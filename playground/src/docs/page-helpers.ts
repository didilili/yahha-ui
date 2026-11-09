import type { ApiRow, DocExample } from './types';

export const buttonNativeRows: ApiRow[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: '按钮内容。普通 Button 应包含可读的操作名称。',
  },
  {
    name: 'type',
    type: "'button' | 'submit' | 'reset'",
    defaultValue: "'button'",
    description: '原生按钮类型。提交表单时显式传入 submit。',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: '禁用按钮。loading 为 true 时也会禁用，不可通过 disabled={false} 覆盖。',
  },
  {
    name: 'onClick',
    type: 'MouseEventHandler<HTMLButtonElement>',
    description: '原生点击事件；键盘 Enter / Space 激活同样触发。',
  },
  {
    name: 'aria-pressed',
    type: "boolean | 'true' | 'false' | 'mixed'",
    description: '用于切换按钮，状态由调用方维护。true 时提供选中视觉。',
  },
  {
    name: 'className / style',
    type: 'string / CSSProperties',
    description: '作用于根 button，可局部定制尺寸与布局。',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLButtonElement>',
    description: '指向原生 button，可用于聚焦。',
  },
  {
    name: '其余原生属性',
    type: "ComponentPropsWithRef<'button'>",
    description:
      '支持 name、value、form、title、aria-*、data-* 等 button 属性，不支持 href 或 asChild。',
  },
];

export const buttonVariantRows: ApiRow[] = [
  {
    name: 'destructive',
    type: 'boolean',
    defaultValue: 'false',
    description: '用危险色表达删除等破坏性动作，与 variant 分开控制；不自动确认或执行删除。',
  },
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'ghost'",
    defaultValue: "'primary'",
    description: '主要、次要或文字按钮。',
  },
  {
    name: 'appearance',
    type: "'default' | 'soft'",
    defaultValue: "'default'",
    description: '常规外观或软团外观，与 variant 的强调程度分开控制。',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: '最小高度依次为 36、44、52px；IconButton 对应为方形点击区域。',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: '显示加载图标并禁用按钮，设置 aria-busy。请求与完成状态由调用方管理。',
  },
  {
    name: 'loadingVariant',
    type: "'dots' | 'biscuit'",
    defaultValue: "'dots'",
    description: '加载图形，默认三墨点；biscuit 显式选择小花饼，与 appearance 分开控制。',
  },
];

export function nativeRows(tag: string, element = tag): ApiRow[] {
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
      description: '支持对应原生元素的事件、aria-*、data-* 等属性；组件声明的同名属性优先。',
    },
  ];
}

export function example(
  id: string,
  title: string,
  description: string,
  component: DocExample['component'],
  source: string,
): DocExample {
  return { id, title, description, component, source };
}

export const stateRows: ApiRow[] = [
  { name: 'open', type: 'boolean', description: '受控展开状态；同时响应 onOpenChange。' },
  {
    name: 'defaultOpen',
    type: 'boolean',
    defaultValue: 'false',
    description: '非受控初始状态，与 open 二选一。',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: '打开或关闭请求。受控模式需要更新 open。',
  },
];

export const portalContainerType =
  'HTMLElement | ShadowRoot | RefObject<HTMLElement | ShadowRoot | null> | null';

export const popupFocusTypeSource = `import type { RefObject } from 'react';

// 文档中的说明别名，不是 yahha-ui 的公开导出。
type FocusInteraction = 'mouse' | 'touch' | 'pen' | 'keyboard' | '';

type PopupFocusTarget =
  | boolean
  | RefObject<HTMLElement | null>
  | ((interactionType: FocusInteraction) => boolean | HTMLElement | null | void);`;

export function popupRows(side: string, align: string): ApiRow[] {
  return [
    {
      name: 'side',
      type: "'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end'",
      defaultValue: `"${side}"`,
      description: 'top、bottom、left、right、inline-start、inline-end；空间不足时自动避让。',
    },
    {
      name: 'align',
      type: '"start" | "center" | "end"',
      defaultValue: `"${align}"`,
      description: '相对触发器的对齐方向。',
    },
    {
      name: 'sideOffset',
      type: 'number',
      defaultValue: '8',
      description: '与触发器的间距，单位 px。',
    },
    {
      name: 'portalContainer',
      type: portalContainerType,
      defaultValue: 'body',
      description: 'Portal 挂载容器，支持元素、ShadowRoot、对应 ref 或 null。',
    },
    {
      name: 'className / style',
      type: 'string / CSSProperties',
      description: '作用于浮层面板 div，不作用于触发器、定位层或 Portal 外层。',
    },
    {
      name: 'ref',
      type: 'Ref<HTMLDivElement>',
      description: '指向浮层面板 div，关闭卸载后为 null。',
    },
  ];
}
