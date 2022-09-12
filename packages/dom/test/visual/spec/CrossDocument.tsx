import { useState, useLayoutEffect, useMemo, HTMLProps } from 'react';
import { createPortal } from 'react-dom'

import type { Placement } from '@floating-ui/core';
import {useFloating} from '@floating-ui/react-dom';

import { Controls } from '../utils/Controls';
import { defineElements } from '../utils/shadowDOM';
import { allPlacements } from '../utils/allPlacements';
import {useScroll} from '../utils/useScroll';

defineElements();

export const IFrame = ({
  children,
  ...props
}: HTMLProps<HTMLIFrameElement>) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null)

  const iFrameHead = contentRef?.contentWindow?.document?.head;
  const iFrameRoot = contentRef?.contentWindow?.document?.body;


  const headContent = useMemo(() => (<>
    {/* Use the same styles as in the top-level document */}
    {Array.from(contentRef?.ownerDocument.querySelectorAll('link') ?? []).map(
      ({href}) => <link key={href} rel="stylesheet" href={href} />
      )}
    {/* Additional styles needed by the iframe's content */}
    <style type='text/css'>{`
      body {
        /* necessary to override body styles from main stylesheet */
        padding: 0;
        /* Center reference inside the iframe */
        display: grid;
        place-items: center;
      }
    `}</style>
  </>), [contentRef]);

  return (
    <iframe {...props} ref={setContentRef}>
      {/* Add styles to the <head> */}
      {iFrameHead && createPortal(headContent, iFrameHead)}
      {/* Add content to the <body> */}
      {iFrameRoot && createPortal(children, iFrameRoot)}
    </iframe>
  )
}

export function CrossDocument() {
  const [placement, setPlacement] = useState<Placement>('top');

  const {x, y, reference, floating, strategy, update, refs} = useFloating({
    placement
  });

  useLayoutEffect(update, [
    update,
    placement,
  ]);

  useLayoutEffect(() => {
    // Hack to force a re-render that also creates new values for
    // `refs` and/or `update`, so that `useScroll` updates internally
    // and scrolls the reference element into view.
    setTimeout(() => setPlacement('bottom-start'));
  }, []);

  const {scrollRef, indicator} = useScroll({refs, update});

  const referenceJsx = <div
    ref={reference}
    className="reference"
  >
    Reference
  </div>;

  const floatingJsx = <div
    ref={floating}
    className="floating"
    style={{
      position: strategy,
      top: y ?? '',
      left: x ?? '',
    }}
    >
    Floating
  </div>;

  return (
    <>
      <h1>Cross document</h1>
      <p>
        The floating element should be positioned correctly when in a different <span style={{fontFamily: 'monospace'}}>ownerDocument</span> than its reference.
      </p>
      <div
        className='container'
        style={{
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <IFrame>
          <div
            className="scroll"
            data-x
            style={{position: 'relative'}}
            ref={scrollRef}
            >
            {indicator}
            {referenceJsx}
          </div>
        </IFrame>
        {floatingJsx}
      </div>

      {/* Controls / variations: */}
      {/* Scenarios:
          - reference inside iframe, floating in top document
          - reference in top document, floating inside iframe
          - reference and floating inside iframes
       */}
      {/* Resize iframe */}
      {/* Scroll iframe */}

      {/* placements */}
      {/* positions */}
      {/* arrow */}
      {/* should the example allow scrolling for testing shift limiting? */}
      {/* with autoupdate (incl rAF) */}

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
    </>
  );
}
