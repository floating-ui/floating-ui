import {
  autoUpdate,
  flip,
  limitShift,
  shift,
  size,
  useFloating,
  type Placement,
  type ShiftOptions,
} from '@floating-ui/react-dom';
import {useState} from 'react';

import {Controls} from '../utils/Controls';
import {useResize} from '../utils/useResize';
import {useScroll} from '../utils/useScroll';
import {AllPlacementsControls} from '../utils/AllPlacementsControls';

type ShiftOrder = 'none' | 'before' | 'after';
const SHIFT_ORDERS: ShiftOrder[] = ['none', 'before', 'after'];

export function Size() {
  const [rtl, setRtl] = useState(false);
  const [placement, setPlacement] = useState<Placement>({
    side: 'bottom',
    align: 'center',
  });
  const [addFlip, setAddFlip] = useState(false);
  const [addShift, setAddShift] = useState<ShiftOrder>('none');
  const [shiftSideAxis, setShiftSideAxis] = useState(false);
  const [shiftLimiter, setShiftLimiter] = useState(false);

  const hasEdgeAlign = placement.align !== 'center';

  const shiftOptions: ShiftOptions = {
    padding: 10,
    sideAxis: shiftSideAxis,
    limiter: shiftLimiter ? limitShift({offset: 50}) : undefined,
  };

  const {x, y, strategy, update, refs} = useFloating({
    side: placement.side,
    align: placement.align,
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
  useResize(scrollRef, () => update());

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
                  addShift === 'before' && shiftSideAxis
                    ? 100
                    : addShift === 'before' && hasEdgeAlign
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
          <h3>shift.alignAxis</h3>
          <Controls>
            {[true, false].map((bool) => (
              <button
                key={String(bool)}
                data-testid={`shift.alignAxis-${bool}`}
                onClick={() => setShiftSideAxis(bool)}
                style={{
                  backgroundColor: shiftSideAxis === bool ? 'black' : '',
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
