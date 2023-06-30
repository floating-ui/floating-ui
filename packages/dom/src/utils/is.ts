import {getComputedStyle} from './getComputedStyle';
import {getWindow} from './getWindow';
import {getNodeName} from './node';

declare global {
  interface Window {
    HTMLElement: any;
    Element: any;
    Node: any;
    ShadowRoot: any;
  }
}

export function isHTMLElement(value: any): value is HTMLElement {
  return value instanceof getWindow(value).HTMLElement;
}

export function isShadowRoot(node: Node): node is ShadowRoot {
  // Browsers without `ShadowRoot` support.
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  return (
    node instanceof getWindow(node).ShadowRoot || node instanceof ShadowRoot
  );
}

export function isOverflowElement(element: Element): boolean {
  const {overflow, overflowX, overflowY, display} = getComputedStyle(element);
  return (
    /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) &&
    !['inline', 'contents'].includes(display)
  );
}

export function isTableElement(element: Element): boolean {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}

export function isContainingBlock(element: Element): boolean {
  const safari = isSafari();
  const css = getComputedStyle(element);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return (
    css.transform !== 'none' ||
    css.perspective !== 'none' ||
    (css.containerType ? css.containerType !== 'normal' : false) ||
    (!safari && (css.backdropFilter ? css.backdropFilter !== 'none' : false)) ||
    (!safari && (css.filter ? css.filter !== 'none' : false)) ||
    ['transform', 'perspective', 'filter'].some((value) =>
      (css.willChange || '').includes(value)
    ) ||
    ['paint', 'layout', 'strict', 'content'].some((value) =>
      (css.contain || '').includes(value)
    )
  );
}

export function isSafari(): boolean {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}

export function isLastTraversableNode(node: Node) {
  return ['html', 'body', '#document'].includes(getNodeName(node));
}
