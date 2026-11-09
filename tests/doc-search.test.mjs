import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { createElement, Fragment } from 'react';
import { componentCatalog } from '../playground/src/docs/component-catalog.ts';
import { apiRowAnchor } from '../playground/src/docs/api-anchor.ts';
import {
  buildDocumentationSearchIndex,
  searchDocumentation,
  searchDocumentationMatches,
} from '../playground/src/docs/search.ts';
import { markdownSearchEntries, docsSearchIndex } from '../scripts/docs-search.ts';

async function componentEntries(id, file = id) {
  const markdown = await readFile(
    new URL(`../docs/components/${file}.md`, import.meta.url),
    'utf8',
  );
  return markdownSearchEntries(markdown, id);
}

test('API names find the documented property row, with case-insensitive matching', async () => {
  const index = buildDocumentationSearchIndex(
    componentCatalog,
    await componentEntries('dialog'),
    [],
  );
  const result = searchDocumentation(index, 'INITIALfocus');
  assert.equal(result[0]?.href, '#/components/dialog?section=api-DialogProps--initialFocus');
  assert.match(result[0].title, /initialFocus/);
  assert.equal(result[0].area, 'components');
  assert.equal(result[0].label, 'API');
  assert.equal(result.filter((entry) => entry.href === result[0].href).length, 1);
});

test('portalContainer matches real API text and not code-only identifiers', async () => {
  const markdown = await readFile(new URL('../docs/components/dialog.md', import.meta.url), 'utf8');
  const entries = markdownSearchEntries(
    `${markdown}\n\n\`\`\`tsx\nconst codeOnlyCanary = true;\n\`\`\``,
    'dialog',
  );
  const index = buildDocumentationSearchIndex(componentCatalog, entries, []);
  assert.equal(
    searchDocumentation(index, 'portalContainer')[0]?.href,
    '#/components/dialog?section=api-DialogProps--portalContainer',
  );
  assert.deepEqual(searchDocumentation(index, 'codeOnlyCanary'), []);
});

test('matching properties in separate API tables retain their own destinations and context', () => {
  const entries = markdownSearchEntries(
    `# Select 下拉选择器

<a id="api"></a>
## API

### SelectProps
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| \`value\` | 当前选择 | \`string\` | — |

### SelectOption
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| \`value\` **必填** | 选项的提交值 | \`string\` | — |
`,
    'select',
  );
  const index = buildDocumentationSearchIndex([], entries, []);
  const results = searchDocumentationMatches(index, 'value').filter(
    (entry) => entry.kind === 'api',
  );
  assert.deepEqual(
    results.map((entry) => entry.href),
    [
      '#/components/select?section=api-SelectProps--value',
      '#/components/select?section=api-SelectOption--value',
    ],
  );
  assert.match(results[0].title, /SelectProps/);
  assert.match(results[1].title, /SelectOption/);
  assert.equal(searchDocumentation(index, 'SelectOption value')[0]?.href, results[1].href);
  assert.equal(new Set(results.map((entry) => entry.id)).size, 2);
  assert(entries.some((entry) => entry.href === '#/components/select?section=api'));
});

test('API row anchors preserve generic signatures, property punctuation and distinct table names', () => {
  assert.equal(
    apiRowAnchor('SegmentedControlProps<T extends string>', 'ref / className'),
    'api-SegmentedControlProps%3CT%20extends%20string%3E--ref%20%2F%20className',
  );
  assert.notEqual(apiRowAnchor('A--B', 'value'), apiRowAnchor('A', 'B--value'));
  assert.notEqual(apiRowAnchor('Props<T>', 'name_value'), apiRowAnchor('Props', 'namevalue'));
  const entries = markdownSearchEntries(
    `# SegmentedControl 分段选择器

<a id="api"></a>
## API
### SegmentedControlProps<T extends string>
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| \`ref / className\` | 作用于根节点 | \`Ref\` | — |

<a id="keyboard"></a>
## 可访问性与键盘
### 普通说明
| \`notAnApiRow\` | 不属于 API 表格 | — | — |
`,
    'segmented-control',
  );
  const properties = entries.filter((entry) => entry.kind === 'api');
  assert.equal(properties.length, 1);
  assert.equal(
    new URLSearchParams(properties[0].href.split('?')[1]).get('section'),
    apiRowAnchor('SegmentedControlProps<T extends string>', 'ref / className'),
  );
  assert.match(properties[0].title, /SegmentedControlProps<T extends string>/);
});

