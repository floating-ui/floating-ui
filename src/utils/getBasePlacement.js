// @flow
import { type BasePlacement, type Placement, auto } from '../enums';

export default function getBasePlacement(
  placement: Placement | typeof auto
): BasePlacement {
  return (placement.split('-')[0]: any);
}
