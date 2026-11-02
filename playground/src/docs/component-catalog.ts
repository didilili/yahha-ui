import type { ComponentCatalogGroup, ComponentGroup, ConfigurationGroup, DocPage } from './types';

/** Search and navigation metadata without importing examples or their source text. */
type ComponentPageSummary = Pick<DocPage, 'id' | 'name' | 'chinese' | 'description'> & {
  group: ComponentCatalogGroup;
  aliases?: readonly string[];
};

/** Shared UI category order for the directory and visual overview. */
export const componentGroups = [
  '通用',
  '排版',
  '布局',
  '表单',
  '内容展示',
  '导航',
  '浮层',
  '反馈',
] as const satisfies readonly ComponentGroup[];

/** Configuration documents remain separate from the UI component categories. */
export const configurationGroups = ['主题配置'] as const satisfies readonly ConfigurationGroup[];

/** All searchable documentation groups, including configuration. */
export const catalogGroups = [...componentGroups, ...configurationGroups] as const;

export const componentCatalog: ComponentPageSummary[] = [
  {
    id: 'button',
    name: 'Button',
    chinese: '按钮',
    group: '通用',
    description: '用于提交、保存和收藏等操作，提供三种强调程度，支持禁用与加载状态。',
  },
  {
    id: 'icon-button',
    name: 'IconButton',
    chinese: '图标按钮',
    group: '通用',
    description: '为关闭、收藏等仅用图标表达的操作提供方形点击区域与明确的可访问名称。',
  },
  {
    id: 'text',
    name: 'Text',
    chinese: '正文',
    group: '排版',
    description: '为段落提供统一的字号、行高和语义文字颜色。',
  },
  {
    id: 'heading',
    name: 'Heading',
    chinese: '标题',
    group: '排版',
    description: '通过真实 h1–h6 元素建立清楚的文档层级。',
  },
  {
    id: 'link',
    name: 'Link',
    chinese: '链接',
    group: '排版',
    description: '保留原生链接行为，统一下划线与键盘焦点。',
  },
  {
    id: 'surface',
    name: 'Surface',
    chinese: '内容容器',
    group: '布局',
    description: '提供背景、边框、圆角与内边距的平面容器，用于组织轻量内容。',
  },
  {
    id: 'divider',
    name: 'Divider',
    chinese: '分隔线',
    group: '布局',
    description: '用细线区分内容，支持水平、垂直和纯装饰模式。',
  },
  {
    id: 'text-field',
    name: 'TextField',
    chinese: '单行输入',
    group: '表单',
    aliases: ['输入框'],
    description: '带可见标签的单行输入框，用于站内搜索、个人资料和轻量表单。',
  },
  {
    id: 'textarea',
    name: 'Textarea',
    chinese: '多行输入',
    group: '表单',
    description: '用于留言、评论、个人简介和需要换行的轻量表单。',
  },
  {
    id: 'select',
    name: 'Select',
    chinese: '下拉选择器',
    group: '表单',
    description: '在有限的文章分类、排序或归档选项中选择一项。',
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    chinese: '复选框',
    group: '表单',
    description: '用于多项选择、订阅选项和需要主动确认的轻量表单。',
  },
  {
    id: 'radio-group',
    name: 'RadioGroup',
    chinese: '单选组',
    group: '表单',
    description: '将互斥选项和说明完整展示，适合订阅频率、可见范围等少量选择。',
  },
  {
    id: 'switch',
    name: 'Switch',
    chinese: '开关',
    group: '表单',
    description: '切换即时生效的阅读偏好或显示选项，开与关都有清楚含义。',
  },
  {
    id: 'segmented-control',
    name: 'SegmentedControl',
    chinese: '分段选择',
    group: '表单',
    aliases: ['分段单选'],
    description: '在少量互斥选项间切换，使用原生 radio 保留表单与键盘行为。',
  },
  {
    id: 'badge',
    name: 'Badge',
    chinese: '状态标记',
    group: '内容展示',
    description: '在文章标题、分类或阅读信息旁展示紧凑的静态标记。',
  },
  {
    id: 'avatar',
    name: 'Avatar',
    chinese: '头像',
    group: '内容展示',
    description: '展示作者图片，并在缺图或失败时保留姓名缩写。',
  },
  {
    id: 'image',
    name: 'Image',
    chinese: '图片',
    group: '内容展示',
    description: '为图片提供明确的替代文字、比例容器与失败回退。',
  },
  {
    id: 'accordion',
    name: 'Accordion',
    chinese: '折叠面板',
    group: '内容展示',
    description: '展开 FAQ 和补充说明，提供单项或多项展开，使用语义标题和按钮。',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    chinese: '标签页',
    group: '导航',
    description: '在同一页面的相关内容面板之间切换，用于栏目说明、作者资料和内容分区。',
  },
  {
    id: 'pagination',
    name: 'Pagination',
    chinese: '分页',
    group: '导航',
    description: '在文章列表和归档中切换页码，保留首页、末页和当前页附近的页码。',
  },
  {
    id: 'dropdown-menu',
    name: 'DropdownMenu',
    chinese: '下拉菜单',
    group: '浮层',
    description: '将文章操作或轻量工具收进一组可通过键盘操作的动作菜单。',
  },
  {
    id: 'dialog',
    name: 'Dialog',
    chinese: '弹窗',
    group: '浮层',
    description: '需要用户暂时集中注意力时，显示一段独立内容或简短表单。',
  },
  {
    id: 'popover',
    name: 'Popover',
    chinese: '弹出面板',
    group: '浮层',
    aliases: ['浮层'],
    description: '锚定到按钮的补充面板，适合简短说明和轻量交互。',
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    chinese: '文字提示',
    group: '浮层',
    description: '悬停或聚焦时，为已有操作补充简短的视觉文字标签。',
  },
  {
    id: 'alert',
    name: 'Alert',
    chinese: '提示条',
    group: '反馈',
    aliases: ['静态提示'],
    description: '持续展示阅读说明、完成结果或需要处理的问题。',
  },
  {
    id: 'toast',
    name: 'Toast',
    chinese: '提示消息',
    group: '反馈',
    description: '在页面中反馈保存、完成或失败等操作结果，支持说明与补充操作。',
  },
  {
    id: 'empty-state',
    name: 'EmptyState',
    chinese: '空状态',
    group: '反馈',
    description: '当列表或搜索没有内容时，解释原因，并给出合适的下一步。',
  },
  {
    id: 'spinner',
    name: 'Spinner',
    chinese: '加载指示',
    group: '反馈',
    description: '表达正在进行的等待，提供可读的状态文字。',
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    chinese: '骨架占位',
    group: '反馈',
    description: '为即将出现的内容预留形状，减少布局跳动。',
  },
  {
    id: 'theme-provider',
    name: 'ThemeProvider',
    chinese: '主题配置',
    group: '主题配置',
    aliases: ['主题'],
    description: '设置默认配色、可选颜色预设与语义颜色，并在浮层 Portal 中保持一致。',
  },
];
