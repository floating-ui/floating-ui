import type {Dimensions, ElementRects, Placement} from '@floating-ui/core';
import {useFloating, size} from '@floating-ui/react-dom';
import {allPlacements} from '../utils/allPlacements';
import {useState, useLayoutEffect} from 'react';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

export function Size() {
  const [sizeData, setSizeData] = useState<ElementRects & Dimensions>();
  const [placement, setPlacement] = useState<Placement>('bottom');
  const {x, y, reference, floating, strategy, update, refs} = useFloating({
    placement,
    middleware: [
      size({
        apply: setSizeData,
        padding: 10,
      }),
    ],
  });

  useLayoutEffect(update, [update]);

  const {scrollRef, indicator} = useScroll({refs, update});

  return (
    <>
      <h1>Size</h1>
      <p></p>
      <div className="container">
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
              maxHeight: sizeData?.height ?? '',
              maxWidth: sizeData?.width ?? '',
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
    </>
  );
}
