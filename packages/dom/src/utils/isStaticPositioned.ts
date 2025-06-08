import {getComputedStyle} from '../utils';

export function isStaticPositioned(element: Element): boolean {
  return getComputedStyle(element).position === 'static';
}
