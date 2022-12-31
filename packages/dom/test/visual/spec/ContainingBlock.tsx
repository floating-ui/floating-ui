import {autoUpdate, useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

export function ContainingBlock() {
  const [willChange, setWillChange] =
    useState<CSSStyleDeclaration['willChange']>('transform');
  const [contain, setContain] = useState('paint');
  const {x, y, reference, floating, strategy, update} = useFloating({
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  });

  useLayoutEffect(update, [update, willChange, contain]);

  return (
    <>
      <h1>Containing Block</h1>
      <p>The floating element should be correctly positioned.</p>
      <div className="container" style={{willChange, contain}}>
        <div ref={reference} className="reference">
          Reference
        </div>
        <div
          ref={floating}
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

      <h2>willChange</h2>
      <Controls>
        {['transform', 'perspective', 'transform, perspective', 'opacity'].map(
          (localWillChange) => (
            <button
              key={localWillChange}
              data-testid={`willchange-${localWillChange}`}
              onClick={() => setWillChange(localWillChange)}
              style={{
                backgroundColor: localWillChange === willChange ? 'black' : '',
              }}
            >
              {localWillChange}
            </button>
          )
        )}
      </Controls>

      <h2>contain</h2>
      <Controls>
        {['paint', 'layout', 'paint, layout', 'strict', 'content', 'size'].map(
          (localContain) => (
            <button
              key={localContain}
              data-testid={`contain-${localContain}`}
              onClick={() => setContain(localContain)}
              style={{
                backgroundColor: localContain === contain ? 'black' : '',
              }}
            >
              {localContain}
            </button>
          )
        )}
      </Controls>
    </>
  );
}
