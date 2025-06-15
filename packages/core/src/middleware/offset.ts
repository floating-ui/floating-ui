import {type Coords, evaluate, getSideAxis} from '../utils';
import type {
  Derivable,
  Middleware,
  MiddlewareState,
  MiddlewareReturn,
} from '../types';

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
       * The axis that runs along the align of the floating element.
       * Represents the skidding between the reference and floating element.
       * @default 0
       */
      crossAxis?: number;
      /**
       * The same axis as `crossAxis` but applies only to aligned placements
       * and inverts the `end` align. When set to a number, it overrides the
       * `crossAxis` value.
       *
       * A positive number will move the floating element in the direction of
       * the opposite edge to the one that is aligned, while a negative number
       * the reverse.
       * @default null
       */
      alignAxis?: number | null;
    };

export type OffsetOptions = OffsetValue | Derivable<OffsetValue>;

export function* offsetGen(
  state: MiddlewareState,
  options: OffsetOptions = 0,
): Generator<any, MiddlewareReturn, any> {
  const {platform, elements, x, y, middlewareData, side, align} = state;

  const rtl = yield platform.isRTL?.(elements.floating);

  const isVertical = getSideAxis(side) === 'y';
  const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);

  // eslint-disable-next-line prefer-const
  let {mainAxis, crossAxis, alignAxis} =
    typeof rawValue === 'number'
      ? {mainAxis: rawValue, crossAxis: 0, alignAxis: null}
      : {
          mainAxis: rawValue.mainAxis ?? 0,
          crossAxis: rawValue.crossAxis ?? 0,
          alignAxis: rawValue.alignAxis ?? null,
        };

  if (align !== 'center' && typeof alignAxis === 'number') {
    crossAxis = align === 'end' ? -alignAxis : alignAxis;
  }

  const diffCoords: Coords = isVertical
    ? {x: crossAxis * crossAxisMulti, y: mainAxis * mainAxisMulti}
    : {x: mainAxis * mainAxisMulti, y: crossAxis * crossAxisMulti};

  const offsetPlacement = middlewareData.offset?.placement;

  // if the same placement + arrow align offset, no change
  if (
    offsetPlacement?.side === side &&
    offsetPlacement.align === align &&
    middlewareData.arrow?.alignOffset
  ) {
    return {};
  }

  return {
    x: x + diffCoords.x,
    y: y + diffCoords.y,
    data: {
      ...diffCoords,
      placement: {
        side,
        align,
      },
    },
  };
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
  fn(state) {
    return offsetGen(state, options);
  },
});
