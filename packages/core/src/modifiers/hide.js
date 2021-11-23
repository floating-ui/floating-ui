// @flow
import type { Modifier, ModifierArguments, Rect, SideObject } from '../types';
import { top, bottom, left, right } from '../enums';
import detectOverflow from '../utils/detectOverflow';

function getSideOffsets(overflow: SideObject, rect: Rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width,
  };
}

function isAnySideFullyClipped(overflow: SideObject) {
  return [top, right, bottom, left].some((side) => overflow[side] >= 0);
}

export const hide = (): Modifier => ({
  name: 'hide',
  async fn(modifierArguments: ModifierArguments) {
    const { rects } = modifierArguments;
    const referenceRect = rects.reference;
    const popperRect = rects.popper;

    const referenceOverflow = await detectOverflow(modifierArguments, {
      elementContext: 'reference',
    });
    const popperAltOverflow = await detectOverflow(modifierArguments, {
      altBoundary: true,
    });

    const referenceClippingOffsets = getSideOffsets(
      referenceOverflow,
      referenceRect
    );
    const popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect);
    const isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    const hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);

    return {
      data: {
        referenceClippingOffsets,
        popperEscapeOffsets,
        isReferenceHidden,
        hasPopperEscaped,
      },
    };
  },
});
