// @flow
import type { Placement } from '../enums';

const hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };

export default (placement: Placement): Placement =>
  (placement.replace(/left|right|bottom|top/g, matched => hash[matched]): any);
