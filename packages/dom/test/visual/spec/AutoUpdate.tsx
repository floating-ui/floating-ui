import {autoUpdate} from '@floating-ui/react-dom';
import {useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

type LayoutShiftString = 'move' | 'insert' | 'delete' | 'none' | 'init';

const layoutShiftStrings: LayoutShiftString[] = [
  'move',
  'insert',
  'delete',
  'none',
  'init',
];

export function AutoUpdate() {
  const [layoutShift, setLayoutShift] = useState<LayoutShiftString>('none');
  const [options, setOptions] = useState({
    ancestorScroll: false,
    ancestorResize: false,
    elementResize: false,
    animationFrame: false,
  });
  const layoutShiftOption = layoutShift !== 'none';

  const [referenceSize, setReferenceSize] = useState(200);
  const [floatingSize, setFloatingSize] = useState(100);
  const [whileElementsMounted, setWhileElementsMounted] = useState(false);

  const {x, y, strategy, refs, update} = useFloating({
    strategy: 'fixed',
    whileElementsMounted: whileElementsMounted ? autoUpdate : undefined,
  });

  useLayoutEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }

    return autoUpdate(refs.reference.current, refs.floating.current, update, {
      ...options,
      layoutShift: layoutShiftOption,
    });
  }, [refs.floating, refs.reference, options, layoutShiftOption, update]);

  useLayoutEffect(() => {
    if (options.elementResize) {
      setReferenceSize(100);
      setFloatingSize(50);
    } else {
      setReferenceSize(200);
      setFloatingSize(100);
    }
  }, [options.elementResize]);

  return (
    <>
      <h1>AutoUpdate</h1>
      {layoutShift !== 'delete' && (
        <p>The floating element should update when required.</p>
      )}
      {layoutShift === 'insert' && <p>inserted content</p>}
      <div className="container" data-flexible>
        <div
          ref={refs.setReference}
          className="reference"
          style={{
            position: 'relative',
            top: layoutShift === 'move' ? -50 : undefined,
            left: layoutShift === 'move' ? 50 : undefined,
            width: layoutShift === 'move' ? referenceSize * 0.9 : referenceSize,
            height:
              layoutShift === 'move' ? referenceSize * 0.9 : referenceSize,
            animation: options.animationFrame
              ? 'scale 0.5s ease infinite alternate'
              : '',
          }}
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
            width: floatingSize,
            height: floatingSize,
          }}
        >
          Floating
        </div>
      </div>

      <h2>ancestorScroll</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            onClick={() => {
              setOptions((o) => ({...o, ancestorScroll: bool}));
            }}
            data-testid={`ancestorScroll-${bool}`}
            style={{
              backgroundColor: options.ancestorScroll === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>ancestorResize</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            onClick={() => {
              setOptions((o) => ({...o, ancestorResize: bool}));
            }}
            data-testid={`ancestorResize-${bool}`}
            style={{
              backgroundColor: options.ancestorResize === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>elementResize</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            onClick={() => {
              setOptions((o) => ({...o, elementResize: bool}));
            }}
            data-testid={`elementResize-${bool}`}
            style={{
              backgroundColor: options.elementResize === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>layoutShift</h2>
      <Controls>
        {layoutShiftStrings.map((str) => (
          <button
            key={str}
            onClick={() => {
              setLayoutShift(str);
            }}
            data-testid={`layoutShift-${str}`}
            style={{
              backgroundColor: layoutShift === str ? 'black' : '',
            }}
          >
            {str}
          </button>
        ))}
      </Controls>

      <h2>animationFrame</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            onClick={() => {
              setOptions((o) => ({...o, animationFrame: bool}));
            }}
            data-testid={`animationFrame-${bool}`}
            style={{
              backgroundColor: options.animationFrame === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>Reactive whileElementsMounted</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            onClick={() => {
              setWhileElementsMounted(bool);
            }}
            data-testid={`whileElementsMounted-${bool}`}
            style={{
              backgroundColor: whileElementsMounted === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>
    </>
  );
}
