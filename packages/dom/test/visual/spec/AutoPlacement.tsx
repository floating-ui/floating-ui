import type {Alignment, Placement} from '@floating-ui/core';
import {useFloating, autoPlacement} from '@floating-ui/react-dom';
import {useState, useLayoutEffect} from 'react';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

const BOOLS = [true, false];
const ALIGNMENTS: Array<null | Alignment> = [null, 'start', 'end'];
const ALLOWED_PLACEMENTS: Array<Placement[] | undefined> = [
  undefined,
  ['top', 'bottom'],
  ['left', 'right'],
];

export function AutoPlacement() {
  const [alignment, setAlignment] = useState<Alignment | null>('start');
  const [autoAlignment, setAutoAlignment] = useState(true);
  const [allowedPlacements, setAllowedPlacements] = useState<
    Placement[] | undefined
  >();
  const {x, y, reference, floating, strategy, update, refs} = useFloating({
    middleware: [
      autoPlacement({
        alignment,
        autoAlignment,
        allowedPlacements,
      }),
    ],
  });

  useLayoutEffect(update, [
    update,
    alignment,
    autoAlignment,
    allowedPlacements,
  ]);

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
          <div ref={reference} className="reference">
            Reference
          </div>
          <div
            ref={floating}
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
    </>
  );
}
