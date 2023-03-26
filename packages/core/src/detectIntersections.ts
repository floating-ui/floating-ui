import type {
  ClientRectObject,
  Coords,
  MiddlewareState,
  Padding,
  Side,
} from './types';
import {getSideObjectFromPadding} from './utils/getPaddingObject';
import {max, min} from './utils/math';
import {rectToClientRect} from './utils/rectToClientRect';

export interface Options {
  /**
   * The collidable rects or area in which intersection will be checked.
   * @default []
   */
  collidables: Array<ClientRectObject>;

  /**
   * Virtual padding for the resolved intersection detection offsets.
   * @default 0
   */
  padding: Padding;
}

/**
 * Resolves with an array of intersection values for each intersecting
 * collidable.
 * @see https://floating-ui.com/docs/detectIntersections
 */
export async function detectIntersections(
  state: MiddlewareState,
  options: Partial<Options> = {}
): Promise<Array<Coords & {xDirection: Side; yDirection: Side}>> {
  const {x, y, platform, rects, elements, strategy} = state;
  const {collidables = [], padding = 0} = options;

  const paddingObject = getSideObjectFromPadding(padding);
  const element = elements.floating;

  const rect = {...rects.floating, x, y};
  const offsetParent = await platform.getOffsetParent?.(elements.floating);

  const elementClientRect = rectToClientRect(
    platform.convertOffsetParentRelativeRectToViewportRelativeRect
      ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
          rect,
          offsetParent,
          strategy,
        })
      : rect
  );

  function getIsIntersecting(clientRect: ClientRectObject) {
    const {top, left, bottom, right} = clientRect;
    return (
      elementClientRect.top - paddingObject.top < bottom &&
      elementClientRect.bottom + paddingObject.bottom > top &&
      elementClientRect.left - paddingObject.left < right &&
      elementClientRect.right + paddingObject.right > left
    );
  }

  const collidablesExclusive = collidables.filter((el) => el !== element);
  const intersectingCollidables =
    collidablesExclusive.filter(getIsIntersecting);

  return intersectingCollidables.map((collidableClientRect) => {
    const xDirection: Side =
      elementClientRect.left + elementClientRect.width / 2 <
      collidableClientRect.left + collidableClientRect.width / 2
        ? 'left'
        : 'right';
    const yDirection: Side =
      elementClientRect.top + elementClientRect.height / 2 <
      collidableClientRect.top + collidableClientRect.height / 2
        ? 'top'
        : 'bottom';

    const leftOp =
      xDirection === 'right'
        ? elementClientRect.left < collidableClientRect.left
        : elementClientRect.left > collidableClientRect.left;
    const rightOp =
      xDirection === 'right'
        ? elementClientRect.right > collidableClientRect.right
        : elementClientRect.right < collidableClientRect.right;
    const topOp =
      yDirection === 'bottom'
        ? elementClientRect.top < collidableClientRect.top
        : elementClientRect.top > collidableClientRect.top;
    const bottomOp =
      yDirection === 'bottom'
        ? elementClientRect.bottom > collidableClientRect.bottom
        : elementClientRect.bottom < collidableClientRect.bottom;

    const left = leftOp
      ? min(elementClientRect.left, collidableClientRect.left)
      : max(elementClientRect.left, collidableClientRect.left);
    const right = rightOp
      ? min(elementClientRect.right, collidableClientRect.right)
      : max(elementClientRect.right, collidableClientRect.right);
    const top = topOp
      ? min(elementClientRect.top, collidableClientRect.top)
      : max(elementClientRect.top, collidableClientRect.top);
    const bottom = bottomOp
      ? min(elementClientRect.bottom, collidableClientRect.bottom)
      : max(elementClientRect.bottom, collidableClientRect.bottom);

    return {
      x: right - left,
      y: bottom - top,
      xDirection,
      yDirection,
    };
  });
}
