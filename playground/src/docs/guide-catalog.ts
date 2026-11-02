import type { DocPage } from './types';

/** Metadata shared by routes and guide pages, without importing examples. */
export const guideCatalog = [
  {
    id: 'introduction',
    name: '项目介绍',
    chinese: '',
    group: '开始使用',
    area: 'getting-started',
    description: '面向个人博客、个人主页与内容网站的漫画手账风 React 组件库。',
  },
  {
    id: 'getting-started',
    name: '开始使用',
    chinese: '',
    group: '开始使用',
    area: 'getting-started',
    presentation: 'compact',
    description: '安装组件、加载样式，先把第一个按钮放进你的页面。',
  },
  {
    id: 'styling',
    name: '使用与定制',
    chinese: '',
    group: '开始使用',
    area: 'getting-started',
    presentation: 'compact',
    description: '通过公开颜色、样式和插槽配置组件，了解状态管理与键盘操作。',
  },
  {
    id: 'recipes',
    name: '场景总览',
    chinese: '',
    group: '开始使用',
    area: 'recipes',
    presentation: 'gallery',
    description: '用现有组件搭文章、归档和编辑界面。按用途查看预览、代码与接入文件。',
  },
  {
    id: 'reading',
    name: '阅读与收藏',
    chinese: '',
    group: '开始使用',
    area: 'recipes',
    description: '用作者信息、正文、配图和收藏组成文章页，查看交互预览与完整接入。',
  },
  {
    id: 'states',
    name: '组合示例',
    chinese: '',
    group: '开始使用',
    area: 'recipes',
    description: '文章归档、编辑、加载与空状态的完整组合，提供交互预览、源码和接入说明。',
  },
  {
    id: 'design-baseline',
    name: '设计规范',
    chinese: '',
    group: '开始使用',
    area: 'design',
    presentation: 'compact',
    description: '查看配色、文字层级、控件尺寸与状态，按相同规则组合页面。',
  },
  {
    id: 'artwork',
    name: '图标与插画',
    chinese: '',
    group: '开始使用',
    area: 'design',
    description: '用于收藏、加载、空状态和首页的 SVG 素材，提供预览、下载与组件组合示例。',
  },
] as const satisfies readonly Omit<DocPage, 'sections'>[];

export function guideMetadata(id: string): Omit<DocPage, 'sections'> {
  const summary = guideCatalog.find((page) => page.id === id);
  if (!summary) throw new Error(`Unknown guide: ${id}`);
  return summary;
}
