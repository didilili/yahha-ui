import { componentCatalog } from './component-catalog';
import type { DocPage } from './types';

/** Select by purpose, including components from a different navigation group. */
const relatedComponents: Record<string, readonly string[]> = {
  button: ['icon-button', 'link'],
  'icon-button': ['button', 'tooltip'],
  text: ['heading', 'link', 'badge'],
  heading: ['text', 'divider'],
  link: ['button', 'text', 'pagination'],
  surface: ['divider', 'text', 'dialog'],
  divider: ['surface', 'heading'],
  'text-field': ['textarea', 'select'],
  textarea: ['text-field', 'button'],
  select: ['radio-group', 'segmented-control', 'dropdown-menu'],
  checkbox: ['radio-group', 'switch'],
  'radio-group': ['select', 'checkbox', 'segmented-control'],
  switch: ['checkbox', 'radio-group'],
  'segmented-control': ['radio-group', 'select', 'tabs'],
  badge: ['text', 'alert'],
  avatar: ['image', 'text'],
  image: ['avatar', 'skeleton'],
  accordion: ['tabs', 'heading'],
  tabs: ['segmented-control', 'accordion', 'pagination'],
  pagination: ['link', 'tabs'],
  'dropdown-menu': ['select', 'popover', 'dialog'],
  dialog: ['popover', 'alert', 'toast'],
  popover: ['tooltip', 'dialog', 'dropdown-menu'],
  tooltip: ['popover', 'icon-button'],
  alert: ['toast', 'empty-state'],
  toast: ['alert', 'dialog'],
  'empty-state': ['spinner', 'skeleton', 'alert'],
  spinner: ['skeleton', 'button', 'empty-state'],
  skeleton: ['spinner', 'image'],
  'theme-provider': ['button', 'surface', 'popover'],
};

/** Metadata belongs to the catalog; each page owns only its usage, examples and API. */
export function defineComponentPage(
  id: string,
  content: Pick<DocPage, 'importCode' | 'sections'>,
): DocPage {
  const summary = componentCatalog.find((item) => item.id === id);
  if (!summary) throw new Error(`Missing component metadata: ${id}`);
  const { name, chinese, group, description } = summary;
  const related = (relatedComponents[id] ?? []).map((relatedId) => {
    const item = componentCatalog.find((entry) => entry.id === relatedId);
    if (!item) throw new Error(`Unknown related component: ${id} -> ${relatedId}`);
    return item;
  });
  return {
    id,
    name,
    chinese,
    group,
    description,
    ...content,
    sections: [
      ...content.sections,
      ...(related.length
        ? [
            {
              id: 'related',
              title: '相关组件',
              content: (
                <ul>
                  {related.map((item) => (
                    <li key={item.id}>
                      <a href={`#/components/${item.id}`}>
                        {item.name} {item.chinese}
                      </a>
                      ：{item.description}
                    </li>
                  ))}
                </ul>
              ),
            },
          ]
        : []),
    ],
  };
}
