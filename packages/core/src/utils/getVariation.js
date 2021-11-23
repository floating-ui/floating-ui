// @flow
import type { Variation, Placement, AutoPlacement } from '../enums';

export default function getVariation(
  placement: Placement | AutoPlacement
): ?Variation {
  return (placement.split('-')[1]: any);
}