test('Chinese names and existing aliases rank the component page before its sections', async () => {
  const index = buildDocumentationSearchIndex(
    componentCatalog,
    await componentEntries('input'),
    [],
  );
  assert.equal(searchDocumentation(index, '输入框')[0]?.href, '#/components/input');
  assert.equal(searchDocumentation(index, '输入框')[0]?.area, 'components');
  assert.equal(searchDocumentation(index, '输入框')[0]?.label, '组件');
  assert.equal(searchDocumentation(index, 'TextField')[0]?.kind, 'component');
  assert.equal(searchDocumentation(index, '单行输入')[0]?.pageId, 'input');
});

test('common Input and Modal names find component entry points before API subparts', async () => {
  const index = buildDocumentationSearchIndex(
    componentCatalog,
    [...(await componentEntries('input')), ...(await componentEntries('dialog'))],
    [],
  );
  assert.equal(searchDocumentation(index, 'Input')[0]?.href, '#/components/input');
  assert.equal(searchDocumentation(index, 'Modal')[0]?.href, '#/components/dialog');
});

test('category words retain the existing route to components in that group', () => {
  const index = buildDocumentationSearchIndex(componentCatalog, [], []);
  for (const group of ['表单', '浮层', '反馈']) {
    const results = searchDocumentation(index, group, 40);
    const expected = componentCatalog.filter((page) => page.group === group).map((page) => page.id);
    assert.deepEqual(
      results
        .slice(0, expected.length)
        .map((entry) => entry.pageId)
        .sort(),
      expected.sort(),
    );
    assert(results.every((entry) => entry.href === `#/components/${entry.pageId}`));
  }
});

test('example titles and descriptions link to the actual example anchor', async () => {
  const index = buildDocumentationSearchIndex(
    componentCatalog,
    await componentEntries('dialog'),
    [],
  );
  assert.equal(
    searchDocumentation(index, '外部按钮打开')[0]?.href,
    '#/components/dialog?section=external',
  );
  assert.equal(
    searchDocumentation(index, '未保存修改的关闭确认')[0]?.href,
    '#/components/dialog?section=form',
  );
  assert.equal(
    searchDocumentation(index, 'Dialog 未保存修改的关闭确认')[0]?.href,
    '#/components/dialog?section=form',
  );
});

test('guide content and examples are searchable without rendering components or indexing source', () => {
  let executions = 0;
  function NeverRender() {
    executions++;
    return createElement('p', null, '执行后才出现的文字');
  }
  const guides = [
    {
      id: 'getting-started',
      name: '开始使用',
      chinese: '',
      group: '开始使用',
      description: '接入组件库',
      sections: [
        {
          id: 'install',
          title: '安装本地包',
          content: createElement(
            Fragment,
            null,
            createElement('p', null, '已有项目先安装本地压缩包。'),
            createElement('pre', null, 'guideSourceCanary'),
            createElement(NeverRender),
          ),
          examples: [
            {
              id: 'first-button',
              title: '第一个收藏按钮',
              description: '点击后切换收藏状态。',
              component: NeverRender,
              source: 'exampleSourceCanary',
            },
          ],
        },
      ],
    },
  ];
  const index = buildDocumentationSearchIndex([], [], guides);
  assert.equal(
    searchDocumentation(index, '压缩包')[0]?.href,
    '#/guides/getting-started?section=install',
  );
  assert.equal(
    searchDocumentation(index, '切换收藏')[0]?.href,
    '#/guides/getting-started?section=first-button',
  );
  assert.equal(searchDocumentation(index, '开始使用')[0]?.href, '#/guides/getting-started');
  assert.equal(searchDocumentation(index, '开始使用')[0]?.area, 'getting-started');
  assert.deepEqual(searchDocumentation(index, 'guideSourceCanary'), []);
  assert.deepEqual(searchDocumentation(index, 'exampleSourceCanary'), []);
  assert.equal(executions, 0);
});

test('empty, unmatched and multiword queries have predictable bounded results', async () => {
  const index = buildDocumentationSearchIndex(
    componentCatalog,
    await componentEntries('dialog'),
    [],
  );
  assert.deepEqual(searchDocumentation(index, '  '), []);
  assert.deepEqual(searchDocumentation(index, '无此内容-xyz987'), []);
  assert.deepEqual(searchDocumentation(index, 'Dialog xyz987'), []);
  assert(searchDocumentation(index, '焦点', 2).length <= 2);
});

