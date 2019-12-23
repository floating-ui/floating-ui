// @flow
import getComputedStyle from './getComputedStyle';
import { isHTMLElement } from './instanceOf';

type Borders = {
  top: number,
  right: number,
  bottom: number,
  left: number,
};

const toNumber = (cssValue: string): number => parseFloat(cssValue) || 0;

export default (element: Element): Borders => {
  const computedStyle = isHTMLElement(element) ? getComputedStyle(element) : {};
  return {
    top: toNumber(computedStyle.borderTop),
    right: toNumber(computedStyle.borderRight),
    bottom: toNumber(computedStyle.borderBottom),
    left: toNumber(computedStyle.borderLeft),
  };
};
