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
  {offset: {alignAxis: 50}, name: 'aA: 50'},
  {offset: {sideAxis: 50}, name: 'sA: 50'},
  {offset: ({rects}) => rects.reference.width / 2, name: 'fn => r.width/2'},
  {
    offset: ({rects}) => ({sideAxis: rects.reference.width}),
    name: 'fn => sA: f.width/2',
  },
];

export function Shift() {
  const [placement, setPlacement] = useState<Placement>({
    side: 'bottom',
    align: 'center',
  });
  const [alignAxis, setalignAxis] = useState(true);
  const [sideAxis, setsideAxis] = useState(false);
  const [limitShift, setLimitShift] = useState(false);
  const [limitShiftAlignAxis, setLimitShiftAlignAxis] =
    useState<LimitShiftOptions['alignAxis']>(true);
  const [limitShiftSideAxis, setLimitShiftSideAxis] =
    useState<LimitShiftOptions['sideAxis']>(true);
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
        alignAxis,
        sideAxis,
        limiter: limitShift
          ? limitShiftFn({
              alignAxis: limitShiftAlignAxis,
              sideAxis: limitShiftSideAxis,
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

      <h2>alignAxis</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`alignAxis-${bool}`}
            onClick={() => setalignAxis(bool)}
            style={{backgroundColor: alignAxis === bool ? 'black' : ''}}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>sideAxis</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`sideAxis-${bool}`}
            onClick={() => setsideAxis(bool)}
            style={{backgroundColor: sideAxis === bool ? 'black' : ''}}
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
          <h3>limitShift.alignAxis</h3>
          <Controls>
            {BOOLS.map((bool) => (
              <button
                key={String(bool)}
                data-testid={`limitShift.alignAxis-${bool}`}
                onClick={() => setLimitShiftAlignAxis(bool)}
                style={{
                  backgroundColor: limitShiftAlignAxis === bool ? 'black' : '',
                }}
              >
                {String(bool)}
              </button>
            ))}
          </Controls>

          <h3>limitShift.sideAxis</h3>
          <Controls>
            {BOOLS.map((bool) => (
              <button
                key={String(bool)}
                data-testid={`limitShift.sideAxis-${bool}`}
                onClick={() => setLimitShiftSideAxis(bool)}
                style={{
                  backgroundColor: limitShiftSideAxis === bool ? 'black' : '',
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
