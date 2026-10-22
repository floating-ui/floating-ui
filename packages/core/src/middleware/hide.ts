import type {Rect, SideObject} from '@floating-ui/utils';
import {evaluate, sides} from '@floating-ui/utils';

import type {DetectOverflowOptions} from '../detectOverflow';
import type {Derivable, Middleware} from '../types';

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
  strategy?: 'referenceHidden' | 'escaped' | undefined;
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
  async fn(state) {
    const {rects, platform} = state;

    const {strategy = 'referenceHidden', ...detectOverflowOptions} = evaluate(
      options,
      state,
    );

    const escaped = strategy === 'escaped';
    const overflow = await platform.detectOverflow(state, {
      ...detectOverflowOptions,
      ...(escaped ? {altBoundary: true} : {elementContext: 'reference'}),
    });
    const offsets = getSideOffsets(
      overflow,
      escaped ? rects.floating : rects.reference,
    );

    return {
      data: {
        [`${strategy}Offsets`]: offsets,
        [strategy]: isAnySideFullyClipped(offsets),
      },
    };
  },
});
