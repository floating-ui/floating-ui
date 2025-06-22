import type {Placement} from '@floating-ui/core';
import type {LimitShiftOptions} from '@floating-ui/core';
import {
  autoUpdate,
  limitShift as limitShiftFn,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import {useState} from 'react';

import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';
import {AllPlacementsControls} from '../utils/AllPlacementsControls';

const BOOLS = [true, false];
const LIMIT_SHIFT_OFFSET: Array<{
  offset: LimitShiftOptions['offset'];
  name: string;
}> = [
  {offset: 0, name: '0'},
  {offset: 50, name: '50'},
  {offset: -50, name: '-50'},
  {offset: {side: 50}, name: 'mA: 50'},
  {offset: {align: 50}, name: 'cA: 50'},
  {offset: ({rects}) => rects.reference.width / 2, name: 'fn => r.width/2'},
  {
    offset: ({rects}) => ({align: rects.reference.width}),
    name: 'fn => cA: f.width/2',
  },
];

export function Shift() {
  const [placement, setPlacement] = useState<Placement>({
    side: 'bottom',
    align: 'center',
  });
  const [side, setSide] = useState(true);
  const [align, setAlign] = useState(false);
  const [limitShift, setLimitShift] = useState(false);
  const [limitShiftsideAxis, setLimitShiftsideAxis] =
    useState<LimitShiftOptions['side']>(true);
  const [limitShiftalignAxis, setLimitShiftalignAxis] =
    useState<LimitShiftOptions['align']>(true);
  const [limitShiftOffset, setLimitShiftOffset] =
    useState<LimitShiftOptions['offset']>(0);
  const [offsetValue, setOffsetValue] = useState(0);
  const {x, y, strategy, refs, update} = useFloating({
    side: placement.side,
    align: placement.align,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      shift({
        side,
        align,
        limiter: limitShift
          ? limitShiftFn({
              side: limitShiftsideAxis,
              align: limitShiftalignAxis,
              offset: limitShiftOffset,
            })
          : undefined,
      }),
    ],
  });

  const {scrollRef, indicator} = useScroll({refs, update});

  return (
    <>
      <h1>Shift</h1>
      <p></p>
      <div className="container">
        <div
          className="scroll"
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

      <h2>offset</h2>
      <Controls>
        {[0, 10].map((value) => (
          <button
            key={String(value)}
            data-testid={`offset-${value}`}
            onClick={() => setOffsetValue(value)}
            style={{backgroundColor: offsetValue === value ? 'black' : ''}}
          >
            {String(value)}
          </button>
        ))}
      </Controls>

      <h2>sideAxis</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`sideAxis-${bool}`}
            onClick={() => setSide(bool)}
            style={{backgroundColor: side === bool ? 'black' : ''}}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>alignAxis</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`alignAxis-${bool}`}
            onClick={() => setAlign(bool)}
            style={{backgroundColor: align === bool ? 'black' : ''}}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>limitShift</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`limitShift-${bool}`}
            onClick={() => setLimitShift(bool)}
            style={{backgroundColor: limitShift === bool ? 'black' : ''}}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      {limitShift && (
        <>
          <h3>limitShift.sideAxis</h3>
          <Controls>
            {BOOLS.map((bool) => (
              <button
                key={String(bool)}
                data-testid={`limitShift.sideAxis-${bool}`}
                onClick={() => setLimitShiftsideAxis(bool)}
                style={{
                  backgroundColor: limitShiftsideAxis === bool ? 'black' : '',
                }}
              >
                {String(bool)}
              </button>
            ))}
          </Controls>

          <h3>limitShift.alignAxis</h3>
          <Controls>
            {BOOLS.map((bool) => (
              <button
                key={String(bool)}
                data-testid={`limitShift.alignAxis-${bool}`}
                onClick={() => setLimitShiftalignAxis(bool)}
                style={{
                  backgroundColor: limitShiftalignAxis === bool ? 'black' : '',
                }}
              >
                {String(bool)}
              </button>
            ))}
          </Controls>

          <h3>limitShift.offset</h3>
          <Controls>
            {LIMIT_SHIFT_OFFSET.map(({offset, name}) => (
              <button
                key={name}
                data-testid={`limitShift.offset-${name}`}
                onClick={() => setLimitShiftOffset(() => offset)}
                style={{
                  backgroundColor: limitShiftOffset === offset ? 'black' : '',
                }}
              >
                {name}
              </button>
            ))}
          </Controls>
        </>
      )}
    </>
  );
}
