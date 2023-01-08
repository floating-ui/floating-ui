import {computePosition} from '@floating-ui/dom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import type {
  ReferenceType,
  UseFloatingData,
  UseFloatingProps,
  UseFloatingReturn,
  VirtualElement,
} from './types';
import {deepEqual} from './utils/deepEqual';
import {useLatestRef} from './utils/useLatestRef';

function isExternalElement(value: any): value is Element | VirtualElement {
  if (value === null) {
    return true;
  }
  return value ? !!value.getBoundingClientRect : false;
}

export function useFloating<RT extends ReferenceType = ReferenceType>(
  externalReferenceOrOptions: RT | null | UseFloatingProps,
  externalFloating: HTMLElement | null,
  options: UseFloatingProps = {}
): UseFloatingReturn<RT> {
  const isExternalSyncOverload =
    externalReferenceOrOptions &&
    !isExternalElement(externalReferenceOrOptions);

  if (isExternalSyncOverload) {
    options = externalReferenceOrOptions;
  }

  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
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

  const [internalReference, setReference] = React.useState<RT | null>(null);
  const [internalFloating, setFloating] = React.useState<HTMLElement | null>(
    null
  );

  const reference = isExternalElement(externalReferenceOrOptions)
    ? externalReferenceOrOptions
    : internalReference;
  const floating = isExternalElement(externalFloating)
    ? externalFloating
    : internalFloating;

  const [latestMiddleware, setLatestMiddleware] = React.useState(middleware);

  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }

  const cleanupRef = React.useRef<(() => void) | void | null>(null);
  const dataRef = React.useRef(data);

  const whileElementsMountedRef = useLatestRef(whileElementsMounted);

  const update = React.useCallback(() => {
    if (!reference || !floating) {
      return;
    }

    computePosition(reference, floating, {
      middleware: latestMiddleware,
      placement,
      strategy,
    }).then((data) => {
      const value = {...data, isPositioned: true};
      if (isMountedRef.current && !deepEqual(dataRef.current, value)) {
        dataRef.current = value;
        ReactDOM.flushSync(() => {
          setData(value);
        });
      }
    });
  }, [reference, floating, latestMiddleware, placement, strategy]);

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
    if (typeof cleanupRef.current === 'function') {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    if (reference && floating) {
      if (whileElementsMountedRef.current) {
        const cleanupFn = whileElementsMountedRef.current(
          reference,
          floating,
          update
        );

        cleanupRef.current = cleanupFn;
      } else {
        update();
      }
    }
  }, [reference, floating, update, whileElementsMountedRef]);

  const refs = React.useMemo(
    () => ({
      reference: {current: reference},
      floating: {current: floating},
      setReference,
      setFloating,
    }),
    [reference, floating]
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
    [data, update, refs, elements]
  );
}
