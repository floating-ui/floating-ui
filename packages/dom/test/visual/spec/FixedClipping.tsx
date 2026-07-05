import type {Rect} from '@floating-ui/core';
import {platform} from '@floating-ui/dom';
import {useLayoutEffect, useRef, useState} from 'react';

import {Controls} from '../utils/Controls';

const SCENARIOS = [
  'no-cb',
  'static-cb-overflow',
  'absolute-cb',
  'fixed-cb',
  'static-cb-fixed-overflow',
  'fixed-overflow-no-cb',
  'absolute-in-fixed-static-cb',
  'fixed-cb-nested-cb',
  'absolute-cb-relative-overflow',
] as const;

type Scenario = (typeof SCENARIOS)[number];

// Computes the clipping rect of the element alongside the plain viewport
// rect (no clipping ancestors) so tests can compare the two. The DOM
// platform is synchronous, so the `Promisable` return type is cast away.
function getRects(element: Element): {clipping: Rect; viewport: Rect} {
  const platformWithCache = {...platform, _c: new Map()};
  const args = {
    element,
    rootBoundary: 'viewport',
    strategy: 'fixed',
  } as const;
  return {
    clipping: platform.getClippingRect.call(platformWithCache, {
      ...args,
      boundary: 'clippingAncestors',
    }) as Rect,
    viewport: platform.getClippingRect.call(platformWithCache, {
      ...args,
      boundary: [],
    }) as Rect,
  };
}

export function FixedClipping() {
  const [scenario, setScenario] = useState<Scenario>('no-cb');
  const [result, setResult] = useState<{
    scenario: Scenario;
    rects: {clipping: Rect; viewport: Rect};
  } | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (elementRef.current) {
      setResult({scenario, rects: getRects(elementRef.current)});
    }
  }, [scenario]);

  // Shaded so screenshots show the overflow ancestor's box; the background
  // does not affect geometry.
  const overflowAncestorStyle = {
    overflow: 'hidden',
    width: 100,
    height: 100,
    background: 'rgba(255, 99, 71, 0.4)',
  } as const;

  // `top`/`left` resolve against the element's containing block, so they
  // are chosen per scenario to make the element visibly overflow its
  // clipper (or visibly escape it) in screenshots.
  const element = (
    top: number,
    left: number,
    position: 'fixed' | 'absolute' = 'fixed',
  ) => (
    <div
      ref={elementRef}
      style={{
        position,
        top,
        left,
        width: 40,
        height: 40,
        background: 'royalblue',
      }}
    />
  );

  let scenarioJsx = (
    // Fixed element with no containing block ancestor escapes the overflow
    // ancestor's clipping.
    <div style={overflowAncestorStyle}>{element(60, 400)}</div>
  );

  if (scenario === 'static-cb-overflow') {
    // The static containing block's clip chain passes through the overflow
    // ancestor, which clips the fixed element.
    scenarioJsx = (
      <div data-testid="clipper" style={overflowAncestorStyle}>
        <div style={{transform: 'translateZ(0)'}}>{element(80, 80)}</div>
      </div>
    );
  } else if (scenario === 'absolute-cb') {
    // The absolute containing block escapes the static overflow ancestor
    // between it and its positioned ancestor, and so does the fixed element.
    scenarioJsx = (
      <div style={{position: 'relative'}}>
        <div style={overflowAncestorStyle}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'translateZ(0)',
            }}
          >
            {element(80, 80)}
          </div>
        </div>
      </div>
    );
  } else if (scenario === 'fixed-cb') {
    // A fixed containing block (e.g. a transformed drawer or modal) escapes
    // the overflow ancestor above it, and so does the fixed element (#2934).
    scenarioJsx = (
      <div style={overflowAncestorStyle}>
        <div
          style={{
            position: 'fixed',
            top: 50,
            left: 400,
            transform: 'translateZ(0)',
          }}
        >
          {element(80, 80)}
        </div>
      </div>
    );
  } else if (scenario === 'static-cb-fixed-overflow') {
    // A fixed overflow ancestor above a static containing block clips the
    // fixed element.
    scenarioJsx = (
      <div
        data-testid="clipper"
        style={{
          ...overflowAncestorStyle,
          position: 'fixed',
          top: 50,
          left: 400,
        }}
      >
        <div style={{transform: 'translateZ(0)'}}>{element(80, 80)}</div>
      </div>
    );
  } else if (scenario === 'absolute-in-fixed-static-cb') {
    // An absolute element inside a fixed ancestor escapes with it only up to
    // the fixed ancestor's containing block; the overflow ancestor above
    // that containing block clips.
    scenarioJsx = (
      <div data-testid="clipper" style={overflowAncestorStyle}>
        <div style={{transform: 'translateZ(0)'}}>
          <div style={{position: 'fixed', top: 0, left: 0}}>
            {element(80, 80, 'absolute')}
          </div>
        </div>
      </div>
    );
  } else if (scenario === 'fixed-cb-nested-cb') {
    // A fixed containing block escapes ancestors only up to the next
    // containing block (the inner overflow ancestor is escaped), and that
    // containing block clips when it is itself an overflow element.
    scenarioJsx = (
      <div
        data-testid="clipper"
        style={{...overflowAncestorStyle, transform: 'translateZ(0)'}}
      >
        <div style={{...overflowAncestorStyle, width: 50, height: 50}}>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              transform: 'translateZ(0)',
            }}
          >
            {element(80, 80)}
          </div>
        </div>
      </div>
    );
  } else if (scenario === 'absolute-cb-relative-overflow') {
    // An absolute containing block escapes only static ancestors: its
    // positioned (relative) overflow ancestor clips.
    scenarioJsx = (
      <div
        data-testid="clipper"
        style={{...overflowAncestorStyle, position: 'relative'}}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translateZ(0)',
          }}
        >
          {element(80, 80)}
        </div>
      </div>
    );
  } else if (scenario === 'fixed-overflow-no-cb') {
    // A fixed overflow ancestor that is not the fixed element's containing
    // block does not clip it.
    scenarioJsx = (
      <div
        style={{
          ...overflowAncestorStyle,
          position: 'fixed',
          top: 50,
          left: 400,
        }}
      >
        {element(60, 550)}
      </div>
    );
  }

  return (
    <>
      <h1>Fixed Clipping</h1>
      <p>
        The clipping rect of a fixed element respects its containing block
        chain.
      </p>
      {scenarioJsx}
      {result && (
        // Visualizes the computed clipping rect: the blue element should
        // never render outside the dashed outline.
        <div
          style={{
            position: 'fixed',
            left: result.rects.clipping.x,
            top: result.rects.clipping.y,
            width: result.rects.clipping.width,
            height: result.rects.clipping.height,
            outline: '2px dashed red',
            outlineOffset: -2,
            pointerEvents: 'none',
          }}
        />
      )}
      <pre data-testid="rects" data-scenario={result?.scenario}>
        {result ? JSON.stringify(result.rects) : ''}
      </pre>

      <h2>Scenario</h2>
      <Controls>
        {SCENARIOS.map((localScenario) => (
          <button
            key={localScenario}
            data-testid={`scenario-${localScenario}`}
            onClick={() => setScenario(localScenario)}
            style={{
              backgroundColor: localScenario === scenario ? 'black' : '',
            }}
          >
            {localScenario}
          </button>
        ))}
      </Controls>
    </>
  );
}
