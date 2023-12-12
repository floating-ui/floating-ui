import type {Coords, Placement} from '@floating-ui/core';
import {
  autoUpdate,
  flip,
  inline,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import {useEffect, useState} from 'react';

import {allPlacements} from '../utils/allPlacements';
import {Controls} from '../utils/Controls';

type ConnectedStatus = '1' | '2-disjoined' | '2-joined' | '3';
const CONNECTED_STATUSES: ConnectedStatus[] = [
  '1',
  '2-disjoined',
  '2-joined',
  '3',
];

export function Inline() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ConnectedStatus>('2-disjoined');
  const [mouseCoords, setMouseCoords] = useState<Coords | undefined>();
  const {x, y, strategy, refs} = useFloating({
    placement,
    middleware: [inline(mouseCoords), flip(), size()],
    whileElementsMounted: autoUpdate,
  });

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setMouseCoords({x: event.clientX, y: event.clientY});
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setMouseCoords(undefined);
    setOpen(false);
  };

  let text = '';
  switch (status) {
    case '1':
      text = 'test';
      break;
    case '2-disjoined':
      text = 'Nulla rutrum dapibus turpis eu volutpat';
      break;
    case '2-joined':
      text =
        'Nulla rutrum dapibus turpis eu volutpat. Duis cursus nisi massa, non dictum';
      break;
    case '3':
      text =
        'Nulla rutrum dapibus turpis eu volutpat. Duis cursus nisi massa, non dictum turpis interdum at. Nulla rutrum dapibus turpis eu volutpat';
      break;
    default:
  }

  useEffect(() => {
    function handleMouseUp(event: MouseEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return;
      }

      setTimeout(() => {
        const selection = window.getSelection();
        const range =
          typeof selection?.rangeCount === 'number' && selection.rangeCount > 0
            ? selection.getRangeAt(0)
            : null;

        if (selection?.isCollapsed) {
          setOpen(false);
          return;
        }

        if (range) {
          refs.setReference({
            getBoundingClientRect: () => range.getBoundingClientRect(),
            getClientRects: () => range.getClientRects(),
          });
          setOpen(true);
        }
      });
    }

    function handleMouseDown(event: MouseEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return;
      }

      if (window.getSelection()?.isCollapsed) {
        setOpen(false);
      }
    }

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [refs]);

  return (
    <>
      <h1>Inline</h1>
      <p>The floating element should choose the most appropriate rect.</p>
      <div className="container">
        <p className="prose" style={{padding: 10}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
          <strong
            ref={refs.setReference}
            style={{color: 'royalblue'}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {text}
          </strong>
          . Ut eu magna eu augue efficitur bibendum id commodo tellus. Nullam
          gravida, mi nec sodales tincidunt, lorem orci aliquam ex, id commodo
          erat libero ut risus. Nam molestie non lectus sit amet tempus. Vivamus
          accumsan{' '}
          <strong style={{color: 'red'}}>nunc quis faucibus egestas</strong>.
          Duis cursus nisi massa, non dictum turpis interdum at.
        </p>
        {open && (
          <div
            ref={refs.setFloating}
            className="floating"
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
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
        {CONNECTED_STATUSES.map((localStatus) => (
          <button
            key={localStatus}
            data-testid={`connected-${localStatus}`}
            onClick={() => {
              setStatus(localStatus);
            }}
            style={{
              backgroundColor: localStatus === status ? 'black' : '',
            }}
          >
            {localStatus}
          </button>
        ))}
      </Controls>
    </>
  );
}
