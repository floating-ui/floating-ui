import {
  autoUpdate,
  limitShift,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import {useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

import {Controls} from '../utils/Controls';

const SCROLL = [
  [900, 900],
  [1090, 900],
  [665, 900],
  [865, 665],
];

function Outside({scroll}: {scroll: number[]}) {
  const [iframe, setIFrame] = useState<HTMLIFrameElement | null>(null);
  const {x, y, refs, strategy} = useFloating({
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
                  ref={refs.setReference}
                  className="reference"
                  style={{position: 'absolute', left: 1000, top: 1000}}
                >
                  Reference
                </button>
              </div>,
              mountNode,
            )}
        </iframe>
        <div
          ref={refs.setFloating}
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

function OutsideEmbedded({scroll}: {scroll: number[]}) {
  const [rootIFrame, setRootIFrame] = useState<HTMLIFrameElement | null>(null);
  const [nestedIFrame, setNestedIFrame] = useState<HTMLIFrameElement | null>(
    null,
  );

  const {x, y, refs, strategy} = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      shift({
        crossAxis: true,
        limiter: limitShift(),
        boundary: nestedIFrame || undefined,
      }),
    ],
  });

  const rootNode = rootIFrame?.contentWindow?.document.body;
  const nestedNode = nestedIFrame?.contentWindow?.document.body;

  useLayoutEffect(() => {
    if (nestedNode && scroll) {
      nestedNode.scrollLeft = scroll[0];
      nestedNode.scrollTop = scroll[1];
    }
  }, [nestedNode, scroll]);

  return (
    <>
      <h2>Outside Embedded</h2>
      <div className="container" id="outside-embedded-container">
        <iframe
          ref={setRootIFrame}
          width={350}
          height={350}
          style={{transform: 'scale(1.25)', border: '5px solid black'}}
        >
          {rootNode &&
            createPortal(
              <div style={{width: 2000, height: 2000, position: 'relative'}}>
                <iframe
                  ref={setNestedIFrame}
                  width={200}
                  height={200}
                  style={{transform: 'scale(1.25)', border: '5px solid black'}}
                >
                  {nestedNode &&
                    createPortal(
                      <div
                        style={{
                          width: 2000,
                          height: 2000,
                          position: 'relative',
                        }}
                      >
                        <button
                          ref={refs.setReference}
                          className="reference"
                          style={{position: 'absolute', left: 1000, top: 1000}}
                        >
                          Reference
                        </button>
                      </div>,
                      nestedNode,
                    )}
                </iframe>
                <div
                  ref={refs.setFloating}
                  className="floating"
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                  }}
                >
                  Floating
                </div>
              </div>,
              rootNode,
            )}
        </iframe>
      </div>
    </>
  );
}

function Inside({scroll}: {scroll: number[]}) {
  const [iframe, setIFrame] = useState<HTMLIFrameElement | null>(null);
  const {x, y, refs, strategy} = useFloating({
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
      <div
        className="container"
        id="inside-container"
        // https://github.com/floating-ui/floating-ui/issues/2552
        style={{overflow: 'hidden'}}
      >
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
                  ref={refs.setReference}
                  className="reference"
                  style={{position: 'absolute', left: 1000, top: 1000}}
                >
                  Reference
                </button>
                <div
                  ref={refs.setFloating}
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
              mountNode,
            )}
        </iframe>
      </div>
    </>
  );
}

function InsideScrollable({scroll}: {scroll: number[]}) {
  const [iframe, setIFrame] = useState<HTMLIFrameElement | null>(null);
  const {x, y, refs, strategy} = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      shift({
        crossAxis: true,
        limiter: limitShift(),
      }),
    ],
  });

  const mountNode = iframe?.contentWindow?.document.body;

  const [scrollableParent, setScrollableParent] =
    useState<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (scrollableParent && scroll) {
      scrollableParent.scrollLeft = scroll[0];
      scrollableParent.scrollTop = scroll[1];
    }
  }, [scrollableParent, scroll]);

  return (
    <>
      <h2>Inside Scrollable</h2>
      <div
        className="container"
        id="inside-scrollable-container"
        // https://github.com/floating-ui/floating-ui/issues/2552
        style={{overflow: 'hidden'}}
      >
        <iframe
          ref={setIFrame}
          width={350}
          height={350}
          style={{transform: 'scale(1.25)', border: '5px solid black'}}
        >
          {mountNode &&
            createPortal(
              <div
                style={{width: '100%', height: '100%', overflow: 'auto'}}
                ref={setScrollableParent}
              >
                <div style={{width: 2000, height: 2000, position: 'relative'}}>
                  <button
                    ref={refs.setReference}
                    className="reference"
                    style={{position: 'absolute', left: 1000, top: 1000}}
                  >
                    Reference
                  </button>
                  <div
                    ref={refs.setFloating}
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
                </div>
              </div>,
              mountNode,
            )}
        </iframe>
      </div>
    </>
  );
}

