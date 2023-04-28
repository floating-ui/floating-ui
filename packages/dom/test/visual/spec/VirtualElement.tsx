import {autoUpdate, useFloating} from '@floating-ui/react-dom';
import {useEffect, useRef} from 'react';

import {useScroll} from '../utils/useScroll';

export function VirtualElement() {
  const referenceToDeriveRef = useRef<HTMLDivElement>(null);
  const {x, y, strategy, update, refs} = useFloating({
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  });

  const {scrollRef} = useScroll({refs, update});

  useEffect(() => {
    const contextElement = referenceToDeriveRef.current;
    if (contextElement) {
      refs.setReference({
        contextElement,
        getBoundingClientRect() {
          return contextElement.getBoundingClientRect();
        },
      });
    }
  }, [refs]);

  return (
    <>
      <h1>Virtual Element</h1>
      <p></p>
      <div className="container">
        <div
          className="scroll"
          data-x
          style={{position: 'relative'}}
          ref={scrollRef}
        >
          <div ref={referenceToDeriveRef} className="reference">
            Reference
          </div>
        </div>
      </div>

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
    </>
  );
}
