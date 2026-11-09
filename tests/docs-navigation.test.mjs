import assert from 'node:assert/strict';
import { test } from 'node:test';
import { componentCatalog } from '../playground/src/docs/component-catalog.ts';
import {
  adjacentNavigation,
  canonicalRoute,
  createDocumentationPages,
  currentNavigationItem,
  navigationForArea,
} from '../playground/src/docs/navigation.ts';

const guide = (id, area, name = id) => ({
  id,
  name,
  chinese: '',
  group: '开始使用',
  area,
  description: `${name}说明`,
  sections: [],
});
// Deliberately shuffled: navigation order belongs to the shared navigation model.
const pages = createDocumentationPages([
  guide('artwork', 'design'),
  guide('states', 'recipes'),
  guide('styling', 'getting-started'),
  guide('getting-started', 'getting-started'),
  guide('reading', 'recipes'),
  guide('design-baseline', 'design'),
  guide('introduction', 'getting-started'),
  guide('recipes', 'recipes'),
]);
const flatten = (groups) => groups.flatMap((group) => group.items);

test('components own the overview and component catalog without guide leakage', () => {
  const items = flatten(navigationForArea('components', pages));
  assert.equal(items[0].pageId, 'component-overview');
  assert.equal(items[0].href, '#/components');
  assert.equal(pages.find((page) => page.id === 'component-overview').area, 'components');
  assert.equal(items.length, componentCatalog.length + 1);
  assert(items.some((item) => item.pageId === 'form' && item.href === '#/components/form'));
  assert(items.some((item) => item.pageId === 'progress' && item.href === '#/components/progress'));
  assert(items.every((item) => item.href.startsWith('#/components')));
  assert.equal(items.at(-1).pageId, 'theme-provider');
  assert.deepEqual(
    navigationForArea('components', pages)
      .slice(1)
      .map((group) => group.name),
    ['通用', '排版', '布局', '表单', '内容展示', '导航', '浮层', '反馈', '主题配置'],
  );
});

test('getting-started and design have stable orders and stay in their own areas', () => {
  assert.deepEqual(
    flatten(navigationForArea('getting-started', pages)).map((item) => item.pageId),
    ['introduction', 'getting-started', 'styling'],
  );
  assert.deepEqual(
    flatten(navigationForArea('design', pages)).map((item) => item.pageId),
    ['design-baseline', 'artwork'],
  );
});

test('recipe navigation targets tasks and recognizes both chapter and example anchors', () => {
  const groups = navigationForArea('recipes', pages);
  const items = flatten(groups);
  assert.deepEqual(
    items.slice(0, 2).map((item) => item.pageId),
    ['recipes', 'reading'],
  );
  assert.equal(
    currentNavigationItem(groups, '/guides/states', 'archive').href,
    '#/guides/states?section=scene-blog-archive',
  );
  assert.equal(
    currentNavigationItem(groups, '/guides/states', 'scene-blog-archive').href,
    '#/guides/states?section=scene-blog-archive',
  );
  assert.equal(
    currentNavigationItem(groups, '/guides/states', 'scene-article-actions').name,
    '文章编辑与保存',
  );
  assert.equal(
    currentNavigationItem(groups, '/guides/reading', 'reading-example').pageId,
    'reading',
  );
  assert.equal(currentNavigationItem(groups, '/components/button', 'api'), undefined);
});

test('previous and next remain inside the supplied area, including scene tasks', () => {
  const components = navigationForArea('components', pages);
  const items = flatten(components);
  assert.deepEqual(adjacentNavigation(components, items[0]), { next: items[1] });
  assert.deepEqual(adjacentNavigation(components, items.at(-1)), { previous: items.at(-2) });
  const recipes = navigationForArea('recipes', pages);
  const archive = currentNavigationItem(recipes, '/guides/states', 'archive');
  const neighbors = adjacentNavigation(recipes, archive);
  assert.equal(neighbors.previous.pageId, 'reading');
  assert.equal(neighbors.next.href, '#/guides/states?section=scene-article-actions');
  assert.deepEqual(adjacentNavigation(components, archive), {});
});

