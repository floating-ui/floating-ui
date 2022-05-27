import type {Placement} from '@floating-ui/core';
import type {FlipOptions} from '@floating-ui/core';
import {allPlacements} from '../utils/allPlacements';
import {useFloating, flip} from '@floating-ui/react-dom';
import {useState, useLayoutEffect} from 'react';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

const BOOLS = [true, false];
const FALLBACK_STRATEGIES: Array<FlipOptions['fallbackStrategy']> = [
  'bestFit',
  'initialPlacement',
];

export function Flip() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [mainAxis, setMainAxis] = useState(true);
  const [crossAxis, setCrossAxis] = useState(true);
  const [fallbackPlacements, setFallbackPlacements] = useState<Placement[]>();
  const [fallbackStrategy, setFallbackStrategy] =
    useState<FlipOptions['fallbackStrategy']>('bestFit');
  const [flipAlignment, setFlipAlignment] = useState(true);
  const {x, y, reference, floating, strategy, update, refs} = useFloating({
    placement,
    middleware: [
      flip({
        mainAxis,
        crossAxis,
        fallbackPlacements,
        fallbackStrategy,
        flipAlignment,
      }),
    ],
  });

  useLayoutEffect(update, [
    update,
    mainAxis,
    crossAxis,
    fallbackPlacements?.length,
    fallbackStrategy,
  ]);

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
                : localFallbackPlacements.length === 12
                ? 'all'
                : ''
            }`}
            onClick={() =>
              setFallbackPlacements(
                // @ts-ignore
                localFallbackPlacements[0] === 'undefined'
                  ? undefined
                  : localFallbackPlacements
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
              : `[${localFallbackPlacements?.join(', ')}]`}
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

      <h2>flipAlignment</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`flipAlignment-${bool}`}
            onClick={() => setFlipAlignment(bool)}
            style={{
              backgroundColor: bool === flipAlignment ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>
    </>
  );
}
