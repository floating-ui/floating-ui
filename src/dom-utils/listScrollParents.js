// @flow
import getScrollParent from './getScrollParent';
import getParentNode from './getParentNode';
import getNodeName from './getNodeName';
import getWindow from './getWindow';
import type { Window } from '../types';

export default function listScrollParents(
  element: Node,
  list: Array<Element | Window> = []
): Array<Element | Window> {
  const scrollParent = getScrollParent(element);
  const isBody = getNodeName(scrollParent) === 'body';
  const target = isBody ? getWindow(scrollParent) : scrollParent;
  const updatedList = list.concat(target);

  return isBody
    ? updatedList
    : // $FlowFixMe: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)));
}
