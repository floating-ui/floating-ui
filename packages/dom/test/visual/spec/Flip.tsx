import type {Placement} from '@floating-ui/core';
import type {FlipOptions} from '@floating-ui/core';
import {autoUpdate, flip, shift, useFloating} from '@floating-ui/react-dom';
import {useState} from 'react';

import {allPlacements} from '../utils/allPlacements';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';
import {stringifyPlacement} from '../utils/stringifyPlacement';
import {AllPlacementsControls} from '../utils/AllPlacementsControls';

const BOOLS = [true, false];
const FALLBACK_STRATEGIES: Array<FlipOptions['fallbackStrategy']> = [
  'bestFit',
  'initialPlacement',
];

export function Flip() {
  const [placement, setPlacement] = useState<Placement>({
    side: 'bottom',
    align: 'center',
  });
  const [mainAxis, setMainAxis] = useState(true);
  const [crossAxis, setCrossAxis] = useState<FlipOptions['crossAxis']>(true);
  const [fallbackPlacements, setFallbackPlacements] = useState<Placement[]>();
  const [fallbackStrategy, setFallbackStrategy] =
    useState<FlipOptions['fallbackStrategy']>('bestFit');
  const [flipAlign, setFlipAlign] = useState(true);
  const [addShift, setAddShift] = useState(false);
  const [fallbackAxisSideDirection, setFallbackAxisSideDirection] =
    useState<FlipOptions['fallbackAxisSideDirection']>('none');

  const {x, y, strategy, update, refs} = useFloating({
    side: placement.side,
    align: placement.align,
    whileElementsMounted: autoUpdate,
    middleware: [
      flip({
        mainAxis,
        crossAxis,
        fallbackPlacements:
          addShift && fallbackAxisSideDirection === 'none'
            ? [{side: 'bottom', align: 'center'}]
            : fallbackPlacements,
        fallbackStrategy,
        flipAlign,
        fallbackAxisSideDirection: 'end',
      }),
      addShift && shift(),
    ],
  });

  const {scrollRef, indicator} = useScroll({refs, update});

  return (
    <>
      <h1>Flip</h1>
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
              top: y ?? 0,
              left: x ?? 0,
              ...(addShift && {
                width: fallbackAxisSideDirection === 'none' ? 400 : 200,
                height: fallbackAxisSideDirection === 'none' ? undefined : 50,
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
        {([...BOOLS, 'align'] as const).map((value) => (
          <button
            key={String(value)}
            data-testid={`crossAxis-${value}`}
            onClick={() => setCrossAxis(value)}
            style={{backgroundColor: crossAxis === value ? 'black' : ''}}
          >
            {String(value)}
          </button>
        ))}
      </Controls>

      <h2>fallbackPlacements</h2>
      <Controls>
        {[['undefined'], [], allPlacements].map((localFallbackPlacements) => (
          <button
            key={localFallbackPlacements.length}
            data-testid={`fallbackPlacements-${
              localFallbackPlacements[0] === 'undefined'
                ? 'undefined'
                : localFallbackPlacements[0] == null
                  ? '[]'
                  : localFallbackPlacements.length === allPlacements.length
                    ? 'all'
                    : ''
            }`}
            onClick={() =>
              setFallbackPlacements(
                // @ts-ignore
                localFallbackPlacements[0] === 'undefined'
                  ? undefined
                  : localFallbackPlacements,
              )
            }
            style={{
              backgroundColor:
                localFallbackPlacements[0] === 'undefined' &&
                fallbackPlacements === undefined
                  ? 'black'
                  : localFallbackPlacements?.length ===
                      fallbackPlacements?.length
                    ? 'black'
                    : '',
            }}
          >
            {localFallbackPlacements[0] === 'undefined'
              ? 'undefined'
              : `[${localFallbackPlacements
                  ?.map((placement) =>
                    typeof placement === 'string'
                      ? placement
                      : stringifyPlacement(placement),
                  )
                  .join(', ')}]`}
          </button>
        ))}
      </Controls>

      <h2>fallbackStrategy</h2>
      <Controls>
        {FALLBACK_STRATEGIES.map((localFallbackStrategy) => (
          <button
            key={localFallbackStrategy}
            data-testid={`fallbackStrategy-${localFallbackStrategy}`}
            onClick={() => setFallbackStrategy(localFallbackStrategy)}
            style={{
              backgroundColor:
                localFallbackStrategy === fallbackStrategy ? 'black' : '',
            }}
          >
            {localFallbackStrategy}
          </button>
        ))}
      </Controls>

      <h2>flipAlign</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`flipAlign-${bool}`}
            onClick={() => setFlipAlign(bool)}
            style={{
              backgroundColor: bool === flipAlign ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>Add shift</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`shift-${bool}`}
            onClick={() => setAddShift(bool)}
            style={{
              backgroundColor: bool === addShift ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>fallbackAxisSideDirection</h2>
      <Controls>
        {(['start', 'end', 'none'] as const).map((value) => (
          <button
            key={value}
            data-testid={`fallbackAxisSideDirection-${value}`}
            onClick={() => setFallbackAxisSideDirection(value)}
            style={{
              backgroundColor:
                value === fallbackAxisSideDirection ? 'black' : '',
            }}
          >
            {String(value)}
          </button>
        ))}
      </Controls>
    </>
  );
}
