import type { IconProps } from '../Icon.js';

/** Props for the supplied 24-unit glyphs. Their paths are fixed, so children are not accepted. */
export type GlyphProps = Omit<IconProps, 'children'>;
