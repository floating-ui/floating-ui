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
 * A data provider that allows you to hide the floating element in applicable
 * situations, usually when it’s not within the same clipping context as the
 * reference element.
 * @see https://floating-ui.com/docs/hide
 */
export const hide = (
  options: Partial<Options & DetectOverflowOptions> = {}
): Middleware => ({
  name: 'hide',
  options,
  async fn(middlewareArguments) {
    const {strategy = 'referenceHidden', ...detectOverflowOptions} = options;
    const {rects} = middlewareArguments;

    switch (strategy) {
      case 'referenceHidden': {
        const overflow = await detectOverflow(middlewareArguments, {
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
        const overflow = await detectOverflow(middlewareArguments, {
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
