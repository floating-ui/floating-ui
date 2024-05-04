import type {Placement} from '@floating-ui/core';
import {
  arrow,
  autoUpdate,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import {useRef, useState} from 'react';

import {allPlacements} from '../utils/allPlacements';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';
import {flushSync} from 'react-dom';

export function Arrow() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const arrowRef = useRef(null);
  const [padding, setPadding] = useState(0);
  const [floatingSize, setFloatingSize] = useState(75);
  const [referenceSize, setReferenceSize] = useState(125);
  const [svg, setSvg] = useState(false);
  const [centerOffset, setCenterOffset] = useState(false);
  const [addOffset, setAddOffset] = useState(false);
  const [nested, setNested] = useState(false);

  const {
    update,
    placement: resultantPlacement,
    middlewareData: {
      arrow: {x: arrowX, y: arrowY, centerOffset: centerOffsetValue} = {},
    },
    refs,
    floatingStyles,
  } = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      addOffset && offset(20),
      shift({padding: 10}),
      arrow({element: arrowRef, padding}),
    ],
  });

  const oppositeSidesMap: {[key: string]: string} = {
    top: 'bottom',
    left: 'right',
    right: 'left',
    bottom: 'top',
  };

  const staticSide = oppositeSidesMap[resultantPlacement.split('-')[0]];

  const {scrollRef} = useScroll({refs, update});

  const ArrowTag = svg ? 'svg' : 'div';

  const jsx = nested ? (
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        width: floatingSize,
        height: floatingSize,
      }}
    >
      <div
        className="floating"
        style={{position: 'relative', border: '5px solid black'}}
      >
        {centerOffset ? centerOffsetValue : 'Floating'}
        <ArrowTag
          ref={arrowRef}
          className="arrow"
          style={{
            position: 'absolute',
            top: arrowY != null ? arrowY : '',
            left: arrowX != null ? arrowX : '',
            right: '',
            bottom: '',
            [staticSide]: -15,
          }}
        />
      </div>
    </div>
  ) : (
    <div
      ref={refs.setFloating}
      className="floating"
      style={{
        ...floatingStyles,
        width: floatingSize,
        height: floatingSize,
      }}
    >
      {centerOffset ? centerOffsetValue : 'Floating'}
      <ArrowTag
        ref={arrowRef}
        className="arrow"
        style={{
          position: 'absolute',
          top: arrowY != null ? arrowY : '',
          left: arrowX != null ? arrowX : '',
          right: '',
          bottom: '',
          [staticSide]: -15,
        }}
      />
    </div>
  );

  return (
    <>
      <h1>Arrow</h1>
      <p></p>
      <div
        className="container"
        style={{willChange: svg ? 'transform' : undefined}}
      >
        <div
          className="scroll"
          ref={scrollRef}
          data-x
          style={{position: 'relative'}}
        >
          <div
            ref={refs.setReference}
            className="reference"
            style={{
              width: referenceSize,
              height: referenceSize,
            }}
          >
            Reference
          </div>
          {jsx}
        </div>
      </div>

      <h2>Reference size</h2>
      <Controls>
        {[25, 125].map((size) => (
          <button
            key={size}
            data-testid={`reference-${size}`}
            onClick={() => setReferenceSize(size)}
            style={{
              backgroundColor: size === referenceSize ? 'black' : '',
            }}
          >
            {size}
          </button>
        ))}
      </Controls>

      <h2>Floating size</h2>
      <Controls>
        {[75, 150].map((size) => (
          <button
            key={size}
            data-testid={`floating-${size}`}
            onClick={() => setFloatingSize(size)}
            style={{
              backgroundColor: size === floatingSize ? 'black' : '',
            }}
          >
            {size}
          </button>
        ))}
      </Controls>

      <h2>Arrow padding</h2>
      <Controls>
        {[0, 20, 200].map((size) => (
          <button
            key={size}
            data-testid={`arrow-padding-${size}`}
            onClick={() => setPadding(size)}
            style={{
              backgroundColor: size === padding ? 'black' : '',
            }}
          >
            {size}
          </button>
        ))}
      </Controls>

      <h2>Add offset</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`add-offset-${bool}`}
            onClick={() => setAddOffset(bool)}
            style={{
              backgroundColor: addOffset === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>Placement</h2>
      <Controls>
        {allPlacements.map((localPlacement) => (
          <button
            key={localPlacement}
            data-testid={`placement-${localPlacement}`}
            onClick={() => setPlacement(localPlacement)}
            style={{
              backgroundColor: localPlacement === placement ? 'black' : '',
            }}
          >
            {localPlacement}
          </button>
        ))}
      </Controls>

      <h2>SVG</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`svg-${bool}`}
            onClick={() => {
              flushSync(() => setSvg(bool));
              update();
            }}
            style={{
              backgroundColor: bool === svg ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>Nested</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`nested-${bool}`}
            onClick={() => {
              flushSync(() => setNested(bool));
              update();
            }}
            style={{
              backgroundColor: bool === nested ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>Center offset</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`centerOffset-${bool}`}
            onClick={() => {
              setCenterOffset(bool);
              if (bool) {
                setReferenceSize(25);
                setFloatingSize(125);
                setPlacement('left-end');
                setPadding(25);
              } else {
                setReferenceSize(125);
                setFloatingSize(75);
                setPlacement('bottom');
                setPadding(0);
              }
            }}
            style={{
              backgroundColor: bool === centerOffset ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>
    </>
  );
}
