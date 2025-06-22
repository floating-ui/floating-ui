import type {Placement} from '@floating-ui/core';
import {autoUpdate, shift, useFloating} from '@floating-ui/react-dom';
import {useState} from 'react';

import {Controls} from '../utils/Controls';
import {useSize} from '../utils/useSize';
import {AllPlacementsControls} from '../utils/AllPlacementsControls';

export function Scrollbars() {
  const [rtl, setRtl] = useState(false);
  const [placement, setPlacement] = useState<Placement>({
    side: 'bottom',
    align: 'center',
  });
  const {x, y, refs, strategy} = useFloating({
    side: placement.side,
    align: placement.align,
    whileElementsMounted: autoUpdate,
    middleware: [shift({align: true, altBoundary: true})],
  });
  const [size, handleSizeChange] = useSize(300);

  return (
    <>
      <h1>Scrollbars</h1>
      <p>The floating element should avoid scrollbars.</p>
      <div
        className="container"
        style={{overflow: 'scroll', direction: rtl ? 'rtl' : 'ltr'}}
      >
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
          max="400"
          value={size}
          onChange={handleSizeChange}
        />
      </Controls>

      <AllPlacementsControls
        placement={placement}
        setPlacement={setPlacement}
      />

      <h2>RTL</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`rtl-${bool}`}
            onClick={() => setRtl(bool)}
            style={{
              backgroundColor: bool === rtl ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>
    </>
  );
}
