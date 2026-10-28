import type { ComponentType, ReactNode } from 'react';

export interface DocExample {
  id: string;
  title: string;
  description: string;
  component: ComponentType;
  source: string;
  /** Downloadable files imported by the unchanged source from its artwork directory. */
  assets?: { name: string; href: string }[];
  /** Explicit examples own their provider; other examples use the default theme in full setup. */
  themeScope?: 'inherited' | 'explicit';
  /** Sparse control demonstrations can use a centered canvas; reading/form layouts stay fluid. */
  previewAlign?: 'center';
}

export interface ApiRow {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: string;
}

export interface DocSection {
  id: string;
  title: string;
  content?: ReactNode;
  examples?: DocExample[];
  api?: { name: string; rows: ApiRow[] }[];
}

export type ComponentGroup =
  '通用' | '排版' | '布局' | '表单' | '内容展示' | '导航' | '浮层' | '反馈';
export type ConfigurationGroup = '主题配置';
export type ComponentCatalogGroup = ComponentGroup | ConfigurationGroup;

export interface DocPage {
  id: string;
  name: string;
  chinese: string;
  group: '开始使用' | ComponentCatalogGroup;
  description: string;
  importCode?: string;
  sections: DocSection[];
}
