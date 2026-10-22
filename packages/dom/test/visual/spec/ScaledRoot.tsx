import {autoUpdate, shift, useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

export function ScaledRoot() {
  const [ready, setReady] = useState(false);

  // A scale transform shrinks the <html> border box without reserving any
  // space, so it must not be mistaken for a `scrollbar-gutter: stable` gutter.
  useLayoutEffect(() => {
    const html = document.documentElement;
    html.style.scrollbarGutter = 'stable';
    html.style.transform = 'scale(0.99)';
    html.style.transformOrigin = 'top left';
    setReady(true);
    return () => {
      html.style.scrollbarGutter = '';
      html.style.transform = '';
      html.style.transformOrigin = '';
    };
  }, []);

  const {refs, floatingStyles} = useFloating({
    strategy: 'fixed',
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [shift()],
  });

  useLayoutEffect(() => {
    if (ready) {
      (refs.floating.current as any).showPopover();
    }
  }, [ready, refs]);

  return (
    <>
      <h1>Scaled Root</h1>
      <p>
        The <code>&lt;html&gt;</code> has <code>transform: scale(0.99)</code>{' '}
        and <code>scrollbar-gutter: stable</code>. The green popup overflows the
        right side of the viewport, so <code>shift()</code> should push it flush
        against the right edge of the window (or the scrollbar), with no gap.
      </p>
      {/* Tall spacer so the page has a real scrollbar where one takes space. */}
      <div style={{height: '200vh'}} />
      {ready && (
        <>
          <div
            ref={refs.setReference}
            className="reference"
            style={{position: 'fixed', top: 300, right: 150, width: 80}}
          >
            Ref
          </div>
          <div
            // `popover` puts it in the top layer, outside the scaled <html>,
            // so it renders exactly where it is positioned.
            // @ts-ignore
            popover="manual"
            ref={refs.setFloating}
            data-testid="floating"
            style={{
              ...floatingStyles,
              margin: 0,
              padding: 0,
              border: 'none',
              width: 300,
              height: 60,
              background: '#16a34a',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            should touch the right edge →
          </div>
        </>
      )}
    </>
  );
}
