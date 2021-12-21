import {useFloating} from '@floating-ui/react-dom';
import {useState, useLayoutEffect, useRef} from 'react';
import {Controls} from '../utils/Controls';

type Node = null | 'reference' | 'floating' | 'body' | 'html' | 'offsetParent';
const NODES: Node[] = [
  null,
  'reference',
  'floating',
  'body',
  'html',
  'offsetParent',
];

export function Transform() {
  const [node, setNode] = useState<Node>(null);
  const {x, y, reference, floating, strategy, update} = useFloating();
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
        element = offsetParentRef.current;
        break;
      default:
    }

    if (element) {
      element.style.transform = 'scale(1.2) translate(2rem, -2rem)';
    }

    update();

    return () => {
      if (element) {
        element.style.transform = '';
      }
    };
  }, [node, update]);

  return (
    <>
      <h1>Transform</h1>
      <p>
        The floating element should be positioned correctly on the bottom when a
        certain node has been transformed.
      </p>
      <div
        className="container"
        ref={offsetParentRef}
        style={{
          overflow: 'hidden',
          position: node === 'offsetParent' ? 'relative' : undefined,
        }}
      >
        <div
          ref={reference}
          className="reference"
          style={{
            transform:
              node === 'reference' ? 'scale(1.25) translate(2rem, -2rem)' : '',
          }}
        >
          Reference
        </div>
        <div
          ref={floating}
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
