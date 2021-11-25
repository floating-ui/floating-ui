/* eslint-disable import/no-unused-modules */
// @flow
import { useMemo, useState, useLayoutEffect } from 'react';
import { Dimensions } from 'react-native';
import { computePosition, rectToClientRect } from '@popperjs/core';
import type { Placement } from '@popperjs/core/src/enums';
import type {
  Modifier,
  Platform,
  ComputePositionReturn,
} from '@popperjs/core/src/types';

export {
  arrow,
  autoPlacement,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
} from '@popperjs/core';

const ORIGIN = { x: 0, y: 0 };
const INITIAL_DATA = {
  ...ORIGIN,
  placement: null,
  strategy: 'absolute',
  modifiersData: {},
};

export const createPlatform = ({
  offsetParent,
  sameScrollView = true,
  scrollOffsets = ORIGIN,
}: {
  offsetParent: any,
  sameScrollView: boolean,
  scrollOffsets: {|
    x: number,
    y: number,
  |},
}): Platform => ({
  getElementRects({ reference, popper }) {
    return new Promise((resolve) => {
      const onMeasure = (offsetX = 0, offsetY = 0) => {
        popper.measure((x, y, width, height) => {
          const popperRect = { width, height, ...ORIGIN };
          const method = sameScrollView ? 'measure' : 'measureInWindow';

          reference[method]((x, y, width, height) => {
            const referenceRect = {
              width,
              height,
              x: x - offsetX,
              y: y - offsetY,
            };

            resolve({ reference: referenceRect, popper: popperRect });
          });
        });
      };

      if (offsetParent) {
        offsetParent.measure(onMeasure);
      } else {
        onMeasure();
      }
    });
  },
  getClippingClientRect() {
    const { width, height } = Dimensions.get('window');
    return Promise.resolve(
      rectToClientRect({
        width,
        height,
        ...(sameScrollView ? scrollOffsets : ORIGIN),
      })
    );
  },
  convertOffsetParentRelativeRectToViewportRelativeRect({ rect }) {
    return new Promise((resolve) => {
      const onMeasure = (offsetX = 0, offsetY = 0) => {
        resolve({ ...rect, x: rect.x + offsetX, y: rect.y + offsetY });
      };

      if (offsetParent) {
        offsetParent.measure(onMeasure);
      } else {
        onMeasure();
      }
    });
  },
  getDocumentElement: () => Promise.resolve({}),
  // these are the properties accessed on an offsetParent
  getOffsetParent: () =>
    Promise.resolve({
      clientLeft: 0,
      clientTop: 0,
      clientWidth: 0,
      clientHeight: 0,
    }),
  getDimensions: ({ element }) =>
    new Promise((resolve) =>
      element.measure(({ width, height }) => resolve({ width, height }))
    ),
  isElement: () => Promise.resolve(true),
});

type UsePopperReturn = {|
  ...ComputePositionReturn,
  placement: ?Placement,
  offsetParent: <S>(((S) => S) | S) => void,
  popper: <S>(((S) => S) | S) => void,
  reference: <S>(((S) => S) | S) => void,
  scrollProps: {|
    onScroll: (event: {
      nativeEvent: {
        contentOffset: {| x: number, y: number |},
      },
    }) => void,
    scrollEventThrottle: 16,
  |},
|};

export const usePopper = ({
  placement,
  modifiers,
  sameScrollView = true,
}: {
  placement: Placement,
  modifiers: Array<Modifier>,
  sameScrollView: boolean,
} = {}): UsePopperReturn => {
  const [offsetParent, setOffsetParent] = useState<any>(null);
  const [reference, setReference] = useState<any>(null);
  const [popper, setPopper] = useState<any>(null);
  const [data, setData] = useState(INITIAL_DATA);
  const [scrollOffsets, setScrollOffsets] = useState(ORIGIN);

  const platform = useMemo(
    () => createPlatform({ offsetParent, scrollOffsets, sameScrollView }),
    [offsetParent, scrollOffsets, sameScrollView]
  );

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      if (!reference || !popper) {
        return;
      }

      computePosition(reference, popper, {
        platform,
        placement,
        modifiers,
      }).then(setData);
    });
  }, [platform, reference, popper, modifiers, placement]);

  return useMemo(
    () => ({
      ...data,
      offsetParent: setOffsetParent,
      reference: setReference,
      popper: setPopper,
      scrollProps: {
        onScroll: (event) => setScrollOffsets(event.nativeEvent.contentOffset),
        scrollEventThrottle: 16,
      },
    }),
    [data]
  );
};
