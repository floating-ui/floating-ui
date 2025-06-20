import type {Placement} from '@floating-ui/core';
import {arrow, autoUpdate, useFloating} from '@floating-ui/react-dom';
import {useRef, useState} from 'react';

import {Controls} from '../utils/Controls';
import {useSize} from './useSize';
import {AllPlacementsControls} from './AllPlacementsControls';

export function New() {
  const [placement, setPlacement] = useState<Placement>({
    side: 'bottom',
    align: 'center',
  });
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const {refs, floatingStyles} = useFloating({
    side: placement.side,
    align: placement.align,
    whileElementsMounted: autoUpdate,
    middleware: [arrow({element: arrowRef})],
  });

  const [size, handleSizeChange] = useSize();

  return (
    <>
      <h1>New</h1>
      <p>This route lets you work on new features! Have fun :-)</p>
      <div className="container">
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

      <h2>Size</h2>
      <Controls>
        <input
          type="range"
          min="1"
          max="200"
          value={size}
          onChange={handleSizeChange}
        />
      </Controls>

      <h2>Placement</h2>
      <AllPlacementsControls
        placement={placement}
        setPlacement={setPlacement}
      />
    </>
  );
}
