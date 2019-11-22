// @flow
import getScrollParent from './getScrollParent';
import getParentNode from './getParentNode';
import getNodeName from './getNodeName';

export default function listScrollParents(
  element: Node,
  list: Array<Node> = []
): Array<Node> {
  const scrollParent = getScrollParent(element);
  const isBody = getNodeName(scrollParent) === 'BODY';
  const target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  const updatedList = list.concat(target);
  return isBody
    ? updatedList
    : updatedList.concat(listScrollParents(getParentNode(target)));
}
