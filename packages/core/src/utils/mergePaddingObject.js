// @flow
import type { SideObject } from '../types';
import getFreshSideObject from './getFreshSideObject';

export default function mergePaddingObject(
  paddingObject: $Shape<SideObject>
): SideObject {
  return {
    ...getFreshSideObject(),
    ...paddingObject,
  };
}
