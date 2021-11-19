// @flow
import type { Window } from '../types';

export default function getNodeName(element: ?Node | Window): ?string {
  return element ? (element.nodeName || '').toLowerCase() : null;
}
