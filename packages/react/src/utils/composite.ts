import {floor} from '@floating-ui/utils';
import {stopEvent} from '@floating-ui/utils/react';

export const ARROW_UP = 'ArrowUp';
export const ARROW_DOWN = 'ArrowDown';
export const ARROW_LEFT = 'ArrowLeft';
export const ARROW_RIGHT = 'ArrowRight';

export function isDifferentRow(index: number, cols: number, prevRow: number) {
  return Math.floor(index / cols) !== prevRow;
}

export function isIndexOutOfBounds(
  listRef: React.MutableRefObject<Array<HTMLElement | null>>,
  index: number
) {
  return index < 0 || index >= listRef.current.length;
}

export function getMinIndex(
  listRef: React.MutableRefObject<Array<HTMLElement | null>>,
  disabledIndices: Array<number> | undefined
) {
  return findNonDisabledIndex(listRef, {disabledIndices});
}

export function getMaxIndex(
  listRef: React.MutableRefObject<Array<HTMLElement | null>>,
  disabledIndices: Array<number> | undefined
) {
  return findNonDisabledIndex(listRef, {
    decrement: true,
    startingIndex: listRef.current.length,
    disabledIndices,
  });
}

export function findNonDisabledIndex(
  listRef: React.MutableRefObject<Array<HTMLElement | null>>,
  {
    startingIndex = -1,
    decrement = false,
    disabledIndices,
    amount = 1,
  }: {
    startingIndex?: number;
    decrement?: boolean;
    disabledIndices?: Array<number>;
    amount?: number;
  } = {}
): number {
  const list = listRef.current;

  let index = startingIndex;
  do {
    index = index + (decrement ? -amount : amount);
  } while (
    index >= 0 &&
    index <= list.length - 1 &&
    (disabledIndices
      ? disabledIndices.includes(index)
      : list[index] == null ||
        list[index]?.hasAttribute('disabled') ||
        list[index]?.getAttribute('aria-disabled') === 'true')
  );

  return index;
}

export function getGridNavigatedIndex(
  elementsRef: React.MutableRefObject<Array<HTMLElement | null>>,
  {
    event,
    orientation,
    loop,
    cols,
    disabledIndices,
    minIndex,
    maxIndex,
    prevIndex,
    stopEvent: stop,
  }: {
    event: React.KeyboardEvent;
    orientation: 'horizontal' | 'vertical' | 'both';
    loop: boolean;
    cols: number;
    disabledIndices: Array<number> | undefined;
    minIndex: number;
    maxIndex: number;
    prevIndex: number;
    stopEvent: boolean;
  }
) {
  let nextIndex = prevIndex;

  if (event.key === ARROW_UP) {
    stop && stopEvent(event);

    if (prevIndex === -1) {
      nextIndex = maxIndex;
    } else {
      nextIndex = findNonDisabledIndex(elementsRef, {
        startingIndex: nextIndex,
        amount: cols,
        decrement: true,
        disabledIndices,
      });

      if (loop && (prevIndex - cols < minIndex || nextIndex < 0)) {
        const col = prevIndex % cols;
        const maxCol = maxIndex % cols;
        const offset = maxIndex - (maxCol - col);

        if (maxCol === col) {
          nextIndex = maxIndex;
        } else {
          nextIndex = maxCol > col ? offset : offset - cols;
        }
      }
    }

    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      nextIndex = prevIndex;
    }
  }

  if (event.key === ARROW_DOWN) {
    stop && stopEvent(event);

    if (prevIndex === -1) {
      nextIndex = minIndex;
    } else {
      nextIndex = findNonDisabledIndex(elementsRef, {
        startingIndex: prevIndex,
        amount: cols,
        disabledIndices,
      });

      if (loop && prevIndex + cols > maxIndex) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: (prevIndex % cols) - cols,
          amount: cols,
          disabledIndices,
        });
      }
    }

    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      nextIndex = prevIndex;
    }
  }

  // Remains on the same row/column.
  if (orientation === 'both') {
    const prevRow = floor(prevIndex / cols);

    if (event.key === ARROW_RIGHT) {
      stop && stopEvent(event);

      if (prevIndex % cols !== cols - 1) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex,
          disabledIndices,
        });

        if (loop && isDifferentRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledIndex(elementsRef, {
            startingIndex: prevIndex - (prevIndex % cols) - 1,
            disabledIndices,
          });
        }
      } else if (loop) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex - (prevIndex % cols) - 1,
          disabledIndices,
        });
      }

      if (isDifferentRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }

    if (event.key === ARROW_LEFT) {
      stop && stopEvent(event);

      if (prevIndex % cols !== 0) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex,
          disabledIndices,
          decrement: true,
        });

        if (loop && isDifferentRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledIndex(elementsRef, {
            startingIndex: prevIndex + (cols - (prevIndex % cols)),
            decrement: true,
            disabledIndices,
          });
        }
      } else if (loop) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex + (cols - (prevIndex % cols)),
          decrement: true,
          disabledIndices,
        });
      }

      if (isDifferentRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }

    const lastRow = floor(maxIndex / cols) === prevRow;

    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      if (loop && lastRow) {
        nextIndex =
          event.key === ARROW_LEFT
            ? maxIndex
            : findNonDisabledIndex(elementsRef, {
                startingIndex: prevIndex - (prevIndex % cols) - 1,
                disabledIndices,
              });
      } else {
        nextIndex = prevIndex;
      }
    }
  }

  return nextIndex;
}
