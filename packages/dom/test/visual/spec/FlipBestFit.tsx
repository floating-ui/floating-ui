import type {Placement} from '@floating-ui/core';
import {autoUpdate, flip, size, useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useRef, useState} from 'react';

import {Controls} from '../utils/Controls';

type Scenario = 'y' | 'x' | 'x-rtl' | 'size';

const SCENARIOS: Scenario[] = ['y', 'x', 'x-rtl', 'size'];

// The floating element is larger than the scrollport on its main axis, so no
// placement fits. The reference sits 250px from the content's origin edge and
// past the scrollport's center, so the origin side (top/left — right in RTL)
// overflows the least: choosing it clips the floating element behind the
// scroll origin where it can never be scrolled into view, while the opposite
// side remains reachable.
// https://github.com/floating-ui/floating-ui/issues/3014
const SCROLLER_SIZE = 400;
const CONTENT_MAIN = 1000;
const CONTENT_CROSS = 300;
const REFERENCE_SIZE = 100;
const REFERENCE_OFFSET = 250;
const FLOATING_MAIN = 500;
const FLOATING_CROSS = 80;

// The initial placement is the origin side, which previously won the
// `bestFit` fallback by overflowing the least. In the `size` scenario it is
// the scrollable side, which must *not* win when `size()` constrains the
// floating element (the least-overflowing side fits more content).
const INITIAL_PLACEMENTS: Record<Scenario, Placement> = {
  y: 'top',
  x: 'left',
  'x-rtl': 'right',
  size: 'bottom',
};

export function FlipBestFit() {
  const [scenario, setScenario] = useState<Scenario>('y');
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const isX = scenario === 'x' || scenario === 'x-rtl';
  const rtl = scenario === 'x-rtl';
  const withSize = scenario === 'size';

  const {x, y, strategy, refs} = useFloating({
    placement: INITIAL_PLACEMENTS[scenario],
    whileElementsMounted: autoUpdate,
    middleware: [
      flip(),
      withSize &&
        size({
          apply({elements, availableHeight}) {
            Object.assign(elements.floating.style, {
              maxHeight: `${Math.max(0, availableHeight)}px`,
            });
          },
        }),
    ],
  });

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.scrollTop = isX ? 0 : 60;
      scroller.scrollLeft = isX ? (rtl ? -60 : 60) : 0;
    }
  }, [scenario, isX, rtl]);

  return (
    <>
      <h1>FlipBestFit</h1>
      <p>
        The floating element cannot fit on any placement, so the bestFit
        fallback should overflow toward the side that can be scrolled into view.
      </p>
      <div className="container">
        <div
          key={scenario}
          ref={scrollerRef}
          className="scroller"
          dir={rtl ? 'rtl' : 'ltr'}
          style={{
            width: SCROLLER_SIZE,
            height: SCROLLER_SIZE,
            overflow: 'auto',
            border: '1px solid black',
            background: '#edeff7',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: isX ? CONTENT_MAIN : CONTENT_CROSS,
              height: isX ? CONTENT_CROSS : CONTENT_MAIN,
            }}
          >
            <div
              ref={refs.setReference}
              className="reference"
              style={{
                position: 'absolute',
                width: REFERENCE_SIZE,
                height: REFERENCE_SIZE,
                ...(isX
                  ? {
                      [rtl ? 'right' : 'left']: REFERENCE_OFFSET,
                      top: (CONTENT_CROSS - REFERENCE_SIZE) / 2,
                    }
                  : {
                      top: REFERENCE_OFFSET,
                      left: (CONTENT_CROSS - REFERENCE_SIZE) / 2,
                    }),
              }}
            >
              Reference
            </div>
            <div
              ref={refs.setFloating}
              className="floating"
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: isX ? FLOATING_MAIN : FLOATING_CROSS,
                ...(withSize
                  ? {height: FLOATING_MAIN, overflowY: 'auto' as const}
                  : {height: isX ? FLOATING_CROSS : FLOATING_MAIN}),
              }}
            >
              {withSize ? (
                <div style={{height: FLOATING_MAIN}}>Floating</div>
              ) : (
                'Floating'
              )}
            </div>
          </div>
        </div>
      </div>

      <h2>Scenario</h2>
      <Controls>
        {SCENARIOS.map((localScenario) => (
          <button
            key={localScenario}
            data-testid={`scenario-${localScenario}`}
            onClick={() => setScenario(localScenario)}
            style={{
              backgroundColor: scenario === localScenario ? 'black' : '',
            }}
          >
            {localScenario}
          </button>
        ))}
      </Controls>
    </>
  );
}
