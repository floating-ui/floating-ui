import type {Placement} from '@floating-ui/core';
import {
  autoUpdate,
  flip,
  limitShift,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import {useState} from 'react';

import {allPlacements} from '../utils/allPlacements';
import {Controls} from '../utils/Controls';
import {useResize} from '../utils/useResize';
import {useScroll} from '../utils/useScroll';

type ShiftOrder = 'none' | 'before' | 'after';
const SHIFT_ORDERS: ShiftOrder[] = ['none', 'before', 'after'];

export function Size() {
  const [rtl, setRtl] = useState(false);
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [addFlip, setAddFlip] = useState(false);
  const [addShift, setAddShift] = useState<ShiftOrder>('none');
  const [shiftCrossAxis, setShiftCrossAxis] = useState(false);
  const [shiftLimiter, setShiftLimiter] = useState(false);

  const hasEdgeAlignment = placement.includes('-');

  const shiftOptions = {
    padding: 10,
    crossAxis: shiftCrossAxis,
    limiter: shiftLimiter ? limitShift({offset: 50}) : undefined,
  };

  const {x, y, strategy, update, refs} = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      addFlip && flip({padding: 10}),
      addShift === 'before' && shift(shiftOptions),
      size({
        apply({availableHeight, availableWidth, elements}) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
      addShift === 'after' && shift(shiftOptions),
    ],
  });

  const {scrollRef, indicator} = useScroll({refs, update, rtl});
  useResize(scrollRef, update);

  return (
    <>
      <h1>Size</h1>
      <p></p>
      <div className="container" style={{direction: rtl ? 'rtl' : 'ltr'}}>
        <div
          className="scroll resize"
          data-x
          style={{position: 'relative'}}
          ref={scrollRef}
        >
          {indicator}
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
              width: 400,
              height: 300,
              ...(addShift !== 'none' && {
                width:
                  addShift === 'before' && shiftCrossAxis
                    ? 100
                    : addShift === 'before' && hasEdgeAlignment
                      ? 360
                      : 600,
                height: 600,
              }),
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

      <h2>Add flip</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`flip-${bool}`}
            onClick={() => setAddFlip(bool)}
            style={{
              backgroundColor: addFlip === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>Add shift</h2>
      <Controls>
        {SHIFT_ORDERS.map((str) => (
          <button
            key={str}
            data-testid={`shift-${str}`}
            onClick={() => setAddShift(str)}
            style={{
              backgroundColor: addShift === str ? 'black' : '',
            }}
          >
            {str}
          </button>
        ))}
      </Controls>

      {addShift !== 'none' && (
        <>
          <h3>shift.crossAxis</h3>
          <Controls>
            {[true, false].map((bool) => (
              <button
                key={String(bool)}
                data-testid={`shift.crossAxis-${bool}`}
                onClick={() => setShiftCrossAxis(bool)}
                style={{
                  backgroundColor: shiftCrossAxis === bool ? 'black' : '',
                }}
              >
                {String(bool)}
              </button>
            ))}
          </Controls>

          <h3>shift.limiter</h3>
          <Controls>
            {[true, false].map((bool) => (
              <button
                key={String(bool)}
                data-testid={`shift.limiter-${bool}`}
                onClick={() => setShiftLimiter(bool)}
                style={{
                  backgroundColor: shiftLimiter === bool ? 'black' : '',
                }}
              >
                {String(bool)}
              </button>
            ))}
          </Controls>
        </>
      )}
    </>
  );
}
