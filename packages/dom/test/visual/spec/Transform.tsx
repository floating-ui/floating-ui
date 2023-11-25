import {autoUpdate, shift, useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useRef, useState} from 'react';

import {Controls} from '../utils/Controls';

// The element rect is black, while the clipping rect is blue.
const debugRectsJsx = (
  <>
    <div
      id="elementRect"
      style={{
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
    <div
      id="clippingRect"
      style={{
        position: 'fixed',
        backgroundColor: 'rgba(0, 200, 255, 0.25)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  </>
);

type Node =
  | null
  | 'reference'
  | 'floating'
  | 'body'
  | 'html'
  | 'offsetParent'
  | 'offsetParent-3d'
  | 'offsetParent-inverse'
  | 'offsetParent-reference'
  | 'virtual'
  | 'inline';
const NODES: Node[] = [
  null,
  'reference',
  'floating',
  'body',
  'html',
  'offsetParent',
  'offsetParent-3d',
  'offsetParent-inverse',
  'offsetParent-reference',
  'virtual',
  'inline',
];

export function Transform() {
  const [node, setNode] = useState<Node>(null);
  const {x, y, refs, strategy, update} = useFloating({
    middleware: [shift({crossAxis: true})],
    whileElementsMounted: autoUpdate,
  });
  const offsetParentRef = useRef(null);

  useLayoutEffect(() => {
    let element: HTMLElement | null = null;

    switch (node) {
      case 'html':
        element = document.documentElement;
        break;
      case 'body':
        element = document.body;
        break;
      case 'offsetParent':
      case 'offsetParent-3d':
      case 'offsetParent-inverse':
      case 'offsetParent-reference':
      case 'virtual':
      case 'inline':
        element = offsetParentRef.current;
        break;
      default:
    }

    if (element) {
      let transform = 'scale(0.5) translate(2rem, -2rem)';
      switch (node) {
        case 'offsetParent-inverse':
          transform = 'scale(0.5)';
          break;
        case 'offsetParent-3d':
          transform = 'scale3d(0.5, 0.2, 0.7) translate3d(2rem, -2rem, 0)';
          break;
      }
      element.style.transform = transform;
    }

    if (node === 'virtual' && element) {
      element.style.transform = 'scale(0.5)';
      const virtualContext = document.querySelector(
        '#virtual-context',
      ) as HTMLElement;
      refs.setReference({
        getBoundingClientRect: () => virtualContext.getBoundingClientRect(),
        contextElement: virtualContext,
      });
    }

    update();

    return () => {
      if (element) {
        element.style.transform = '';
      }
    };
  }, [node, update, refs]);

  return (
    <>
      <h1>Transform</h1>
      <p>
        The floating element should be positioned correctly on the bottom when a
        certain node has been transformed.
      </p>
      {debugRectsJsx}
      <div
        className="container"
        ref={offsetParentRef}
        style={{
          overflow: 'hidden',
          position: node === 'offsetParent' ? 'relative' : undefined,
        }}
      >
        <span style={{position: node === 'inline' ? 'relative' : undefined}}>
          {node === 'virtual' && (
            <div
              id="virtual-context"
              style={{width: 50, height: 50, background: 'black'}}
            />
          )}
          <div
            ref={refs.setReference}
            className="reference"
            style={{
              transform: node?.includes('reference')
                ? 'scale(1.25) translate(2rem, -2rem)'
                : '',
            }}
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
              transform: node === 'floating' ? 'scale(1.25)' : '',
              transformOrigin: 'top',
            }}
          >
            Floating
          </div>
        </span>
      </div>

      <Controls>
        {NODES.map((localNode) => (
          <button
            key={String(localNode)}
            onClick={() => setNode(localNode)}
            data-testid={`transform-${localNode}`}
            style={{
              backgroundColor: node === localNode ? 'black' : '',
            }}
          >
            {localNode ?? 'None'}
          </button>
        ))}
      </Controls>
    </>
  );
}
