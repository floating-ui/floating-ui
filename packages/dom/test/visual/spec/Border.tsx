import {useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

type Node =
  | null
  | 'reference'
  | 'floating'
  | 'body'
  | 'html'
  | 'offsetParent'
  | 'content-box';
const NODES: Node[] = [
  null,
  'reference',
  'floating',
  'body',
  'html',
  'offsetParent',
  'content-box',
];

export function Border() {
  const [node, setNode] = useState<Node>(null);
  const {x, y, strategy, refs, update} = useFloating();

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
    }

    if (element) {
      element.style.border = '10px solid black';
    }

    update();

    return () => {
      if (element) {
        element.style.border = '';
      }
    };
  }, [node, update]);

  return (
    <>
      <h1>Border</h1>
      <p>
        The floating element should be correctly positioned on the bottom when a
        certain element has a border.
      </p>
      <div
        className="container"
        style={{
          border:
            node === 'offsetParent' || node === 'content-box'
              ? '10px solid black'
              : '',
          overflow: 'hidden',
          padding: node === 'content-box' ? 10 : '',
          position:
            node === 'offsetParent' || node === 'content-box'
              ? 'relative'
              : undefined,
          boxSizing: node === 'content-box' ? 'unset' : undefined,
        }}
      >
        <div
          ref={refs.setReference}
          className="reference"
          style={{border: node === 'reference' ? '10px solid black' : ''}}
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
            border: node === 'floating' ? '10px solid black' : '',
          }}
        >
          Floating
        </div>
      </div>

      <Controls>
        {NODES.map((localNode) => (
          <button
            key={String(localNode)}
            data-testid={`border-${localNode}`}
            onClick={() => setNode(localNode)}
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
