import type {Placement} from '@floating-ui/core';
import {useFloating, arrow, offset, flip, shift} from '@floating-ui/react-dom';
import {allPlacements} from '../utils/allPlacements';
import {useState, useLayoutEffect, useRef} from 'react';
import {Controls} from '../utils/Controls';
import {useSize} from '../utils/useSize';
import {Container} from '../utils/Container';

export function Complex() {
  const [size, handleSizeChange] = useSize(150);
  const [referenceSize, handleReferenceSizeChange] = useSize(160);
  const [offsetValue, handleOffsetChange] = useSize(15);
  const [shiftValue, handleShiftChange] = useSize(5);
  const [paddingValue, handlePaddingChange] = useSize(10);
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
    middleware: [
      offset(offsetValue),
      flip(),
      shift({padding: shiftValue}),
      arrow({element: arrowRef, padding: paddingValue})
    ],
  });

  useLayoutEffect(update, [update, size, referenceSize, paddingValue]);

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
          ref={reference}
          className="reference"
          style={{ width: referenceSize, height: referenceSize }}
        >
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
      </Container>

      <Controls>
        <label htmlFor="referenceSize">Reference size</label>
        <input
          id="referenceSize"
          type="range"
          min="1"
          max="200"
          value={referenceSize}
          onChange={handleReferenceSizeChange}
        />
      </Controls>
      <Controls>
        <label htmlFor="size">Floating size</label>
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
