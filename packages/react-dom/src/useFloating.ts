import {computePosition} from '@floating-ui/dom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import type {
  ReferenceType,
  UseFloatingData,
  UseFloatingProps,
  UseFloatingReturn,
} from './types';
import {deepEqual} from './utils/deepEqual';
import {useLatestRef} from './utils/useLatestRef';

export function useFloating<RT extends ReferenceType = ReferenceType>({
  middleware = [],
  placement = 'bottom',
  strategy = 'absolute',
  whileElementsMounted,
  open,
}: UseFloatingProps = {}): UseFloatingReturn<RT> {
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

  const reference = React.useRef<RT | null>(null);
  const floating = React.useRef<HTMLElement | null>(null);
  const cleanupRef = React.useRef<(() => void) | void | null>(null);
  const dataRef = React.useRef(data);

  const whileElementsMountedRef = useLatestRef(whileElementsMounted);

  const update = React.useCallback(() => {
    if (!reference.current || !floating.current) {
      return;
    }

    computePosition(reference.current, floating.current, {
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
  }, [latestMiddleware, placement, strategy]);

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

  const runElementMountCallback = React.useCallback(() => {
    if (typeof cleanupRef.current === 'function') {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    if (reference.current && floating.current) {
      if (whileElementsMountedRef.current) {
        const cleanupFn = whileElementsMountedRef.current(
          reference.current,
          floating.current,
          update
        );

        cleanupRef.current = cleanupFn;
      } else {
        update();
      }
    }
  }, [update, whileElementsMountedRef]);

  const setReference: UseFloatingReturn<RT>['reference'] = React.useCallback(
    (node) => {
      if (reference.current !== node) {
        reference.current = node;
        runElementMountCallback();
      }
    },
    [runElementMountCallback]
  );

  const setFloating: UseFloatingReturn<RT>['floating'] = React.useCallback(
    (node) => {
      if (floating.current !== node) {
        floating.current = node;
        runElementMountCallback();
      }
    },
    [runElementMountCallback]
  );

  const refs = React.useMemo(() => ({reference, floating}), []);

  return React.useMemo(
    () => ({
      ...data,
      update,
      refs,
      reference: setReference,
      floating: setFloating,
    }),
    [data, update, refs, setReference, setFloating]
  );
}
