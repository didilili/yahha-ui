import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as documentationContract from '../scripts/documentation-contract.mjs';
import {
  apiMarkdown,
  documentationLink,
  markdownExamples,
  proseToMarkdown,
  sourceFence,
  validateDocumentation,
} from '../scripts/documentation-contract.mjs';

test('API Markdown keeps union types, callback syntax, required markers and explicit false defaults', () => {
  const markdown = apiMarkdown({
    name: 'ExampleProps',
    rows: [
      {
        name: 'value',
        type: "'draft' | 'published'",
        required: true,
        description: 'Value | state',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disable an action.',
      },
      { name: 'onChange', type: '(value: string | null) => void', description: 'Requested value.' },
    ],
  });
  assert.match(markdown, /'draft' \\\| 'published'/);
  assert.match(markdown, /Value \\\| state/);
  assert.match(markdown, /\*\*必填\*\*/);
  assert.match(markdown, /`false`/);
  assert.match(markdown, /\(value: string \\\| null\) => void/);
});

test('website component links retain their anchors in repository documentation', () => {
  assert.equal(documentationLink('#/components/select?section=api'), 'select.md#api');
  assert.equal(documentationLink('#/components/theme-provider'), 'theme.md');
  assert.equal(
    documentationLink('#/guides/interactions?section=button-delete-draft'),
    '../recipes/interactions.md#button-delete-draft',
  );
  assert.equal(
    documentationLink('#/components/button?section=button-delete-draft'),
    '../recipes/interactions.md#button-delete-draft',
  );
  assert.equal(
    documentationLink('#/components/select?section=api', { fromGuide: true }),
    '../components/select.md#api',
  );
  assert.equal(
    documentationLink('#/guides/interactions?section=counts', { fromGuide: true }),
    'interactions.md#counts',
  );
  for (const section of ['heading-article-reply', 'heading-article-journal']) {
    assert.equal(
      documentationLink(`#/components/heading?section=${section}`),
      '../recipes/interactions.md#heading-reading-layout',
    );
  }
  assert.equal(
    proseToMarkdown('<p>Use <a href="#/components/select">Select</a>, then <code>form</code>.</p>'),
    'Use [Select](select.md), then `form`.',
  );
});

test('source fences preserve imports and nested backticks verbatim', () => {
  const source = "import asset from './artwork/a.svg';\nconst value = `hello`;\n// ```";
  const fenced = sourceFence(source);
  assert(fenced.includes(source));
  assert(fenced.startsWith('````tsx\n'));
  assert(fenced.endsWith('\n````'));
  assert.deepEqual(
    markdownExamples(`<!-- example-source: playground/src/examples/Sample.tsx -->\n\n${fenced}`),
    [{ sourcePath: 'playground/src/examples/Sample.tsx', source: `${source}\n` }],
  );
});

test('prose exports code blocks without toolbar text and preserves following sections', () => {
  const source = "import { Form } from 'yahha-ui';\n<Form />";
  const html = `<p>Before.</p><div class="source-code is-expanded"><div class="code-toolbar"><span>tsx</span><button>复制代码</button></div><pre aria-label="tsx 代码"><code>import { Form } from 'yahha-ui';\n&lt;Form /&gt;</code></pre></div><p>After.</p>`;
  assert.equal(proseToMarkdown(html), `Before.\n\n${sourceFence(source)}\n\nAfter.`);
  assert.equal(
    proseToMarkdown(
      '<div class="source-code"><pre aria-label="焦点参数的 TypeScript 类型"><code>type Focus = false;</code></pre></div>',
    ),
    sourceFence('type Focus = false;', 'text'),
  );
});

test('documentation refuses duplicate anchors and ambiguous API rows', () => {
  const page = {
    id: 'example',
    sections: [
      { id: 'usage' },
      { id: 'examples', examples: [{ id: 'basic' }] },
      {
        id: 'api',
        api: [
          {
            name: 'ExampleProps',
            rows: [{ name: 'value', type: 'string', description: 'Value.' }],
          },
        ],
      },
      { id: 'related' },
    ],
  };
  assert.doesNotThrow(() => validateDocumentation([page]));
  assert.throws(
    () => validateDocumentation([{ ...page, sections: [...page.sections, { id: 'api' }] }]),
    /duplicate anchor/,
  );
  const duplicateApi = structuredClone(page);
  duplicateApi.sections[2].api[0].rows.push({ ...duplicateApi.sections[2].api[0].rows[0] });
  assert.throws(() => validateDocumentation([duplicateApi]), /duplicate API property/);
});

test('Input Markdown links canonicalize legacy routes, examples and API rows', () => {
  assert.equal(documentationLink('#/components/text-field'), 'input.md');
  assert.equal(
    documentationLink('#/components/text-field?section=text-field-states'),
    'input.md#text-field-states',
  );
  assert.equal(documentationLink('#/components/text-field?section=integration'), 'input.md#form');
  assert.equal(
    documentationLink('#/components/text-field?section=api-TextFieldProps--value'),
    'input.md#api-InputProps--value',
  );
  assert.equal(
    documentationLink('#/components/text-field?section=api-TextFieldProps--value', {
      fromGuide: true,
    }),
    '../components/input.md#api-InputProps--value',
  );
  assert.equal(
    documentationLink('#/components/radio-group?section=radio-comment-signature'),
    '../recipes/interactions.md#radio-comment-signature',
  );
});

