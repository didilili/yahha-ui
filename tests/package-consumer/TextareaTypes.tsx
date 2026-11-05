import { createRef } from 'react';
import { Textarea, type TextareaProps } from 'yahha-ui';

const sizing: TextareaProps['autoSize'] = { minRows: 2, maxRows: 8 };
export const textarea = (
  <Textarea
    label="留言"
    autoSize={sizing}
    ref={createRef<HTMLTextAreaElement>()}
    name="comment"
    form="draft"
    defaultValue="草稿"
  />
);
export const unbounded = <Textarea label="草稿" autoSize rows={3} />;
export const fixedRows = (
  <Textarea label="摘要" autoSize={false} style={{ height: 200, resize: 'vertical' }} />
);
// @ts-expect-error Auto size accepts a boolean or row bounds, not a mode string.
export const invalidSize = <Textarea label="留言" autoSize="always" />;
