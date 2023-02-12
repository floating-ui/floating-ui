import {computePosition} from '@floating-ui/dom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import type {
  ComputePositionConfig,
  ReferenceType,
  UseFloatingData,
  UseFloatingProps,
  UseFloatingReturn,
} from './types';
import {deepEqual} from './utils/deepEqual';
import {useLatestRef} from './utils/useLatestRef';

/**
 * Provides data to position a floating element.
 * @see https://floating-ui.com/docs/react
 */
export function useFloating<RT extends ReferenceType = ReferenceType>(
  options: UseFloatingProps = {}
): UseFloatingReturn<RT> {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform,
    whileElementsMounted,
    open,
  } = options;

  const [data, setData] = React.useState<UseFloatingData>({
    x: null,
    y: null,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false,
  });

  const [latestMiddleware, setLatestMiddleware] = React.useState(middleware);

  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }

  const referenceRef = React.useRef<RT | null>(null);
  const floatingRef = React.useRef<HTMLElement | null>(null);
  const dataRef = React.useRef(data);

  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const platformRef = useLatestRef(platform);

  const [reference, _setReference] = React.useState<RT | null>(null);
  const [floating, _setFloating] = React.useState<HTMLElement | null>(null);

  const setReference = React.useCallback((node: RT | null) => {
    if (referenceRef.current !== node) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);

  const setFloating = React.useCallback((node: HTMLElement | null) => {
    if (floatingRef.current !== node) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);

  const update = React.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }

    const config: ComputePositionConfig = {
      placement,
      strategy,
      middleware: latestMiddleware,
    };

    if (platformRef.current) {
      config.platform = platformRef.current;
    }

    computePosition(referenceRef.current, floatingRef.current, config).then(
      (data) => {
        const fullData = {...data, isPositioned: true};
        if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
          dataRef.current = fullData;
          ReactDOM.flushSync(() => {
            setData(fullData);
          });
        }
      }
    );
  }, [latestMiddleware, placement, strategy, platformRef]);

  useLayoutEffect(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData((data) => ({...data, isPositioned: false}));
    }
  }, [open]);

  const isMountedRef = React.useRef(false);
  useLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useLayoutEffect(() => {
    if (reference && floating) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(reference, floating, update);
      } else {
        update();
      }
    }
  }, [reference, floating, update, whileElementsMountedRef]);

  const refs = React.useMemo(
    () => ({
      reference: referenceRef,
      floating: floatingRef,
      setReference,
      setFloating,
    }),
    [setReference, setFloating]
  );

  const elements = React.useMemo(
    () => ({reference, floating}),
    [reference, floating]
  );

  return React.useMemo(
    () => ({
      ...data,
      update,
      refs,
      elements,
      reference: setReference,
      floating: setFloating,
    }),
    [data, update, refs, elements, setReference, setFloating]
  );
}
