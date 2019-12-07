// @flow
import { type VariationPlacement, type Placement, auto } from '../enums';

export default (placement: Placement | typeof auto): ?VariationPlacement =>
  (placement.split('-')[1]: any);
