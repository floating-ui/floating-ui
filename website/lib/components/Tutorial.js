import React, {forwardRef} from 'react';
import {Chrome} from './Chrome';
import {
  useFloating,
  flip,
  shift,
  offset,
  arrow,
} from '@floating-ui/react-dom';
import {useState} from 'react';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

const Button = forwardRef(({children, ...props}, ref) => (
  <button
    ref={ref}
    className="bg-gray-100 px-2 rounded"
    {...props}
  >
    {children}
  </button>
));

export const Result1 = () => {
  return (
    <Chrome>
      <Button>My button</Button>
      <div>My tooltip</div>
    </Chrome>
  );
};

export const Result2 = () => {
  return (
    <Chrome>
      <Button>My button</Button>
      <div className="bg-gray-900 text-gray-50 rounded font-bold text-sm p-1">
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result3 = () => {
  return (
    <Chrome>
      <Button>My button</Button>
      <div className="absolute bg-gray-900 text-gray-50 rounded font-bold text-sm p-1">
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result4 = () => {
  const {x, y, reference, floating, strategy} = useFloating();

  return (
    <Chrome>
      <Button ref={reference}>My button</Button>
      <div
        ref={floating}
        className="bg-gray-900 text-gray-50 rounded font-bold text-sm p-1"
        style={{
          position: strategy,
          top: y ?? '',
          left: x ?? '',
        }}
      >
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result5 = () => {
  const {x, y, reference, floating, strategy} = useFloating({
    placement: 'right',
  });

  return (
    <Chrome>
      <Button ref={reference}>My button</Button>
      <div
        ref={floating}
        className="bg-gray-900 text-gray-50 rounded font-bold text-sm p-1"
        style={{
          position: strategy,
          top: y ?? '',
          left: x ?? '',
        }}
      >
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result6 = () => {
  const {x, y, reference, floating, strategy} = useFloating({
    placement: 'top',
  });

  return (
    <Chrome>
      <Button ref={reference}>My button</Button>
      <div
        ref={floating}
        className="bg-gray-900 text-gray-50 rounded font-bold text-sm p-1"
        style={{
          position: strategy,
          top: y ?? '',
          left: x ?? '',
        }}
      >
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result7 = () => {
  const {x, y, reference, floating, strategy} = useFloating({
    placement: 'top',
    middleware: [flip({rootBoundary: 'document'})],
  });

  return (
    <Chrome>
      <Button ref={reference}>My button</Button>
      <div
        ref={floating}
        className="bg-gray-900 text-gray-50 rounded font-bold text-sm p-1"
        style={{
          position: strategy,
          top: y ?? '',
          left: x ?? '',
        }}
      >
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result8 = () => {
  const {x, y, reference, floating, strategy} = useFloating({
    placement: 'top',
    middleware: [flip({rootBoundary: 'document'})],
  });

  return (
    <Chrome>
      <Button ref={reference}>My button</Button>
      <div
        ref={floating}
        className="bg-gray-900 text-gray-50 rounded font-bold text-sm p-1"
        style={{
          position: strategy,
          top: y ?? '',
          left: x ?? '',
        }}
      >
        My tooltip with more content
      </div>
    </Chrome>
  );
};

export const Result9 = () => {
  const {x, y, reference, floating, strategy} = useFloating({
    placement: 'top',
    middleware: [flip({rootBoundary: 'document'}), shift()],
  });

  return (
    <Chrome>
      <Button ref={reference}>My button</Button>
      <div
        ref={floating}
        className="bg-gray-900 text-gray-50 rounded font-bold text-sm p-1"
        style={{
          position: strategy,
          top: y ?? '',
          left: x ?? '',
        }}
      >
        My tooltip with more content
      </div>
    </Chrome>
  );
};

export const Result10 = () => {
  const {x, y, reference, floating, strategy} = useFloating({
    placement: 'top',
    middleware: [
      flip({rootBoundary: 'document'}),
      shift({padding: 5}),
    ],
  });

  return (
    <Chrome>
      <Button ref={reference}>My button</Button>
      <div
        ref={floating}
        className="bg-gray-900 text-gray-50 rounded font-bold text-sm p-1"
        style={{
          position: strategy,
          top: y ?? '',
          left: x ?? '',
        }}
      >
        My tooltip with more content
      </div>
    </Chrome>
  );
};

export const Result11 = () => {
  const {x, y, reference, floating, strategy} = useFloating({
    placement: 'top',
    middleware: [
      offset(6),
      flip({rootBoundary: 'document'}),
      shift({padding: 5}),
    ],
  });

  return (
    <Chrome>
      <Button ref={reference}>My button</Button>
      <div
        ref={floating}
        className="bg-gray-900 text-gray-50 rounded font-bold text-sm p-1"
        style={{
          position: strategy,
          top: y ?? '',
          left: x ?? '',
        }}
      >
        My tooltip with more content
      </div>
    </Chrome>
  );
};

export const Result12 = () => {
  const [arrowEl, setArrowEl] = useState(null);

  const {
    x,
    y,
    reference,
    floating,
    strategy,
    placement,
    update,
    middlewareData: {arrow: {x: arrowX, y: arrowY} = {}},
  } = useFloating({
    placement: 'top',
    middleware: [
      offset(6),
      flip({rootBoundary: 'document'}),
      shift({padding: 5}),
      ...(arrowEl ? [arrow({element: arrowEl})] : []),
    ],
  });

  useIsomorphicLayoutEffect(() => {
    arrowEl && update();
  }, [arrowEl]);

  return (
    <Chrome>
      <Button ref={reference}>My button</Button>
      <div
        ref={floating}
        className="bg-gray-900 text-gray-50 rounded font-bold text-sm p-1"
        style={{
          position: strategy,
          top: y ?? '',
          left: x ?? '',
        }}
      >
        My tooltip with more content
        <div
          ref={setArrowEl}
          className="w-2 h-2 bg-gray-1000 rotate-45"
          style={{
            position: strategy,
            top: arrowY ?? '',
            left: arrowX ?? '',
            right: '',
            bottom: '',
            [{
              top: 'bottom',
              left: 'right',
              right: 'left',
              bottom: 'top',
            }[placement]]: '-0.25rem',
          }}
        />
      </div>
    </Chrome>
  );
};

export const Result13 = () => {
  const [show, setShow] = useState(false);
  const [arrowEl, setArrowEl] = useState(null);

  const {
    x,
    y,
    reference,
    floating,
    strategy,
    placement,
    update,
    middlewareData: {arrow: {x: arrowX, y: arrowY} = {}},
  } = useFloating({
    placement: 'top',
    middleware: [
      offset(6),
      flip({rootBoundary: 'document'}),
      shift({padding: 5}),
      ...(arrowEl ? [arrow({element: arrowEl})] : []),
    ],
  });

  useIsomorphicLayoutEffect(() => {
    arrowEl && update();
  }, [arrowEl]);

  return (
    <Chrome>
      <Button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        ref={reference}
        aria-describedby="tooltip"
      >
        My button
      </Button>
      {show && (
        <div
          id="tooltip"
          role="tooltip"
          ref={floating}
          className="bg-gray-900 text-gray-50 rounded font-bold text-sm p-1"
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
            pointerEvents: 'none',
          }}
        >
          My tooltip with more content
          <div
            ref={setArrowEl}
            className="w-2 h-2 bg-gray-1000 rotate-45"
            style={{
              position: strategy,
              top: arrowY ?? '',
              left: arrowX ?? '',
              right: '',
              bottom: '',
              [{
                top: 'bottom',
                left: 'right',
                right: 'left',
                bottom: 'top',
              }[placement]]: '-0.25rem',
            }}
          />
        </div>
      )}
    </Chrome>
  );
};
