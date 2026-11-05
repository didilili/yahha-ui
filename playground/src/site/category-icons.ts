import type { ComponentCatalogGroup } from '../docs/types';
import type { CategoryIconName } from './CategoryIcon';

/** One visual identity per category, shared by the sidebar and overview. */
export const categoryIcons = {
  组件: 'components',
  通用: 'general',
  排版: 'typography',
  布局: 'layout',
  表单: 'forms',
  内容展示: 'content',
  导航: 'navigation',
  浮层: 'overlays',
  反馈: 'feedback',
  主题配置: 'theme',
} as const satisfies Record<ComponentCatalogGroup | '组件', CategoryIconName>;

export function categoryIconFor(group: string): CategoryIconName | undefined {
  return Object.hasOwn(categoryIcons, group)
    ? categoryIcons[group as keyof typeof categoryIcons]
    : undefined;
}
