import {getComputedStyle} from '@floating-ui/utils/dom';

export function isRTL(element: Element) {
  return getComputedStyle(element).direction === 'rtl';
}
