// @flow
import getNodeName from './getNodeName';

export default function isTableElement(element: Element): boolean {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}
