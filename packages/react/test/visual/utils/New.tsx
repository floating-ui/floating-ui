import {arrow,useFloating} from '@floating-ui/react';
import {useRef} from 'react';

import {Controls} from './Controls';

export function New() {
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const {x, y, reference, floating, strategy} = useFloating({
    middleware: [arrow({element: arrowRef})],
  });

  return (
    <>
      <h1>New</h1>
      <p>This route lets you work on new features! Have fun :-)</p>
      <div className="container">
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

      <Controls></Controls>
    </>
  );
}
