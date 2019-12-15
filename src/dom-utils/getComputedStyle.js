// @flow
import getWindow from './getWindow';

export default function getComputedStyle(
  element: Element
): CSSStyleDeclaration {
  return getWindow(element).getComputedStyle(element);
}
