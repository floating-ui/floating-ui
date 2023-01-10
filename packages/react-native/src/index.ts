import type {
  ComputePositionReturn,
  Middleware,
  Placement,
  SideObject,
} from '@floating-ui/core';
import {arrow as arrowCore, computePosition} from '@floating-ui/core';
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
    setReference: (node: any) => void;
    setFloating: (node: any) => void;
    setOffsetParent: (node: any) => void;
  };
  elements: {
    reference: any;
    floating: any;
    offsetParent: any;
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
  const [reference, _setReference] = useState(null);
  const [floating, _setFloating] = useState(null);
  const [offsetParent, _setOffsetParent] = useState(null);

  const referenceRef = useRef<any>(null);
  const floatingRef = useRef<any>(null);
  const offsetParentRef = useRef<any>(null);

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

  const setReference = useCallback((node: any) => {
    if (referenceRef.current !== node) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);

  const setFloating = useCallback((node: any) => {
    if (floatingRef.current !== node) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);

  const setOffsetParent = useCallback((node: any) => {
    if (offsetParentRef.current !== node) {
      offsetParentRef.current = node;
      _setOffsetParent(node);
    }
  }, []);

  const update = useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }

    computePosition(referenceRef.current, floatingRef.current, {
      middleware: latestMiddleware,
      platform,
      placement,
    }).then((data) => {
      if (isMountedRef.current) {
        setData(data);
      }
    });
  }, [latestMiddleware, platform, placement]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [reference, floating, offsetParent, update]);

  const isMountedRef = useRef(true);
  useLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refs = useMemo(
    () => ({
      reference: referenceRef,
      floating: floatingRef,
      offsetParent: offsetParentRef,
      setReference,
      setFloating,
      setOffsetParent,
    }),
    [setReference, setFloating, setOffsetParent]
  );

  const elements = useMemo(
    () => ({
      reference,
      floating,
      offsetParent,
    }),
    [reference, floating, offsetParent]
  );

  return useMemo(
    () => ({
      ...data,
      update,
      refs,
      elements,
      offsetParent: setOffsetParent,
      reference: setReference,
      floating: setFloating,
      scrollProps: {
        onScroll: (event) => setScrollOffsets(event.nativeEvent.contentOffset),
        scrollEventThrottle: 16,
      },
    }),
    [data, refs, elements, setReference, setFloating, setOffsetParent, update]
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
