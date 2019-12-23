// @flow
import { type Variation, type Placement, auto } from '../enums';

export default (placement: Placement | typeof auto): ?Variation =>
  (placement.split('-')[1]: any);
