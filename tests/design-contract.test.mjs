import assert from 'node:assert/strict';
import { test } from 'node:test';
import { auditDesign } from '../scripts/check-design.mjs';

const theme = `
.theme {
  --chi-control-height: 44px;
  --chi-font-size-md: 14px;
  --chi-leading-control: 20px;
  --chi-radius-field: 12px 16px 14px 11px;
  --chi-focus-width: 2px;
  --chi-focus-offset: 2px;
  --chi-focus: #ad6179;
  --chi-ink: #462e31;
  --chi-accent: #f8dbe2;
}
`;
const componentPath = 'src/components/text-field/text-field.module.css';
const examplePath = 'playground/src/examples/design/Example.tsx';
const inspect = (text, extra = {}) =>
  auditDesign({ theme, componentStyles: [{ path: componentPath, text }], ...extra });
const example = (text, styles = []) =>
  auditDesign({ theme, examples: [{ path: examplePath, text, styles }] });
const hasRule = (diagnostics, rule) => diagnostics.some((item) => item.rule === rule);

test('reports a 46px interactive minimum instead of the canonical height', () => {
  assert(hasRule(inspect('.input { min-height: 46px; }'), 'literal-drift'));
});
test('reports a raw font size and line height', () => {
  assert(hasRule(inspect('.input { font-size: 16px; line-height: 24px; }'), 'literal-drift'));
});
test('rejects unknown chi tokens even with a valid-looking fallback', () => {
  assert(hasRule(inspect('.input { height: var(--chi-contol-height, 44px); }'), 'unknown-token'));
});
test('rejects an existing height token used as a font size', () => {
  assert(hasRule(inspect('.input { font-size: var(--chi-control-height); }'), 'token-role'));
});
test('rejects dimensional fallback drift and invalid fallback values', () => {
  assert(
    hasRule(inspect('.input { min-height: var(--chi-control-height, 46px); }'), 'token-fallback'),
  );
  assert(
    hasRule(inspect('.input { min-height: var(--chi-control-height, banana); }'), 'token-fallback'),
  );
});
test('validates token definitions in the canonical theme', () => {
  assert(
    hasRule(inspect('', { theme: '.theme { --chi-control-height: banana; }' }), 'token-value'),
  );
});
test('follows local derived variables without accepting hidden literal drift', () => {
  assert.deepEqual(
    inspect(
      '.input { --field-height: var(--chi-control-height); min-height: var(--field-height); }',
    ),
    [],
  );
  assert(
    hasRule(
      inspect('.input { --field-height: 46px; min-height: var(--field-height); }'),
      'literal-drift',
    ),
  );
});
test('accepts theme tokens, ordinary layout and explicitly reviewed geometry', () => {
  assert.deepEqual(
    inspect(
      `
    .field { display: grid; gap: 17px; margin-top: 13px; padding: 12px; }
    .input { min-height: var(--chi-control-height, 44px); font-size: var(--chi-font-size-md, 14px); line-height: var(--chi-leading-control, 20px); border-radius: var(--chi-radius-field); }
    .dot { width: 17px; height: 17px; border-radius: 50%; }
  `,
      {
        exceptions: [
          {
            path: componentPath,
            selector: '.dot',
            property: 'border-radius',
            value: '50%',
            reason: 'A circular graphic, not an input outline.',
          },
        ],
      },
    ),
    [],
  );
});
test('requires focus width and offset tokens', () => {
  assert(
    hasRule(
      inspect('.input:focus-visible { outline: 3px solid red; outline-offset: 4px; }'),
      'literal-drift',
    ),
  );
  assert.deepEqual(
    inspect(
      '.input:focus-visible { outline: var(--chi-focus-width) solid var(--chi-focus); outline-offset: var(--chi-focus-offset); }',
    ),
    [],
  );
});
test('allows a precise reviewed graphical exception and rejects stale/wildcard exceptions', () => {
  const entry = {
    path: componentPath,
    selector: '.mark',
    property: 'border-radius',
    value: '3px',
    reason: 'Small functional mark corner, not a field radius.',
  };
  assert.deepEqual(inspect('.mark { border-radius: 3px; }', { exceptions: [entry] }), []);
  assert(hasRule(inspect('', { exceptions: [entry] }), 'stale-exception'));
  assert(
    hasRule(
      inspect('.mark { border-radius: 3px; }', { exceptions: [{ ...entry, selector: '*' }] }),
      'invalid-exception',
    ),
  );
});
test('rejects inline geometry overrides on imported components', () => {
  assert(
    hasRule(
      example(
        "import { TextField } from 'yahha-ui'; export default () => <TextField label='Name' style={{ minHeight: 46 }} />;",
      ),
      'example-override',
    ),
  );
});
test('rejects component CSS-class geometry overrides', () => {
  assert(
    hasRule(
      example(
        "import { TextField } from 'yahha-ui'; export default () => <TextField label='Name' className='custom-field' />;",
        [{ path: 'example.css', text: '.custom-field { min-height: 46px; }' }],
      ),
      'example-override',
    ),
  );
});
test('checks CSS modules, internal part classes and imported aliases', () => {
  assert(
    hasRule(
      example(
        "import { TextField as Field } from 'yahha-ui'; import styles from './example.css'; export default () => <Field label='Name' classNames={{ input: styles.field }} />;",
        [{ path: 'example.css', text: '.field { font-size: 46px; }' }],
      ),
      'example-override',
    ),
  );
});
test('checks embedded style blocks and component-reaching native selectors', () => {
  assert(
    hasRule(
      example(
        "import { TextField } from 'yahha-ui'; export default () => <div className='shell'><style>{`.shell input { height: 46px; }`}</style><TextField label='Name' /></div>;",
      ),
      'example-override',
    ),
  );
});
test('rejects inherited chi token injection on layout wrappers', () => {
  assert(
    hasRule(
      example(
        "import { Button } from 'yahha-ui'; export default () => <div style={{ '--chi-control-height': '46px' }}><Button>Save</Button></div>;",
      ),
      'example-override',
    ),
  );
});
test('resolves style variables and spreads instead of silently ignoring them', () => {
  assert(
    hasRule(
      example(
        "import { TextField } from 'yahha-ui'; const props = { style: { height: 46 } }; export default () => <TextField label='Name' {...props} />;",
      ),
      'example-override',
    ),
  );
});
test('permits component placement and native container layout', () => {
  assert.deepEqual(
    example(
      "import { TextField } from 'yahha-ui'; export default () => <div style={{ padding: 24, display: 'grid', gap: 16 }}><TextField label='Name' style={{ width: '100%', maxWidth: 420, marginTop: 12 }} className='field' /></div>;",
      [{ path: 'example.css', text: '.field { max-width: 420px; margin-top: 12px; }' }],
    ),
    [],
  );
});

