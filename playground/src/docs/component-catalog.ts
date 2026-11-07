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
    description: '用于触发操作，支持不同强调程度、禁用、加载和切换状态。',
  },
  {
    id: 'icon-button',
    name: 'IconButton',
    chinese: '图标按钮',
    group: '通用',
    description: '用于仅以图标呈现的操作，提供方形点击区域，并要求明确的可访问名称。',
  },
  {
    id: 'icon',
    name: 'Icon',
    chinese: '图标',
    group: '通用',
    aliases: ['SVG', '图形', '手绘图标'],
    description: '显示自定义 SVG 或直接使用手绘功能图标，统一尺寸、颜色和可访问名称。',
  },
  {
    id: 'text',
    name: 'Text',
    chinese: '正文',
    group: '排版',
    description: '用于正文、摘要和辅助说明，统一字号、行高与语义颜色。',
  },
  {
    id: 'heading',
    name: 'Heading',
    chinese: '标题',
    group: '排版',
    description: '通过原生 h1–h6 元素定义页面、文章与章节的标题层级。',
  },
  {
    id: 'link',
    name: 'Link',
    chinese: '链接',
    group: '排版',
    description: '用于页面导航和资源跳转，保留原生链接行为、下划线与焦点样式。',
  },
  {
    id: 'surface',
    name: 'Surface',
    chinese: '内容容器',
    group: '布局',
    description: '用于组织文章摘要、作者介绍等内容，提供背景、边框、圆角与内边距。',
  },
  {
    id: 'divider',
    name: 'Divider',
    chinese: '分隔线',
    group: '布局',
    description: '用于内容的主题或视觉分隔，支持水平、垂直和装饰模式。',
  },
  {
    id: 'text-field',
    name: 'TextField',
    chinese: '单行输入',
    group: '表单',
    aliases: ['输入框'],
    description: '带可见标签、辅助说明和错误反馈的单行输入框。',
  },
  {
    id: 'textarea',
    name: 'Textarea',
    chinese: '多行输入',
    group: '表单',
    description: '用于留言、评论、个人简介等多行纯文本输入。',
  },
  {
    id: 'select',
    name: 'Select',
    chinese: '下拉选择器',
    group: '表单',
    description: '从文章分类、排序方式等固定选项中选一项。',
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    chinese: '复选框',
    group: '表单',
    description: '用于独立选择、多项选择或确认事项，支持半选状态。',
  },
  {
    id: 'radio-group',
    name: 'RadioGroup',
    chinese: '单选组',
    group: '表单',
    description: '用于在一组互斥选项中选择单个值，可为选项提供说明。',
  },
  {
    id: 'switch',
    name: 'Switch',
    chinese: '开关',
    group: '表单',
    description: '打开或关闭即时生效的设置，例如显示文章摘要。',
  },
  {
    id: 'segmented-control',
    name: 'SegmentedControl',
    chinese: '分段选择',
    group: '表单',
    aliases: ['分段单选'],
    description: '紧凑的受控单选组，适用于分类、排序等简短选项，保留原生 radio 的表单与键盘行为。',
  },
  {
    id: 'badge',
    name: 'Badge',
    chinese: '状态标记',
    group: '内容展示',
    description: '用于展示分类、标签或当前状态的静态标记。',
  },
  {
    id: 'avatar',
    name: 'Avatar',
    chinese: '头像',
    group: '内容展示',
    description: '展示作者头像，支持姓名缩写、自定义回退与图片加载失败处理。',
  },
  {
    id: 'image',
    name: 'Image',
    chinese: '图片',
    group: '内容展示',
    description: '用于内容图片和封面，支持替代文字、比例容器与失败回退。',
  },
  {
    id: 'accordion',
    name: 'Accordion',
    chinese: '折叠面板',
    group: '内容展示',
    description: '用于可展开和收起的内容面板，支持单项或多项展开。',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    chinese: '标签页',
    group: '导航',
    description: '用于在同一区域切换相关内容面板，建立标签与面板的语义关联。',
  },
  {
    id: 'pagination',
    name: 'Pagination',
    chinese: '分页',
    group: '导航',
    description: '用于列表分页，显示首页、末页和当前页附近的页码。',
  },
  {
    id: 'dropdown-menu',
    name: 'DropdownMenu',
    chinese: '下拉菜单',
    group: '浮层',
    description: '用于展示单层操作菜单，支持键盘导航与禁用项。',
  },
  {
    id: 'dialog',
    name: 'Dialog',
    chinese: '弹窗',
    group: '浮层',
    description: '用于模态展示确认、简短表单或补充内容，管理弹窗焦点。',
  },
  {
    id: 'popover',
    name: 'Popover',
    chinese: '弹出面板',
    group: '浮层',
    aliases: ['浮层'],
    description: '锚定到触发器的非模态面板，可包含说明、链接或短表单。',
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    chinese: '文字提示',
    group: '浮层',
    description: '悬停或聚焦时显示简短的视觉文字提示，不替代触发器的可访问名称。',
  },
  {
    id: 'alert',
    name: 'Alert',
    chinese: '提示条',
    group: '反馈',
    aliases: ['静态提示'],
    description: '用于页面内持续显示的信息、结果、警告或错误提示。',
  },
  {
    id: 'toast',
    name: 'Toast',
    chinese: '提示消息',
    group: '反馈',
    description: '用于反馈操作结果，支持说明与操作插槽，由调用方管理显示状态。',
  },
  {
    id: 'empty-state',
    name: 'EmptyState',
    chinese: '空状态',
    group: '反馈',
    description: '用于列表为空、搜索无结果等情况，提供说明与操作插槽。',
  },
  {
    id: 'progress',
    name: 'Progress',
    chinese: '进度条',
    group: '反馈',
    aliases: ['完成比例', '百分比'],
    description: '显示任务完成比例，支持未知进度和可选的纸签端点。',
  },
  {
    id: 'spinner',
    name: 'Spinner',
    chinese: '加载指示',
    group: '反馈',
    description: '表示正在进行的加载或等待，提供可读的状态文字。',
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
    description: '配置配色预设与语义颜色，并向浮层 Portal 传递主题。',
  },
];
