// @flow
import type { ModifierArguments, Modifier, Rect, Options } from '../types';
import { top, bottom, left, right } from '../enums';

type ModifierData = {
  top: number,
  bottom: number,
  right: number,
  left: number,
};

const getOffsets = (
  overflow: ModifierData,
  rect: Rect,
  preventedOffsets: { x: number, y: number } = { x: 0, y: 0 }
): ModifierData => ({
  top: overflow.top - rect.height - preventedOffsets.y,
  right: overflow.right - rect.width + preventedOffsets.x,
  bottom: overflow.bottom - rect.height + preventedOffsets.y,
  left: overflow.left - rect.width - preventedOffsets.x,
});

const isAnySideFullyClipped = (overflow: ModifierData): boolean =>
  [top, right, bottom, left].some(side => overflow[side] >= 0);

export function hide({ state, name }: ModifierArguments<Options>) {
  const referenceRect = state.measures.reference;
  const popperRect = state.measures.popper;
  const overflow = state.modifiersData.detectOverflowReference.clippingArea;
  const altOverflow = state.modifiersData.detectOverflowAlt.clippingArea;
  const preventedOffsets = state.modifiersData.preventOverflow;

  const referenceClippingOffsets = getOffsets(overflow, referenceRect);
  const popperEscapeOffsets = getOffsets(
    altOverflow,
    popperRect,
    preventedOffsets
  );

  const isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  const hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);

  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped,
  };

  state.attributes.popper = {
    ...state.attributes.popper,
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped,
  };

  return state;
}

export default ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requires: ['detectOverflowReference', 'detectOverflowAlt'],
  optionallyRequires: ['preventOverflow'],
  fn: hide,
}: Modifier<Options>);
