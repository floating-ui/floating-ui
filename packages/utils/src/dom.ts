type OverflowAncestors = Array<Element | Window | VisualViewport>;

function hasWindow() {
  return typeof window !== 'undefined';
}

export function getNodeName(node: Node | Window): string {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}

export function getWindow(node: any): typeof window {
  return node?.ownerDocument?.defaultView || window;
}

export function getDocumentElement(node: Node | Window): HTMLElement {
  return (
    (isNode(node) ? node.ownerDocument : node.document) || window.document
  )?.documentElement;
}

export function isNode(value: unknown): value is Node {
  if (!hasWindow()) {
    return false;
  }

  return value instanceof Node || value instanceof getWindow(value).Node;
}

export function isElement(value: unknown): value is Element {
  if (!hasWindow()) {
    return false;
  }

  return value instanceof Element || value instanceof getWindow(value).Element;
}

export function isHTMLElement(value: unknown): value is HTMLElement {
  if (!hasWindow()) {
    return false;
  }

  return (
    value instanceof HTMLElement ||
    value instanceof getWindow(value).HTMLElement
  );
}

export function isShadowRoot(value: unknown): value is ShadowRoot {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }

  return (
    value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot
  );
}

export function isOverflowElement(element: Element): boolean {
  const {overflow, overflowX, overflowY, display} = getComputedStyle(element);
  return (
    /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) &&
    display !== 'inline' &&
    display !== 'contents'
  );
}

export function isTableElement(element: Element): boolean {
  return /^(table|td|th)$/.test(getNodeName(element));
}

export function isTopLayer(element: Element): boolean {
  try {
    if (element.matches(':popover-open')) {
      return true;
    }
  } catch (_e) {
    // no-op
  }

  try {
    return element.matches(':modal');
  } catch (_e) {
    return false;
  }
}

const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = (value: string) => !!value && value !== 'none';
let isWebKitValue: boolean | undefined;

export function isContainingBlock(
  elementOrCss: Element | CSSStyleDeclaration,
): boolean {
  const css = isElement(elementOrCss)
    ? getComputedStyle(elementOrCss)
    : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return (
    isNotNone(css.transform) ||
    isNotNone(css.translate) ||
    isNotNone(css.scale) ||
    isNotNone(css.rotate) ||
    isNotNone(css.perspective) ||
    (!isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter))) ||
    willChangeRe.test(css.willChange || '') ||
    containRe.test(css.contain || '')
  );
}

export function getContainingBlock(element: Element): HTMLElement | null {
  let currentNode: Node | null = getParentNode(element);

  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }

    currentNode = getParentNode(currentNode);
  }

  return null;
}

export function isWebKit(): boolean {
  if (isWebKitValue == null) {
    isWebKitValue =
      typeof CSS !== 'undefined' &&
      CSS.supports &&
      CSS.supports('-webkit-backdrop-filter', 'none');
  }

  return isWebKitValue;
}

export function isLastTraversableNode(node: Node): boolean {
  return /^(html|body|#document)$/.test(getNodeName(node));
}

export function getComputedStyle(element: Element): CSSStyleDeclaration {
  return getWindow(element).getComputedStyle(element);
}

export function getNodeScroll(element: Element | Window): {
  scrollLeft: number;
  scrollTop: number;
} {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    };
  }

  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY,
  };
}

export function getParentNode(node: Node): Node {
  if (getNodeName(node) === 'html') {
    return node;
  }

  const result =
    // Step into the shadow DOM of the parent of a slotted node.
    (node as any).assignedSlot ||
    // DOM Element detected.
    node.parentNode ||
    // ShadowRoot detected.
    (isShadowRoot(node) && node.host) ||
    // Fallback.
    getDocumentElement(node);

  return isShadowRoot(result) ? result.host : result;
}

export function getNearestOverflowAncestor(node: Node): HTMLElement {
  const parentNode = getParentNode(node);

  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument
      ? node.ownerDocument.body
      : (node as Document).body;
  }

  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }

  return getNearestOverflowAncestor(parentNode);
}

export function getOverflowAncestors(
  node: Node,
  list: OverflowAncestors = [],
  traverseIframes = true,
): OverflowAncestors {
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === node.ownerDocument?.body;
  const win = getWindow(scrollableAncestor);

  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(
      win,
      win.visualViewport || [],
      isOverflowElement(scrollableAncestor) ? scrollableAncestor : [],
      frameElement && traverseIframes ? getOverflowAncestors(frameElement) : [],
    );
  } else {
    return list.concat(
      scrollableAncestor,
      getOverflowAncestors(scrollableAncestor, [], traverseIframes),
    );
  }
}

export function getFrameElement(win: Window): Element | null {
  return win.parent && Object.getPrototypeOf(win.parent)
    ? win.frameElement
    : null;
}
