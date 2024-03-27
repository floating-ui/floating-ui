import {
  arrow,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import React, {forwardRef} from 'react';
import {useState} from 'react';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

import {Chrome} from './Chrome';

const Button = forwardRef(function Button(
  {children, ...props},
  ref,
) {
  return (
    <button
      ref={ref}
      className="rounded bg-gray-100 px-2"
      {...props}
    >
      {children}
    </button>
  );
});

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
      <div className="rounded bg-gray-900 p-1 text-sm font-bold text-gray-50">
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result3 = () => {
  return (
    <Chrome>
      <Button>My button</Button>
      <div
        className="absolute top-0 left-0 rounded bg-gray-900 p-1 text-sm font-bold text-gray-50"
        style={{
          pointerEvents: 'none',
        }}
      >
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result4 = () => {
  const {refs, floatingStyles} = useFloating();

  return (
    <Chrome>
      <Button ref={refs.setReference}>My button</Button>
      <div
        ref={refs.setFloating}
        className="rounded bg-gray-900 p-1 text-sm font-bold text-gray-50"
        style={{
          ...floatingStyles,
          pointerEvents: 'none',
        }}
      >
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result5 = () => {
  const {refs, floatingStyles} = useFloating({
    placement: 'right',
  });

  return (
    <Chrome>
      <Button ref={refs.setReference}>My button</Button>
      <div
        ref={refs.setFloating}
        className="rounded bg-gray-900 p-1 text-sm font-bold text-gray-50"
        style={{
          ...floatingStyles,
          pointerEvents: 'none',
        }}
      >
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result6 = () => {
  const {refs, floatingStyles} = useFloating({
    placement: 'top',
  });

  return (
    <Chrome>
      <Button ref={refs.setReference}>My button</Button>
      <div
        ref={refs.setFloating}
        className="rounded bg-gray-900 p-1 text-sm font-bold text-gray-50"
        style={floatingStyles}
      >
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result7 = () => {
  const {refs, floatingStyles} = useFloating({
    placement: 'top',
    middleware: [flip({rootBoundary: 'document'})],
  });

  return (
    <Chrome>
      <Button ref={refs.setReference}>My button</Button>
      <div
        ref={refs.setFloating}
        className="rounded bg-gray-900 p-1 text-sm font-bold text-gray-50"
        style={{
          ...floatingStyles,
          pointerEvents: 'none',
        }}
      >
        My tooltip
      </div>
    </Chrome>
  );
};

export const Result8 = () => {
  const {refs, floatingStyles} = useFloating({
    placement: 'top',
    middleware: [flip({rootBoundary: 'document'})],
  });

  return (
    <Chrome>
      <Button ref={refs.setReference}>My button</Button>
      <div
        ref={refs.setFloating}
        className="rounded bg-gray-900 p-1 text-sm font-bold text-gray-50"
        style={{
          ...floatingStyles,
          pointerEvents: 'none',
        }}
      >
        My tooltip with more content
      </div>
    </Chrome>
  );
};

export const Result9 = () => {
  const {refs, floatingStyles} = useFloating({
    placement: 'top',
    middleware: [flip({rootBoundary: 'document'}), shift()],
  });

  return (
    <Chrome>
      <Button ref={refs.setReference}>My button</Button>
      <div
        ref={refs.setFloating}
        className="rounded bg-gray-900 p-1 text-sm font-bold text-gray-50"
        style={{
          ...floatingStyles,
          pointerEvents: 'none',
        }}
      >
        My tooltip with more content
      </div>
    </Chrome>
  );
};

export const Result10 = () => {
  const {refs, floatingStyles} = useFloating({
    placement: 'top',
    middleware: [
      flip({rootBoundary: 'document'}),
      shift({padding: 5}),
    ],
  });

  return (
    <Chrome>
      <Button ref={refs.setReference}>My button</Button>
      <div
        ref={refs.setFloating}
        className="rounded bg-gray-900 p-1 text-sm font-bold text-gray-50"
        style={{
          ...floatingStyles,
          pointerEvents: 'none',
        }}
      >
        My tooltip with more content
      </div>
    </Chrome>
  );
};

export const Result11 = () => {
  const {refs, floatingStyles} = useFloating({
    placement: 'top',
    middleware: [
      offset(6),
      flip({rootBoundary: 'document'}),
      shift({padding: 5}),
    ],
  });

  return (
    <Chrome>
      <Button ref={refs.setReference}>My button</Button>
      <div
        ref={refs.setFloating}
        className="rounded bg-gray-900 p-1 text-sm font-bold text-gray-50"
        style={{
          ...floatingStyles,
          pointerEvents: 'none',
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
    refs,
    floatingStyles,
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
      <Button ref={refs.setReference}>My button</Button>
      <div
        ref={refs.setFloating}
        className="rounded bg-gray-900 p-1 text-sm font-bold text-gray-50"
        style={{
          ...floatingStyles,
          pointerEvents: 'none',
        }}
      >
        My tooltip with more content
        <div
          ref={setArrowEl}
          className="h-2 w-2 rotate-45 bg-gray-1000"
          style={{
            position: 'absolute',
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
    refs,
    floatingStyles,
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
        ref={refs.setReference}
        aria-describedby="tooltip"
      >
        My button
      </Button>
      {show && (
        <div
          id="tooltip"
          role="tooltip"
          ref={refs.setFloating}
          className="rounded bg-gray-900 p-1 text-sm font-bold text-gray-50"
          style={{
            ...floatingStyles,
            pointerEvents: 'none',
          }}
        >
          My tooltip with more content
          <div
            ref={setArrowEl}
            className="h-2 w-2 rotate-45 bg-gray-1000"
            style={{
              position: 'absolute',
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
