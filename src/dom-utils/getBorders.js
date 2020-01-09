// @flow
import type { SideObject } from '../types';
import getComputedStyle from './getComputedStyle';
import { isHTMLElement } from './instanceOf';

function toNumber(cssValue: string): number {
  return parseFloat(cssValue) || 0;
}

export default function getBorders(element: Element): SideObject {
  const computedStyle = isHTMLElement(element) ? getComputedStyle(element) : {};

  return {
    top: toNumber(computedStyle.borderTopWidth),
    right: toNumber(computedStyle.borderRightWidth),
    bottom: toNumber(computedStyle.borderBottomWidth),
    left: toNumber(computedStyle.borderLeftWidth),
  };
}
