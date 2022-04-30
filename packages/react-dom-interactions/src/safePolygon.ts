import type {Side} from '@floating-ui/core';
import type {FloatingContext, FloatingTreeType, ReferenceType} from './types';
import {isElement} from './utils/is';
import {getChildren} from './utils/getChildren';

type Point = [number, number];
type Polygon = Point[];

function isPointInPolygon(point: Point, polygon: Polygon) {
  const [x, y] = point;
  let isInside = false;
  const length = polygon.length;
  for (let i = 0, j = length - 1; i < length; j = i++) {
    const [xi, yi] = polygon[i] || [0, 0];
    const [xj, yj] = polygon[j] || [0, 0];
    const intersect =
      yi >= y !== yj >= y && x <= ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      isInside = !isInside;
    }
  }
  return isInside;
}

export function safePolygon<RT extends ReferenceType = ReferenceType>({
  restMs = 0,
  buffer = 0,
  debug = null,
}: Partial<{
  restMs: number;
  buffer: number;
  debug: null | ((points?: string | null) => void);
}> = {}) {
  let timeoutId: NodeJS.Timeout;
  let initialized = false;
  let polygonIsDestroyed = false;
  let timeoutPending = false;

  return ({
    x,
    y,
    placement,
    refs,
    onClose,
    nodeId,
    tree,
  }: FloatingContext<RT> & {
    onClose: () => void;
    tree?: FloatingTreeType<RT> | null;
  }) => {
    return function onPointerMove(event: PointerEvent) {
      clearTimeout(timeoutId);

      if (!initialized) {
        // Block the first events to ensure the cursor has moved into the
        // polygon, allowing leeway in rounding errors between the cursor point
        // and the polygon.
        if (!timeoutPending) {
          timeoutPending = true;
          setTimeout(() => {
            initialized = true;
          }, 1000 / 60);
        }
        return;
      }

      function close() {
        clearTimeout(timeoutId);
        onClose();
      }

      if (event.pointerType && event.pointerType !== 'mouse') {
        return;
      }

      const {clientX, clientY} = event;
      const target =
        'composedPath' in event
          ? event.composedPath()[0]
          : (event as Event).target;
      const targetNode = target as Element | null;

      // If the pointer is over the reference or floating element already, there
      // is no need to run the logic.
      if (
        event.type === 'pointermove' &&
        isElement(refs.reference.current) &&
        refs.reference.current.contains(targetNode)
      ) {
        return;
      }

      // If any nested child is open, abort.
      if (
        tree &&
        getChildren(tree, nodeId).some(({context}) => context?.open)
      ) {
        return;
      }

      // The cursor landed, so we destroy the polygon logic
      if (refs.floating.current?.contains(targetNode)) {
        polygonIsDestroyed = true;
        return;
      }

      if (
        !refs.reference.current ||
        !refs.floating.current ||
        placement == null ||
        x == null ||
        y == null
      ) {
        return;
      }

      const refRect = refs.reference.current.getBoundingClientRect();
      const rect = refs.floating.current.getBoundingClientRect();
      const side = placement.split('-')[0] as Side;
      const cursorLeaveFromRight = x > rect.right - rect.width / 2;
      const cursorLeaveFromBottom = y > rect.bottom - rect.height / 2;

      // If the pointer is leaving from the opposite side, the "buffer" logic
      // creates a point where the floating element remains open, but should be
      // ignored.
      // A constant of 1 handles floating point rounding errors.
      if (
        (side === 'top' && y >= refRect.bottom - 1) ||
        (side === 'bottom' && y <= refRect.top + 1) ||
        (side === 'left' && x >= refRect.right - 1) ||
        (side === 'right' && x <= refRect.left + 1)
      ) {
        return close();
      }

      // Ignore when the cursor is within the rectangular trough between the
      // two elements. Since the triangle is created from the cursor point,
      // which can start beyond the ref element's edge, traversing back and
      // forth from the ref to the floating element can cause it to close. This
      // ensures it always remains open in that case.
      switch (side) {
        case 'top':
          if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.bottom &&
            clientY <= refRect.top
          ) {
            return;
          }
          break;
        case 'bottom':
          if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= refRect.bottom &&
            clientY <= rect.top
          ) {
            return;
          }
          break;
        case 'left':
          if (
            clientX >= rect.right &&
            clientX <= refRect.left &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          ) {
            return;
          }
          break;
        case 'right':
          if (
            clientX >= refRect.right &&
            clientX <= rect.left &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          ) {
            return;
          }
          break;
      }

      if (polygonIsDestroyed) {
        return close();
      }

      function getPolygon([x, y]: Point): Array<Point> {
        const isFloatingWider = rect.width > refRect.width;
        const isFloatingTaller = rect.height > refRect.height;

        switch (side) {
          case 'top': {
            const cursorPointOne: Point = [
              isFloatingWider
                ? x + buffer / 2
                : cursorLeaveFromRight
                ? x + buffer * 4
                : x - buffer * 4,
              y + buffer + 1,
            ];
            const cursorPointTwo: Point = [
              isFloatingWider
                ? x - buffer / 2
                : cursorLeaveFromRight
                ? x + buffer * 4
                : x - buffer * 4,
              y + buffer + 1,
            ];
            const commonPoints: [Point, Point] = [
              [
                rect.left,
                cursorLeaveFromRight
                  ? rect.bottom - buffer
                  : isFloatingWider
                  ? rect.bottom - buffer
                  : rect.top,
              ],
              [
                rect.right,
                cursorLeaveFromRight
                  ? isFloatingWider
                    ? rect.bottom - buffer
                    : rect.top
                  : rect.bottom - buffer,
              ],
            ];

            return [cursorPointOne, cursorPointTwo, ...commonPoints];
          }
          case 'bottom': {
            const cursorPointOne: Point = [
              isFloatingWider
                ? x + buffer / 2
                : cursorLeaveFromRight
                ? x + buffer * 4
                : x - buffer * 4,
              y - buffer,
            ];
            const cursorPointTwo: Point = [
              isFloatingWider
                ? x - buffer / 2
                : cursorLeaveFromRight
                ? x + buffer * 4
                : x - buffer * 4,
              y - buffer,
            ];
            const commonPoints: [Point, Point] = [
              [
                rect.left,
                cursorLeaveFromRight
                  ? rect.top + buffer
                  : isFloatingWider
                  ? rect.top + buffer
                  : rect.bottom,
              ],
              [
                rect.right,
                cursorLeaveFromRight
                  ? isFloatingWider
                    ? rect.top + buffer
                    : rect.bottom
                  : rect.top + buffer,
              ],
            ];

            return [cursorPointOne, cursorPointTwo, ...commonPoints];
          }
          case 'left': {
            const cursorPointOne: Point = [
              x + buffer + 1,
              isFloatingTaller
                ? y + buffer / 2
                : cursorLeaveFromBottom
                ? y + buffer * 4
                : y - buffer * 4,
            ];
            const cursorPointTwo: Point = [
              x + buffer + 1,
              isFloatingTaller
                ? y - buffer / 2
                : cursorLeaveFromBottom
                ? y + buffer * 4
                : y - buffer * 4,
            ];
            const commonPoints: [Point, Point] = [
              [
                cursorLeaveFromBottom
                  ? rect.right - buffer
                  : isFloatingTaller
                  ? rect.right - buffer
                  : rect.left,
                rect.top,
              ],
              [
                cursorLeaveFromBottom
                  ? isFloatingTaller
                    ? rect.right - buffer
                    : rect.left
                  : rect.right - buffer,
                rect.bottom,
              ],
            ];

            return [...commonPoints, cursorPointOne, cursorPointTwo];
          }
          case 'right': {
            const cursorPointOne: Point = [
              x - buffer,
              isFloatingTaller
                ? y + buffer / 2
                : cursorLeaveFromBottom
                ? y + buffer * 4
                : y - buffer * 4,
            ];
            const cursorPointTwo: Point = [
              x - buffer,
              isFloatingTaller
                ? y - buffer / 2
                : cursorLeaveFromBottom
                ? y + buffer * 4
                : y - buffer * 4,
            ];
            const commonPoints: [Point, Point] = [
              [
                cursorLeaveFromBottom
                  ? rect.left + buffer
                  : isFloatingTaller
                  ? rect.left + buffer
                  : rect.right,
                rect.top,
              ],
              [
                cursorLeaveFromBottom
                  ? isFloatingTaller
                    ? rect.left + buffer
                    : rect.right
                  : rect.left + buffer,
                rect.bottom,
              ],
            ];

            return [cursorPointOne, cursorPointTwo, ...commonPoints];
          }
        }
      }

      const poly = getPolygon([x, y]);

      if (__DEV__) {
        debug?.(poly.slice(0, 4).join(', '));
      }

      if (!isPointInPolygon([clientX, clientY], poly)) {
        close();
      } else if (restMs) {
        timeoutId = setTimeout(onClose, restMs);
      }
    };
  };
}
