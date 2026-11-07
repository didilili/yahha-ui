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
    'button',
    ".button[data-appearance='soft'][data-variant='primary']::before",
    '50%',
    'The opt-in soft button uses a short rounded highlight, independent of its control silhouette.',
  ],
  [
    'checkbox',
    '.input',
    '7px 8px 7px 6px',
    'The native checkbox outline is a small, rounded ink square.',
  ],
  [
    'checkbox',
    '.input::before, .input::after',
    '2px',
    'The persistent check and mixed-state strokes share rounded ends.',
  ],
  ['select', '.popup', '13px 22px 18px 11px', 'The selection list uses a paper-note silhouette.'],
  [
    'select',
    '.option[data-selected]',
    '9px 15px 11px 8px',
    'The chosen row forms a small ink stamp.',
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
    '2px',
    'The ordinary selected-tab underline has small rounded functional ends.',
  ],
  [
    'tabs',
    ".root[data-appearance='ink'] > .list > .tab::after",
    '4px 3px 4px 2px',
    'The opt-in short ink underline is local graphical geometry.',
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
    ".heading[data-decoration='underline']::after",
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
  [
    'accordion',
    ".root[data-appearance='soft'] > .item > .heading > .trigger > .chevron",
    '50%',
    'The opt-in soft chevron uses a compact circular reading marker.',
  ],
  [
    'pagination',
    ".root[data-appearance='circled'] > .list > .pageGroup > .button[aria-current='page']",
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
    path: 'src/components/dropdown-menu/dropdown-menu.module.css',
    selector: '.item[data-highlighted]:not([data-disabled])',
    property: 'box-shadow',
    value: 'inset 0 1px 0 var(--yahha-surface, #ffffff)',
    reason:
      'This highlighted paper edge is decorative; focus-visible separately overrides it with the canonical focus inset.',
  },
  {
    path: 'src/components/select/select.module.css',
    selector: '.option[data-selected][data-highlighted]',
    property: 'box-shadow',
    value:
      'inset 0 0 0 var(--yahha-focus-width, 2px) var(--yahha-focus, #b04e78), inset 0 -3px 0 var(--yahha-line, #c58ba1)',
    reason: 'The canonical focus inset remains visible above the selected paper edge.',
  },
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
    path: 'playground/src/examples/foundations/SurfaceCover.tsx',
    component: 'Surface',
    property: 'padding',
    value: '0',
    reason: 'An explicit full-bleed cover composition owns its content padding separately.',
  },
  {
    path: 'playground/src/examples/foundations/SurfaceCover.tsx',
    component: 'Surface',
    property: 'overflow',
    value: 'hidden',
    reason: 'Clip the edge-to-edge cover to the existing Surface contour; controls remain inset.',
  },
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

/** Reviewed public classNames demonstrations; these do not apply to default examples. */
export const exampleCssExceptions = [
  {
    path: 'playground/src/examples/customization/TextFieldCustomization.tsx',
    selector: '.yahha-example-nickname-hint',
    property: 'padding',
    value: '8px 12px',
    reason: 'The explicit hint-slot example adds reading space without resizing the input.',
  },
  {
    path: 'playground/src/examples/customization/TextFieldCustomization.tsx',
    selector: '.yahha-example-nickname-hint',
    property: 'border-radius',
    value: '8px',
    reason: 'The hint-slot note has a local corner; the field contour remains unchanged.',
  },
  {
    path: 'playground/src/examples/customization/TextFieldCustomization.tsx',
    selector: '.yahha-example-nickname-hint',
    property: 'background',
    value: '#fff0f6',
    reason:
      'This explicit hint-slot customization uses a reviewed soft pink without requiring internal tokens.',
  },
  {
    path: 'playground/src/examples/customization/TextFieldCustomization.tsx',
    selector: '.yahha-example-nickname-hint',
    property: 'color',
    value: '#49313d',
    reason:
      'The hint-slot customization pairs reviewed warm ink with its pink paper using plain CSS.',
  },
  {
    path: 'playground/src/examples/customization/SelectPortalCustomization.tsx',
    selector: '.yahha-example-archive-popup',
    property: 'background',
    value: '#f1f8ff',
    reason:
      'The explicit Portal popup slot uses reviewed light-blue paper without relying on unpublished variables.',
  },
  {
    path: 'playground/src/examples/customization/SelectPortalCustomization.tsx',
    selector: '.yahha-example-archive-option',
    property: 'font-weight',
    value: '600',
    reason:
      'The explicit option-slot example demonstrates text emphasis while preserving semantic option colors.',
  },
];

// These explicit chapter compositions customize a real hr with the one existing
// flower SVG; the library's ordinary and vertical Divider remain unchanged.
for (const { path, selector, artwork } of [
  {
    path: 'playground/src/examples/scenes/DividerChapter.tsx',
    selector: '.yahha-chapter-divider',
    artwork: '--chapter-flower-art',
  },
  {
    path: 'playground/src/examples/ReadingExample.tsx',
    selector: '.reading-flower-divider',
    artwork: '--reading-chapter-art',
  },
]) {
  exampleCssExceptions.push(
    ...[
      [
        'border',
        '0',
        'The chapter SVG replaces the default drawn edge in this explicit composition.',
      ],
      [
        'block-size',
        '48px',
        'The chapter SVG keeps its 48px artwork height so the central flower stays readable on narrow screens.',
      ],
      [
        'background',
        `var(${artwork}) center / 600px 48px no-repeat`,
        'The existing flower artwork stays centered and crops only its outer line ends.',
      ],
      [
        'block-size',
        '0',
        'Forced colors return the chapter composition to a simple semantic rule.',
      ],
      [
        'border-block-start',
        'var(--yahha-border-width, 1px) solid CanvasText',
        'The forced-color rule keeps one visible system-color edge.',
      ],
      [
        'background',
        'none',
        'Forced colors remove the multicolor chapter SVG in favor of the system-color rule.',
      ],
    ].map(([property, value, reason]) => ({ path, selector, property, value, reason })),
  );
}
