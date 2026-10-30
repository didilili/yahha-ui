import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

export const markdownFile = (id) => `${id === 'theme-provider' ? 'theme' : id}.md`;

export function documentationLink(href) {
  const component = /^#\/components\/([^?]+)(?:\?section=([^&]+))?$/.exec(href);
  if (component) return `${markdownFile(component[1])}${component[2] ? `#${component[2]}` : ''}`;
  if (href === '#/components') return '../README.md';
  if (href.startsWith('#/guides/getting-started')) return '../../README.md#构建与本地安装';
  if (href.startsWith('#/guides/design-baseline')) return '../design-language.md';
  if (href.startsWith('#/guides/')) return `../README.md#站内指南`;
  return href;
}

/** Render documentation prose, never rewrite the runnable example source. */
export function proseToMarkdown(html) {
  const document = new JSDOM(`<body>${html}</body>`).window.document;
  function convert(node) {
    if (node.nodeType === 3)
      return node.textContent.replace(/\s+/g, ' ').replace(/([*_[\]])/g, '\\$1');
    if (node.nodeType !== 1) return '';
    const inside = () => [...node.childNodes].map(convert).join('');
    switch (node.tagName.toLowerCase()) {
      case 'p':
        return `${inside().trim()}\n\n`;
      case 'a':
        return `[${inside().trim()}](${documentationLink(node.getAttribute('href') ?? '')})`;
      case 'code':
        return inlineCode(node.textContent);
      case 'strong':
      case 'b':
        return `**${inside()}**`;
      case 'em':
      case 'i':
        return `*${inside()}*`;
      case 'br':
        return '\n';
      case 'ul':
      case 'ol': {
        const ordered = node.tagName === 'OL';
        return (
          [...node.children]
            .map(
              (child, index) =>
                `${ordered ? `${index + 1}.` : '-'} ${convert(child).trim().replace(/\n/g, '\n  ')}`,
            )
            .join('\n') + '\n\n'
        );
      }
      case 'li':
        return inside();
      case 'pre':
        return sourceFence(node.textContent, 'text') + '\n\n';
      case 'h3':
        return `### ${inside().trim()}\n\n`;
      case 'h4':
        return `#### ${inside().trim()}\n\n`;
      default:
        return inside();
    }
  }
  return [...document.body.childNodes].map(convert).join('').trim();
}

function inlineCode(value) {
  const longest = Math.max(0, ...(value.match(/`+/g) ?? []).map((run) => run.length));
  const fence = '`'.repeat(longest + 1);
  return `${fence}${longest ? ' ' : ''}${value}${longest ? ' ' : ''}${fence}`;
}

export function sourceFence(source, language = 'tsx') {
  const longest = Math.max(2, ...(source.match(/`+/g) ?? []).map((run) => run.length));
  const fence = '`'.repeat(longest + 1);
  return `${fence}${language}\n${source}${source.endsWith('\n') ? '' : '\n'}${fence}`;
}

const cell = (value) => value.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
export function apiMarkdown(api) {
  return [
    `### ${api.name}`,
    '',
    '| 属性 | 说明 | 类型 | 默认值 |',
    '| --- | --- | --- | --- |',
    ...api.rows.map(
      (row) =>
        `| ${cell(inlineCode(row.name))}${row.required ? ' **必填**' : ''} | ${cell(row.description.replace(/([*_])/g, '\\$1'))} | ${cell(inlineCode(row.type))} | ${cell(row.defaultValue === undefined ? '—' : inlineCode(row.defaultValue))} |`,
    ),
  ].join('\n');
}

export function markdownExamples(markdown) {
  return [
    ...markdown.matchAll(
      /<!-- example-source: ([^\r\n]+) -->\r?\n+(`{3,})tsx\r?\n([\s\S]*?)\r?\n\2/g,
    ),
  ].map((match) => ({ sourcePath: match[1], source: `${match[3]}\n` }));
}

export function validateDocumentation(pages) {
  const ids = new Set(pages.map((page) => page.id));
  assert.equal(ids.size, pages.length, 'Component documentation ids must be unique.');
  for (const page of pages) {
    const anchors = new Set();
    for (const section of page.sections) {
      for (const id of [section.id, ...(section.examples ?? []).map((example) => example.id)]) {
        assert(!anchors.has(id), `${page.id}: duplicate anchor ${id}`);
        anchors.add(id);
      }
      for (const table of section.api ?? []) {
        const names = new Set();
        assert(table.rows.length > 0, `${page.id}: empty API ${table.name}`);
        for (const row of table.rows) {
          assert(!names.has(row.name), `${page.id}: duplicate API property ${row.name}`);
          assert(
            row.name.trim() && row.type.trim() && row.description.trim(),
            `${page.id}: incomplete API row`,
          );
          names.add(row.name);
        }
      }
    }
    assert(anchors.has('usage'), `${page.id}: explain when to use this component before examples.`);
    assert(anchors.has('api'), `${page.id}: API is required.`);
    assert(anchors.has('related'), `${page.id}: related components are required.`);
    assert(
      page.sections.some((section) => section.examples?.length),
      `${page.id}: runnable examples are required.`,
    );
  }
}
