import type {Placement} from '@floating-ui/core';
import {flip, shift, size, useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {allPlacements} from '../utils/allPlacements';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

export function Size() {
  const [rtl, setRtl] = useState(false);
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [addFlipShift, setAddFlipShift] = useState(false);

  const hasEdgeAlignment = placement.includes('-');

  const {x, y, strategy, update, refs} = useFloating({
    placement,
    middleware: [
      addFlipShift && flip({padding: 10}),
      addFlipShift && !hasEdgeAlignment && shift({padding: 10}),
      size({
        apply({availableHeight, availableWidth, elements}) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
      addFlipShift && hasEdgeAlignment && shift({padding: 10}),
    ],
  });

  useLayoutEffect(update, [update, rtl]);

  const {scrollRef, indicator} = useScroll({refs, update, rtl});

  return (
    <>
      <h1>Size</h1>
      <p></p>
      <div className="container" style={{direction: rtl ? 'rtl' : 'ltr'}}>
        <div
          className="scroll"
          data-x
          style={{position: 'relative'}}
          ref={scrollRef}
        >
          {indicator}
          <div ref={refs.setReference} className="reference">
            Reference
          </div>
          <div
            ref={refs.setFloating}
            className="floating"
            style={{
              position: strategy,
              top: y ?? '',
              left: x ?? '',
              width: 400,
              height: 300,
              ...(addFlipShift && {
                width: 600,
                height: 600,
              }),
            }}
          >
            Floating
          </div>
        </div>
      </div>

      <h2>placement</h2>
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

      <h2>RTL</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`rtl-${bool}`}
            onClick={() => setRtl(bool)}
            style={{
              backgroundColor: rtl === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>Add flip and shift</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`flipshift-${bool}`}
            onClick={() => setAddFlipShift(bool)}
            style={{
              backgroundColor: addFlipShift === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>
    </>
  );
}
