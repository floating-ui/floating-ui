import {
  type Coords,
  evaluate,
  getAlignment,
  getSide,
  getSideAxis,
} from '@floating-ui/utils';

import {originSides} from '../constants';
import type {Derivable, Middleware, MiddlewareState} from '../types';

type OffsetValue =
  | number
  | {
      /**
       * The axis that runs along the side of the floating element. Represents
       * the distance (gutter or margin) between the reference and floating
       * element.
       * @default 0
       */
      mainAxis?: number;
      /**
       * The axis that runs along the alignment of the floating element.
       * Represents the skidding between the reference and floating element.
       * @default 0
       */
      crossAxis?: number;
      /**
       * The same axis as `crossAxis` but applies only to aligned placements
       * and inverts the `end` alignment. When set to a number, it overrides the
       * `crossAxis` value.
       *
       * A positive number will move the floating element in the direction of
       * the opposite edge to the one that is aligned, while a negative number
       * the reverse.
       * @default null
       */
      alignmentAxis?: number | null;
    };

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.
export type OffsetOptions = OffsetValue | Derivable<OffsetValue>;

export async function convertValueToCoords(
  state: MiddlewareState,
  options: OffsetOptions,
): Promise<Coords> {
  const {placement, platform, elements} = state;
  const rtl = await platform.isRTL?.(elements.floating);

  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);

  // eslint-disable-next-line prefer-const
  let {mainAxis, crossAxis, alignmentAxis} =
    typeof rawValue === 'number'
      ? {mainAxis: rawValue, crossAxis: 0, alignmentAxis: null}
      : {
          mainAxis: rawValue.mainAxis || 0,
          crossAxis: rawValue.crossAxis || 0,
          alignmentAxis: rawValue.alignmentAxis,
        };

  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }

  return isVertical
    ? {x: crossAxis * crossAxisMulti, y: mainAxis * mainAxisMulti}
    : {x: mainAxis * mainAxisMulti, y: crossAxis * crossAxisMulti};
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
export const offset = (options: OffsetOptions = 0): Middleware => ({
  name: 'offset',
  options,
  async fn(state) {
    const {x, y, placement, middlewareData} = state;
    const diffCoords = await convertValueToCoords(state, options);

    // If the placement is the same and the arrow caused an alignment offset
    // then we don't need to change the positioning coordinates.
    if (
      placement === middlewareData.offset?.placement &&
      middlewareData.arrow?.alignmentOffset
    ) {
      return {};
    }

    return {
      x: x + diffCoords.x,
      y: y + diffCoords.y,
      data: {
        ...diffCoords,
        placement,
      },
    };
  },
});
