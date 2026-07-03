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
] as const;

type Scenario = (typeof SCENARIOS)[number];

// Computes the clipping rect of the element alongside the plain viewport
// rect (no clipping ancestors) so tests can compare the two.
function getRects(element: Element) {
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
    }),
    viewport: platform.getClippingRect.call(platformWithCache, {
      ...args,
      boundary: [],
    }),
  };
}

export function FixedClipping() {
  const [scenario, setScenario] = useState<Scenario>('no-cb');
  const [result, setResult] = useState<{
    scenario: Scenario;
    json: string;
  } | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (elementRef.current) {
      setResult({scenario, json: JSON.stringify(getRects(elementRef.current))});
    }
  }, [scenario]);

  const element = (
    <div
      ref={elementRef}
      style={{
        position: 'fixed',
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        background: 'royalblue',
      }}
    />
  );

  let scenarioJsx = (
    // Fixed element with no containing block ancestor escapes the overflow
    // ancestor's clipping.
    <div style={{overflow: 'hidden', width: 100, height: 100}}>{element}</div>
  );

  if (scenario === 'static-cb-overflow') {
    // The static containing block's clip chain passes through the overflow
    // ancestor, which clips the fixed element.
    scenarioJsx = (
      <div
        data-testid="clipper"
        style={{overflow: 'hidden', width: 100, height: 100}}
      >
        <div style={{transform: 'translateZ(0)'}}>{element}</div>
      </div>
    );
  } else if (scenario === 'absolute-cb') {
    // The absolute containing block escapes the static overflow ancestor
    // between it and its positioned ancestor, and so does the fixed element.
    scenarioJsx = (
      <div style={{position: 'relative'}}>
        <div style={{overflow: 'hidden', width: 100, height: 100}}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'translateZ(0)',
            }}
          >
            {element}
          </div>
        </div>
      </div>
    );
  } else if (scenario === 'fixed-cb') {
    // A fixed containing block (e.g. a transformed drawer or modal) escapes
    // the overflow ancestor above it, and so does the fixed element (#2934).
    scenarioJsx = (
      <div style={{overflow: 'hidden', width: 100, height: 100}}>
        <div
          style={{
            position: 'fixed',
            top: 50,
            left: 50,
            transform: 'translateZ(0)',
          }}
        >
          {element}
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
          position: 'fixed',
          top: 50,
          left: 50,
          width: 100,
          height: 100,
          overflow: 'hidden',
        }}
      >
        <div style={{transform: 'translateZ(0)'}}>{element}</div>
      </div>
    );
  } else if (scenario === 'fixed-overflow-no-cb') {
    // A fixed overflow ancestor that is not the fixed element's containing
    // block does not clip it.
    scenarioJsx = (
      <div
        style={{
          position: 'fixed',
          top: 50,
          left: 50,
          width: 100,
          height: 100,
          overflow: 'hidden',
        }}
      >
        {element}
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
      <pre data-testid="rects" data-scenario={result?.scenario}>
        {result?.json}
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
