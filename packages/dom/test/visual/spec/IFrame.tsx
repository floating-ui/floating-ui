import {
  useFloating,
  shift,
  limitShift,
  autoUpdate,
} from '@floating-ui/react-dom';
import {useState} from 'react';
import {createPortal} from 'react-dom';

function Outside() {
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

  return (
    <>
      <h2>Outside</h2>
      <div className="container">
        <iframe
          ref={setIFrame}
          width={350}
          height={350}
          style={{transform: 'scale(1.25)', border: '5px solid black'}}
        >
          {mountNode &&
            createPortal(
              <div style={{width: 1000, height: 1000, position: 'relative'}}>
                <button
                  ref={reference}
                  className="reference"
                  style={{margin: 100}}
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

function Inside() {
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

  return (
    <>
      <h2>Inside</h2>
      <div className="container">
        <iframe
          ref={setIFrame}
          width={350}
          height={350}
          style={{transform: 'scale(1.25)', border: '5px solid black'}}
        >
          {mountNode &&
            createPortal(
              <div style={{width: 1000, height: 1000, position: 'relative'}}>
                <button
                  ref={reference}
                  className="reference"
                  style={{margin: 100}}
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
  return (
    <>
      <h1>iFrame</h1>
      <p></p>
      <Outside />
      <Inside />
    </>
  );
}
