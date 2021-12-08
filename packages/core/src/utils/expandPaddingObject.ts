import {SideObject} from '../types';

export function expandPaddingObject(padding: Partial<SideObject>): SideObject {
  return {top: 0, right: 0, bottom: 0, left: 0, ...padding};
}
