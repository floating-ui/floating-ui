/* eslint-disable import/no-unused-modules */
// @flow
import { useMemo, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { position, rectToClientRect } from '@popperjs/core';
import type { Placement } from '@popperjs/core/src/enums';
import type { Modifier, Platform } from '@popperjs/core/src/types';

const ORIGIN = { x: 0, y: 0 };

export const createPlatform = ({
  offsetParentRef,
  sameScrollView = true,
  scrollOffsets = ORIGIN,
}: {
  offsetParentRef: {|
    current: any,
  |},
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

      if (offsetParentRef.current) {
        offsetParentRef.current.measure(onMeasure);
      } else {
        onMeasure();
      }
    });
  },
  getClippingClientRect() {
    const { width, height } = Dimensions.get('window');
    return Promise.resolve(
      rectToClientRect({ width, height, ...scrollOffsets })
    );
  },
  convertOffsetParentRelativeRectToViewportRelativeRect({ rect }) {
    return new Promise((resolve) => {
      const onMeasure = (offsetX = 0, offsetY = 0) => {
        resolve({ ...rect, x: rect.x + offsetX, y: rect.y + offsetY });
      };

      if (offsetParentRef.current) {
        offsetParentRef.current.measure(onMeasure);
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
  x: number,
  y: number,
  placement: ?Placement,
  offsetParent: {| current: any |},
  popper: {| current: any |},
  reference: {| current: any |},
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
  const offsetParentRef = useRef<null>(null);
  const referenceRef = useRef<null>(null);
  const popperRef = useRef<null>(null);
  const [data, setData] = useState({ ...ORIGIN, placement: null });
  const [scrollOffsets, setScrollOffsets] = useState(ORIGIN);

  const platform = useMemo(
    () => createPlatform({ offsetParentRef, scrollOffsets, sameScrollView }),
    [offsetParentRef, scrollOffsets, sameScrollView]
  );

  useEffect(() => {
    const wrap = !data.placement ? requestAnimationFrame : (cb) => cb();

    wrap(() => {
      if (!referenceRef.current || !popperRef.current) {
        return;
      }

      position(referenceRef.current, popperRef.current, {
        platform,
        placement,
        modifiers,
      }).then(setData);
    });
  }, [platform, scrollOffsets]);

  return useMemo(
    () => ({
      ...data,
      offsetParent: offsetParentRef,
      reference: referenceRef,
      popper: popperRef,
      scrollProps: {
        onScroll: (event) => setScrollOffsets(event.nativeEvent.contentOffset),
        scrollEventThrottle: 16,
      },
    }),
    [data]
  );
};