function Nested({scroll}: {scroll: number[]}) {
  const [rootIFrame, setRootIFrame] = useState<HTMLIFrameElement | null>(null);
  const [nestedIFrame, setNestedIFrame] = useState<HTMLIFrameElement | null>(
    null,
  );

  const {x, y, refs, strategy} = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      shift({
        crossAxis: true,
        limiter: limitShift(),
        boundary: rootIFrame || undefined,
      }),
    ],
  });

  const rootNode = rootIFrame?.contentWindow?.document.body;
  const nestedNode = nestedIFrame?.contentWindow?.document.body;

  useLayoutEffect(() => {
    if (nestedNode && scroll) {
      nestedNode.scrollLeft = scroll[0];
      nestedNode.scrollTop = scroll[1];
    }
  }, [nestedNode, scroll]);

  return (
    <>
      <h2>Nested</h2>
      <div className="container" id="nested-container">
        <iframe
          ref={setRootIFrame}
          width={350}
          height={350}
          style={{transform: 'scale(1.25)', border: '5px solid black'}}
        >
          {rootNode &&
            createPortal(
              <div style={{width: 2000, height: 2000, position: 'relative'}}>
                <iframe
                  ref={setNestedIFrame}
                  width={200}
                  height={200}
                  style={{transform: 'scale(1.25)', border: '5px solid black'}}
                >
                  {nestedNode &&
                    createPortal(
                      <div
                        style={{
                          width: 2000,
                          height: 2000,
                          position: 'relative',
                        }}
                      >
                        <button
                          ref={refs.setReference}
                          className="reference"
                          style={{position: 'absolute', left: 1000, top: 1000}}
                        >
                          Reference
                        </button>
                      </div>,
                      nestedNode,
                    )}
                </iframe>
              </div>,
              rootNode,
            )}
        </iframe>
        <div
          ref={refs.setFloating}
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

function Virtual({scroll}: {scroll: number[]}) {
  const [iframe, setIFrame] = useState<HTMLIFrameElement | null>(null);
  const referenceRef = useRef<HTMLButtonElement>(null);

  const {x, y, refs, strategy} = useFloating({
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
    const el = referenceRef.current;
    if (mountNode && el) {
      refs.setReference({
        getBoundingClientRect: () => el.getBoundingClientRect(),
        contextElement: el,
      });
    }
  }, [mountNode, refs]);

  useLayoutEffect(() => {
    if (mountNode && scroll) {
      mountNode.scrollLeft = scroll[0];
      mountNode.scrollTop = scroll[1];
    }
  }, [mountNode, scroll]);

  return (
    <>
      <h2>Virtual</h2>
      <div className="container" id="virtual-container">
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
                  ref={referenceRef}
                  className="reference"
                  style={{
                    position: 'absolute',
                    left: 1000,
                    top: 1000,
                  }}
                >
                  Reference
                </button>
              </div>,
              mountNode,
            )}
        </iframe>
        <div
          ref={refs.setFloating}
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

export function IFrame() {
  const [scroll, setScroll] = useState(SCROLL[0]);

  return (
    <>
      <h1>iframe</h1>
      <p></p>
      <Outside scroll={scroll} />
      <OutsideEmbedded scroll={scroll} />
      <Inside scroll={scroll} />
      <Nested scroll={scroll} />
      <Virtual scroll={scroll} />
      <InsideScrollable scroll={scroll} />

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
