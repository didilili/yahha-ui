import { useCallback, useLayoutEffect, useState } from 'react';
import { useDirection, type TextDirection } from '@base-ui/react/direction-provider';
import { observeNativeDirection } from './observeNativeDirection.js';

/** Keep anchored portals on their trigger's native reading direction. */
export function useTriggerDirection<Element extends HTMLElement = HTMLButtonElement>() {
  const inheritedDirection = useDirection();
  const [triggerElement, setTriggerElement] = useState<Element | null>(null);
  const triggerRef = useCallback((element: Element | null) => setTriggerElement(element), []);
  const [nativeDirection, setNativeDirection] = useState<TextDirection>();

  // A custom trigger can replace its node; keep its native ancestry up to date too.
  useLayoutEffect(() => {
    return observeNativeDirection(triggerElement, setNativeDirection);
  }, [triggerElement]);

  return { direction: nativeDirection ?? inheritedDirection, nativeDirection, triggerRef };
}
