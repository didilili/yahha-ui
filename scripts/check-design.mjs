import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import typescriptPlugin from 'prettier/plugins/typescript';
import {
  baselineExamples,
  componentSizing,
  designExceptions,
  exampleCssExceptions,
  exampleExceptions,
} from './design-contract.mjs';

const normalize = (value) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .trim();
const lineAt = (text, position) => text.slice(0, position).split('\n').length;
const neutral = /^(?:0|none|auto|normal|inherit|initial|unset|revert(?:-layer)?)$/i;
const length = /^(?:0|\d*\.?\d+(?:px|rem|em|%|ch|vw|vh|dvh|svh|vmin|vmax))$/;
const layoutProperties =
  /^(?:display|position|inset(?:-(?:inline|block)(?:-start|-end)?)?|top|right|bottom|left|float|clear|isolation|z-index|order|align-(?:items|self|content)|justify-(?:items|self|content)|place-(?:items|self|content)|flex(?:-(?:basis|grow|shrink|direction|wrap))?|grid(?:-.+)?|gap|row-gap|column-gap|margin(?:-.+)?|width|min-width|max-width|inline-size|min-inline-size|max-inline-size)$/;
const cssProperty = (name) =>
  name.startsWith('--') ? name : name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

function splitTop(value, delimiter) {
  const result = [];
  let start = 0,
    depth = 0,
    quote = '';
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (quote) {
      if (char === '\\') index++;
      else if (char === quote) quote = '';
    } else if (char === '"' || char === "'") quote = char;
    else if (char === '(' || char === '[') depth++;
    else if (char === ')' || char === ']') depth--;
    else if (
      !depth &&
      (typeof delimiter === 'string' ? char === delimiter : delimiter.test(char))
    ) {
      result.push(value.slice(start, index));
      start = index + 1;
    }
  }
  result.push(value.slice(start));
  return result;
}

/** Balanced declaration scanner, including @media, strings, comments and function commas. */
export function cssDeclarations(text, path) {
  const source = text.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '));
  const declarations = [],
    stack = [];
  let start = 0,
    depth = 0,
    quote = '';
  const flush = (end) => {
    const chunk = source.slice(start, end),
      colon = chunk.indexOf(':');
    if (!stack.length || colon < 0) return;
    const property = chunk.slice(0, colon).trim();
    if (!/^(?:--)?[\w-]+$/.test(property)) return;
    declarations.push({
      path,
      property,
      value: normalize(chunk.slice(colon + 1).replace(/\s*!important\s*$/, '')),
      selector: normalize(stack.filter((part) => !part.startsWith('@')).join(' ')),
      line: lineAt(source, start + chunk.search(/\S/)),
    });
  };
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (quote) {
      if (char === '\\') index++;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '(' || char === '[') {
      depth++;
      continue;
    }
    if (char === ')' || char === ']') {
      depth--;
      continue;
    }
    if (depth) continue;
    if (char === '{') {
      stack.push(normalize(source.slice(start, index)));
      start = index + 1;
    } else if (char === ';') {
      flush(index);
      start = index + 1;
    } else if (char === '}') {
      flush(index);
      stack.pop();
      start = index + 1;
    }
  }
  if (stack.length || quote || depth) throw new Error(`${path}: unbalanced CSS cannot be checked.`);
  return declarations;
}