test('legacy styling links resolve to their content homes without changing other routes', () => {
  assert.deepEqual(canonicalRoute('/guides/styling', 'language'), {
    path: '/guides/design-baseline',
    section: 'language',
  });
  for (const section of ['reading', 'reading-example']) {
    assert.deepEqual(canonicalRoute('/guides/styling', section), {
      path: '/guides/reading',
      section,
    });
  }
  assert.deepEqual(canonicalRoute('/guides/styling'), { path: '/guides/styling', section: '' });
  assert.deepEqual(canonicalRoute('/components/button', 'api'), {
    path: '/components/button',
    section: 'api',
  });
});

test('component bookmarks follow relocated workflows and keep ordinary examples on their page', () => {
  for (const [component, section] of [
    ['button', 'button-delete-draft'],
    ['icon-button', 'icon-button-reading-list'],
    ['icon', 'icon-composition'],
    ['checkbox', 'checkbox-reading-topics'],
    ['checkbox', 'checkbox-reading-list'],
    ['badge', 'badge-status'],
    ['alert', 'alert-action'],
    ['toast', 'timer-and-action'],
  ]) {
    assert.deepEqual(canonicalRoute(`/components/${component}`, section), {
      path: '/guides/interactions',
      section,
    });
  }
  assert.deepEqual(canonicalRoute('/components/empty-state', 'empty-illustrations'), {
    path: '/guides/states',
    section: 'scene-empty',
  });
  assert.deepEqual(canonicalRoute('/components/radio-group', 'states'), {
    path: '/components/radio-group',
    section: 'radio-status',
  });
  assert.deepEqual(canonicalRoute('/components/button', 'button-async'), {
    path: '/components/button',
    section: 'button-async',
  });
  for (const section of ['heading-article-reply', 'heading-article-journal']) {
    assert.deepEqual(canonicalRoute('/components/heading', section), {
      path: '/guides/interactions',
      section,
    });
  }
});

test('unknown paths and prototype-named sections remain valid routes', () => {
  for (const path of ['/components/button', '/components/unknown', 'constructor', '__proto__']) {
    for (const section of ['unknown', 'constructor', 'toString', '__proto__']) {
      assert.deepEqual(canonicalRoute(path, section), { path, section });
    }
  }
});

test('the interaction guide is discoverable from recipe navigation', () => {
  const guidePages = createDocumentationPages([guide('interactions', 'recipes')]);
  const groups = navigationForArea('recipes', guidePages);
  const item = currentNavigationItem(groups, '/guides/interactions', 'button-delete-draft');
  assert.equal(item.href, '#/guides/interactions');
});

test('Input is the sole catalog entry and legacy TextField paths preserve every destination', () => {
  const inputs = pages.filter((page) => page.id === 'input' || page.id === 'text-field');
  assert.equal(inputs.length, 1);
  assert.deepEqual(
    { id: inputs[0].id, name: inputs[0].name, chinese: inputs[0].chinese, href: inputs[0].href },
    { id: 'input', name: 'Input', chinese: '输入框', href: '#/components/input' },
  );
  const groups = navigationForArea('components', pages);
  for (const section of [
    '',
    'usage',
    'form',
    'text-field-slots',
    'text-field-customization',
    'related',
    'constructor',
  ]) {
    assert.deepEqual(canonicalRoute('/components/text-field', section), {
      path: '/components/input',
      section,
    });
    assert.equal(currentNavigationItem(groups, '/components/text-field', section).pageId, 'input');
  }
  for (const path of ['/components/text-field', '/components/input']) {
    assert.deepEqual(canonicalRoute(path, 'integration'), {
      path: '/components/input',
      section: 'form',
    });
    for (const property of ['value', 'ref%20%2F%20className', 'aria-describedby']) {
      assert.deepEqual(canonicalRoute(path, `api-TextFieldProps--${property}`), {
        path: '/components/input',
        section: `api-InputProps--${property}`,
      });
    }
  }
});

test('the moved Radio condition workflow resolves to its interaction guide', () => {
  assert.deepEqual(canonicalRoute('/components/radio-group', 'radio-comment-signature'), {
    path: '/guides/interactions',
    section: 'radio-comment-signature',
  });
});
