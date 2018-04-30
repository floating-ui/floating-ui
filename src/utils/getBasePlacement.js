// @flow
import { type BasePlacement, type Placement, typeof auto } from '../enums';

export default (placement: Placement | auto): BasePlacement =>
  (placement.split('-')[0]: any);
