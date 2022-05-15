import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import {computePosition} from '@floating-ui/dom';
import type {
  UseFloatingProps,
  UseFloatingReturn,
  UseFloatingData,
  ReferenceType,
} from './types';
import {deepEqual} from './utils/deepEqual';
import {useLatestRef} from './utils/useLatestRef';

export function useFloating<RT extends ReferenceType = ReferenceType>({
  middleware,
  placement = 'bottom',
  strategy = 'absolute',
  whileElementsMounted,
}: UseFloatingProps = {}): UseFloatingReturn<RT> {
  const reference = React.useRef<RT | null>(null);
  const floating = React.useRef<HTMLElement | null>(null);

  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const cleanupRef = React.useRef<(() => void) | void | null>(null);

  const [data, setData] = React.useState<UseFloatingData>({
    // Setting these to `null` will allow the consumer to determine if
    // `computePosition()` has run yet
    x: null,
    y: null,
    strategy,
    placement,
    middlewareData: {},
  });

  const [latestMiddleware, setLatestMiddleware] = React.useState(middleware);

  if (
    !deepEqual(
      latestMiddleware?.map(({options}) => options),
      middleware?.map(({options}) => options)
    )
  ) {
    setLatestMiddleware(middleware);
  }

  const update = React.useCallback(() => {
    if (!reference.current || !floating.current) {
      return;
    }

    computePosition(reference.current, floating.current, {
      middleware: latestMiddleware,
      placement,
      strategy,
    }).then((data) => {
      if (isMountedRef.current) {
        ReactDOM.flushSync(() => {
          setData(data);
        });
      }
    });
  }, [latestMiddleware, placement, strategy]);

  useLayoutEffect(() => {
    // Skip first update
    if (isMountedRef.current) {
      update();
    }
  }, [update]);

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
      reference.current = node;
      runElementMountCallback();
    },
    [runElementMountCallback]
  );

  const setFloating: UseFloatingReturn<RT>['floating'] = React.useCallback(
    (node) => {
      floating.current = node;
      runElementMountCallback();
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
