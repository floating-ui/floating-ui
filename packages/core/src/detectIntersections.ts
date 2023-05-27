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
   * The obstacle rects or area in which intersection will be checked.
   * @default []
   */
  obstacles: Array<ClientRectObject>;

  /**
   * Virtual padding for the resolved intersection detection offsets.
   * @default 0
   */
  padding: Padding;
}

/**
 * Resolves with an array of intersection values for each intersecting
 * obstacle.
 * @see https://floating-ui.com/docs/detectIntersections
 */
export async function detectIntersections(
  state: MiddlewareState,
  options: Partial<Options> = {}
): Promise<Array<Coords & {xSide: Side; ySide: Side}>> {
  const {x, y, platform, rects, elements, strategy} = state;
  const {obstacles = [], padding = 0} = options;

  const paddingObject = getSideObjectFromPadding(padding);
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

  return obstacles
    .filter(
      (rect) =>
        rect.x !== elementClientRect.x &&
        rect.y !== elementClientRect.y &&
        rect.width !== elementClientRect.width &&
        rect.height !== elementClientRect.height &&
        getIsIntersecting(rect)
    )
    .map((obstacleClientRect) => {
      const xSide: Side =
        elementClientRect.left + elementClientRect.width / 2 <
        obstacleClientRect.left + obstacleClientRect.width / 2
          ? 'left'
          : 'right';
      const ySide: Side =
        elementClientRect.top + elementClientRect.height / 2 <
        obstacleClientRect.top + obstacleClientRect.height / 2
          ? 'top'
          : 'bottom';

      const leftOp =
        xSide === 'right'
          ? elementClientRect.left < obstacleClientRect.left
          : elementClientRect.left > obstacleClientRect.left;
      const rightOp =
        xSide === 'right'
          ? elementClientRect.right > obstacleClientRect.right
          : elementClientRect.right < obstacleClientRect.right;
      const topOp =
        ySide === 'bottom'
          ? elementClientRect.top < obstacleClientRect.top
          : elementClientRect.top > obstacleClientRect.top;
      const bottomOp =
        ySide === 'bottom'
          ? elementClientRect.bottom > obstacleClientRect.bottom
          : elementClientRect.bottom < obstacleClientRect.bottom;

      const left = leftOp
        ? min(elementClientRect.left, obstacleClientRect.left)
        : max(elementClientRect.left, obstacleClientRect.left);
      const right = rightOp
        ? min(elementClientRect.right, obstacleClientRect.right)
        : max(elementClientRect.right, obstacleClientRect.right);
      const top = topOp
        ? min(elementClientRect.top, obstacleClientRect.top)
        : max(elementClientRect.top, obstacleClientRect.top);
      const bottom = bottomOp
        ? min(elementClientRect.bottom, obstacleClientRect.bottom)
        : max(elementClientRect.bottom, obstacleClientRect.bottom);

      return {
        x: right - left,
        y: bottom - top,
        xSide,
        ySide,
      };
    });
}
