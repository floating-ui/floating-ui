// @flow
import { type Variation, type Placement } from '../enums';

export default function getVariation(placement: Placement): ?Variation {
  return (placement.split('-')[1]: any);
}
