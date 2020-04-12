// @flow
import getScrollParent from './getScrollParent';
import getParentNode from './getParentNode';
import getNodeName from './getNodeName';
import getWindow from './getWindow';
import type { Window, VisualViewport } from '../types';

export default function listScrollParents(
  element: Node,
  list: Array<Element | Window> = []
): Array<Element | Window | VisualViewport> {
  const scrollParent = getScrollParent(element);
  const isBody = getNodeName(scrollParent) === 'body';
  const win = getWindow(scrollParent);
  const target = isBody ? [win].concat(win.visualViewport || []) : scrollParent;
  const updatedList = list.concat(target);

  return isBody
    ? updatedList
    : // $FlowFixMe: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)));
}
