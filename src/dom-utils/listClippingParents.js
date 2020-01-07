// @flow
import listOverflowParents from './listOverflowParents';

export default function listClippingParents(element: Node): Array<Element> {
  return listOverflowParents(element, 'clipping');
}
