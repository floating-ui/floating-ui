import {
  useFloating,
  shift,
  limitShift,
  autoUpdate,
} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {Controls} from '../utils/Controls';

export const SCROLL = [
  [900, 900],
  [1090, 900],
  [665, 900],
  [865, 665],
];

function Outside({scroll}: {scroll: number[]}) {
  const [iframe, setIFrame] = useState<HTMLIFrameElement | null>(null);
  const {x, y, reference, floating, strategy} = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      shift({
        crossAxis: true,
        limiter: limitShift(),
        boundary: iframe || undefined,
      }),
    ],
  });

  const mountNode = iframe?.contentWindow?.document.body;

  useLayoutEffect(() => {
    if (mountNode && scroll) {
      mountNode.scrollLeft = scroll[0];
      mountNode.scrollTop = scroll[1];
    }
  }, [mountNode, scroll]);

  return (
    <>
      <h2>Outside</h2>
      <div className="container" id="outside-container">
        <iframe
          ref={setIFrame}
          width={350}
          height={350}
          style={{transform: 'scale(1.25)', border: '5px solid black'}}
        >
          {mountNode &&
            createPortal(
              <div style={{width: 2000, height: 2000, position: 'relative'}}>
                <button
                  ref={reference}
                  className="reference"
                  style={{position: 'absolute', left: 1000, top: 1000}}
                >
                  Reference
                </button>
              </div>,
              mountNode
            )}
        </iframe>
        <div
          ref={floating}
          className="floating"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          Floating
        </div>
      </div>
    </>
  );
}

function Inside({scroll}: {scroll: number[]}) {
  const [iframe, setIFrame] = useState<HTMLIFrameElement | null>(null);
  const {x, y, reference, floating, strategy} = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      shift({
        crossAxis: true,
        limiter: limitShift(),
      }),
    ],
  });

  const mountNode = iframe?.contentWindow?.document.body;

  useLayoutEffect(() => {
    if (mountNode && scroll) {
      mountNode.scrollLeft = scroll[0];
      mountNode.scrollTop = scroll[1];
    }
  }, [mountNode, scroll]);

  return (
    <>
      <h2>Inside</h2>
      <div className="container" id="inside-container">
        <iframe
          ref={setIFrame}
          width={350}
          height={350}
          style={{transform: 'scale(1.25)', border: '5px solid black'}}
        >
          {mountNode &&
            createPortal(
              <div style={{width: 2000, height: 2000, position: 'relative'}}>
                <button
                  ref={reference}
                  className="reference"
                  style={{position: 'absolute', left: 1000, top: 1000}}
                >
                  Reference
                </button>
                <div
                  ref={floating}
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                    width: 80,
                    height: 80,
                    background: '#40e0d0',
                  }}
                >
                  Floating
                </div>
              </div>,
              mountNode
            )}
        </iframe>
      </div>
    </>
  );
}

export function IFrame() {
  const [scroll, setScroll] = useState(SCROLL[0]);

  return (
    <>
      <h1>iFrame</h1>
      <p></p>
      <Outside scroll={scroll} />
      <Inside scroll={scroll} />

      <h2>Scroll position</h2>
      <Controls>
        {SCROLL.map((localScroll) => (
          <button
            key={localScroll.join(',')}
            data-testid={`scroll-${localScroll}`}
            onClick={() => setScroll(localScroll)}
            style={{
              backgroundColor:
                scroll[0] === localScroll[0] && scroll[1] === localScroll[1]
                  ? 'black'
                  : '',
            }}
          >
            {localScroll[0]}, {localScroll[1]}
          </button>
        ))}
      </Controls>
    </>
  );
}
