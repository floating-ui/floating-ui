import {evaluate, sides} from '../utils';
import type {DetectOverflowOptions} from '../detectOverflow';
import {detectOverflow} from '../detectOverflow';
import type {
  Derivable,
  Middleware,
  MiddlewareState,
  MiddlewareReturn,
  Rect,
  SideObject,
} from '../types';

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

export interface HideOptions extends DetectOverflowOptions {
  /**
   * The strategy used to determine when to hide the floating element.
   */
  strategy?: 'reference-hidden' | 'escaped';
}

export function* hideGen(
  state: MiddlewareState,
  options: HideOptions | Derivable<HideOptions> = {},
): Generator<any, MiddlewareReturn, any> {
  const {rects} = state;

  const {strategy = 'reference-hidden', ...detectOverflowOptions} = evaluate(
    options,
    state,
  );

  switch (strategy) {
    case 'reference-hidden': {
      const overflow = yield* detectOverflow(state, {
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
      const overflow = yield* detectOverflow(state, {
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
}

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
export const hide = (
  options: HideOptions | Derivable<HideOptions> = {},
): Middleware => ({
  name: 'hide',
  options,
  fn(state) {
    return hideGen(state, options);
  },
});
