import { createRef } from 'react';
import {
  Icon,
  SearchIcon,
  BookmarkIcon,
  type IconProps,
  type GlyphProps,
  type BookmarkIconProps,
} from 'yahha-ui';

const root = createRef<SVGSVGElement>();
const custom: IconProps = {
  ref: root,
  size: 28,
  tone: 'muted',
  viewBox: '0 0 16 16',
  'aria-label': '阅读标记',
};
const glyph: GlyphProps = { ref: root, size: 'sm', strokeWidth: 2, 'aria-hidden': true };
const bookmark: BookmarkIconProps = { filled: true, tone: 'accent', size: 'lg' };

// @ts-expect-error Icon sizes use documented presets or positive numbers at runtime.
const invalidSize: IconProps = { size: 'xl' };
// @ts-expect-error The square icon frame is controlled by size, not native width.
const invalidWidth: IconProps = { width: 30 };
// @ts-expect-error Named glyphs own their drawing and cannot receive children.
const invalidDrawing: GlyphProps = { children: <circle cx="8" cy="8" r="4" /> };

void invalidSize;
void invalidWidth;
void invalidDrawing;

export const validIcons = (
  <>
    <Icon {...custom}>
      <circle cx="8" cy="8" r="4" />
    </Icon>
    <SearchIcon {...glyph} />
    <BookmarkIcon {...bookmark} />
  </>
);
