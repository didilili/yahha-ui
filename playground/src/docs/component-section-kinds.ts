import type { DocSectionKind } from './types';

const sharedSections = {
  usage: 'usage',
  examples: 'examples',
  api: 'api',
  related: 'related',
} satisfies Record<string, DocSectionKind>;

const integratedSections = {
  ...sharedSections,
  integration: 'integration',
} satisfies Record<string, DocSectionKind>;

/** Legacy anchors describe different subjects on different component pages. */
const componentSections: Readonly<Record<string, Readonly<Record<string, DocSectionKind>>>> = {
  button: {
    ...integratedSections,
    design: 'styling',
    accessibility: 'accessibility',
  },
  'icon-button': {
    ...integratedSections,
    accessibility: 'accessibility',
    styling: 'styling',
  },
  text: {
    ...integratedSections,
    design: 'styling',
    behavior: 'guidance',
  },
  heading: {
    ...integratedSections,
    design: 'styling',
    behavior: 'accessibility',
  },
  link: {
    ...sharedSections,
    design: 'styling',
    behavior: 'behavior',
  },
  surface: {
    ...integratedSections,
    design: 'styling',
    accessibility: 'accessibility',
  },
  divider: {
    ...integratedSections,
    design: 'styling',
    behavior: 'accessibility',
  },
  'text-field': {
    ...integratedSections,
    design: 'behavior',
    keyboard: 'accessibility',
    styling: 'styling',
  },
  textarea: {
    ...integratedSections,
    keyboard: 'accessibility',
    limits: 'behavior',
    styling: 'styling',
  },
  select: {
    ...integratedSections,
    design: 'behavior',
    keyboard: 'accessibility',
    limits: 'styling',
  },
  checkbox: {
    ...integratedSections,
    design: 'behavior',
    keyboard: 'accessibility',
    limits: 'styling',
  },
  'radio-group': {
    ...integratedSections,
    design: 'behavior',
    keyboard: 'accessibility',
    limits: 'styling',
  },
  switch: {
    ...integratedSections,
    design: 'behavior',
    keyboard: 'accessibility',
    limits: 'styling',
  },
  'segmented-control': {
    ...integratedSections,
    design: 'behavior',
    keyboard: 'accessibility',
    styling: 'styling',
  },
  badge: {
    ...integratedSections,
    design: 'guidance',
    accessibility: 'accessibility',
  },
  avatar: {
    ...integratedSections,
    design: 'guidance',
    behavior: 'behavior',
  },
  image: {
    ...integratedSections,
    design: 'styling',
    behavior: 'behavior',
  },
  accordion: {
    ...integratedSections,
    design: 'behavior',
    keyboard: 'accessibility',
    styling: 'styling',
  },
  tabs: {
    ...integratedSections,
    design: 'behavior',
    keyboard: 'accessibility',
    styling: 'styling',
  },
  pagination: {
    ...integratedSections,
    design: 'behavior',
    behavior: 'accessibility',
    styling: 'styling',
  },
  'dropdown-menu': {
    ...integratedSections,
    design: 'behavior',
    keyboard: 'accessibility',
    styling: 'styling',
  },
  dialog: {
    ...integratedSections,
    design: 'behavior',
    'keyboard-and-theme': 'accessibility',
    styling: 'styling',
  },
  popover: {
    ...integratedSections,
    design: 'behavior',
    keyboard: 'accessibility',
    styling: 'styling',
  },
  tooltip: {
    ...sharedSections,
    design: 'behavior',
    keyboard: 'accessibility',
    styling: 'styling',
  },
  alert: {
    ...integratedSections,
    design: 'guidance',
    behavior: 'accessibility',
  },
  toast: {
    ...integratedSections,
    design: 'behavior',
    behavior: 'accessibility',
    styling: 'styling',
  },
  'empty-state': {
    ...sharedSections,
    design: 'guidance',
    accessibility: 'accessibility',
  },
  spinner: {
    ...sharedSections,
    design: 'guidance',
    behavior: 'accessibility',
  },
  skeleton: {
    ...integratedSections,
    design: 'styling',
    behavior: 'accessibility',
  },
  'theme-provider': {
    ...sharedSections,
    'theme-names': 'behavior',
    boundaries: 'behavior',
  },
};

/** Return metadata only for an existing component page and its stable chapter anchors. */
export function componentSectionKind(
  pageId: string,
  sectionId: string,
): DocSectionKind | undefined {
  if (!Object.hasOwn(componentSections, pageId)) return undefined;
  const sections = componentSections[pageId];
  return Object.hasOwn(sections, sectionId) ? sections[sectionId] : undefined;
}
