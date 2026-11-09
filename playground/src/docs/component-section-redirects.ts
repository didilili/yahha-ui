/** Legacy component bookmarks follow the example's current home. */
export const componentSectionRedirects: Record<
  string,
  Record<string, { path: string; section: string }>
> = {
  '/components/button': {
    'button-delete-draft': {
      path: '/guides/interactions',
      section: 'button-delete-draft',
    },
    integration: {
      path: '/components/button',
      section: 'button-async',
    },
  },
  '/components/icon-button': {
    'icon-button-reading-list': {
      path: '/guides/interactions',
      section: 'icon-button-reading-list',
    },
    integration: {
      path: '/components/icon-button',
      section: 'icon-button-basic',
    },
  },
  '/components/icon': {
    'icon-composition': {
      path: '/guides/interactions',
      section: 'icon-composition',
    },
    integration: {
      path: '/guides/interactions',
      section: 'icon-composition',
    },
  },
  '/components/checkbox': {
    'checkbox-reading-topics': {
      path: '/guides/interactions',
      section: 'checkbox-reading-topics',
    },
    'checkbox-reading-list': {
      path: '/guides/interactions',
      section: 'checkbox-reading-list',
    },
    integration: {
      path: '/components/checkbox',
      section: 'form',
    },
  },
  '/components/radio-group': {
    'radio-comment-signature': {
      path: '/guides/interactions',
      section: 'radio-comment-signature',
    },
    states: {
      path: '/components/radio-group',
      section: 'radio-status',
    },
    integration: {
      path: '/components/radio-group',
      section: 'radio-status',
    },
  },
  '/components/badge': {
    'badge-status': {
      path: '/guides/interactions',
      section: 'badge-status',
    },
    integration: {
      path: '/guides/interactions',
      section: 'badge-status',
    },
  },
  '/components/alert': {
    'alert-action': {
      path: '/guides/interactions',
      section: 'alert-action',
    },
    integration: {
      path: '/guides/interactions',
      section: 'alert-action',
    },
  },
  '/components/toast': {
    'timer-and-action': {
      path: '/guides/interactions',
      section: 'timer-and-action',
    },
    integration: {
      path: '/components/toast',
      section: 'basic',
    },
  },
  '/components/empty-state': {
    'empty-illustrations': {
      path: '/guides/states',
      section: 'scene-empty',
    },
    illustrations: {
      path: '/guides/states',
      section: 'scene-empty',
    },
  },
  '/components/text': {
    integration: {
      path: '/components/text',
      section: 'text-quotation',
    },
  },
  '/components/heading': {
    integration: {
      path: '/components/heading',
      section: 'heading-reading-layout',
    },
    'heading-article-reply': {
      path: '/guides/interactions',
      section: 'heading-article-reply',
    },
    'heading-article-journal': {
      path: '/guides/interactions',
      section: 'heading-article-journal',
    },
  },
  '/components/surface': {
    integration: {
      path: '/components/surface',
      section: 'surface-composition',
    },
  },
  '/components/divider': {
    integration: {
      path: '/components/divider',
      section: 'divider-chapter',
    },
  },
  '/components/input': {
    integration: {
      path: '/components/input',
      section: 'form',
    },
  },
  '/components/textarea': {
    integration: {
      path: '/components/textarea',
      section: 'native',
    },
  },
  '/components/select': {
    integration: {
      path: '/components/select',
      section: 'form',
    },
  },
  '/components/switch': {
    integration: {
      path: '/components/switch',
      section: 'form',
    },
  },
  '/components/segmented-control': {
    integration: {
      path: '/components/segmented-control',
      section: 'filtering',
    },
  },
  '/components/avatar': {
    integration: {
      path: '/components/avatar',
      section: 'avatar-author',
    },
  },
  '/components/image': {
    integration: {
      path: '/components/image',
      section: 'image-detail',
    },
  },
  '/components/accordion': {
    integration: {
      path: '/components/accordion',
      section: 'controlled',
    },
  },
  '/components/tabs': {
    integration: {
      path: '/components/tabs',
      section: 'counts',
    },
  },
  '/components/pagination': {
    integration: {
      path: '/components/pagination',
      section: 'archive',
    },
  },
  '/components/dropdown-menu': {
    integration: {
      path: '/components/dropdown-menu',
      section: 'controlled',
    },
  },
  '/components/dialog': {
    integration: {
      path: '/components/dialog',
      section: 'form',
    },
  },
  '/components/popover': {
    integration: {
      path: '/components/popover',
      section: 'popover-collection',
    },
  },
  '/components/progress': {
    integration: {
      path: '/components/progress',
      section: 'progress-checklist',
    },
  },
  '/components/skeleton': {
    integration: {
      path: '/components/skeleton',
      section: 'skeleton-content',
    },
  },
};
