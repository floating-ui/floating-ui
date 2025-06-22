import type {Align, Placement} from '@floating-ui/core';
import {
  autoPlacement,
  autoUpdate,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import {useState} from 'react';

import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';
import {stringifyPlacement} from '../utils/stringifyPlacement';

const BOOLS = [true, false];
const ALIGNMENTS: Array<Align> = ['center', 'start', 'end'];
const ALLOWED_PLACEMENTS: Array<Placement[] | undefined> = [
  undefined,
  [
    {side: 'top', align: 'center'},
    {side: 'bottom', align: 'center'},
  ],
  [
    {side: 'left', align: 'center'},
    {side: 'right', align: 'center'},
  ],
  [
    {side: 'top', align: 'start'},
    {side: 'top', align: 'end'},
    {side: 'bottom', align: 'start'},
    {side: 'bottom', align: 'end'},
  ],
];

export function AutoPlacement() {
  const [align, setAlign] = useState<Align>('start');
  const [autoAlign, setAutoAlign] = useState(true);
  const [allowedPlacements, setAllowedPlacements] = useState<
    Placement[] | undefined
  >();
  const [checkAlign, setCheckAlign] = useState(false);
  const [addShift, setAddShift] = useState(false);

  const {x, y, strategy, update, refs} = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      autoPlacement({
        align,
        autoAlign,
        allowedPlacements,
        checkAlign,
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

      <h2>align</h2>
      <Controls>
        {ALIGNMENTS.map((localAlign) => (
          <button
            key={String(localAlign)}
            data-testid={`align-${localAlign}`}
            onClick={() => setAlign(localAlign)}
            style={{
              backgroundColor: align === localAlign ? 'black' : '',
            }}
          >
            {String(localAlign)}
          </button>
        ))}
      </Controls>

      <h2>autoAlign</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`autoAlign-${bool}`}
            onClick={() => setAutoAlign(bool)}
            style={{
              backgroundColor: bool === autoAlign ? 'black' : '',
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
            key={String(localAllowedPlacements?.map(stringifyPlacement))}
            data-testid={`allowedPlacements-${localAllowedPlacements?.map(
              stringifyPlacement,
            )}`}
            onClick={() => setAllowedPlacements(localAllowedPlacements)}
            style={{
              backgroundColor:
                localAllowedPlacements === allowedPlacements ? 'black' : '',
            }}
          >
            {String(localAllowedPlacements?.map(stringifyPlacement))}
          </button>
        ))}
      </Controls>

      <h2>alignAxis</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`alignAxis-${bool}`}
            onClick={() => setCheckAlign(bool)}
            style={{
              backgroundColor: bool === checkAlign ? 'black' : '',
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
