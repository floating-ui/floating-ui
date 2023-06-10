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

  const elementTop = elementClientRect.top - paddingObject.top;
  const elementLeft = elementClientRect.left - paddingObject.left;
  const elementBottom = elementClientRect.bottom + paddingObject.bottom;
  const elementRight = elementClientRect.right + paddingObject.right;
  const elementWidth = elementClientRect.width;
  const elementHeight = elementClientRect.height;

  function getIsIntersecting(clientRect: ClientRectObject) {
    const {top, left, bottom, right} = clientRect;
    return (
      elementTop < bottom &&
      elementBottom > top &&
      elementLeft < right &&
      elementRight > left
    );
  }

  return obstacles
    .filter(
      (rect) =>
        !(
          rect.x === elementClientRect.x &&
          rect.y === elementClientRect.y &&
          rect.width === elementClientRect.width &&
          rect.height === elementClientRect.height
        ) && getIsIntersecting(rect)
    )
    .map((obstacleClientRect) => {
      const obstacleTop = obstacleClientRect.top;
      const obstacleLeft = obstacleClientRect.left;
      const obstacleBottom = obstacleClientRect.bottom;
      const obstacleRight = obstacleClientRect.right;
      const obstacleWidth = obstacleClientRect.width;
      const obstacleHeight = obstacleClientRect.height;

      const xSide: Side =
        elementLeft + elementWidth / 2 < obstacleLeft + obstacleWidth / 2
          ? 'left'
          : 'right';
      const ySide: Side =
        elementTop + elementHeight / 2 < obstacleTop + obstacleHeight / 2
          ? 'top'
          : 'bottom';

      const leftOp =
        xSide === 'right'
          ? elementLeft < obstacleLeft
          : elementLeft > obstacleLeft;
      const rightOp =
        xSide === 'right'
          ? elementRight > obstacleRight
          : elementRight < obstacleRight;
      const topOp =
        ySide === 'bottom'
          ? elementTop < obstacleTop
          : elementTop > obstacleTop;
      const bottomOp =
        ySide === 'bottom'
          ? elementBottom > obstacleBottom
          : elementBottom < obstacleBottom;

      const left = leftOp
        ? min(elementLeft, obstacleLeft)
        : max(elementLeft, obstacleLeft);
      const right = rightOp
        ? min(elementRight, obstacleRight)
        : max(elementRight, obstacleRight);
      const top = topOp
        ? min(elementTop, obstacleTop)
        : max(elementTop, obstacleTop);
      const bottom = bottomOp
        ? min(elementBottom, obstacleBottom)
        : max(elementBottom, obstacleBottom);

      return {
        x: right - left,
        y: bottom - top,
        xSide,
        ySide,
      };
    });
}
