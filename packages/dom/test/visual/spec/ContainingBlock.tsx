import {autoUpdate, useFloating} from '@floating-ui/react-dom';
import React, {useLayoutEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

export function ContainingBlock() {
  const [willChange, setWillChange] =
    useState<CSSStyleDeclaration['willChange']>('transform');
  const [contain, setContain] = useState('paint');
  const [containerType, setContainerType] = useState<
    React.CSSProperties['containerType'] | undefined
  >(undefined);

  const {refs, floatingStyles, update} = useFloating({
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  });

  useLayoutEffect(update, [update, willChange, contain, containerType]);

  return (
    <>
      <h1>Containing Block</h1>
      <p>The floating element should be correctly positioned.</p>
      <div
        className="container"
        style={containerType ? {containerType} : {willChange, contain}}
      >
        <div ref={refs.setReference} className="reference">
          Reference
        </div>
        <div ref={refs.setFloating} className="floating" style={floatingStyles}>
          Floating
        </div>
      </div>

      <h2>willChange</h2>
      <Controls>
        {[
          'transform',
          'translate',
          'scale',
          'rotate',
          'perspective',
          'transform, perspective',
          'opacity',
        ].map((localWillChange) => (
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
        ))}
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
          ),
        )}
      </Controls>

      <h2>containerType</h2>
      <Controls>
        {([undefined, 'inline-size', 'size'] as const).map(
          (localContainerType) => (
            <button
              key={localContainerType ?? 'normal'}
              data-testid={`container-type-${localContainerType ?? 'normal'}`}
              onClick={() => setContainerType(localContainerType)}
              style={{
                backgroundColor:
                  localContainerType === containerType ? 'black' : '',
              }}
            >
              {localContainerType ?? 'normal'}
            </button>
          ),
        )}
      </Controls>
    </>
  );
}
