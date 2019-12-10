// @flow
import type { ModifierArguments, Modifier } from '../types';
import { top, bottom, left, right } from '../enums';

type ModifierData = {
  top: number,
  bottom: number,
  right: number,
  left: number,
};

type Options = {
  detectOverflowName: string,
};

const isAnySideFullyClipped = (overflow: ModifierData): boolean =>
  [top, right, bottom, left].some(side => overflow[side] >= 0);

export function hide({ state, name, options }: ModifierArguments<Options>) {
  const { detectOverflowName = 'detectOverflow#hide' } = options;

  const reference = state.measures.reference;
  const overflow = state.modifiersData[detectOverflowName].clippingArea;

  const referenceClippingOffsets = {
    top: overflow.top - reference.height,
    right: overflow.right - reference.width,
    bottom: overflow.bottom - reference.height,
    left: overflow.left - reference.width,
  };

  const isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);

  state.modifiersData[name] = {
    referenceClippingOffsets,
    isReferenceHidden,
  };

  state.attributes.popper = {
    ...state.attributes.popper,
    'data-popper-reference-hidden': isReferenceHidden,
  };

  return state;
}

export default ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  fn: hide,
}: Modifier<Options>);
