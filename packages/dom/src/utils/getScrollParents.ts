import {getScrollParent} from './getScrollParent';
import {getParentNode} from './getParentNode';
import {getWindow} from './window';
import {isScrollParent} from './is';

export function getScrollParents(
  node: Node,
  list: Array<Element | Window> = []
): Array<Element | Window | VisualViewport> {
  const scrollParent = getScrollParent(node);
  const isBody = scrollParent === node.ownerDocument?.body;
  const win = getWindow(scrollParent);
  const target = isBody
    ? ([win] as any).concat(
        win.visualViewport || [],
        isScrollParent(scrollParent) ? scrollParent : []
      )
    : scrollParent;
  const updatedList = list.concat(target);

  return isBody
    ? updatedList
    : // @ts-ignore: isBody tells us target will be an HTMLElement here
      updatedList.concat(getScrollParents(getParentNode(target)));
}
