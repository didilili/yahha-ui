import assert from 'node:assert/strict';
import { test } from 'node:test';
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
  assert.equal(items.length, 31);
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
