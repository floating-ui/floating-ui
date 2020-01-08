// @flow
import listOverflowParents from './listOverflowParents';

export default function listScrollParents(element: Node): Array<Element> {
  return listOverflowParents(element, 'scroll');
}
