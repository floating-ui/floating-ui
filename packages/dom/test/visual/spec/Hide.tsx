import type {Placement} from '@floating-ui/core';
import {useFloating, hide} from '@floating-ui/react-dom';
import {allPlacements} from '../utils/allPlacements';
import {useState} from 'react';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

export function Hide() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const {
    x,
    y,
    reference,
    floating,
    strategy,
    update,
    refs,
    middlewareData: {hide: {referenceHidden, escaped} = {}},
  } = useFloating({
    placement,
    middleware: [
      hide({strategy: 'referenceHidden'}),
      hide({strategy: 'escaped'}),
    ],
  });

  const {scrollRef, indicator} = useScroll({refs, update});

  return (
    <>
      <h1>Hide</h1>
      <p></p>
      <div className="container">
        <div className="scroll" ref={scrollRef} data-x>
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
              backgroundColor: referenceHidden
                ? 'black'
                : escaped
                ? 'yellow'
                : '',
            }}
          >
            Floating
          </div>
        </div>
      </div>

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
    </>
  );
}
