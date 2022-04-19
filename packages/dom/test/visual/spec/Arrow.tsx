import type {Placement} from '@floating-ui/core';
import {useFloating, arrow} from '@floating-ui/react-dom';
import {allPlacements} from '../utils/allPlacements';
import {useState, useLayoutEffect, useRef} from 'react';
import {Controls} from '../utils/Controls';
import {useSize} from '../utils/useSize';

export function Arrow() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const {
    x,
    y,
    reference,
    floating,
    strategy,
    update,
    placement: resultantPlacement,
    middlewareData: {arrow: {x: arrowX, y: arrowY} = {}},
  } = useFloating({
    placement,
    middleware: [arrow({element: arrowRef})],
  });

  const [size, handleSizeChange] = useSize(150);

  useLayoutEffect(update, [update, size]);

  const oppositeSidesMap: {[key: string]: string} = {
    top: 'bottom',
    left: 'right',
    right: 'left',
    bottom: 'top',
  };

  const staticSide = oppositeSidesMap[resultantPlacement.split('-')[0]];

  return (
    <>
      <h1>Arrow</h1>
      <p></p>
      <div className="container">
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
            width: size,
            height: size,
          }}
        >
          Floating
          <div
            ref={arrowRef}
            className="arrow"
            style={{
              position: 'absolute',
              top: arrowY ?? '',
              left: arrowX ?? '',
              right: '',
              bottom: '',
              [staticSide]: -15,
            }}
          />
        </div>
      </div>

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
