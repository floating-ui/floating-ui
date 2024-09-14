import {useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

type Node = null | 'html' | 'body' | 'offsetParent';
export const NODES: Node[] = [null, 'html', 'body', 'offsetParent'];

export function Relative() {
  const [node, setNode] = useState<Node>(null);
  const [offset, setOffset] = useState(0);
  const {x, y, refs, strategy, update} = useFloating();

  useLayoutEffect(() => {
    let element: HTMLElement | null = null;

    switch (node) {
      case 'html':
        element = document.documentElement;
        break;
      case 'body':
        element = document.body;
        break;
      default:
        element = document.querySelector('.container');
    }

    if (element) {
      element.style.position = 'relative';
      element.style.top = `${-offset}px`;
    }

    update();

    return () => {
      if (element) {
        element.style.position = '';
        element.style.top = '';
      }
    };
  }, [node, offset, update]);

  return (
    <>
      <h1>Relative</h1>
      <p>
        The floating element should be positioned correctly on the bottom when a
        certain parent node has <code>position: relative</code> applied.
      </p>
      <div
        className="container"
        style={{position: node === 'offsetParent' ? 'relative' : undefined}}
      >
        <div ref={refs.setReference} className="reference">
          Reference
        </div>
        <div
          ref={refs.setFloating}
          className="floating"
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
          }}
        >
          Floating
        </div>
      </div>

      <h2>Node</h2>
      <Controls>
        {NODES.map((localNode) => (
          <button
            key={String(localNode)}
            data-testid={`relative-${localNode}`}
            onClick={() => setNode(localNode)}
            style={{
              backgroundColor: node === localNode ? 'black' : '',
            }}
          >
            {localNode ?? 'None'}
          </button>
        ))}
      </Controls>

      <h2>Offset</h2>
      <Controls>
        {[0, 100].map((localOffset) => (
          <button
            key={localOffset}
            data-testid={`offset-${localOffset}`}
            onClick={() => setOffset(localOffset)}
            style={{
              backgroundColor: offset === localOffset ? 'black' : '',
            }}
          >
            {localOffset}
          </button>
        ))}
      </Controls>
    </>
  );
}
