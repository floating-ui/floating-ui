// @flow
import { type BasePlacement, type Placement, auto } from '../enums';

export default (placement: Placement | typeof auto): BasePlacement =>
  (placement.split('-')[0]: any);
