import type { DocPage } from './types';
import introduction from './guides/introduction';
import gettingStarted from './guides/getting-started';
import forms from './guides/forms';
import styling from './guides/styling';
import reading from './guides/reading';
import states from './guides/states';
import interactions from './guides/interactions';
import designBaseline from './guides/design-baseline';
import { artworkGuide } from './artwork-guide';
import { recipeGuide } from './recipe-guide';

/** Complete models are used only when full guide content is needed, such as search. */
export const guidePages: DocPage[] = [
  introduction,
  gettingStarted,
  forms,
  styling,
  recipeGuide,
  reading,
  states,
  interactions,
  designBaseline,
  artworkGuide,
];
