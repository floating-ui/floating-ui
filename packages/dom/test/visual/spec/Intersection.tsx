import {Placement as PlacementType} from '@floating-ui/core';
import {autoUpdate, flip, shift, useFloating} from '@floating-ui/react-dom';
import {useState} from 'react';

import {allPlacements} from '../utils/allPlacements';
import {Controls} from '../utils/Controls';
import {useSize} from '../utils/useSize';

function Obstacle({x, y}: {x: number; y: number}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        background: 'orange',
        padding: 15,
      }}
      data-floating-ui-obstacle
    >
      Obstacle
    </div>
  );
}

export function Intersection() {
  const [placement, setPlacement] = useState<PlacementType>('bottom');
  const [size, handleSizeChange] = useSize();

  const {refs, floatingStyles} = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [flip(), shift()],
  });

  return (
    <>
      <div
        style={{
          position: 'fixed',
          width: '100%',
          background: 'orange',
          top: 0,
          left: 0,
          textAlign: 'center',
          padding: 20,
        }}
        data-floating-ui-obstacle
      >
        Obstacle
      </div>
      <h1>Intersection</h1>
      <p>The floating element should avoid the obstacle elements.</p>
      <div className="container">
        <div style={{display: 'flex', gap: 10}}>
          <div
            ref={refs.setReference}
            className="reference"
            style={{width: 60, height: 60}}
          />
        </div>
        <div
          ref={refs.setFloating}
          className="floating"
          style={{...floatingStyles, width: size, height: size}}
        >
          Floating
        </div>
        <Obstacle x={500} y={500} />
        <Obstacle x={550} y={300} />
        <Obstacle x={600} y={600} />
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