test('full search reports every unique destination before the UI chooses its visible batch', () => {
  const pages = Array.from({ length: 29 }, (_, index) => ({
    id: `matching-${index}`,
    name: `Matching${index}`,
    chinese: '匹配文档',
    description: '结果批次测试',
    group: '通用',
  }));
  const index = buildDocumentationSearchIndex(
    pages,
    [
      {
        id: 'duplicate',
        pageId: pages[0].id,
        pageTitle: 'Matching0',
        title: '同一目的地的另一份匹配文档',
        description: '',
        kind: 'section',
        href: '#/components/matching-0',
      },
    ],
    [],
  );
  const all = searchDocumentationMatches(index, '匹配文档');
  const initial = searchDocumentation(index, '匹配文档');
  assert.equal(initial.length, 12);
  assert.equal(all.length, 29);
  assert.equal(new Set(all.map((entry) => entry.href)).size, 29);
  assert.deepEqual(initial, all.slice(0, 12));
  assert.deepEqual(searchDocumentationMatches(index, '没有匹配'), []);
});

test('component overview is a first-class destination and page summaries do not duplicate pages', () => {
  const guides = [
    {
      id: 'introduction',
      name: '项目介绍',
      chinese: '',
      group: '开始使用',
      description: '从组件总览找到合适的组件。',
      sections: [],
    },
  ];
  const pages = [
    {
      id: 'component-overview',
      name: '组件总览',
      chinese: '',
      description: '查看全部组件。',
      area: 'components',
      href: '#/components',
      group: '组件',
    },
    {
      id: 'introduction',
      name: '项目介绍',
      chinese: '',
      description: guides[0].description,
      area: 'getting-started',
      href: '#/guides/introduction',
      group: '开始使用',
    },
    { ...componentCatalog[0], area: 'components', href: '#/components/button' },
  ];
  const index = buildDocumentationSearchIndex(componentCatalog, [], guides, pages);
  const first = searchDocumentation(index, '组件总览')[0];
  assert.equal(first?.href, '#/components');
  assert.equal(first.kind, 'overview');
  assert.equal(first.label, '总览');
  assert.equal(first.areaLabel, '组件');
  assert.equal(index.filter((entry) => entry.href === '#/guides/introduction').length, 1);
  assert.equal(index.filter((entry) => entry.href === '#/components/button').length, 1);
});

test('global results retain the page area and distinguish guides, design and composition examples', () => {
  const makePage = (id, name, title, content) => ({
    id,
    name,
    chinese: '',
    group: '开始使用',
    description: `了解${name}`,
    sections: [
      {
        id: 'details',
        title,
        content: createElement('p', null, content),
        examples:
          id === 'recipes'
            ? [
                {
                  id: 'reading',
                  title: '文章阅读组合',
                  description: '作者与收藏组合。',
                  component: () => {
                    throw new Error('Search must not render examples');
                  },
                  source: 'neverIndexThisSource',
                },
              ]
            : [],
      },
    ],
  });
  const guides = [
    makePage('getting-started', '开始使用', '准备安装', '压缩包安装路径'),
    makePage('recipes', '组合示例', '选择场景', '组合文章页面'),
    makePage('artwork', '图标与插画', '素材使用', '装饰素材分发边界'),
  ];
  const pages = guides.map((page, index) => ({
    ...page,
    href: `#/guides/${page.id}`,
    area: ['getting-started', 'recipes', 'design'][index],
  }));
  const index = buildDocumentationSearchIndex([], [], guides, pages);
  assert.equal(searchDocumentation(index, '压缩包安装路径')[0]?.area, 'getting-started');
  assert.equal(searchDocumentation(index, '压缩包安装路径')[0]?.label, '指南');
  assert.equal(searchDocumentation(index, '装饰素材分发边界')[0]?.area, 'design');
  assert.equal(searchDocumentation(index, '装饰素材分发边界')[0]?.label, '设计/素材');
  const composition = searchDocumentation(index, '文章阅读组合')[0];
  assert.equal(composition?.area, 'recipes');
  assert.equal(composition.areaLabel, '组合示例');
  assert.equal(composition.label, '组合示例');
  assert.equal(composition.href, '#/guides/recipes?section=reading');
  assert.deepEqual(searchDocumentation(index, 'neverIndexThisSource'), []);
  const directArea = buildDocumentationSearchIndex([], [], [{ ...guides[2], area: 'design' }]);
  assert.equal(searchDocumentation(directArea, '装饰素材分发边界')[0]?.area, 'design');
});

