import {evaluate, getSideAxis} from '../utils';
import type {
  Derivable,
  Middleware,
  MiddlewareState,
  MiddlewareReturn,
  Coords,
} from '../types';

export type OffsetOptions =
  | number
  | {
      /**
       * How far to translate the floating element along the side axis (distance).
       * @default 0
       */
      side?: number;
      /**
       * How far to translate the floating element along the align axis (skidding).
       * @default 0
       */
      align?: number;
    };

export function* offsetGen(
  state: MiddlewareState,
  options: OffsetOptions | Derivable<OffsetOptions> = 0,
): Generator<any, MiddlewareReturn, any> {
  const {platform, elements, x, y, middlewareData, side, align} = state;

  const rtl = yield platform.isRTL?.(elements.floating);

  const isVertical = getSideAxis(side) === 'y';
  const sideAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
  const alignAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);

  const {side: sideOffset, align: alignOffset} =
    typeof rawValue === 'number'
      ? {side: rawValue, align: 0}
      : {side: rawValue.side || 0, align: rawValue.align || 0};

  const diffCoords: Coords = isVertical
    ? {x: alignOffset * alignAxisMulti, y: sideOffset * sideAxisMulti}
    : {x: sideOffset * sideAxisMulti, y: alignOffset * alignAxisMulti};

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
