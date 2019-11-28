// @flow
import type { Rect } from '../types';

// Returns the width, height and offsets of the provided element
export default (element: HTMLElement): Rect => {
  // get the basic client rect, it doesn't include margins
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const y = element.offsetTop;
  const x = element.offsetLeft;

  return { width, height, y, x };
};
