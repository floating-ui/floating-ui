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
  return value ? !!value.getBoundingClientRect : value === null;
}

export function useFloating<RT extends ReferenceType = ReferenceType>(
  externalReferenceOrOptions?: RT | null | UseFloatingProps,
  externalFloating?: HTMLElement | null,
  options: UseFloatingProps = {}
): UseFloatingReturn<RT> {
  const isExternalSync = isExternalElement(externalReferenceOrOptions);

  if (externalReferenceOrOptions && !isExternalSync) {
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

  const [latestMiddleware, setLatestMiddleware] = React.useState(middleware);

  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }

  const referenceRef = React.useRef<RT | null>(null);
  const floatingRef = React.useRef<HTMLElement | null>(null);
  const cleanupRef = React.useRef<(() => void) | void | null>(null);

  const whileElementsMountedRef = useLatestRef(whileElementsMounted);

  const [internalReference, _setReference] = React.useState<RT | null>(null);
  const [internalFloating, _setFloating] = React.useState<HTMLElement | null>(
    null
  );

  const reference = isExternalElement(externalReferenceOrOptions)
    ? externalReferenceOrOptions
    : internalReference;
  const floating = isExternalElement(externalFloating)
    ? externalFloating
    : internalFloating;

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

  useLayoutEffect(() => {
    if (isExternalSync) {
      referenceRef.current = reference;
      floatingRef.current = floating;
    }
  }, [isExternalSync, reference, floating]);

  const update = React.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }

    computePosition(referenceRef.current, floatingRef.current, {
      middleware: latestMiddleware,
      placement,
      strategy,
    }).then((data) => {
      if (isMountedRef.current) {
        ReactDOM.flushSync(() => {
          setData({...data, isPositioned: true});
        });
      }
    });
  }, [latestMiddleware, placement, strategy]);

  useLayoutEffect(() => {
    if (open === false) {
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
