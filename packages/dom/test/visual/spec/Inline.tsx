import {Coords, Placement} from '@floating-ui/core';
import {useFloating, inline, flip} from '@floating-ui/react-dom';
import React, {useLayoutEffect, useState} from 'react';
import {allPlacements} from '../utils/allPlacements';
import {Controls} from '../utils/Controls';

export function Inline() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [mouseCoords, setMouseCoords] = useState<undefined | Coords>();
  const {x, y, reference, floating, strategy, update} = useFloating({
    placement,
    middleware: [inline(mouseCoords), flip()],
  });

  useLayoutEffect(update, [update, mouseCoords]);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setMouseCoords({x: event.clientX, y: event.clientY});
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setMouseCoords(undefined);
    setOpen(false);
  };

  return (
    <>
      <h1>Inline</h1>
      <p>The floating element should choose the most appropriate rect.</p>
      <div className="container">
        <p className="prose" style={{padding: 10}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
          {!connected && (
            <strong
              ref={reference}
              style={{color: 'royalblue'}}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Nulla rutrum dapibus turpis eu volutpat
            </strong>
          )}
          {connected && (
            <strong
              ref={reference}
              style={{color: 'royalblue'}}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Nulla rutrum dapibus turpis eu volutpat. Duis cursus nisi massa,
              non dictum turpis interdum at
            </strong>
          )}
          . Ut eu magna eu augue efficitur bibendum id commodo tellus. Nullam
          gravida, mi nec sodales tincidunt, lorem orci aliquam ex, id commodo
          erat libero ut risus. Nam molestie non lectus sit amet tempus. Vivamus
          accumsan nunc quis faucibus egestas. Duis cursus nisi massa, non
          dictum turpis interdum at.
        </p>
        {open && (
          <div
            ref={floating}
            className="floating"
            style={{
              position: strategy,
              top: y ?? '',
              left: x ?? '',
              pointerEvents: 'none',
            }}
          >
            Floating
          </div>
        )}
      </div>

      <h2>Placement</h2>
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

      <h2>Open</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`open-${bool}`}
            onClick={() => {
              setMouseCoords(undefined);
              setOpen(bool);
            }}
            style={{
              backgroundColor: open === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>Connected</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`connected-${bool}`}
            onClick={() => {
              setConnected(bool);
            }}
            style={{
              backgroundColor: connected === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>
    </>
  );
}
