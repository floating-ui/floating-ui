import type {
  ComputePositionReturn,
  Middleware,
  Placement,
  SideObject,
} from '@floating-ui/core';
import {arrow as arrowCore,computePosition} from '@floating-ui/core';
import {
  RefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {createPlatform} from './createPlatform';
import {deepEqual} from './utils/deepEqual';

export {
  autoPlacement,
  detectOverflow,
  flip,
  hide,
  inline,
  limitShift,
  offset,
  shift,
  size,
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
  middleware = [],
  sameScrollView = true,
}: {
  placement?: Placement;
  middleware?: Array<Middleware | null | undefined | false>;
  sameScrollView?: boolean;
} = {}): UseFloatingReturn => {
  const reference = useRef<any>();
  const floating = useRef<any>();
  const offsetParent = useRef<any>();

  const isUpdateQueuedRef = useRef(false);

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

  const [latestMiddleware, setLatestMiddleware] = useState(middleware);

  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }

  const animationFrames = useRef<Array<number>>([]);

  const isMountedRef = useRef(true);
  useLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const update = useCallback(() => {
    if (!reference.current || !floating.current) {
      return;
    }

    computePosition(reference.current, floating.current, {
      middleware: latestMiddleware,
      platform,
      placement,
    }).then((data) => {
      if (isMountedRef.current) {
        setData(data);
      }
    });

    isUpdateQueuedRef.current = false;
  }, [latestMiddleware, platform, placement]);

  useLayoutEffect(() => {
    const frames = animationFrames.current;
    frames.push(requestAnimationFrame(update));
    return () => {
      frames.forEach(cancelAnimationFrame);
      animationFrames.current = [];
    };
  }, [update]);

  const setReference: UseFloatingReturn['reference'] = useCallback(
    (node) => {
      reference.current = node;
      if (!isUpdateQueuedRef.current) animationFrames.current.push(requestAnimationFrame(update));
      isUpdateQueuedRef.current = true;
    },
    [update]
  );

  const setFloating: UseFloatingReturn['floating'] = useCallback(
    (node) => {
      floating.current = node;
      if (!isUpdateQueuedRef.current) animationFrames.current.push(requestAnimationFrame(update));
      isUpdateQueuedRef.current = true;
    },
    [update]
  );

  const setOffsetParent: UseFloatingReturn['offsetParent'] = useCallback(
    (node) => {
      offsetParent.current = node;
      if (!isUpdateQueuedRef.current) animationFrames.current.push(requestAnimationFrame(update));
      isUpdateQueuedRef.current = true;
    },
    [update]
  );

  const refs = useMemo(() => ({reference, floating, offsetParent}), []);

  return useMemo(
    () => ({
      ...data,
      update,
      refs,
      offsetParent: setOffsetParent,
      reference: setReference,
      floating: setFloating,
      scrollProps: {
        onScroll: (event) => setScrollOffsets(event.nativeEvent.contentOffset),
        scrollEventThrottle: 16,
      },
    }),
    [data, refs, setReference, setFloating, setOffsetParent, update]
  );
};

export const arrow = (options: {
  element: any;
  padding?: number | SideObject;
}): Middleware => {
  const {element, padding} = options;

  function isRef(value: unknown) {
    return Object.prototype.hasOwnProperty.call(value, 'current');
  }

  return {
    name: 'arrow',
    options,
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
