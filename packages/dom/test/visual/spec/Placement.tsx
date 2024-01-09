import type {Placement as PlacementType} from '@floating-ui/core';
import {autoUpdate, useFloating} from '@floating-ui/react-dom';
import {useState} from 'react';

import {flushSync} from 'react-dom';
import {Controls} from '../utils/Controls';
import {allPlacements} from '../utils/allPlacements';
import {useSize} from '../utils/useSize';

export function Placement() {
  const [rtl, setRtl] = useState(false);
  const [placement, setPlacement] = useState<PlacementType>('bottom');
  const {refs, floatingStyles, update} = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
  });
  const [size, handleSizeChange] = useSize();

  return (
    <>
      <h1>Placement</h1>
      <p>
        The floating element should be correctly positioned when given each of
        the 12 placements.
      </p>
      <div className="container" style={{direction: rtl ? 'rtl' : 'ltr'}}>
        <div ref={refs.setReference} className="reference">
          Reference
        </div>
        <div
          ref={refs.setFloating}
          className="floating"
          style={{
            ...floatingStyles,
            width: size,
            height: size,
          }}
        >
          Floating
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

      <h2>RTL</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`rtl-${bool}`}
            onClick={() => {
              flushSync(() => setRtl(bool));
              update();
            }}
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
