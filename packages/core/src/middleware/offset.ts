import {evaluate, getSideAxis} from '../utils';
import type {
  Middleware,
  MiddlewareState,
  MiddlewareReturn,
  Coords,
  Derivable,
} from '../types';
import {originSides} from '../constants';

export type OffsetOptions =
  | number
  | {
      /**
       * The axis that runs along the side of the floating element. Represents
       * the distance (gutter or margin) between the reference and floating
       * element.
       * @default 0
       */
      sideAxis?: number;
      /**
       * The axis that runs along the align of the floating element.
       * Represents the skidding between the reference and floating element.
       * @default 0
       */
      alignAxis?: number;
    };

export function* offsetGen(
  state: MiddlewareState,
  options: OffsetOptions | Derivable<OffsetOptions> = 0,
): Generator<any, MiddlewareReturn, any> {
  const {platform, elements, x, y, middlewareData, side, align} = state;

  const rtl = yield platform.isRTL?.(elements.floating);

  const isVertical = getSideAxis(side) === 'y';
  const sideAxisMulti = originSides.has(side) ? -1 : 1;
  const alignAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);

  // eslint-disable-next-line prefer-const
  let {sideAxis, alignAxis} =
    typeof rawValue === 'number'
      ? {sideAxis: rawValue, alignAxis: 0}
      : {sideAxis: rawValue.sideAxis ?? 0, alignAxis: rawValue.alignAxis ?? 0};

  if (align !== 'center' && typeof alignAxis === 'number') {
    alignAxis = align === 'end' ? -alignAxis : alignAxis;
  }

  const diffCoords: Coords = isVertical
    ? {x: alignAxis * alignAxisMulti, y: sideAxis * sideAxisMulti}
    : {x: sideAxis * sideAxisMulti, y: alignAxis * alignAxisMulti};

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
 * A number (shorthand for `sideAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
export const offset = (
  options: OffsetOptions | Derivable<OffsetOptions> = 0,
): Middleware => ({
  name: 'offset',
  options,
  fn(state) {
    return offsetGen(state, options);
  },
});
