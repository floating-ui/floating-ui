import type {Middleware, Rect, SideObject} from '../types';
import {basePlacements} from '../enums';
import {detectOverflow} from '../detectOverflow';

function getSideOffsets(overflow: SideObject, rect: Rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width,
  };
}

function isAnySideFullyClipped(overflow: SideObject) {
  return basePlacements.some((side) => overflow[side] >= 0);
}

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 */
export const hide = (): Middleware => ({
  name: 'hide',
  async fn(modifierArguments) {
    const referenceOverflow = await detectOverflow(modifierArguments, {
      elementContext: 'reference',
    });
    const floatingAltOverflow = await detectOverflow(modifierArguments, {
      altBoundary: true,
    });

    const referenceHiddenOffsets = getSideOffsets(
      referenceOverflow,
      modifierArguments.rects.reference
    );
    const escapedOffsets = getSideOffsets(
      floatingAltOverflow,
      modifierArguments.rects.floating
    );
    const referenceHidden = isAnySideFullyClipped(referenceHiddenOffsets);
    const escaped = isAnySideFullyClipped(escapedOffsets);

    return {
      data: {
        referenceHidden,
        referenceHiddenOffsets,
        escaped,
        escapedOffsets,
      },
    };
  },
});
