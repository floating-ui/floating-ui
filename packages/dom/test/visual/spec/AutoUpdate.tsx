import {autoUpdate} from '@floating-ui/react-dom';
import {useFloating} from '@floating-ui/react-dom';
import {useState, useEffect} from 'react';
import {Controls} from '../utils/Controls';

export function AutoUpdate() {
  const {x, y, reference, floating, strategy, refs, update} = useFloating({
    strategy: 'fixed',
  });
  const [options, setOptions] = useState({
    ancestorScroll: false,
    ancestorResize: false,
    elementResize: false,
    animationFrame: false,
  });

  const [referenceSize, setReferenceSize] = useState(200);
  const [floatingSize, setFloatingSize] = useState(100);

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }

    return autoUpdate(
      refs.reference.current,
      refs.floating.current,
      update,
      options
    );
  }, [refs.floating, refs.reference, options, update]);

  useEffect(() => {
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
      <p>The floating element should update when required.</p>
      <div className="container" data-flexible>
        <div
          ref={reference}
          className="reference"
          style={{
            width: referenceSize,
            height: referenceSize,
            animation: options.animationFrame
              ? 'scale 0.5s ease infinite alternate'
              : '',
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
    </>
  );
}
