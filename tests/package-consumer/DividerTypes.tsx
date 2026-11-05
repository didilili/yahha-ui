import { createRef } from 'react';
import { Divider, type DividerProps } from 'yahha-ui';

const valid: DividerProps = {
  ref: createRef<HTMLHRElement>(),
  orientation: 'vertical',
  decorative: true,
  className: 'article-meta-divider',
  style: { margin: 0 },
  'aria-label': '阅读信息',
};

// @ts-expect-error A native hr is a void element and cannot receive children.
const invalidChildren: DividerProps = { children: '章节标题' };
// @ts-expect-error A native hr cannot receive injected inner HTML.
const invalidHTML: DividerProps = { dangerouslySetInnerHTML: { __html: '<b>标题</b>' } };

void invalidChildren;
void invalidHTML;
export const validDivider = <Divider {...valid} data-example="valid-native-attributes" />;
