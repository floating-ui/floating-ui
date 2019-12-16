// @flow
import type { ModifierArguments, Modifier, Rect } from '../types';
import { top, bottom, left, right, clippingParents, reference } from '../enums';
import detectOverflow from './detectOverflow';

type Options = {
  detectOverflowReference: string,
  detectOverflowAltArea: string,
};

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

const defaultDetectOverflowReference = 'detectOverflow:hide:reference';
const defaultDetectOverflowAltArea = 'detectOverflow:hide:altArea';

function hide({ state, name, options }: ModifierArguments<Options>) {
  const {
    detectOverflowReference = defaultDetectOverflowReference,
    detectOverflowAltArea = defaultDetectOverflowAltArea,
  } = options;

  const referenceRect = state.measures.reference;
  const popperRect = state.measures.popper;
  const overflow = state.modifiersData[detectOverflowReference].overflowOffsets;
  const altOverflow =
    state.modifiersData[detectOverflowAltArea].overflowOffsets;
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

const hideModifier = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  optionallyRequires: ['preventOverflow'],
  fn: hide,
}: Modifier<Options>);

// eslint-disable-next-line import/no-unused-modules
export default hideModifier;

// eslint-disable-next-line import/no-unused-modules
export const preconfiguredHide = [
  {
    ...detectOverflow,
    name: defaultDetectOverflowReference,
    options: {
      area: clippingParents,
      elementContext: reference,
    },
  },
  {
    ...detectOverflow,
    name: defaultDetectOverflowAltArea,
    options: {
      area: clippingParents,
      altArea: true,
    },
  },
  {
    ...hideModifier,
    requires: [defaultDetectOverflowReference, defaultDetectOverflowAltArea],
  },
];