test('rejects font shorthand and hidden local fallback dimensions', () => {
  assert(hasRule(inspect('.input { font: 16px/24px sans-serif; }'), 'literal-drift'));
  assert(
    hasRule(
      inspect('.input { font-size: calc(var(--chi-font-size-md) + var(--local-step, 2px)); }'),
      'literal-drift',
    ),
  );
});

test('resolves static mapped component props and rejects dynamic or appearance spreads', () => {
  assert.deepEqual(
    example(
      "import { TextField } from 'yahha-ui'; const fields = [{label:'Name'}, {label:'Email'}] as const; export default () => <>{fields.map(field => <TextField {...field} />)}</>;",
    ),
    [],
  );
  assert(
    hasRule(
      example(
        "import { TextField } from 'yahha-ui'; const fields = [{label:'Name', style:{minHeight:46}}] as const; export default () => <>{fields.map(field => <TextField {...field} />)}</>;",
      ),
      'example-override',
    ),
  );
  assert(
    hasRule(
      example(
        "import { TextField } from 'yahha-ui'; export default ({props}) => <TextField {...props} />;",
      ),
      'example-override',
    ),
  );
});

test('does not mistake native scene links or fieldset layout for public components', () => {
  assert.deepEqual(
    example(
      "import { TextField } from 'yahha-ui'; export default () => <section style={{minHeight:46}}><fieldset style={{border:0,padding:0}}><TextField label='Name' /><a className='scene-link' href='/'>Home</a></fieldset></section>;",
      [
        {
          path: 'scene.css',
          text: '.scene-link { min-height: var(--chi-control-height); background: var(--chi-ink); }',
        },
      ],
    ),
    [],
  );
});

test('does not accept arbitrary percentage radii on canonical controls', () => {
  assert(hasRule(inspect('.input { border-radius:37% 41% 53% 12%; }'), 'literal-drift'));
  assert(hasRule(inspect('.input { border-radius:50%; }'), 'literal-drift'));
});

test('requires color fallbacks to match the canonical theme color', () => {
  assert(hasRule(inspect('.input { color:var(--chi-accent, #f7dce3); }'), 'token-fallback'));
  assert.deepEqual(inspect('.input { color:var(--chi-accent, #f8dbe2); }'), []);
});

test('rejects literal paint colors while keeping system colors and graphic geometry', () => {
  for (const css of [
    'color:red',
    'background:#fff',
    'border:2px solid #fff',
    'box-shadow:1px 2px 0 rgba(0,0,0,.3)',
    'border:2px solid red',
  ])
    assert(hasRule(inspect(`.input { ${css}; }`), 'literal-color'));
  assert.deepEqual(
    inspect(
      '.input { color:CanvasText; background:transparent; border:2px solid currentColor; box-shadow:1px 2px 0 currentColor; }',
    ),
    [],
  );
});

test('does not hide literal paint colors in local aliases or logical border shorthands', () => {
  assert(hasRule(inspect('.input { --local-ink:#fff; color:var(--local-ink); }'), 'literal-color'));
  assert(hasRule(inspect('.input { border-inline-start:2px solid red; }'), 'literal-color'));
});
