import type {Alignment, Placement} from '@floating-ui/core';
import {
  autoPlacement,
  autoUpdate,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import {useState} from 'react';

import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

const BOOLS = [true, false];
const ALIGNMENTS: Array<null | Alignment> = [null, 'start', 'end'];
const ALLOWED_PLACEMENTS: Array<Placement[] | undefined> = [
  undefined,
  ['top', 'bottom'],
  ['left', 'right'],
  ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
];

export function AutoPlacement() {
  const [alignment, setAlignment] = useState<Alignment | null>('start');
  const [autoAlignment, setAutoAlignment] = useState(true);
  const [allowedPlacements, setAllowedPlacements] = useState<
    Placement[] | undefined
  >();
  const [crossAxis, setCrossAxis] = useState(false);
  const [addShift, setAddShift] = useState(false);

  const {x, y, strategy, update, refs} = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      autoPlacement({
        alignment,
        autoAlignment,
        allowedPlacements,
        crossAxis,
      }),
      addShift && shift(),
    ],
  });

  const {scrollRef, indicator} = useScroll({refs, update});

  return (
    <>
      <h1>AutoPlacement</h1>
      <p></p>
      <div className="container">
        <div
          className="scroll"
          data-x
          style={{position: 'relative'}}
          ref={scrollRef}
        >
          {indicator}
          <div
            ref={refs.setReference}
            className="reference"
            style={
              addShift
                ? {
                    width: 50,
                    height: 25,
                  }
                : {}
            }
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
              ...(addShift && {
                width: 250,
                height: 250,
              }),
            }}
          >
            Floating
          </div>
        </div>
      </div>

      <h2>alignment</h2>
      <Controls>
        {ALIGNMENTS.map((localAlignment) => (
          <button
            key={String(localAlignment)}
            data-testid={`alignment-${localAlignment}`}
            onClick={() => setAlignment(localAlignment)}
            style={{
              backgroundColor: alignment === localAlignment ? 'black' : '',
            }}
          >
            {String(localAlignment)}
          </button>
        ))}
      </Controls>

      <h2>autoAlignment</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`autoAlignment-${bool}`}
            onClick={() => setAutoAlignment(bool)}
            style={{
              backgroundColor: bool === autoAlignment ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>allowedPlacements</h2>
      <Controls>
        {ALLOWED_PLACEMENTS.map((localAllowedPlacements) => (
          <button
            key={String(localAllowedPlacements)}
            data-testid={`allowedPlacements-${localAllowedPlacements}`}
            onClick={() => setAllowedPlacements(localAllowedPlacements)}
            style={{
              backgroundColor:
                localAllowedPlacements === allowedPlacements ? 'black' : '',
            }}
          >
            {String(localAllowedPlacements)}
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
            style={{
              backgroundColor: bool === crossAxis ? 'black' : '',
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
    </>
  );
}
