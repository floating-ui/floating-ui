import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type {Side} from '@floating-ui/core';
import type {FloatingContext, FloatingTreeType, ReferenceType} from './types';
import {getChildren} from './utils/getChildren';
import {useLatestRef} from './utils/useLatestRef';

type Point = [number, number];
type SvgPoints = Array<string | null>;
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

interface SafePolygonProps {
  restMs: number;
  buffer: number;
  setPoints: (newPoints: SvgPoints) => void;
}

export function safePolygon<RT extends ReferenceType = ReferenceType>({
  restMs = 0,
  buffer = 0.5,
  setPoints,
}: Partial<SafePolygonProps> = {}) {
  let timeoutId: NodeJS.Timeout;
  let polygonIsDestroyed = false;

  return ({
    x,
    y,
    placement,
    refs,
    onClose,
    nodeId,
    tree,
    leave = false,
  }: FloatingContext<RT> & {
    onClose: () => void;
    tree?: FloatingTreeType<RT> | null;
    leave?: boolean;
  }) => {
    return function onPointerMove(event: PointerEvent) {
      clearTimeout(timeoutId);

      function close() {
        clearTimeout(timeoutId);
        ReactDOM.flushSync(() => setPoints?.([null, null]));
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
        refs.domReference.current?.contains(targetNode)
      ) {
        return;
      }

      // If any nested child is open, abort.
      if (
        tree &&
        getChildren(tree.nodesRef.current, nodeId).some(
          ({context}) => context?.open
        )
      ) {
        return;
      }

      // The cursor landed, so we destroy the polygon logic
      if (refs.floating.current?.contains(targetNode) && !leave) {
        polygonIsDestroyed = true;
        return;
      }

      if (
        !refs.domReference.current ||
        !refs.floating.current ||
        placement == null ||
        x == null ||
        y == null ||
        refs.floating.current?.contains(event.relatedTarget as Element | null)
      ) {
        return;
      }

      const refRect = refs.domReference.current.getBoundingClientRect();
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
      let insideRect = false;
      switch (side) {
        case 'top':
          if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= refRect.top + 1
          ) {
            insideRect = true;
          }
          break;
        case 'bottom':
          if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= refRect.bottom - 1 &&
            clientY <= rect.bottom
          ) {
            insideRect = true;
          }
          break;
        case 'left':
          if (
            clientX >= rect.left &&
            clientX <= refRect.left + 1 &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          ) {
            insideRect = true;
          }
          break;
        case 'right':
          if (
            clientX >= refRect.right - 1 &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          ) {
            insideRect = true;
          }
          break;
      }

      let rectPolygon: Point[] = [];
      switch (side) {
        case 'top':
          rectPolygon = [
            [rect.left, refRect.top + 1],
            [rect.left, rect.bottom - 1],
            [rect.right, rect.bottom - 1],
            [rect.right, refRect.top + 1],
          ];
          break;
        case 'bottom':
          rectPolygon = [
            [rect.left, rect.top + 1],
            [rect.left, refRect.bottom - 1],
            [rect.right, refRect.bottom - 1],
            [rect.right, rect.top + 1],
          ];
          break;
        case 'left':
          rectPolygon = [
            [rect.right - 1, rect.bottom],
            [rect.right - 1, rect.top],
            [refRect.left + 1, rect.top],
            [refRect.left + 1, rect.bottom],
          ];
          break;
        case 'right':
          rectPolygon = [
            [refRect.right - 1, rect.bottom],
            [refRect.right - 1, rect.top],
            [rect.left + 1, rect.top],
            [rect.left + 1, rect.bottom],
          ];
          break;
      }

      if (polygonIsDestroyed && !leave && !insideRect) {
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

      const cursorPoly = getPolygon([x, y]);
      const rectPoly = rectPolygon;

      ReactDOM.flushSync(() => {
        setPoints?.([
          insideRect ? null : cursorPoly.slice(0, 4).join(', '),
          rectPoly.slice(0, 4).join(', '),
        ]);
      });

      if (insideRect) {
        return;
      }

      if (
        !isPointInPolygon([clientX, clientY], cursorPoly) &&
        !isPointInPolygon([clientX, clientY], rectPoly)
      ) {
        close();
      } else if (restMs) {
        timeoutId = setTimeout(close, restMs);
      }
    };
  };
}

interface SafePolygonComponentProps {
  state: {
    points: SvgPoints;
    setPoints: (points: SvgPoints) => void;
  };
}

export function SafePolygon({
  state: {
    points: [triangle, rect],
    setPoints,
  },
}: SafePolygonComponentProps) {
  const setPointsRef = useLatestRef(setPoints);

  React.useEffect(() => {
    const fn = setPointsRef.current;
    return () => {
      fn([null, null]);
    };
  }, [setPointsRef]);

  if (triangle == null && rect == null) {
    return null;
  }

  return (
    <svg
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 2147483647,
      }}
    >
      {triangle && (
        <polygon
          points={triangle}
          style={{fill: 'transparent', pointerEvents: 'auto'}}
        />
      )}
      {rect && (
        <polygon
          points={rect}
          style={{fill: 'transparent', pointerEvents: 'auto'}}
        />
      )}
    </svg>
  );
}

export const useSafePolygon = () => {
  const [points, setPoints] = React.useState<SvgPoints>([null, null]);

  return {
    polygonState: {points, setPoints},
    safePolygon<RT extends ReferenceType = ReferenceType>(
      props?: Partial<SafePolygonProps>
    ) {
      return safePolygon<RT>({...props, setPoints});
    },
  };
};
