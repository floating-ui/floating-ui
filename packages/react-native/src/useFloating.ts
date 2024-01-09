import type {ComputePositionReturn} from '@floating-ui/core';
import {computePosition} from '@floating-ui/core';
import * as React from 'react';

import {createPlatform} from './createPlatform';
import type {UseFloatingOptions, UseFloatingReturn} from './types';
import {deepEqual} from './utils/deepEqual';

const ORIGIN = {x: 0, y: 0};

export function useFloating(
  options: UseFloatingOptions = {},
): UseFloatingReturn {
  const {
    placement = 'bottom',
    middleware = [],
    sameScrollView = true,
    elements: {
      reference: externalReference,
      floating: externalFloating,
      offsetParent: externalOffsetParent,
    } = {},
  } = options;

  const [_reference, _setReference] = React.useState(null);
  const [_floating, _setFloating] = React.useState(null);
  const [_offsetParent, _setOffsetParent] = React.useState(null);

  const referenceEl = externalReference || _reference;
  const floatingEl = externalFloating || _floating;
  const offsetParentEl = externalOffsetParent || _offsetParent;

  const setReference = React.useCallback((node: any) => {
    if (node !== referenceRef.current) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);

  const setFloating = React.useCallback((node: any) => {
    if (node !== floatingRef.current) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);

  const setOffsetParent = React.useCallback((node: any) => {
    if (node !== offsetParentRef.current) {
      offsetParentRef.current = node;
      _setOffsetParent(node);
    }
  }, []);

  const referenceRef = React.useRef<any>(null);
  const floatingRef = React.useRef<any>(null);
  const offsetParentRef = React.useRef<any>(null);

  const [data, setData] = React.useState<ComputePositionReturn>({
    x: 0,
    y: 0,
    placement,
    strategy: 'absolute',
    middlewareData: {},
  });

  const [scrollOffsets, setScrollOffsets] = React.useState(ORIGIN);
  const [latestMiddleware, setLatestMiddleware] = React.useState(middleware);

  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }

  const platform = React.useMemo(
    () =>
      createPlatform({
        offsetParent: offsetParentEl,
        scrollOffsets,
        sameScrollView,
      }),
    [offsetParentEl, scrollOffsets, sameScrollView],
  );

  const update = React.useCallback(() => {
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

  React.useLayoutEffect(() => {
    if (referenceEl) referenceRef.current = referenceEl;
    if (floatingEl) floatingRef.current = floatingEl;
    if (offsetParentEl) offsetParentRef.current = offsetParentEl;
    const frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [referenceEl, floatingEl, offsetParentEl, update]);

  const isMountedRef = React.useRef(true);
  React.useLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refs = React.useMemo(
    () => ({
      reference: referenceRef,
      floating: floatingRef,
      offsetParent: offsetParentRef,
      setReference,
      setFloating,
      setOffsetParent,
    }),
    [setReference, setFloating, setOffsetParent],
  );

  const elements = React.useMemo(
    () => ({
      reference: referenceEl,
      floating: floatingEl,
      offsetParent: offsetParentEl,
    }),
    [referenceEl, floatingEl, offsetParentEl],
  );

  const floatingStyles = React.useMemo(() => {
    if (!elements.floating) {
      return {
        position: 'absolute',
        left: 0,
        top: 0,
      } as const;
    }

    return {
      position: 'absolute',
      left: data.x,
      top: data.y,
    } as const;
  }, [elements.floating, data.x, data.y]);

  return React.useMemo(
    () => ({
      ...data,
      update,
      refs,
      elements,
      floatingStyles,
      offsetParent: setOffsetParent,
      reference: setReference,
      floating: setFloating,
      scrollProps: {
        onScroll: (event) => setScrollOffsets(event.nativeEvent.contentOffset),
        scrollEventThrottle: 16,
      },
    }),
    [
      data,
      refs,
      elements,
      floatingStyles,
      setReference,
      setFloating,
      setOffsetParent,
      update,
    ],
  );
}
