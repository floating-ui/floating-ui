// @flow
import getNodeName from './getNodeName';

export default (element: Element): boolean =>
  ['table', 'td', 'th'].includes(getNodeName(element));
