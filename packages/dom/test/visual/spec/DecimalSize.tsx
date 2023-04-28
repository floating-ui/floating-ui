import type {Dimensions} from '@floating-ui/core';
import {size as sizeM, useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

type Size = string;
const SIZES: Size[] = ['.0', '.25', '.5', '.75'];

const INTEGER = 80;

export function DecimalSize() {
  const [size, setSize] = useState<Dimensions>({
    width: INTEGER,
    height: INTEGER,
  });
  const [truncate, setTruncate] = useState(false);
  const {x, y, refs, strategy, update} = useFloating({
    middleware: [
      sizeM({
        apply({elements, rects}) {
          Object.assign(elements.floating.style, {
            width: `${rects.floating.width}px`,
          });
        },
      }),
    ],
  });

  useLayoutEffect(update, [size, truncate, update]);

  return (
    <>
      <h1>Decimal Size</h1>
      <p>
        The floating element should be positioned correctly on the bottom when
        the reference and floating elements have a non-integer size
        (width/height).
      </p>
      <div className="container">
        <div ref={refs.setReference} className="reference" style={size}>
          Reference
        </div>
        <div
          ref={refs.setFloating}
          className="floating"
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
            ...(truncate
              ? {
                  width: 'auto',
                  height: 'auto',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }
              : size),
          }}
        >
          {truncate ? 'Long text that will be truncated' : 'Floating'}
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

      <h2>Truncate</h2>
      <Controls>
        {[true, false].map((localTruncate) => (
          <button
            key={String(localTruncate)}
            data-testid={`truncate-${localTruncate}`}
            onClick={() => setTruncate(localTruncate)}
            style={{
              backgroundColor: truncate === localTruncate ? 'black' : '',
            }}
          >
            {String(localTruncate)}
          </button>
        ))}
      </Controls>
    </>
  );
}
