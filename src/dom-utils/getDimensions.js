// @flow
import type { Dimensions } from '../types';
import getBoundingClientRect from './getBoundingClientRect';

export default function getDimensions(element: HTMLElement): Dimensions {
  const clientRect = getBoundingClientRect(element);
  return {
    width: clientRect.width,
    height: clientRect.height,
  };
}
