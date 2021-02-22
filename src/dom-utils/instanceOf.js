// @flow
import getWindow from './getWindow';

/*:: declare function isElement(node: mixed): boolean %checks(node instanceof
  Element); */

function isElement(node) {
  const OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

/*:: declare function isHTMLElement(node: mixed): boolean %checks(node instanceof
  HTMLElement); */

function isHTMLElement(node) {
  const OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

/*:: declare function isShadowRoot(node: mixed): boolean %checks(node instanceof
  ShadowRoot); */

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }
  const OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

export { isElement, isHTMLElement, isShadowRoot };
