import type {Placement} from '@floating-ui/core';
import {useFloating, arrow, shift, autoUpdate} from '@floating-ui/react-dom';
import {allPlacements} from '../utils/allPlacements';
import {useState, useRef} from 'react';
import {Controls} from '../utils/Controls';
import {useSize} from '../utils/useSize';
import {useScroll} from '../utils/useScroll';

export function Arrow() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const arrowRef = useRef<HTMLDivElement | null>(null);

  const [floatingSize, handleFloatingSizeChange] = useSize(100, 'floating');
  const [referenceSize, handleReferenceSizeChange] = useSize(200, 'reference');
  const [arrowPadding, handleArrowPaddingChange] = useSize(0, 'arrow_padding');

  const {
    x,
    y,
    reference,
    floating,
    strategy,
    update,
    placement: resultantPlacement,
    middlewareData: {arrow: {x: arrowX, y: arrowY} = {}},
    refs,
  } = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      shift(),
      arrow({
        element: arrowRef,
        padding: arrowPadding,
      }),
    ],
  });

  const oppositeSidesMap: {[key: string]: string} = {
    top: 'bottom',
    left: 'right',
    right: 'left',
    bottom: 'top',
  };

  const staticSide = oppositeSidesMap[resultantPlacement.split('-')[0]];

  const {scrollRef} = useScroll({refs, update});

  return (
    <>
      <h1>Arrow</h1>
      <p></p>
      <div className="container">
        <div
          className="scroll"
          ref={scrollRef}
          data-x
          style={{position: 'relative'}}
        >
          <div
            ref={reference}
            className="reference"
            style={{
              width: referenceSize,
              height: referenceSize,
            }}
          >
            Reference
          </div>
          <div
            ref={floating}
            className="floating"
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: floatingSize,
              height: floatingSize,
            }}
          >
            Floating
            <div
              ref={arrowRef}
              className="arrow"
              style={{
                position: 'absolute',
                top: arrowY != null ? arrowY : '',
                left: arrowX != null ? arrowX : '',
                right: '',
                bottom: '',
                [staticSide]: -15,
              }}
            />
          </div>
        </div>
      </div>

      <Controls>
        <div>
          <label htmlFor="floating-size">Floating size</label>
          <input
            id="floating-size"
            type="range"
            min="1"
            max="200"
            value={floatingSize}
            onChange={handleFloatingSizeChange}
          />
        </div>
        <div>
          <label htmlFor="reference-size">Reference size</label>
          <input
            id="reference-size"
            type="range"
            min="1"
            max="200"
            value={referenceSize}
            onChange={handleReferenceSizeChange}
          />
        </div>
        <div>
          <label htmlFor="arrow-size">Arrow padding</label>
          <input
            id="arrow-size"
            type="range"
            min="0"
            max="50"
            value={arrowPadding}
            onChange={handleArrowPaddingChange}
          />
        </div>
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
