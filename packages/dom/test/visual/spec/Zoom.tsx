import type {Strategy} from '@floating-ui/dom';
import {shift, size, useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

type Node = null | 'html' | 'body' | 'container';
export const NODES: Node[] = [null, 'html', 'body', 'container'];
export const ZOOMS = [0.8, 1.5, 2];
export const STRATEGIES: Strategy[] = ['absolute', 'fixed'];
export const SCROLLS = [0, 250];

export function Zoom() {
  const [node, setNode] = useState<Node>(null);
  const [zoom, setZoom] = useState(1.5);
  const [strategy, setStrategy] = useState<Strategy>('absolute');
  const [scroll, setScroll] = useState(0);
  const [overflow, setOverflow] = useState(false);

  const {x, y, refs, update} = useFloating({
    strategy,
    middleware: overflow
      ? [
          shift({padding: 4}),
          size({
            apply({availableWidth, availableHeight, elements}) {
              Object.assign(elements.floating.style, {
                maxWidth: `${availableWidth}px`,
                maxHeight: `${availableHeight}px`,
              });
            },
            padding: 4,
          }),
        ]
      : [],
  });

  useLayoutEffect(() => {
    const floating = refs.floating.current;
    if (floating && !overflow) {
      Object.assign(floating.style, {maxWidth: '', maxHeight: ''});
    }

    // Zoom first: it changes the document height the scroll is applied against.
    const element =
      node === 'html'
        ? document.documentElement
        : node === 'body'
          ? document.body
          : document.querySelector<HTMLElement>('.container');

    if (node !== null && element) {
      element.style.zoom = String(zoom);
    }

    window.scrollTo(0, scroll);
    update();

    return () => {
      if (element) {
        element.style.zoom = '';
      }
    };
  }, [node, zoom, strategy, scroll, overflow, refs, update]);

  return (
    <>
      <h1>Zoom</h1>
      <p>
        The floating element should be anchored to the bottom of the reference
        when the CSS <code>zoom</code> property is applied to an ancestor.
      </p>
      {/* Kept deliberately small: at `zoom: 2` a full-size container would
          overflow the viewport, and screenshotting it scrolls the page, which
          drags a `fixed` floating element out of the captured region. */}
      <div
        className="container"
        style={{width: 260, height: 160, placeItems: 'start', padding: 10}}
      >
        <div
          ref={refs.setReference}
          className="reference"
          style={{width: 70, height: 40, fontSize: 12}}
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
            width: overflow ? 300 : 60,
            height: overflow ? 400 : 40,
            fontSize: 12,
            overflow: 'hidden',
          }}
        >
          Floating
        </div>
      </div>
      {/* Makes the document scrollable at every zoom factor. */}
      <div style={{height: 1200}} />

      <h2>Node</h2>
      <Controls>
        {NODES.map((localNode) => (
          <button
            key={String(localNode)}
            data-testid={`zoom-node-${localNode}`}
            onClick={() => setNode(localNode)}
            style={{
              backgroundColor: node === localNode ? 'black' : '',
            }}
          >
            {localNode ?? 'None'}
          </button>
        ))}
      </Controls>

      <h2>Zoom</h2>
      <Controls>
        {ZOOMS.map((localZoom) => (
          <button
            key={localZoom}
            data-testid={`zoom-${localZoom}`}
            onClick={() => setZoom(localZoom)}
            style={{
              backgroundColor: zoom === localZoom ? 'black' : '',
            }}
          >
            {localZoom}
          </button>
        ))}
      </Controls>

      <h2>Strategy</h2>
      <Controls>
        {STRATEGIES.map((localStrategy) => (
          <button
            key={localStrategy}
            data-testid={`zoom-strategy-${localStrategy}`}
            onClick={() => setStrategy(localStrategy)}
            style={{
              backgroundColor: strategy === localStrategy ? 'black' : '',
            }}
          >
            {localStrategy}
          </button>
        ))}
      </Controls>

      <h2>Scroll</h2>
      <Controls>
        {SCROLLS.map((localScroll) => (
          <button
            key={localScroll}
            data-testid={`zoom-scroll-${localScroll}`}
            onClick={() => setScroll(localScroll)}
            style={{
              backgroundColor: scroll === localScroll ? 'black' : '',
            }}
          >
            {localScroll}
          </button>
        ))}
      </Controls>

      <h2>Overflow middleware</h2>
      <Controls>
        {[false, true].map((localOverflow) => (
          <button
            key={String(localOverflow)}
            data-testid={`zoom-overflow-${localOverflow}`}
            onClick={() => setOverflow(localOverflow)}
            style={{
              backgroundColor: overflow === localOverflow ? 'black' : '',
            }}
          >
            {String(localOverflow)}
          </button>
        ))}
      </Controls>
    </>
  );
}
