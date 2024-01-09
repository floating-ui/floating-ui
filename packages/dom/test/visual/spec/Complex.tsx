import type {Placement} from '@floating-ui/core';
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import {useRef, useState} from 'react';

import {BoxSizeControl} from '../utils/BoxSizeControl';
import {Container} from '../utils/Container';
import {Controls} from '../utils/Controls';
import {allPlacements} from '../utils/allPlacements';
import {useBoxSize} from '../utils/useBoxSize';
import {useSize} from '../utils/useSize';

export function Complex() {
  const [floatingSizeValue, floatingSize, handleFloatingSizeChange] =
    useBoxSize();
  const [referenceSizeValue, referenceSize, handleReferenceSizeChange] =
    useBoxSize();
  const [offsetValue, handleOffsetChange] = useSize(15);
  const [shiftValue, handleShiftChange] = useSize(5);
  const [paddingValue, handlePaddingChange] = useSize(10);
  const [placement, setPlacement] = useState<Placement>('bottom');

  const arrowRef = useRef<HTMLDivElement | null>(null);
  const {
    x,
    y,
    refs,
    strategy,
    update,
    placement: resultantPlacement,
    middlewareData: {arrow: {x: arrowX, y: arrowY} = {}},
  } = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      flip(),
      shift({padding: shiftValue}),
      arrow({element: arrowRef, padding: paddingValue}),
    ],
  });

  const oppositeSidesMap: {[key: string]: string} = {
    top: 'bottom',
    left: 'right',
    right: 'left',
    bottom: 'top',
  };

  const staticSide = oppositeSidesMap[resultantPlacement.split('-')[0]];

  return (
    <>
      <h1>Complex</h1>
      <p>
        This case shows a complex use case of having a nice popover pointing at
        the reference just like a tooltip would.
      </p>
      <Container update={update}>
        <div
          ref={refs.setReference}
          className="reference"
          style={{width: referenceSizeValue, height: referenceSizeValue}}
        >
          Reference
        </div>
        <div
          ref={refs.setFloating}
          className="floating"
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
            width: floatingSizeValue,
            height: floatingSizeValue,
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
      </Container>

      <BoxSizeControl
        id="reference-size"
        label="Reference size"
        onChange={handleReferenceSizeChange}
        size={referenceSize}
      />
      <BoxSizeControl
        id="floating-size"
        label="Floating size"
        onChange={handleFloatingSizeChange}
        size={floatingSize}
      />
      <Controls>
        <label htmlFor="offset">Offset</label>
        <input
          id="offset"
          type="range"
          min="0"
          max="50"
          value={offsetValue}
          onChange={handleOffsetChange}
        />
      </Controls>
      <Controls>
        <label htmlFor="shift">Shift</label>
        <input
          id="shift"
          type="range"
          min="0"
          max="50"
          value={shiftValue}
          onChange={handleShiftChange}
        />
      </Controls>
      <Controls>
        <label htmlFor="padding">Arrow padding</label>
        <input
          id="padding"
          type="range"
          min="0"
          max="50"
          value={paddingValue}
          onChange={handlePaddingChange}
        />
      </Controls>
      <h3>Floating position</h3>
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
