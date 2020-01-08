// @flow
import getParentNode from './getParentNode';
import getComputedStyle from './getComputedStyle';
import getNodeName from './getNodeName';
import { isHTMLElement } from './instanceOf';

export default function getOverflowParent(
  node: Node,
  type: 'scroll' | 'clipping' = 'scroll'
): HTMLElement {
  if (['html', 'body', '#document'].includes(getNodeName(node))) {
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node)) {
    // Firefox wants us to check `-x` and `-y` variations as well
    const { overflow, overflowX, overflowY } = getComputedStyle(node);
    const re = type === 'scroll' ? /visible|hidden/ : /visible/;
    const str = overflow + overflowY + overflowX;

    if (str !== '' && !re.test(str)) {
      return node;
    }
  }

  return getOverflowParent(getParentNode(node), type);
}
