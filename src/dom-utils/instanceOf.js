// @flow
import getWindow from './getWindow';

/*:: declare function isElement(node: mixed): boolean %checks(node instanceof
  Element); */

function isElement(node) {
  const OwnElement = getWindow(node).Element;
  return node instanceof OwnElement;
}

/*:: declare function isHTMLElement(node: mixed): boolean %checks(node instanceof
  HTMLElement); */

function isHTMLElement(node) {
  const OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement;
}

/*:: declare function isShadowRoot(node: mixed): boolean %checks(node instanceof
  ShadowRoot); */

function isShadowRoot(node) {
  const OwnElement = getWindow(node).ShadowRoot;
  return OwnElement ? node instanceof OwnElement : false;
}

export { isElement, isHTMLElement, isShadowRoot };
