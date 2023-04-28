import {
  arrow,
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';

import {Controls} from '../utils/Controls';
import {useSize} from '../utils/useSize';

const arrowEl = document.createElement('div');

export function Perf() {
  const {x, y, refs, strategy} = useFloating({
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(1),
      flip(),
      shift({crossAxis: true, limiter: limitShift()}),
      hide(),
      arrow({element: arrowEl}),
    ],
  });

  const [size, handleSizeChange] = useSize();

  let jsx = (
    <>
      <div ref={refs.setReference} className="reference">
        Reference
      </div>
      <div
        ref={refs.setFloating}
        className="floating"
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
          width: size,
          height: size,
        }}
      >
        Floating
      </div>
    </>
  );

  for (let i = 0; i < 100; i++) {
    jsx = <div style={{position: 'relative'}}>{jsx}</div>;
  }

  return (
    <>
      <h1>Perf</h1>
      <p>
        The reference and floating elements are nested within 100+ offsetParent
        containers and forced to flip. With 6x CPU slow down on an M1 Mac,
        `computePosition` updates should take less than <strong>15ms</strong>.
      </p>
      <div className="container">
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            height: 200,
            background: '#ddd',
          }}
        >
          {jsx}
        </div>
      </div>

      <Controls>
        <label htmlFor="size">Size</label>
        <input
          id="size"
          type="range"
          min="1"
          max="200"
          value={size}
          onChange={handleSizeChange}
        />
      </Controls>
    </>
  );
}