test('virtual index derives all component documents including the theme filename mapping', async () => {
  const plugin = docsSearchIndex(new URL('../docs/components/', import.meta.url));
  const id = plugin.resolveId('virtual:yahha-doc-search');
  assert.equal(typeof id, 'string');
  const watched = [];
  const source = await plugin.load.call({ addWatchFile: (file) => watched.push(file) }, id);
  const entries = JSON.parse(source.replace(/^export default /, '').replace(/;$/, ''));
  assert(watched.some((file) => file.endsWith('dialog.md')));
  assert(
    entries.some((entry) => entry.pageId === 'theme-provider' && entry.href.includes('section=')),
  );
  assert(!source.includes('import '));
});

test('every generated API result matches one unique row in the current component page model', async () => {
  const { createServer } = await import('vite');
  const server = await createServer({
    configFile: new URL('../vite.config.ts', import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    logLevel: 'error',
  });
  try {
    const { loadComponentPage } = await server.ssrLoadModule('/src/docs/component-pages.ts');
    for (const { id } of componentCatalog) {
      const page = await loadComponentPage(id);
      const expected = page.sections.flatMap((section) =>
        (section.api ?? []).flatMap((api) =>
          api.rows.map((row) => ({
            anchor: apiRowAnchor(api.name, row.name),
            apiName: api.name,
            property: row.name,
          })),
        ),
      );
      const actual = (await componentEntries(id, id === 'theme-provider' ? 'theme' : id)).filter(
        (entry) => entry.kind === 'api',
      );
      const anchors = expected.map((row) => row.anchor);
      assert.equal(new Set(anchors).size, expected.length, `${id}: API row IDs are unique`);
      assert.equal(
        new Set(actual.map((entry) => entry.id)).size,
        expected.length,
        `${id}: search entry IDs are unique`,
      );
      assert.deepEqual(
        actual.map((entry) => ({
          anchor: new URLSearchParams(entry.href.split('?')[1]).get('section'),
          apiName: entry.keywords[1],
          property: entry.keywords[0],
        })),
        expected,
        `${id}: generated Markdown and current API row models agree`,
      );
      const pageAnchors = page.sections.flatMap((section) => [
        section.id,
        ...(section.examples ?? []).map((example) => example.id),
      ]);
      assert(
        anchors.every((anchor) => !pageAnchors.includes(anchor)),
        `${id}: row anchors do not collide with existing section/example IDs`,
      );
    }
  } finally {
    await server.close();
  }
});

test('Input is canonical for every retained name without adding a component entry', () => {
  assert.equal(componentCatalog.filter((item) => item.id === 'input').length, 1);
  assert(!componentCatalog.some((item) => item.id === 'text-field'));
  const index = buildDocumentationSearchIndex(componentCatalog, [], []);
  for (const term of ['Input', 'TextField', '单行输入', '输入框']) {
    const result = searchDocumentation(index, term)[0];
    assert.equal(result?.href, '#/components/input', term);
    assert.equal(result?.title, 'Input 输入框', term);
  }
  assert(!index.some((entry) => entry.pageId === 'text-field'));
});

test('virtual search skips the legacy Markdown copy and indexes only canonical Input API rows', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'yahha-input-search-'));
  try {
    const markdown =
      '# Input 输入框\n\n<a id="api"></a>\n## API\n\n### InputProps\n| 属性 | 说明 | 类型 | 默认值 |\n| --- | --- | --- | --- |\n| `value` | 当前值 | `string` | — |\n';
    await writeFile(join(directory, 'input.md'), markdown);
    await writeFile(join(directory, 'text-field.md'), markdown.replaceAll('Input', 'TextField'));
    const plugin = docsSearchIndex(pathToFileURL(`${directory}/`));
    const id = plugin.resolveId('virtual:yahha-doc-search');
    const source = await plugin.load.call({ addWatchFile: () => {} }, id);
    const entries = JSON.parse(source.replace(/^export default /, '').replace(/;$/, ''));
    assert(entries.length > 0);
    assert(entries.every((entry) => entry.pageId === 'input'));
    assert.equal(entries.filter((entry) => entry.kind === 'api').length, 1);
    assert.equal(
      entries.find((entry) => entry.kind === 'api').href,
      '#/components/input?section=api-InputProps--value',
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
