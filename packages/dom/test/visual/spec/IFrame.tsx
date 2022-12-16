import {
  useFloating,
  shift,
  limitShift,
  autoUpdate,
} from '@floating-ui/react-dom';
import {useState} from 'react';
import {createPortal} from 'react-dom';

export function IFrame() {
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

  return (
    <>
      <h1>iFrame</h1>
      <p></p>
      <div className="container">
        <iframe
          ref={setIFrame}
          src="/empty"
          width={350}
          height={350}
          style={{transform: 'scale(1.5)'}}
        >
          {mountNode &&
            createPortal(
              <div style={{width: 1000, height: 1000}}>
                <button
                  className="reference"
                  ref={reference}
                  style={{margin: 500}}
                >
                  Hello
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
