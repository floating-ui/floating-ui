import type {Dimensions} from '@floating-ui/core';
import {useFloating} from '@floating-ui/react-dom';
import {useState, useLayoutEffect} from 'react';
import {Controls} from '../utils/Controls';

type Size = string;
const SIZES: Size[] = ['.0', '.25', '.5', '.75'];

const INTEGER = 80;

export function DecimalSize() {
  const [size, setSize] = useState<Dimensions>({
    width: INTEGER,
    height: INTEGER,
  });
  const {x, y, reference, floating, strategy, update} = useFloating();

  useLayoutEffect(update, [size, update]);

  return (
    <>
      <h1>Decimal Size</h1>
      <p>
        The floating element should be positioned correctly on the bottom when
        the reference and floating elements have a non-integer size
        (width/height).
      </p>
      <div className="container">
        <div ref={reference} className="reference" style={size}>
          Reference
        </div>
        <div
          ref={floating}
          className="floating"
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
            ...size,
          }}
        >
          Floating
        </div>
      </div>

      <Controls>
        {SIZES.map((localSize) => (
          <button
            key={localSize}
            data-testid={`decimal-size-${localSize}`}
            onClick={() =>
              setSize({
                width: Number(`${INTEGER}${localSize}`),
                height: Number(`${INTEGER}${localSize}`),
              })
            }
            style={{
              backgroundColor:
                Number(`${INTEGER}${localSize}`) === size.width ? 'black' : '',
            }}
          >
            {localSize}
          </button>
        ))}
      </Controls>
    </>
  );
}
