// @flow
import getScrollParent from './getScrollParent';
import getParentNode from './getParentNode';
import getNodeName from './getNodeName';
import getWindow from './getWindow';

export default function listScrollParents(
  element: Node,
  list: Array<Element> = []
): Array<Element> {
  const scrollParent = getScrollParent(element);
  const isBody = getNodeName(scrollParent) === 'body';
  const target = isBody ? getWindow(scrollParent) : scrollParent;
  const updatedList = list.concat(target);
  return isBody
    ? updatedList
    : updatedList.concat(listScrollParents(getParentNode(target)));
}
