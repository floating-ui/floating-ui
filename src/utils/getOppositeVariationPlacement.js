// @flow
import type { Placement } from '../enums';

const hash = { start: 'end', end: 'start' };

export default (placement: Placement): Placement =>
  (placement.replace(/start|end/g, matched => hash[matched]): any);
