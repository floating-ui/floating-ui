import {getComputedStyle} from '@floating-ui/utils/dom';

export function isStaticPositioned(element: Element): boolean {
  return getComputedStyle(element).position === 'static';
}
