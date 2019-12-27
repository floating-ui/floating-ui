// @flow
import type { SideObject } from '../types';
import getFreshSideObject from './getFreshSideObject';

export default (paddingObject: $Shape<SideObject>): SideObject => ({
  ...getFreshSideObject(),
  ...paddingObject,
});
