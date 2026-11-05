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
    description: '组件安装、样式导入、主题配置与基础用法。',
  },
  {
    id: 'styling',
    name: '使用与定制',
    chinese: '',
    group: '开始使用',
    area: 'getting-started',
    presentation: 'compact',
    description: '组件的颜色、布局、内容插槽与状态管理，以及公开定制方式。',
  },
  {
    id: 'recipes',
    name: '场景总览',
    chinese: '',
    group: '开始使用',
    area: 'recipes',
    presentation: 'gallery',
    description: '文章页、归档和编辑界面的组件组合，提供预览、源码与接入说明。',
  },
  {
    id: 'reading',
    name: '阅读与收藏',
    chinese: '',
    group: '开始使用',
    area: 'recipes',
    description: '由作者信息、正文、配图和收藏操作组成的文章阅读示例。',
  },
  {
    id: 'states',
    name: '组合示例',
    chinese: '',
    group: '开始使用',
    area: 'recipes',
    description: '文章归档、编辑、加载、错误和空状态的组合示例。',
  },
  {
    id: 'design-baseline',
    name: '设计规范',
    chinese: '',
    group: '开始使用',
    area: 'design',
    presentation: 'compact',
    description: '配色、文字层级、控件尺寸与状态的设计规范。',
  },
  {
    id: 'artwork',
    name: '图标与插画',
    chinese: '',
    group: '开始使用',
    area: 'design',
    description: '收藏、加载、空状态和首页欢迎场景的 SVG 素材，提供预览、下载与组合示例。',
  },
] as const satisfies readonly Omit<DocPage, 'sections'>[];

export function guideMetadata(id: string): Omit<DocPage, 'sections'> {
  const summary = guideCatalog.find((page) => page.id === id);
  if (!summary) throw new Error(`Unknown guide: ${id}`);
  return summary;
}
