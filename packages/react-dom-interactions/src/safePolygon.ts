import type {Side} from '@floating-ui/core';
import type {FloatingContext, FloatingTreeType} from './types';
import pointInPolygon from 'point-in-polygon';
import {isElement} from './utils/is';
import {getChildren} from './utils/getChildren';

type XY = [number, number];

export function safePolygon({
  timeout = 0,
  debug = null,
}: Partial<{
  timeout: number;
  debug: null | ((points: string | null) => void);
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
      if (event.pointerType === 'touch') {
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
      const BUFFER = 1;

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
                ? x + BUFFER
                : x - BUFFER,
              y + BUFFER,
            ];
            const cursorPointTwo: XY = [
              isFloatingWider
                ? x
                : cursorLeaveFromRight
                ? x - BUFFER
                : x + BUFFER,
              y + BUFFER,
            ];
            const commonPoints: [XY, XY] = [
              [
                rect.left,
                cursorLeaveFromRight
                  ? rect.bottom - BUFFER
                  : isFloatingWider
                  ? rect.bottom - BUFFER
                  : rect.top,
              ],
              [
                rect.right,
                cursorLeaveFromRight
                  ? isFloatingWider
                    ? rect.bottom - BUFFER
                    : rect.top
                  : rect.bottom - BUFFER,
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
                ? x + BUFFER
                : x - BUFFER,
              y - BUFFER,
            ];
            const cursorPointTwo: XY = [
              isFloatingWider
                ? x
                : cursorLeaveFromRight
                ? x - BUFFER
                : x + BUFFER,
              y - BUFFER,
            ];
            const commonPoints: [XY, XY] = [
              [
                rect.left,
                cursorLeaveFromRight
                  ? rect.top + BUFFER
                  : isFloatingWider
                  ? rect.top + BUFFER
                  : rect.bottom,
              ],
              [
                rect.right,
                cursorLeaveFromRight
                  ? isFloatingWider
                    ? rect.top + BUFFER
                    : rect.bottom
                  : rect.top + BUFFER,
              ],
            ];

            if (cursorLeaveFromRight) {
              return [cursorPointOne, cursorPointTwo, ...commonPoints];
            }

            return [cursorPointOne, ...commonPoints, cursorPointTwo];
          }
          case 'left': {
            const cursorPointOne: XY = [
              x + BUFFER,
              isFloatingTaller
                ? y
                : cursorLeaveFromBottom
                ? y - BUFFER
                : y + BUFFER,
            ];
            const cursorPointTwo: XY = [
              x + BUFFER,
              isFloatingTaller
                ? y
                : cursorLeaveFromBottom
                ? y + BUFFER
                : y - BUFFER,
            ];
            const commonPoints: [XY, XY] = [
              [
                cursorLeaveFromBottom
                  ? rect.right - BUFFER
                  : isFloatingTaller
                  ? rect.right - BUFFER
                  : rect.left,
                rect.top,
              ],
              [
                cursorLeaveFromBottom
                  ? isFloatingTaller
                    ? rect.right - BUFFER
                    : rect.left
                  : rect.right - BUFFER,
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
              x - BUFFER,
              isFloatingTaller
                ? y
                : cursorLeaveFromBottom
                ? y + BUFFER
                : y - BUFFER,
            ];
            const cursorPointTwo: XY = [
              x - BUFFER,
              isFloatingTaller
                ? y
                : cursorLeaveFromBottom
                ? y - BUFFER
                : y + BUFFER,
            ];
            const commonPoints: [XY, XY] = [
              [
                cursorLeaveFromBottom
                  ? rect.left + BUFFER
                  : isFloatingTaller
                  ? rect.left + BUFFER
                  : rect.right,
                rect.top,
              ],
              [
                cursorLeaveFromBottom
                  ? isFloatingTaller
                    ? rect.left + BUFFER
                    : rect.right
                  : rect.left + BUFFER,
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

      if (process.env.NODE_ENV !== 'production') {
        debug?.(getPolygon([x, y]).slice(0, 4).join(', '));
      }

      if (!pointInPolygon([clientX, clientY], poly)) {
        clearTimeout(timeoutId);
        onClose();
      } else if (timeout) {
        timeoutId = setTimeout(onClose, timeout);
      }
    };
}
