import { JSDOM } from 'jsdom';

const ariaReferences = new Set([
  'aria-labelledby',
  'aria-describedby',
  'aria-details',
  'aria-controls',
  'aria-owns',
  'aria-activedescendant',
  'aria-errormessage',
  'aria-flowto',
]);

/** Trim unused top-level definitions from a finished, project-owned SVG. */
export function pruneSvgDefs(source) {
  const dom = new JSDOM(source, { contentType: 'image/svg+xml' });
  try {
    const document = dom.window.document;
    const root = document.documentElement;
    if (root.localName !== 'svg') throw new Error('Expected a complete SVG document.');
    const ids = new Map();
    for (const element of document.querySelectorAll('[id]')) {
      if (ids.has(element.id)) throw new Error(`Duplicate SVG ID: ${element.id}`);
      ids.set(element.id, element);
    }

    const definitions = [...root.querySelectorAll('defs')]
      .filter((element) => !element.parentElement.closest('defs'))
      .flatMap((element) => [...element.children]);
    const owner = new Map();
    for (const definition of definitions) {
      owner.set(definition, definition);
      for (const descendant of definition.querySelectorAll('*')) owner.set(descendant, definition);
    }

    const kept = new Set();
    const visited = new Set();
    const references = [];
    function readUrls(value) {
      for (const match of value.matchAll(/url\(\s*(['"]?)#([^\s)'"\\]+)\1\s*\)/gi))
        references.push(match[2]);
    }
    function visit(element, includeDefinitions = false) {
      if (visited.has(element) || (element.localName === 'defs' && !includeDefinitions)) return;
      visited.add(element);
      for (const { name, localName, value } of element.attributes) {
        if (localName === 'href' && value.trim().startsWith('#'))
          references.push(value.trim().slice(1));
        if (ariaReferences.has(name)) references.push(...value.trim().split(/\s+/));
        readUrls(value);
      }
      if (element.localName === 'style') readUrls(element.textContent);
      for (const child of element.children) visit(child, includeDefinitions);
    }
    function keep(definition) {
      if (kept.has(definition)) return;
      kept.add(definition);
      // A referenced nested ID retains its whole top-level container and dependencies.
      visit(definition, true);
    }

    visit(root);
    for (const [element, definition] of owner) {
      if (
        ['style', 'title', 'desc', 'set'].includes(element.localName) ||
        element.localName.startsWith('animate')
      )
        keep(definition);
    }
    while (references.length) {
      const target = ids.get(references.pop());
      if (!target) continue;
      const definition = owner.get(target);
      if (definition) keep(definition);
      else visit(target);
    }

    let removed = false;
    for (const definition of definitions) {
      if (kept.has(definition)) continue;
      definition.remove();
      removed = true;
    }
    return removed ? new dom.window.XMLSerializer().serializeToString(document) : source;
  } finally {
    dom.window.close();
  }
}