test('forms and interaction guide links resolve relative to their generated directories', () => {
  assert.equal(
    documentationLink('#/guides/forms?section=validation'),
    '../guides/forms.md#validation',
  );
  assert.equal(
    documentationLink('#/guides/forms?section=reset', { fromGuide: true }),
    '../guides/forms.md#reset',
  );
  assert.equal(
    documentationLink('#/guides/forms?section=controls', { fromDirectory: 'guides' }),
    'forms.md#controls',
  );
  assert.equal(
    documentationLink('#/guides/interactions?section=radio-comment-signature', {
      fromDirectory: 'guides',
    }),
    '../recipes/interactions.md#radio-comment-signature',
  );
  assert.equal(
    documentationLink('#/components/input?section=api', { fromDirectory: 'guides' }),
    '../components/input.md#api',
  );
});

test('copy-example links open the shared setup guide without changing installation links', () => {
  assert.equal(
    documentationLink('#/guides/getting-started?section=copy-example'),
    '../guides/examples.md',
  );
  assert.equal(
    documentationLink('#/guides/getting-started?section=copy-example', {
      fromDirectory: 'guides',
    }),
    'examples.md',
  );
  assert.equal(
    documentationLink('#/guides/getting-started?section=install'),
    '../../README.md#构建与本地安装',
  );
  assert.equal(documentationLink('#/guides/getting-started'), '../../README.md#构建与本地安装');
});

test('example Markdown marks owned themes and retains the original source', () => {
  const source =
    'import { ThemeProvider } from \'yahha-ui\';\nexport default function Owned() {\n  return <ThemeProvider theme="blue">内容</ThemeProvider>;\n}\n';
  const example = {
    id: 'owned',
    title: '主题示例',
    description: '查看蓝色主题。',
    themeScope: 'explicit',
    source,
  };
  const markdown = documentationContract.exampleMarkdown(
    example,
    'playground/src/examples/theme/Owned.tsx',
  );
  assert.match(markdown, /本例自带 `ThemeProvider`/);
  assert(markdown.includes(sourceFence(source)));
  assert.deepEqual(markdownExamples(markdown), [
    { sourcePath: 'playground/src/examples/theme/Owned.tsx', source },
  ]);
  const inherited = documentationContract.exampleMarkdown(
    { ...example, themeScope: 'inherited' },
    'playground/src/examples/theme/Owned.tsx',
  );
  assert.doesNotMatch(inherited, /本例自带|素材|App\.tsx/);
});

test('example asset Markdown links original files and explains only the imported query modes', () => {
  const source =
    "import picture from './artwork/illustrations/picture.svg?no-inline';\nimport scene from './artwork/scene.svg?raw';\nexport default function Example() { return <img src={picture} alt={scene} />; }\n";
  const markdown = documentationContract.exampleMarkdown(
    {
      id: 'artwork',
      title: '素材示例',
      description: '保留相对导入。',
      source,
      assets: [
        {
          name: 'picture.svg',
          href: 'data:image/svg+xml;base64,ignored',
          path: 'artwork/illustrations/picture.svg',
        },
        { name: 'scene.svg', href: '/transformed-scene.svg' },
      ],
    },
    'playground/src/examples/scenes/Artwork.tsx',
  );
  assert.match(
    markdown,
    /\[picture\.svg\]\(\.\.\/\.\.\/playground\/src\/examples\/scenes\/artwork\/illustrations\/picture\.svg\)/,
  );
  assert.match(markdown, /`artwork\/illustrations\/picture\.svg`/);
  assert.match(
    markdown,
    /\[scene\.svg\]\(\.\.\/\.\.\/playground\/src\/examples\/scenes\/artwork\/scene\.svg\)/,
  );
  assert.match(markdown, /`artwork\/scene\.svg`/);
  assert.match(markdown, /`\?no-inline`/);
  assert.match(markdown, /`\?raw`/);
  assert.doesNotMatch(markdown, /base64|transformed-scene/);
  assert(markdown.includes(sourceFence(source)));
});

test('Input API Markdown provides the canonical property anchor targeted by links', () => {
  const markdown = apiMarkdown({
    name: 'InputProps',
    rows: [{ name: 'value', type: 'string', description: '当前值。' }],
  });
  assert(markdown.includes('<a id="api-InputProps--value"></a>'));
  assert.match(markdown, /### InputProps/);
});

test('semantic control comparison tables remain readable Markdown tables with linked cells', () => {
  const markdown = proseToMarkdown(
    '<table><thead><tr><th>控件</th><th>表单值</th></tr></thead><tbody><tr><td><a href="#/components/input">Input</a></td><td><code>name</code> + 字符串</td></tr><tr><td>Checkbox</td><td>选中时提交 | 关闭时省略</td></tr></tbody></table>',
  );
  assert.equal(
    markdown,
    '| 控件 | 表单值 |\n| --- | --- |\n| [Input](input.md) | `name` + 字符串 |\n| Checkbox | 选中时提交 \\| 关闭时省略 |',
  );
});
