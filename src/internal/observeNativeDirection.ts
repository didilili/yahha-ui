import type { TextDirection } from '@base-ui/react/direction-provider';

/** Observe native direction along the current composed ancestry, including slot changes. */
export function observeNativeDirection(
  element: HTMLElement | null,
  onDirection: (direction: TextDirection | undefined) => void,
  includeSelf = true,
) {
  function parentElement(node: HTMLElement): HTMLElement | null {
    if (node.assignedSlot) return node.assignedSlot;
    if (node.parentElement) return node.parentElement;
    const root = node.getRootNode();
    return root instanceof ShadowRoot ? (root.host as HTMLElement) : null;
  }
  const ancestors: HTMLElement[] = [];
  function updateDirection() {
    const direction = ancestors.find((node) => node.dir === 'rtl' || node.dir === 'ltr')?.dir;
    onDirection(direction === 'rtl' || direction === 'ltr' ? direction : undefined);
  }
  const observer = new MutationObserver(updateDirection);
  function disconnectAncestors() {
    observer.disconnect();
    for (const node of ancestors) {
      if (node instanceof HTMLSlotElement) {
        node.removeEventListener('slotchange', observeAncestors);
      }
    }
  }
  function observeAncestors() {
    disconnectAncestors();
    ancestors.length = 0;
    for (
      let node: HTMLElement | null = includeSelf || !element ? element : parentElement(element);
      node;
      node = parentElement(node)
    ) {
      ancestors.push(node);
      observer.observe(node, { attributes: true, attributeFilter: ['dir'] });
      if (node instanceof HTMLSlotElement) {
        node.addEventListener('slotchange', observeAncestors);
      }
    }
    updateDirection();
  }
  observeAncestors();
  return disconnectAncestors;
}
