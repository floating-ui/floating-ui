// @flow
import { type VariationPlacement, type Placement, typeof auto } from '../enums';

export default (placement: Placement | auto): ?VariationPlacement =>
  (placement.split('-')[1]: any);
