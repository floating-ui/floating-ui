import type {Side} from '@floating-ui/core';
import type {FloatingContext, FloatingTreeType} from './types';
import pointInPolygon from 'point-in-polygon';
import {isElement} from './utils/is';
import {getChildren} from './utils/getChildren';

type XY = [number, number];

export function safePolygon({
  restMs = 0,
  buffer = 1,
  debug = null,
}: Partial<{
  restMs: number;
  buffer: number;
  debug: null | ((points?: string | null) => void);
}> = {}) {
  let timeoutId: NodeJS.Timeout;

  return ({
    x,
    y,
    placement,
    refs,
    onClose,
    nodeId,
    tree,
  }: FloatingContext & {
    onClose: () => void;
    tree?: FloatingTreeType | null;
  }) =>
    function onPointerMove(event: PointerEvent) {
      clearTimeout(timeoutId);

      if (event.pointerType && event.pointerType !== 'mouse') {
        return;
      }

      const {target, clientX, clientY} = event;
      const targetNode = target as Element | null;

      if (
        (event.type === 'pointermove' &&
          isElement(refs.reference.current) &&
          refs.reference.current.contains(targetNode)) ||
        refs.floating.current?.contains(targetNode)
      ) {
        return;
      }

      // If any child has a menu open, abort
      if (
        tree &&
        getChildren(tree, nodeId).some(({context}) => context?.open)
      ) {
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

      // Within the rectangular trough between the two elements
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
            clientY >= rect.left &&
            clientY <= rect.right
          ) {
            return;
          }
          break;
        case 'right':
          if (
            clientX >= rect.right &&
            clientX <= refRect.left &&
            clientY >= rect.right &&
            clientY <= refRect.left
          ) {
            return;
          }
          break;
      }

      function getPolygon([x, y]: XY): Array<XY> {
        const isFloatingWider = rect.width > refRect.width;
        const isFloatingTaller = rect.height > refRect.height;

        switch (side) {
          case 'top': {
            const cursorPointOne: XY = [
              isFloatingWider
                ? x
                : cursorLeaveFromRight
                ? x + buffer
                : x - buffer,
              y + buffer,
            ];
            const cursorPointTwo: XY = [
              isFloatingWider
                ? x
                : cursorLeaveFromRight
                ? x - buffer
                : x + buffer,
              y + buffer,
            ];
            const commonPoints: [XY, XY] = [
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

            if (cursorLeaveFromRight) {
              return [cursorPointOne, cursorPointTwo, ...commonPoints];
            }

            return [cursorPointOne, ...commonPoints, cursorPointTwo];
          }
          case 'bottom': {
            const cursorPointOne: XY = [
              isFloatingWider
                ? x
                : cursorLeaveFromRight
                ? x + buffer
                : x - buffer,
              y - buffer,
            ];
            const cursorPointTwo: XY = [
              isFloatingWider
                ? x
                : cursorLeaveFromRight
                ? x - buffer
                : x + buffer,
              y - buffer,
            ];
            const commonPoints: [XY, XY] = [
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

            if (cursorLeaveFromRight) {
              return [cursorPointOne, cursorPointTwo, ...commonPoints];
            }

            return [cursorPointOne, ...commonPoints, cursorPointTwo];
          }
          case 'left': {
            const cursorPointOne: XY = [
              x + buffer,
              isFloatingTaller
                ? y
                : cursorLeaveFromBottom
                ? y - buffer
                : y + buffer,
            ];
            const cursorPointTwo: XY = [
              x + buffer,
              isFloatingTaller
                ? y
                : cursorLeaveFromBottom
                ? y + buffer
                : y - buffer,
            ];
            const commonPoints: [XY, XY] = [
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

            if (cursorLeaveFromBottom) {
              return [cursorPointOne, ...commonPoints, cursorPointTwo];
            }

            return [...commonPoints, cursorPointOne, cursorPointTwo];
          }
          case 'right': {
            const cursorPointOne: XY = [
              x - buffer,
              isFloatingTaller
                ? y
                : cursorLeaveFromBottom
                ? y + buffer
                : y - buffer,
            ];
            const cursorPointTwo: XY = [
              x - buffer,
              isFloatingTaller
                ? y
                : cursorLeaveFromBottom
                ? y - buffer
                : y + buffer,
            ];
            const commonPoints: [XY, XY] = [
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

            if (cursorLeaveFromBottom) {
              return [cursorPointOne, cursorPointTwo, ...commonPoints];
            }

            return [cursorPointOne, ...commonPoints, cursorPointTwo];
          }
        }
      }

      const poly = getPolygon([x, y]);

      if (__DEV__) {
        debug?.(poly.slice(0, 4).join(', '));
      }

      if (!pointInPolygon([clientX, clientY], poly)) {
        clearTimeout(timeoutId);
        onClose();
      } else if (restMs) {
        timeoutId = setTimeout(onClose, restMs);
      }
    };
}
