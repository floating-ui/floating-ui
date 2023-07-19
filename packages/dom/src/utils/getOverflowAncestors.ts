import {getWindow, isOverflowElement} from '@floating-ui/utils/dom';

import {getNearestOverflowAncestor} from './getNearestOverflowAncestor';

type OverflowAncestors = Array<Element | Window | VisualViewport>;

export function getOverflowAncestors(
  node: Node,
  list: OverflowAncestors = []
): OverflowAncestors {
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === node.ownerDocument?.body;
  const win = getWindow(scrollableAncestor);

  if (isBody) {
    return list.concat(
      win,
      win.visualViewport || [],
      isOverflowElement(scrollableAncestor) ? scrollableAncestor : []
    );
  }

  return list.concat(
    scrollableAncestor,
    getOverflowAncestors(scrollableAncestor)
  );
}
