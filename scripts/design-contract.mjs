/** Internal checks only. The theme stylesheet owns token names and default values. */
export const componentSizing = {
  button: ['button', 'iconButton'],
  'text-field': ['input'],
  select: ['trigger', 'option'],
  textarea: ['textarea'],
  checkbox: ['label'],
  'radio-group': ['option'],
  switch: ['label'],
  'segmented-control': ['segment'],
  tabs: ['tab'],
  pagination: ['button'],
  accordion: ['trigger'],
  'dropdown-menu': ['item'],
};

export const baselineExamples = ['playground/src/examples'];

/** Exact declarations only; functional marks are distinct from shared component radii. */
export const designExceptions = [
  [
    'checkbox',
    '.input',
    '5px 6px 5px 4px',
    'The native checkbox outline is a small, purpose-built ink square.',
  ],
  [
    'checkbox',
    '.input::before, .input::after',
    '2px',
    'The persistent check and mixed-state strokes share rounded ends.',
  ],
  ['dropdown-menu', '.item::before', '3px', 'The menu row marker is a small paper bullet.'],
  [
    'empty-state',
    '.emptyMotif::before',
    '6px 9px 7px 5px',
    'The empty-state paper illustration is local geometry.',
  ],
  [
    'tabs',
    '.tab::after',
    '4px 3px 4px 2px',
    'The short ink underline is local graphical geometry.',
  ],
  [
    'typography',
    '.link:focus-visible',
    '3px',
    'A tight focus corner follows the inline text link.',
  ],
  ['radio-group', '.input', '50%', 'The native radio indicator remains circular.'],
  ['radio-group', '.input::after', '50%', 'The persistent radio ink dot remains circular.'],
  [
    'typography',
    'h2.heading::after',
    '0 0 48% 55%',
    'The heading underline is a short irregular ink curve.',
  ],
  [
    'skeleton',
    ".skeleton[data-variant='circle']",
    '50%',
    'The documented circular placeholder variant remains circular.',
  ],
  ['switch', '.input::after', '50%', 'The moving switch thumb is a circular native-state marker.'],
  ['accordion', '.chevron', '50%', 'The chevron uses a compact circular reading marker.'],
  [
    'pagination',
    ".button[aria-current='page']",
    '48% 52% 50% 46%',
    'The current-page sign is intentionally a small ink circle.',
  ],
].map(([family, selector, value, reason]) => ({
  path: `src/components/${family}/${family}.module.css`,
  selector,
  property: 'border-radius',
  value,
  reason,
}));

designExceptions.push({
  path: 'src/internal/loading-mark.module.css',
  selector: '.dot',
  property: 'border-radius',
  value: '48% 55% 46% 52%',
  reason: 'Each loading ink dot is local graphical geometry.',
});

designExceptions.push(
  {
    path: 'src/components/skeleton/skeleton.module.css',
    selector: '.skeleton',
    property: 'outline',
    value: '1px solid CanvasText',
    reason: 'A decorative forced-color silhouette preserves the placeholder, not keyboard focus.',
  },
  {
    path: 'src/components/skeleton/skeleton.module.css',
    selector: '.skeleton',
    property: 'outline-offset',
    value: '-1px',
    reason:
      'The forced-color silhouette stays inside the reserved placeholder without resizing it.',
  },
);

/** Baseline examples can demonstrate these specific public customization behaviors. */
export const exampleExceptions = [
  {
    path: 'playground/src/examples/content/SkeletonExample.tsx',
    component: 'Skeleton',
    property: 'border-radius',
    value: '40% 45% 42% 38%',
    reason: 'Demonstrates the documented custom placeholder silhouette.',
  },
  {
    path: 'playground/src/examples/new-forms/TextareaStates.tsx',
    component: 'Textarea',
    property: 'resize',
    value: 'none',
    reason: 'Demonstrates the native textarea resize behavior on a read-only field.',
  },
];
