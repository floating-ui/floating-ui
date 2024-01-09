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

import {allPlacements} from '../utils/allPlacements';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

const BOOLS = [true, false];
const LIMIT_SHIFT_OFFSET: Array<{
  offset: LimitShiftOptions['offset'];
  name: string;
}> = [
  {offset: 0, name: '0'},
  {offset: 50, name: '50'},
  {offset: -50, name: '-50'},
  {offset: {mainAxis: 50}, name: 'mA: 50'},
  {offset: {crossAxis: 50}, name: 'cA: 50'},
  {offset: ({rects}) => rects.reference.width / 2, name: 'fn => r.width/2'},
  {
    offset: ({rects}) => ({crossAxis: rects.reference.width}),
    name: 'fn => cA: f.width/2',
  },
];

export function Shift() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [mainAxis, setMainAxis] = useState(true);
  const [crossAxis, setCrossAxis] = useState(false);
  const [limitShift, setLimitShift] = useState(false);
  const [limitShiftMainAxis, setLimitShiftMainAxis] =
    useState<LimitShiftOptions['mainAxis']>(true);
  const [limitShiftCrossAxis, setLimitShiftCrossAxis] =
    useState<LimitShiftOptions['crossAxis']>(true);
  const [limitShiftOffset, setLimitShiftOffset] =
    useState<LimitShiftOptions['offset']>(0);
  const [offsetValue, setOffsetValue] = useState(0);
  const {x, y, strategy, update, refs} = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      shift({
        mainAxis,
        crossAxis,
        limiter: limitShift
          ? limitShiftFn({
              mainAxis: limitShiftMainAxis,
              crossAxis: limitShiftCrossAxis,
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

      <h2>mainAxis</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`mainAxis-${bool}`}
            onClick={() => setMainAxis(bool)}
            style={{backgroundColor: mainAxis === bool ? 'black' : ''}}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>crossAxis</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`crossAxis-${bool}`}
            onClick={() => setCrossAxis(bool)}
            style={{backgroundColor: crossAxis === bool ? 'black' : ''}}
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
          <h3>limitShift.mainAxis</h3>
          <Controls>
            {BOOLS.map((bool) => (
              <button
                key={String(bool)}
                data-testid={`limitShift.mainAxis-${bool}`}
                onClick={() => setLimitShiftMainAxis(bool)}
                style={{
                  backgroundColor: limitShiftMainAxis === bool ? 'black' : '',
                }}
              >
                {String(bool)}
              </button>
            ))}
          </Controls>

          <h3>limitShift.crossAxis</h3>
          <Controls>
            {BOOLS.map((bool) => (
              <button
                key={String(bool)}
                data-testid={`limitShift.crossAxis-${bool}`}
                onClick={() => setLimitShiftCrossAxis(bool)}
                style={{
                  backgroundColor: limitShiftCrossAxis === bool ? 'black' : '',
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
