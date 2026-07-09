import type {RootBoundary, Strategy} from '@floating-ui/core';
import {autoUpdate, platform, shift, useFloating} from '@floating-ui/react-dom';
import {useEffect, useLayoutEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

type BoundaryOption = 'viewport' | 'layoutViewport' | 'rect';

const BOUNDARY_OPTIONS: BoundaryOption[] = [
  'viewport',
  'layoutViewport',
  'rect',
];
const STRATEGY_OPTIONS: Strategy[] = ['absolute', 'fixed'];

function toRootBoundary(option: BoundaryOption): RootBoundary {
  if (option === 'rect') {
    return {
      x: 0,
      y: 0,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  }
  return option;
}

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ViewportBoundary() {
  const [boundary, setBoundary] = useState<BoundaryOption>('viewport');
  const [strategy, setStrategy] = useState<Strategy>('absolute');
  const [gutter, setGutter] = useState(true);
  const [scrollLock, setScrollLock] = useState(false);

  const rootBoundary = toRootBoundary(boundary);

  const shared = {
    strategy,
    whileElementsMounted: autoUpdate,
    middleware: [shift({crossAxis: true, rootBoundary})],
  };

  const left = useFloating({...shared, placement: 'bottom-start'});
  const right = useFloating({...shared, placement: 'bottom-end'});

  useLayoutEffect(() => {
    // `gutter` reserves scrollbar-gutter space; `scrollLock` sets
    // `overflow: hidden`. With both on and no scroll, the gutter is reserved
    // with no actual scrollbar (the original bug scenario); with scrollLock
    // off the page keeps a real scrollbar, which a browser may place on the
    // left (e.g. Firefox `layout.scrollbar.side`, RTL).
    const html = document.documentElement;
    html.style.scrollbarGutter = gutter ? 'stable' : '';
    html.style.overflowY = scrollLock ? 'hidden' : '';
    return () => {
      html.style.scrollbarGutter = '';
      html.style.overflowY = '';
    };
  }, [gutter, scrollLock]);

  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    let raf = 0;
    let prev = '';
    const tick = () => {
      const el = left.refs.reference.current;
      let clip: Box | null = null;
      if (el) {
        try {
          clip = platform.getClippingRect.call(
            {...platform, _c: new Map()},
            {
              element: el as Element,
              boundary: 'clippingAncestors',
              rootBoundary: toRootBoundary(boundary),
              strategy,
            },
          ) as Box;
        } catch {
          clip = null;
        }
      }
      const s = JSON.stringify(clip);
      if (s !== prev) {
        prev = s;
        setBox(clip);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundary, strategy, gutter]);

  return (
    <>
      <div style={{padding: '24px 24px 0'}}>
        <h1>Viewport Boundary</h1>
        <p style={{maxWidth: 720}}>
          Smoke test for the <code>viewport</code> / <code>layoutViewport</code>{' '}
          root boundary across browsers and scrollbar placements. The blue and
          green boxes are <code>shift</code>ed to the left and right edges; the
          red dashed outline is the boundary reported by{' '}
          <code>getClippingRect</code>. Both boxes should stay inside the
          visible viewport (and the dashed outline) with no horizontal scroll.
          Try <code>absolute</code> vs <code>fixed</code>, toggle the gutter,
          and test with a left-side scrollbar.
        </p>
      </div>

      <Controls>
        {BOUNDARY_OPTIONS.map((option) => (
          <button
            key={option}
            data-testid={`boundary-${option}`}
            onClick={() => setBoundary(option)}
            style={{backgroundColor: option === boundary ? 'black' : ''}}
          >
            {option}
          </button>
        ))}
        {STRATEGY_OPTIONS.map((option) => (
          <button
            key={option}
            data-testid={`strategy-${option}`}
            onClick={() => setStrategy(option)}
            style={{backgroundColor: option === strategy ? 'black' : ''}}
          >
            {option}
          </button>
        ))}
        <button
          data-testid="gutter"
          onClick={() => setGutter((g) => !g)}
          style={{backgroundColor: gutter ? 'black' : ''}}
        >
          gutter {gutter ? 'on' : 'off'}
        </button>
        <button
          data-testid="scroll-lock"
          onClick={() => setScrollLock((s) => !s)}
          style={{backgroundColor: scrollLock ? 'black' : ''}}
        >
          scroll lock {scrollLock ? 'on' : 'off'}
        </button>
      </Controls>

      {/* Tall spacer so the page is genuinely scrollable. */}
      <div style={{height: '200vh'}} />

      {/*
        Dotted outline of the boundary getClippingRect actually computes.
        Note: in Firefox with a left-side scrollbar, this `position: fixed`
        overlay can visually drift by the scrollbar width when scrolling to the
        page edge — a Firefox paint bug for fixed elements, not a boundary
        change (getClippingRect's x stays constant, and the floating elements
        are positioned correctly).
      */}
      {box && (
        <div
          style={{
            position: 'fixed',
            left: box.x,
            top: box.y,
            width: box.width,
            height: box.height,
            border: '2px dashed #e00',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            zIndex: 500,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 11,
              color: '#e00',
              background: '#fff',
              padding: '0 4px',
            }}
          >
            getClippingRect ({boundary}/{strategy})
          </span>
        </div>
      )}

      {/* Left-edge reference + floating. */}
      <div
        ref={left.refs.setReference}
        className="reference"
        style={{position: 'fixed', left: 0, top: '45vh'}}
      >
        L-ref
      </div>
      <div
        ref={left.refs.setFloating}
        data-testid="floating-left"
        style={{
          position: strategy,
          top: left.y ?? 0,
          left: left.x ?? 0,
          width: 200,
          height: 44,
          boxSizing: 'border-box',
          border: '4px solid #facc15',
          background: '#2563eb',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 600,
        }}
      >
        LEFT edge
      </div>

      {/* Right-edge reference + floating. */}
      <div
        ref={right.refs.setReference}
        className="reference"
        style={{position: 'fixed', right: 0, top: '45vh'}}
      >
        R-ref
      </div>
      <div
        ref={right.refs.setFloating}
        data-testid="floating-right"
        style={{
          position: strategy,
          top: right.y ?? 0,
          left: right.x ?? 0,
          width: 200,
          height: 44,
          boxSizing: 'border-box',
          border: '4px solid #facc15',
          background: '#16a34a',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 600,
        }}
      >
        RIGHT edge
      </div>
    </>
  );
}
