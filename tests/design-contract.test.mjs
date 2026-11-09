import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { auditDesign } from '../scripts/check-design.mjs';

const theme = `
.theme {
  --yahha-control-height: 44px;
  --yahha-font-size-md: 14px;
  --yahha-leading-control: 20px;
  --yahha-radius-field: 12px 16px 14px 11px;
  --yahha-focus-width: 2px;
  --yahha-focus-offset: 2px;
  --yahha-focus: #ad6179;
  --yahha-ink: #462e31;
  --yahha-accent: #f8dbe2;
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
test('rejects unknown Yahha tokens even with a valid-looking fallback', () => {
  assert(hasRule(inspect('.input { height: var(--yahha-contol-height, 44px); }'), 'unknown-token'));
});
test('rejects an existing height token used as a font size', () => {
  assert(hasRule(inspect('.input { font-size: var(--yahha-control-height); }'), 'token-role'));
});
test('rejects dimensional fallback drift and invalid fallback values', () => {
  assert(
    hasRule(inspect('.input { min-height: var(--yahha-control-height, 46px); }'), 'token-fallback'),
  );
  assert(
    hasRule(
      inspect('.input { min-height: var(--yahha-control-height, banana); }'),
      'token-fallback',
    ),
  );
});
test('validates token definitions in the canonical theme', () => {
  assert(
    hasRule(inspect('', { theme: '.theme { --yahha-control-height: banana; }' }), 'token-value'),
  );
});
test('follows local derived variables without accepting hidden literal drift', () => {
  assert.deepEqual(
    inspect(
      '.input { --field-height: var(--yahha-control-height); min-height: var(--field-height); }',
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
    .input { min-height: var(--yahha-control-height, 44px); font-size: var(--yahha-font-size-md, 14px); line-height: var(--yahha-leading-control, 20px); border-radius: var(--yahha-radius-field); }
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
      '.input:focus-visible { outline: var(--yahha-focus-width) solid var(--yahha-focus); outline-offset: var(--yahha-focus-offset); }',
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
test('rejects inherited Yahha token injection on layout wrappers', () => {
  assert(
    hasRule(
      example(
        "import { Button } from 'yahha-ui'; export default () => <div style={{ '--yahha-control-height': '46px' }}><Button>Save</Button></div>;",
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
      inspect('.input { font-size: calc(var(--yahha-font-size-md) + var(--local-step, 2px)); }'),
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
          text: '.scene-link { min-height: var(--yahha-control-height); background: var(--yahha-ink); }',
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
  assert(hasRule(inspect('.input { color:var(--yahha-accent, #f7dce3); }'), 'token-fallback'));
  assert.deepEqual(inspect('.input { color:var(--yahha-accent, #f8dbe2); }'), []);
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

const customizationPaths = [
  'playground/src/examples/customization/TextFieldCustomization.tsx',
  'playground/src/examples/customization/SelectPortalCustomization.tsx',
];
async function customizationAudit(path, change = (source) => source, targetPath = path) {
  const [canonicalTheme, source] = await Promise.all([
    readFile(new URL('../src/theme/theme.module.css', import.meta.url), 'utf8'),
    readFile(new URL(`../${path}`, import.meta.url), 'utf8'),
  ]);
  return auditDesign({
    theme: canonicalTheme,
    examples: [{ path: targetPath, text: change(source) }],
  });
}

test('permits only reviewed CSS declarations in the two explicit public customization examples', async () => {
  for (const path of customizationPaths) assert.deepEqual(await customizationAudit(path), []);
});

test('customization permissions do not cover changed values, selectors or default examples', async () => {
  const [field, select] = customizationPaths;
  assert(
    hasRule(
      await customizationAudit(field, (source) =>
        source.replace('padding: 8px 12px', 'padding: 9px 12px'),
      ),
      'example-override',
    ),
  );
  assert(
    hasRule(
      await customizationAudit(field, (source) =>
        source.replaceAll('yahha-example-nickname-hint', 'different-hint'),
      ),
      'example-override',
    ),
  );
  assert(
    hasRule(
      await customizationAudit(field, (source) =>
        source.replace('border-radius: 8px', 'font-size: 8px'),
      ),
      'example-override',
    ),
  );
  assert(
    hasRule(
      await customizationAudit(select, (source) =>
        source.replace('background: #f1f8ff', 'background: #ffffff'),
      ),
      'example-override',
    ),
  );
  assert(
    hasRule(
      await customizationAudit(select, (source) =>
        source.replace('font-weight: 600', 'font-weight: 700'),
      ),
      'example-override',
    ),
  );
  assert(
    hasRule(
      await customizationAudit(field, (source) =>
        source.replace('color: #49313d', 'color: #000000'),
      ),
      'literal-color',
    ),
  );
  for (const path of customizationPaths)
    assert(hasRule(await customizationAudit(path, undefined, examplePath), 'example-override'));
});

test('reviewed customization does not bypass unknown tokens or incorrect fallbacks', async () => {
  const [field] = customizationPaths;
  assert(
    hasRule(
      await customizationAudit(field, (source) =>
        source.replace('background: #fff0f6', 'background: var(--yahha-unknown-color, #fff0f6)'),
      ),
      'unknown-token',
    ),
  );
  assert(
    hasRule(
      await customizationAudit(field, (source) =>
        source.replace('color: #49313d', 'color: var(--yahha-ink, #000000)'),
      ),
      'token-fallback',
    ),
  );
});

const formExample = (
  body,
  imports = "import { Form, Input, Checkbox, Switch, Select } from 'yahha-ui';",
) =>
  `${imports} export default () => <Form initialValues={{ nickname: '', accepted: false }}>{form => (${body})}</Form>;`;

test('accepts only public Form render bindings with static supported helpers and error placement', () => {
  for (const text of [
    formExample(
      `<><Input {...form.input('nickname')} label="昵称" /><Checkbox {...form.checked('accepted')} label="同意" /><Switch {...form.checked('accepted', { errorPlacement: 'external' })} label="通知" /><Select {...form.choice('nickname', { errorPlacement: 'control' })} label="选择" options={[]} /></>`,
    ),
    `import { Form as ManagedForm, Input } from 'yahha-ui'; export default () => <ManagedForm initialValues={{ nickname: '' }}>{state => <Input {...state.input('nickname')} label="昵称" />}</ManagedForm>;`,
    `import * as UI from 'yahha-ui'; export default () => <UI.Form initialValues={{ nickname: '' }}>{state => <UI.Input {...state.input('nickname')} label="昵称" />}</UI.Form>;`,
    `import { Form, Input } from 'yahha-ui'; export default () => <Form initialValues={{ nickname: '' }} children={state => <Input {...state.input('nickname')} label="昵称" />} />;`,
    formExample(
      `<>{[1].map(item => <Input key={item} {...form.input('nickname')} label="昵称" />)}</>`,
    ),
  ])
    assert.deepEqual(example(text), [], text);
});

test('rejects forged Form objects, wrong imports and non-render callbacks', () => {
  for (const text of [
    `import { Input } from 'yahha-ui'; const form = { input: () => ({style:{height:46}}) }; export default () => <Input {...form.input('nickname')} />;`,
    `import type { Form } from 'yahha-ui'; import { Input } from 'yahha-ui'; export default () => <Form>{form => <Input {...form.input('nickname')} />}</Form>;`,
    `import { Form as form, Input } from 'yahha-ui'; export default () => <form>{state => <Input {...state.input('nickname')} />}</form>;`,
    `import { Form } from './fake'; import { Input } from 'yahha-ui'; export default () => <Form>{form => <Input {...form.input('nickname')} />}</Form>;`,
    `import { Input as Form, Input } from 'yahha-ui'; export default () => <Form>{form => <Input {...form.input('nickname')} />}</Form>;`,
    `import { Form, Input } from 'yahha-ui'; export default () => <Form onSubmit={form => <Input {...form.input('nickname')} />}>{() => null}</Form>;`,
    `import { Form, Input } from 'yahha-ui'; const form = {}; export default () => <Form>{() => <Input {...form.input('nickname')} />}</Form>;`,
  ])
    assert(hasRule(example(text), 'example-override'), text);
});

test('rejects unknown Form helper members, arguments and option keys', () => {
  for (const binding of [
    `form.style('nickname')`,
    `form['input']('nickname')`,
    `form.input(name)`,
    `form.input('nickname', options)`,
    `form.input('nickname', { style: { height: 46 } })`,
    `form.input('nickname', { classNames: { input: 'custom' } })`,
    `form.input('nickname', { errorPlacement: 'elsewhere' })`,
    `form.input('nickname', { errorPlacement: placement })`,
    `form.input('nickname', { ...options })`,
    `form.input('nickname', { get errorPlacement() { return 'external'; } })`,
    `form.input('nickname', {}, extra)`,
  ])
    assert(hasRule(example(formExample(`<Input {...${binding}} />`)), 'example-override'), binding);
});

test('resolves Form render parameters lexically and rejects shadowed imports or field state', () => {
  for (const text of [
    `import { Form, Input } from 'yahha-ui'; export default (Form) => <Form>{form => <Input {...form.input('nickname')} />}</Form>;`,
    `import * as UI from 'yahha-ui'; export default (UI) => <UI.Form>{form => <UI.Input {...form.input('nickname')} />}</UI.Form>;`,
    `import { Form, Input } from 'yahha-ui'; export default class FormContainer { field = class Form { render() { return <Form>{form => <Input {...form.input('nickname')} />}</Form>; } }; }`,
    formExample(`<>{items.map(form => <Input {...form.input('nickname')} />)}</>`),
    `import { Form, Input } from 'yahha-ui'; export default () => <Form>{form => { const inner = () => { const form = spoof; return <Input {...form.input('nickname')} />; }; return inner(); }}</Form>;`,
    `import { Form, Input } from 'yahha-ui'; export default () => <Form>{form => { try { throw 1; } catch (form) { return <Input {...form.input('nickname')} />; } }}</Form>;`,
    `import { Form, Input } from 'yahha-ui'; export default () => <Form>{form => { for (const form of items) { return <Input {...form.input('nickname')} />; } }}</Form>;`,
  ])
    assert(hasRule(example(text), 'example-override'), text);
});

test('rejects mutated or escaped Form render state even when a helper call looks valid', () => {
  for (const statement of [
    `form = spoof;`,
    `({ input: form.input } = spoof);`,
    `[form.input] = spoof;`,
    `form.input = () => ({style:{height:46}});`,
    `Object.assign(form, spoof);`,
    `const alias = form; alias.input = spoof;`,
    `Object.defineProperty(form, 'input', {value: spoof});`,
  ]) {
    const text = `import { Form, Input } from 'yahha-ui'; export default () => <Form>{form => { ${statement} return <Input {...form.input('nickname')} />; }}</Form>;`;
    assert(hasRule(example(text), 'example-override'), statement);
  }
});

test('keeps checking explicit style and classes around verified Form binding spreads', () => {
  for (const attributes of [
    `{...form.input('nickname')} style={{height:46}}`,
    `style={{height:46}} {...form.input('nickname')}`,
    `{...form.input('nickname')} classNames={{input:'custom'}}`,
  ])
    assert(
      hasRule(
        example(formExample(`<Input ${attributes} />`), [
          { path: 'example.css', text: '.custom { min-height: 46px; }' },
        ]),
        'example-override',
      ),
      attributes,
    );
});
