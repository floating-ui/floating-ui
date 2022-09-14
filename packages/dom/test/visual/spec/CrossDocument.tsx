import {
  forwardRef,
  ForwardedRef,
  HTMLProps,
  LegacyRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom'

import type { Middleware, Placement } from '@floating-ui/core';
import {
  autoUpdate,
  limitShift as limitShiftFn,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';

import {Controls} from '../utils/Controls';
import {defineElements} from '../utils/shadowDOM';
import {allPlacements} from '../utils/allPlacements';
import {useScroll} from '../utils/useScroll';
import {useSize} from '../utils/useSize';

defineElements();

const SCENARIOS = ['Reference in iframe', 'Floating in iframe', 'Both in same iframe'] as const;
type Scenario = typeof SCENARIOS[number];

function isRef(value: unknown): value is React.MutableRefObject<unknown> {
  return Object.prototype.hasOwnProperty.call(value, 'current');
}

export const IFrame = forwardRef((
  {
    children,
    ...props
  }: HTMLProps<HTMLIFrameElement>,
  forwardedRef: ForwardedRef<HTMLIFrameElement>
) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);

  const headPortal = useMemo(() => {
    const iFrameHead = contentRef?.contentWindow?.document?.head;

    if (!iFrameHead) {
      return null;
    }

    return createPortal(
      <>
        {/* Use the same styles as in the top-level document */}
        {Array.from(contentRef?.ownerDocument.querySelectorAll('link') ?? []).map(
          ({href}) => <link key={href} rel="stylesheet" href={href} />
          )}
        {/* Additional styles needed by the iframe's content */}
        <style type='text/css'>{`
          body {
            /* necessary to override body styles from main stylesheet */
            padding: 0;
            /* Center reference inside the iframe */
            display: grid;
            place-items: center;
          }
        `}</style>
      </>,
      iFrameHead
    );
  }, [contentRef]);

  const rootPortal = useMemo(() => {
    const iFrameRoot = contentRef?.contentWindow?.document?.body;

    if (!iFrameRoot) {
      return null;
    }

    return createPortal(children, iFrameRoot);
  }, [contentRef, children])

  const mergedIframeRef: LegacyRef<HTMLIFrameElement> = useCallback(
    (node: HTMLIFrameElement | null) => {
      setContentRef(node);
      if (forwardedRef && isRef(forwardedRef)) {
        forwardedRef.current = node;
      } else if (forwardedRef) {
        forwardedRef(node);
      }
    },
    [forwardedRef]
  );

  return (
    <iframe {...props} ref={mergedIframeRef}>
      {/* Add styles to the <head> */}
      {headPortal}
      {/* Add content to the <body> */}
      {rootPortal}
    </iframe>
  );
});

