// @flow
import type { ModifierArguments, Modifier, Options } from '../types';
import { top, bottom, left, right } from '../enums';

type ModifierData = {
  top: number,
  bottom: number,
  right: number,
  left: number,
};

const isAnySideFullyClipped = (overflow: ModifierData): boolean =>
  [top, right, bottom, left].some(side => overflow[side] >= 0);

export function hide({ state, name }: ModifierArguments<Options>) {
  const reference = state.measures.reference;
  const overflow = state.modifiersData.detectOverflowHide.clippingArea;

  const referenceClippingOffsets = {
    top: overflow.top - reference.height,
    right: overflow.right - reference.width,
    bottom: overflow.bottom - reference.height,
    left: overflow.left - reference.width,
  };

  const isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);

  state.modifiersData[name] = {
    referenceClippingOffsets,
    isReferenceHidden: isAnySideFullyClipped(referenceClippingOffsets),
  };

  return state;
}

export default ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requires: ['detectOverflowHide'],
  fn: hide,
}: Modifier<Options>);