function variables(value) {
  const found = [];
  for (const match of value.matchAll(/\bvar\(\s*(--[\w-]+)/g)) {
    let depth = 1,
      end = match.index + match[0].length;
    for (; end < value.length && depth; end++) {
      if (value[end] === '(') depth++;
      if (value[end] === ')') depth--;
    }
    const body = value.slice(match.index + 4, end - 1);
    const parts = splitTop(body, ',');
    found.push({
      name: parts[0].trim(),
      fallback: parts.length > 1 ? normalize(parts.slice(1).join(',')) : undefined,
      start: match.index,
      end,
    });
  }
  return found;
}

function withoutVariables(value) {
  const records = variables(value).sort((a, b) => b.start - a.start);
  for (const item of records) value = value.slice(0, item.start) + ' ' + value.slice(item.end);
  return value;
}

function tokenRole(name) {
  if (name.startsWith('--yahha-font-size-')) return 'font-size';
  if (name.startsWith('--yahha-leading-')) return 'leading';
  if (name.startsWith('--yahha-radius-')) return 'radius';
  if (name.startsWith('--yahha-control-height')) return 'control-height';
  if (name === '--yahha-focus-width') return 'focus-width';
  if (name.startsWith('--yahha-focus-offset')) return 'focus-offset';
  if (name.includes('border-width')) return 'border-width';
  if (name.startsWith('--yahha-space-') || name === '--yahha-press-offset') return 'space';
  if (name.startsWith('--yahha-duration-')) return 'duration';
  if (name.startsWith('--yahha-shadow-')) return 'shadow';
  if (name === '--yahha-ease') return 'ease';
  return 'color';
}

function validTokenValue(role, value) {
  if (variables(value).length || /^(?:calc|min|max|clamp)\(/.test(value)) return true;
  if (
    [
      'font-size',
      'control-height',
      'focus-width',
      'focus-offset',
      'border-width',
      'space',
    ].includes(role)
  )
    return length.test(value);
  if (role === 'leading') return length.test(value) || /^\d*\.?\d+$/.test(value);
  if (role === 'radius') return value.split(/[\s/]+/).every((part) => length.test(part));
  if (role === 'duration') return /^\d*\.?\d+m?s$/.test(value);
  if (role === 'ease')
    return /^(?:linear|ease(?:-in|-out|-in-out)?|cubic-bezier\(|steps\()/.test(value);
  if (role === 'shadow') return value === 'none' || /(?:\dpx|\drem)/.test(value);
  return /^(?:#[\da-f]{3,8}$|(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(|transparent$|currentcolor$|(?:Canvas|CanvasText|ButtonFace|ButtonText|ButtonBorder|Highlight|HighlightText|GrayText|LinkText|VisitedText|ActiveText)$)/i.test(
    value,
  );
}

const colorProperty =
  /^(?:color|background(?:-color|-image)?|border(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?(?:-color)?|outline(?:-color)?|fill|stroke|(?:box|text)-shadow)$/;
const colorKeywords =
  /^(?:transparent|currentcolor|Canvas|CanvasText|ButtonFace|ButtonText|ButtonBorder|Field|FieldText|Highlight|HighlightText|SelectedItem|SelectedItemText|GrayText|LinkText|VisitedText|ActiveText|AccentColor|AccentColorText)$/i;
function literalColorIn(item, locals = new Map(), seen = new Set()) {
  if (!colorProperty.test(item.property)) return false;
  if (
    variables(item.value).some(
      (record) =>
        locals.has(record.name) &&
        !seen.has(record.name) &&
        locals
          .get(record.name)
          .some((value) =>
            literalColorIn({ ...item, value }, locals, new Set([...seen, record.name])),
          ),
    )
  )
    return true;
  const rest = withoutVariables(item.value).trim();
  if (/#[\da-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i.test(rest)) return true;
  if (
    /^[a-z]+$/i.test(rest) &&
    !neutral.test(rest) &&
    !colorKeywords.test(rest) &&
    !/^(?:solid|dashed|dotted|double|inset|outset|groove|ridge|hidden|thin|medium|thick)$/i.test(
      rest,
    )
  )
    return true;
  if (
    /^(?:border(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?|outline)$/.test(
      item.property,
    )
  ) {
    const words = rest
      .replace(/-?\d*\.?\d+(?:px|rem|em|%)?/g, '')
      .split(/\s+/)
      .filter(Boolean);
    return words.some(
      (word) =>
        !/^(?:solid|dashed|dotted|double|inset|outset|groove|ridge|hidden|none|thin|medium|thick)$/i.test(
          word,
        ) && !colorKeywords.test(word),
    );
  }
  return false;
}

function subjectMatches(selector, classes) {
  return splitTop(selector, ',').some((part) => {
    const subject =
      splitTop(part.trim(), /[\s>+~]/)
        .filter(Boolean)
        .at(-1) ?? '';
    if (/::[\w-]+/.test(subject)) return false;
    return classes.some((name) => new RegExp(`\\.${name}(?![\\w-])`).test(subject));
  });
}

function protectedProperty(item) {
  const property = item.property;
  if (property === 'font-size' || property === 'font')
    return ['font-size', ...(property === 'font' ? ['leading'] : [])];
  if (property === 'line-height') return ['leading'];
  if (property === 'border-radius' || /^border-.+-radius$/.test(property)) return ['radius'];
  if (property === 'outline-offset') return ['focus-offset'];
  if (property === 'outline-width') return ['focus-width'];
  if (property === 'outline' && item.value !== 'none') return ['focus-width', 'color'];
  if (
    property === 'box-shadow' &&
    /focus-visible|data-highlighted|data-focused/.test(item.selector)
  )
    return ['focus-width', 'color'];
  const family = item.path.split('/')[2];
  if (
    /^(?:height|min-height|block-size|min-block-size)$/.test(property) &&
    subjectMatches(item.selector, componentSizing[family] ?? [])
  )
    return ['control-height'];
  if (
    /^(?:width|min-width|inline-size|min-inline-size)$/.test(property) &&
    family === 'button' &&
    subjectMatches(item.selector, ['iconButton'])
  )
    return ['control-height'];
  if (/^(?:color|background-color|border(?:-.+)?-color|outline-color|fill|stroke)$/.test(property))
    return ['color'];
  return undefined;
}

function checkExample(example, report, validateReferences) {
  let source;
  try {
    source = typescriptPlugin.parsers.typescript.parse(example.text);
  } catch (error) {
    report(
      { path: example.path, line: error.loc?.start?.line ?? 1 },
      'example-syntax',
      error.message,
    );
    return;
  }
  const bindings = new Map(),
    imports = new Set(),
    namespaces = new Set(),
    modules = new Set(),
    componentClasses = new Set(),
    hostClasses = new Set();
  const styles = [...(example.styles ?? [])];
  const visit = (node, fn) => {
    if (!node || typeof node !== 'object') return;
    if (typeof node.type === 'string') fn(node);
    for (const [key, value] of Object.entries(node)) {
      if (key === 'loc' || key === 'range' || key === 'tokens' || key === 'comments') continue;
      if (Array.isArray(value)) value.forEach((child) => visit(child, fn));
      else if (value && typeof value === 'object') visit(value, fn);
    }
  };
  const fail = (node, message) =>
    report({ path: example.path, line: node.loc?.start.line ?? 1 }, 'example-override', message);
  const nameOf = (node) => node?.name ?? node?.value;
  const stringValue = (node) =>
    node?.type === 'Literal' && typeof node.value === 'string'
      ? node.value
      : node?.type === 'TemplateLiteral' && !node.expressions.length
        ? node.quasis[0].value.cooked
        : undefined;
  visit(source, (node) => {
    if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && node.init)
      bindings.set(node.id.name, node.init);
    if (node.type === 'ImportDeclaration') {
      if (node.source.value === 'yahha-ui')
        node.specifiers.forEach((item) =>
          (item.type === 'ImportNamespaceSpecifier' ? namespaces : imports).add(item.local.name),
        );
      if (/\.css$/.test(node.source.value))
        node.specifiers.forEach((item) => modules.add(item.local.name));
    }
  });
  const resolveNode = (node, seen = new Set()) => {
    if (!node) return node;
    if (
      [
        'TSAsExpression',
        'TSSatisfiesExpression',
        'TSNonNullExpression',
        'ChainExpression',
      ].includes(node.type)
    )
      return resolveNode(node.expression, seen);
    if (node.type === 'Identifier' && bindings.has(node.name) && !seen.has(node.name))
      return resolveNode(bindings.get(node.name), new Set([...seen, node.name]));
    return node;
  };
  const collectClasses = (node, output) => {
    node = resolveNode(node);
    if (!node) return;
    const value = stringValue(node);
    if (value !== undefined) {
      value
        .split(/\s+/)
        .filter(Boolean)
        .forEach((part) => output.add(part));
      return;
    }
    if (
      node.type === 'MemberExpression' &&
      modules.has(node.object.name) &&
      (!node.computed || stringValue(node.property) !== undefined)
    ) {
      output.add(nameOf(node.property));
      return;
    }
    if (node.type === 'ConditionalExpression') {
      collectClasses(node.consequent, output);
      collectClasses(node.alternate, output);
      return;
    }
    if (node.type === 'LogicalExpression') {
      collectClasses(node.right, output);
      return;
    }
    if (node.type === 'ObjectExpression') {
      node.properties.forEach((property) =>
        property.type === 'SpreadElement'
          ? collectClasses(property.argument, output)
          : collectClasses(property.value, output),
      );
      return;
    }
    if (
      (node.type === 'Literal' && (node.value === null || node.value === false)) ||
      (node.type === 'Identifier' && node.name === 'undefined')
    )
      return;
    if (node.type === 'TemplateLiteral') {
      node.quasis.forEach((part) =>
        part.value.cooked
          .split(/\s+/)
          .filter(Boolean)
          .forEach((value) => output.add(value)),
      );
      node.expressions.forEach((expression) => collectClasses(expression, output));
      return;
    }
    fail(
      node,
      'Dynamic component classes cannot be verified; use explicit baseline layout classes.',
    );
  };
  const checkStyle = (node, component) => {
    const isComponent = Boolean(component);
    node = resolveNode(node);
    if (!node || (node.type === 'Identifier' && node.name === 'undefined')) return;
    if (node.type !== 'ObjectExpression') {
      fail(node, 'Dynamic styles cannot be verified in a baseline example.');
      return;
    }
    for (const property of node.properties) {
      if (property.type === 'SpreadElement') {
        checkStyle(property.argument, component);
        continue;
      }
      if (property.computed && stringValue(property.key) === undefined) {
        fail(property, 'Computed style keys cannot be verified.');
        continue;
      }
      const name = cssProperty(nameOf(property.key));
      const permitted = exampleExceptions.some(
        (entry) =>
          entry.path === example.path &&
          entry.component === component &&
          entry.property === name &&
          entry.value === stringValue(property.value),
      );
      if (
        !permitted &&
        (name.startsWith('--yahha-') || (isComponent && !layoutProperties.test(name)))
      )
        fail(
          property,
          `Baseline component style cannot override ${name}; keep appearance in the library.`,
        );
    }
  };
  const mappedBindings = new Map();
  visit(source, (node) => {
    if (
      node.type !== 'CallExpression' ||
      node.callee.type !== 'MemberExpression' ||
      node.callee.property.name !== 'map'
    )
      return;
    const array = resolveNode(node.callee.object),
      callback = node.arguments[0];
    if (
      array?.type === 'ArrayExpression' &&
      callback?.type === 'ArrowFunctionExpression' &&
      callback.params[0]?.type === 'Identifier'
    )
      mappedBindings.set(
        callback.params[0].name,
        array.elements.map((entry) => resolveNode(entry)),
      );
  });
  const checkAttributes = (attributes, component) => {
    const isComponent = Boolean(component);
    for (const attribute of attributes) {
      if (attribute.type === 'JSXSpreadAttribute' || attribute.type === 'SpreadElement') {
        const object = resolveNode(attribute.argument);
        if (object?.type === 'ObjectExpression') checkAttributes(object.properties, component);
        else if (object?.type === 'Identifier' && mappedBindings.has(object.name))
          for (const candidate of mappedBindings.get(object.name)) {
            if (candidate?.type === 'ObjectExpression')
              checkAttributes(candidate.properties, component);
            else fail(attribute, 'Mapped spread props must resolve to static objects.');
          }
        else fail(attribute, 'Dynamic spread props cannot be verified in a baseline example.');
        continue;
      }
      const name = nameOf(attribute.name ?? attribute.key);
      let value = attribute.value;
      if (value?.type === 'JSXExpressionContainer') value = value.expression;
      if (name === 'style') checkStyle(value, component);
      if (name === 'className' || name === 'classNames')
        collectClasses(value, isComponent ? componentClasses : hostClasses);
    }
  };
  visit(source, (node) => {
    if (node.type === 'JSXOpeningElement') {
      const tag = node.name;
      checkAttributes(
        node.attributes,
        imports.has(tag.name)
          ? tag.name
          : tag.type === 'JSXMemberExpression' && namespaces.has(tag.object.name)
            ? tag.property.name
            : undefined,
      );
    }
    if (node.type === 'JSXElement' && node.openingElement.name.name === 'style') {
      for (const child of node.children) {
        if (child.type !== 'JSXExpressionContainer') continue;
        const value = stringValue(resolveNode(child.expression));
        if (value !== undefined) styles.push({ path: example.path, text: value });
        else fail(child, 'Dynamic CSS cannot be verified in a baseline example.');
      }
    }
  });
  for (const style of styles) {
    for (const item of cssDeclarations(style.text, style.path)) {
      validateReferences(item);
      const permitted = exampleCssExceptions.some(
        (entry) =>
          entry.path === example.path &&
          entry.path === item.path &&
          normalize(entry.selector) === item.selector &&
          entry.property === item.property &&
          normalize(entry.value) === item.value,
      );
      if (!permitted && literalColorIn(item))
        report(
          item,
          'literal-color',
          `${item.property}: ${item.value} must consume a canonical color token.`,
        );
      const classes = [...item.selector.matchAll(/\.([\w-]+)/g)].map((match) => match[1]);
      const attached = classes.some((name) => componentClasses.has(name));
      const nativeReach =
        /(?:^|[\s>+~,(])(?:button|input|select|textarea|h[1-6]|p|a)(?![\w-])/.test(item.selector) &&
        (classes.length === 0 || classes.some((name) => hostClasses.has(name)));
      if (
        !permitted &&
        (item.property.startsWith('--yahha-') ||
          ((attached || nativeReach) && !layoutProperties.test(item.property)))
      )
        report(
          item,
          'example-override',
          `${item.selector} cannot override component ${item.property} in a baseline example.`,
        );
    }
  }
}

export function auditDesign({ theme, componentStyles = [], examples = [], exceptions = [] }) {
  const diagnostics = [],
    tokens = new Map(),
    used = new Set();
  const report = (item, rule, message) =>
    diagnostics.push({ file: item.path, line: item.line ?? 1, rule, message });
  const themeDeclarations = cssDeclarations(theme, 'src/theme/theme.module.css');
  for (const item of themeDeclarations)
    if (item.property.startsWith('--yahha-') && !tokens.has(item.property))
      tokens.set(item.property, item.value);
  const expand = (value, seen = new Set()) => {
    for (const record of variables(value).sort((a, b) => b.start - a.start)) {
      if (tokens.has(record.name) && !seen.has(record.name))
        value =
          value.slice(0, record.start) +
          expand(tokens.get(record.name), new Set([...seen, record.name])) +
          value.slice(record.end);
    }
    return normalize(value);
  };
  const validateReferences = (item) => {
    for (const record of variables(item.value)) {
      if (!record.name.startsWith('--yahha-')) continue;
      if (!tokens.has(record.name)) {
        report(item, 'unknown-token', `Unknown theme token ${record.name}.`);
        continue;
      }
      if (record.fallback !== undefined) {
        const role = tokenRole(record.name),
          expected = expand(tokens.get(record.name));
        if (
          !validTokenValue(role, record.fallback) ||
          (!['shadow', 'ease'].includes(role) && expand(record.fallback) !== expected)
        )
          report(
            item,
            'token-fallback',
            `${record.name} fallback ${record.fallback} must match theme default ${expected}.`,
          );
      }
    }
  };
  for (const item of themeDeclarations) {
    validateReferences(item);
    if (
      item.property.startsWith('--yahha-') &&
      !validTokenValue(tokenRole(item.property), expand(item.value))
    )
      report(
        item,
        'token-value',
        `${item.property} has invalid ${tokenRole(item.property)} value ${item.value}.`,
      );
  }
  for (const [index, entry] of [...exceptions, ...exampleCssExceptions].entries()) {
    if (
      ![entry.path, entry.selector, entry.property, entry.value, entry.reason].every(
        (part) => typeof part === 'string' && part.trim(),
      ) ||
      /[*?]/.test(entry.path) ||
      entry.selector === '*'
    )
      report(
        { path: entry.path ?? 'scripts/design-contract.mjs' },
        'invalid-exception',
        `Exception ${index + 1} must name one exact declaration and a concrete reason.`,
      );
  }
  for (const style of componentStyles) {
    const declarations = cssDeclarations(style.text, style.path),
      locals = new Map();
    for (const item of declarations)
      if (item.property.startsWith('--') && !item.property.startsWith('--yahha-'))
        locals.set(item.property, [...(locals.get(item.property) ?? []), item.value]);
    const rolesFor = (value, seen = new Set()) =>
      variables(value).flatMap((record) => {
        if (tokens.has(record.name)) return [tokenRole(record.name)];
        if (!locals.has(record.name) || seen.has(record.name)) return [];
        return locals
          .get(record.name)
          .flatMap((local) => rolesFor(local, new Set([...seen, record.name])));
      });
    const literalIn = (value, seen = new Set()) => {
      if (/\d*\.?[1-9]\d*(?:\.\d+)?(?:px|rem|em|%|ch|vw|vh)\b/.test(withoutVariables(value)))
        return true;
      return variables(value).some(
        (record) =>
          (!tokens.has(record.name) &&
            record.fallback !== undefined &&
            literalIn(record.fallback, seen)) ||
          (locals.has(record.name) &&
            !seen.has(record.name) &&
            locals
              .get(record.name)
              .some((local) => literalIn(local, new Set([...seen, record.name])))),
      );
    };
    for (const item of declarations) {
      validateReferences(item);
      if (literalColorIn(item, locals))
        report(
          item,
          'literal-color',
          `${item.property}: ${item.value} must consume a canonical color token.`,
        );
      if (item.property.startsWith('--yahha-')) {
        if (!tokens.has(item.property))
          report(item, 'unknown-token', `Unknown theme token declaration ${item.property}.`);
        else if (
          !validTokenValue(tokenRole(item.property), expand(item.value)) ||
          (tokenRole(item.property) !== 'color' &&
            !variables(item.value).length &&
            expand(item.value) !== expand(tokens.get(item.property)))
        )
          report(
            item,
            'token-value',
            `${item.property} must consume its canonical theme value instead of ${item.value}.`,
          );
      }
      const allowed = protectedProperty(item);
      if (!allowed || neutral.test(item.value)) continue;
      const matching = exceptions.findIndex(
        (entry) =>
          entry.path === item.path &&
          normalize(entry.selector) === item.selector &&
          entry.property === item.property &&
          normalize(entry.value) === item.value,
      );
      if (matching >= 0) {
        used.add(matching);
        continue;
      }
      const roles = rolesFor(item.value);
      if (roles.some((role) => !allowed.includes(role)))
        report(
          item,
          'token-role',
          `${item.property} requires ${allowed.join('/')} tokens, received ${[...new Set(roles)].join('/')}.`,
        );
      if (
        allowed[0] !== 'color' &&
        (!roles.some((role) => role === allowed[0]) || literalIn(item.value))
      )
        report(
          item,
          'literal-drift',
          `${item.selector} ${item.property}: ${item.value} must consume a canonical ${allowed[0]} token.`,
        );
    }
  }
  for (const [index, entry] of exceptions.entries())
    if (!used.has(index))
      report(
        { path: entry.path },
        'stale-exception',
        `Remove stale exception for ${entry.selector} ${entry.property}: ${entry.value}.`,
      );
  for (const example of examples) checkExample(example, report, validateReferences);
  return diagnostics;
}

async function filesUnder(path, suffix) {
  const entries = await readdir(path, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? filesUnder(join(path, entry.name), suffix)
          : entry.name.endsWith(suffix)
            ? [join(path, entry.name)]
            : [],
      ),
    )
  ).flat();
}

async function main() {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const styles = (
    await Promise.all(
      ['src/components', 'src/internal'].map((path) => filesUnder(join(root, path), '.css')),
    )
  ).flat();
  const examples = (
    await Promise.all(
      baselineExamples.map((path) =>
        path.endsWith('.tsx') ? [join(root, path)] : filesUnder(join(root, path), '.tsx'),
      ),
    )
  ).flat();
  const diagnostics = auditDesign({
    theme: await readFile(join(root, 'src/theme/theme.module.css'), 'utf8'),
    componentStyles: await Promise.all(
      styles.map(async (path) => ({
        path: relative(root, path),
        text: await readFile(path, 'utf8'),
      })),
    ),
    examples: await Promise.all(
      examples.map(async (path) => {
        const text = await readFile(path, 'utf8');
        const css = [...text.matchAll(/import\s+(?:[^;]*?from\s+)?['"]([^'"]+\.css)['"]/g)]
          .map((match) => match[1])
          .filter((entry) => entry.startsWith('.'));
        return {
          path: relative(root, path),
          text,
          styles: await Promise.all(
            css.map(async (entry) => ({
              path: relative(root, resolve(dirname(path), entry)),
              text: await readFile(resolve(dirname(path), entry), 'utf8'),
            })),
          ),
        };
      }),
    ),
    exceptions: designExceptions,
  });
  for (const item of diagnostics)
    console.error(`${item.file}:${item.line} [${item.rule}] ${item.message}`);
  if (diagnostics.length) process.exitCode = 1;
  else
    console.log(
      `Design contract passed: ${styles.length} component/internal stylesheets and ${examples.length} baseline examples.`,
    );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
