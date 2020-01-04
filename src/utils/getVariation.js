// @flow
import { type Variation, type Placement, auto } from '../enums';

export default function getVariation(
  placement: Placement | typeof auto
): ?Variation {
  return (placement.split('-')[1]: any);
}
