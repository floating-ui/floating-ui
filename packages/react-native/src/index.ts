import {
  useMemo,
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
  RefObject,
} from 'react';
import {computePosition, arrow as arrowCore} from '@floating-ui/core';
import type {
  Placement,
  Middleware,
  ComputePositionReturn,
  SideObject,
} from '@floating-ui/core';
import {createPlatform} from './createPlatform';
import {useLatestRef} from './utils/useLatestRef';

export {
  autoPlacement,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  detectOverflow,
} from '@floating-ui/core';

const ORIGIN = {x: 0, y: 0};

type UseFloatingReturn = Data & {
  update: () => void;
  offsetParent: (node: any) => void;
  floating: (node: any) => void;
  reference: (node: any) => void;
  refs: {
    reference: RefObject<any>;
    floating: RefObject<any>;
    offsetParent: RefObject<any>;
  };
  scrollProps: {
    onScroll: (event: {
      nativeEvent: {
        contentOffset: {x: number; y: number};
      };
    }) => void;
    scrollEventThrottle: 16;
  };
};

type Data = Omit<ComputePositionReturn, 'x' | 'y'> & {
  x: number | null;
  y: number | null;
};

export const useFloating = ({
  placement = 'bottom',
  middleware,
  sameScrollView = true,
}: {
  placement?: Placement;
  middleware?: Array<Middleware>;
  sameScrollView?: boolean;
} = {}): UseFloatingReturn => {
  const reference = useRef<any>();
  const floating = useRef<any>();
  const offsetParent = useRef<any>();

  const [data, setData] = useState<Data>({
    x: null,
    y: null,
    placement,
    strategy: 'absolute',
    middlewareData: {},
  });

  const [scrollOffsets, setScrollOffsets] = useState(ORIGIN);

  const platform = useMemo(
    () => createPlatform({offsetParent, scrollOffsets, sameScrollView}),
    [offsetParent, scrollOffsets, sameScrollView]
  );

  // Memoize middleware internally, to remove the requirement of memoization by consumer
  const latestMiddleware = useLatestRef(middleware);

  const update = useCallback(() => {
    if (!reference.current || !floating.current) {
      return;
    }

    computePosition(reference.current, floating.current, {
      middleware: latestMiddleware.current,
      platform,
      placement,
    }).then(setData);
  }, [latestMiddleware, platform, placement]);

  useLayoutEffect(() => {
    requestAnimationFrame(update);
  }, [update]);

  const setReference = useCallback(
    (node) => {
      reference.current = node;
      requestAnimationFrame(update);
    },
    [update]
  );

  const setFloating = useCallback(
    (node) => {
      floating.current = node;
      requestAnimationFrame(update);
    },
    [update]
  );

  const setOffsetParent = useCallback(
    (node) => {
      offsetParent.current = node;
      requestAnimationFrame(update);
    },
    [update]
  );

  return useMemo(
    () => ({
      ...data,
      update,
      refs: {reference, floating, offsetParent},
      offsetParent: setOffsetParent,
      reference: setReference,
      floating: setFloating,
      scrollProps: {
        onScroll: (event) => setScrollOffsets(event.nativeEvent.contentOffset),
        scrollEventThrottle: 16,
      },
    }),
    [data, setReference, setFloating, setOffsetParent, update]
  );
};

export const arrow = ({
  element,
  padding,
}: {
  element: any;
  padding?: number | SideObject;
}): Middleware => {
  function isRef(value: unknown) {
    return Object.prototype.hasOwnProperty.call(value, 'current');
  }

  return {
    name: 'arrow',
    fn(args) {
      if (isRef(element)) {
        if (element.current != null) {
          return arrowCore({element: element.current, padding}).fn(args);
        }

        return {};
      } else if (element) {
        return arrowCore({element, padding}).fn(args);
      }

      return {};
    },
  };
};
