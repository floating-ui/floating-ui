// @flow
import getOverflowParent from './getOverflowParent';
import getParentNode from './getParentNode';
import getNodeName from './getNodeName';
import getWindow from './getWindow';

export default function listOverflowParents(
  element: Node,
  type: 'scroll' | 'clipping' = 'scroll',
  list: Array<Element> = []
): Array<Element> {
  const scrollParent = getOverflowParent(element, type);
  const isBody = getNodeName(scrollParent) === 'body';
  const target = isBody ? getWindow(scrollParent) : scrollParent;
  const updatedList = list.concat(target);

  return isBody
    ? updatedList
    : updatedList.concat(listOverflowParents(getParentNode(target), type));
}