export function CrossDocument() {
  const [scenario, setScenario] = useState<Scenario>('Reference in iframe');
  const [placement, setPlacement] = useState<Placement | undefined>(undefined);
  const [offsetValue, setOffsetValue] = useState(0);
  const [enableShift, setEnableShift] = useState(false);
  const [shiftMainAxis, setShiftMainAxis] = useState(true);
  const [shiftCrossAxis, setShiftCrossAxis] = useState(false);
  const [limitShift, setLimitShift] = useState(false);
  const [rafAutoUpdate, setRafAutoUpdate] = useState(false);

  const {
    x,
    y,
    reference,
    floating,
    strategy,
    update,
    refs,
  } = useFloating({
    placement,
    middleware: [
      offset(offsetValue),
      enableShift ? shift({
        mainAxis: shiftMainAxis,
        crossAxis: shiftCrossAxis,
        limiter: limitShift
          ? limitShiftFn()
          : undefined,
      }) : null,
    ].filter((m: Middleware | null): m is Middleware => Boolean(m)),
  });

  const [size, handleSizeChange] = useSize();
  const {scrollRef, indicator} = useScroll({refs, update});

  useLayoutEffect(update, [ scenario, update, size ]);

  useLayoutEffect(() => {
    // Hack to force a re-render that also creates new values for `refs` and/or
    // `update`, so that `useFloating` can compute the position correctly.
    setTimeout(() => setPlacement('top'), 50);
  }, []);

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }

    return autoUpdate(
      refs.reference.current,
      refs.floating.current,
      update,
      { animationFrame: rafAutoUpdate }
    );
  }, [refs.floating, refs.reference, rafAutoUpdate, update]);

  const referenceJsx = <div
    ref={reference}
    className="reference"
  >
    Reference
  </div>;

  const floatingJsx = <div
    ref={floating}
    className="floating"
    style={{
      position: strategy,
      top: y ?? '',
      left: x ?? '',
      width: size,
      height: size,
    }}
  >
    Floating
  </div>;

  return (
    <>
      <h1>Cross document</h1>
      <p>
        The floating element should be positioned correctly when in a different <span style={{fontFamily: 'monospace'}}>ownerDocument</span> than its reference.
      </p>
      <div
        className='container'
        style={{
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {scenario === 'Reference in iframe' ? (
          <><IFrame>
            <IFrame style={{
              maxWidth: '90%',
              margin: '0 auto',
            }}>
              <div
                className="scroll"
                style={{position: 'relative'}}
                data-x
                ref={scrollRef}
                >
                {indicator}
                {referenceJsx}
              </div>
            </IFrame>
          </IFrame>
          {floatingJsx}
          </>
        // ) : scenario === 'Floating in iframe' ? (
        //   <>
        //     <div
        //       className="scroll"
        //       data-x
        //       style={{position: 'relative', zIndex: 1}}
        //       ref={scrollRef}
        //       >
        //       {indicator}
        //       {referenceJsx}
        //     </div>
        //     <IFrame style={{
        //       position: 'absolute',
        //       zIndex: 0,
        //       width: '100%',
        //       height: '100%',
        //       inset: 0,
        //     }}>
        //       {floatingJsx}
        //     </IFrame>
        //   </>
        ) : scenario === 'Both in same iframe' ? (
          <IFrame>
            <div
              className="scroll"
              data-x
              style={{position: 'relative'}}
              ref={scrollRef}
              >
              {indicator}
              {referenceJsx}
              {floatingJsx}
            </div>
          </IFrame>
         ) : (
          null
        )}
      </div>

      <h2>Scenarios</h2>
      <Controls>
        {SCENARIOS.map((s) => (
          <button
            key={s}
            data-testid={`scenario-${s}`}
            onClick={() => setScenario(s)}
            style={{
              backgroundColor: scenario === s ? 'black' : '',
            }}
          >
            {s}
          </button>
        ))}
      </Controls>

      <h2>Size</h2>
      <Controls>
        <label htmlFor="size">Size</label>
        <input
          id="size"
          type="range"
          min="1"
          max="200"
          value={size}
          onChange={handleSizeChange}
        />
      </Controls>

      <h2>Placement</h2>
      <Controls>
        {allPlacements.map((localPlacement) => (
          <button
            key={localPlacement}
            data-testid={`placement-${localPlacement}`}
            onClick={() => setPlacement(localPlacement)}
            style={{
              backgroundColor: localPlacement === placement ? 'black' : '',
            }}
          >
            {localPlacement}
          </button>
        ))}
      </Controls>

      <h2>Offset</h2>
      <Controls>
        {[0, 10].map((value) => (
          <button
            key={String(value)}
            data-testid={`offset-${value}`}
            onClick={() => setOffsetValue(value)}
            style={{backgroundColor: offsetValue === value ? 'black' : ''}}
          >
            {String(value)}
          </button>
        ))}
      </Controls>

      <h2>Shift</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`enableShift-${bool}`}
            onClick={() => setEnableShift(bool)}
            style={{backgroundColor: enableShift === bool ? 'black' : ''}}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h3>Shift.mainAxis</h3>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`shiftMainAxis-${bool}`}
            onClick={() => setShiftMainAxis(bool)}
            style={{backgroundColor: shiftMainAxis === bool ? 'black' : ''}}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h3>Shift.crossAxis</h3>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`shiftCrossAxis-${bool}`}
            onClick={() => setShiftCrossAxis(bool)}
            style={{backgroundColor: shiftCrossAxis === bool ? 'black' : ''}}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h3>Shift.limitShift</h3>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`limitShift-${bool}`}
            onClick={() => setLimitShift(bool)}
            style={{backgroundColor: limitShift === bool ? 'black' : ''}}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>Use animationFrame strategy for autoUpdates</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`autoUpdateRAF-${bool}`}
            onClick={() => setRafAutoUpdate(bool)}
            style={{backgroundColor: rafAutoUpdate === bool ? 'black' : ''}}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>
    </>
  );
}
