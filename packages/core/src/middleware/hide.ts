import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';
import {sides} from '../enums';
import type {Middleware, Rect, SideObject} from '../types';

function getSideOffsets(overflow: SideObject, rect: Rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width,
  };
}

function isAnySideFullyClipped(overflow: SideObject) {
  return sides.some((side) => overflow[side] >= 0);
}

export interface Options {
  /**
   * The strategy used to determine when to hide the floating element.
   */
  strategy: 'referenceHidden' | 'escaped';
}

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
export const hide = (
  options: Partial<Options & DetectOverflowOptions> = {}
): Middleware => ({
  name: 'hide',
  options,
  async fn(state) {
    const {strategy = 'referenceHidden', ...detectOverflowOptions} = options;
    const {rects} = state;

    switch (strategy) {
      case 'referenceHidden': {
        const overflow = await detectOverflow(state, {
          ...detectOverflowOptions,
          elementContext: 'reference',
        });
        const offsets = getSideOffsets(overflow, rects.reference);
        return {
          data: {
            referenceHiddenOffsets: offsets,
            referenceHidden: isAnySideFullyClipped(offsets),
          },
        };
      }
      case 'escaped': {
        const overflow = await detectOverflow(state, {
          ...detectOverflowOptions,
          altBoundary: true,
        });
        const offsets = getSideOffsets(overflow, rects.floating);
        return {
          data: {
            escapedOffsets: offsets,
            escaped: isAnySideFullyClipped(offsets),
          },
        };
      }
      default: {
        return {};
      }
    }
  },
});
