// @flow
import type { BasePlacement, Placement } from '../enums';

export default (placement: Placement): BasePlacement =>
  (placement.split('-')[0]: any);
