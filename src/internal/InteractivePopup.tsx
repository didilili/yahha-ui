import type { ComponentPropsWithRef, SyntheticEvent } from 'react';

/** Keep retained exit content inert, including the frame before native focus updates. */
export function renderInteractivePopup(
  props: ComponentPropsWithRef<'div'>,
  state: { open: boolean },
) {
  function guard<Event extends SyntheticEvent<HTMLDivElement>>(
    handler: ((event: Event) => void) | undefined,
  ) {
    return (event: Event) => {
      if (!state.open) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      handler?.(event);
    };
  }

  return (
    <div
      {...props}
      inert={props.inert || !state.open}
      onKeyDownCapture={guard(props.onKeyDownCapture)}
      onKeyUpCapture={guard(props.onKeyUpCapture)}
      onClickCapture={guard(props.onClickCapture)}
      onSubmitCapture={guard(props.onSubmitCapture)}
    />
  );
}
