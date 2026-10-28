import assert from 'node:assert/strict';
import { test } from 'node:test';
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
