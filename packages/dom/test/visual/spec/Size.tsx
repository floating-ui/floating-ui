import type {Placement} from '@floating-ui/core';
import {useFloating, size} from '@floating-ui/react-dom';
import {allPlacements} from '../utils/allPlacements';
import {useState, useLayoutEffect} from 'react';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

export function Size() {
  const [rtl, setRtl] = useState(false);
  const [placement, setPlacement] = useState<Placement>('bottom');
  const {x, y, reference, floating, strategy, update, refs} = useFloating({
    placement,
    middleware: [
      size({
        apply({availableHeight, availableWidth, elements}) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
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
          <div ref={reference} className="reference">
            Reference
          </div>
          <div
            ref={floating}
            className="floating"
            style={{
              position: strategy,
              top: y ?? '',
              left: x ?? '',
              width: 400,
              height: 300,
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
    </>
  );
}
