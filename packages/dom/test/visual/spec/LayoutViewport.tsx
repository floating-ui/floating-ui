import type {RootBoundary} from '@floating-ui/core';
import {autoUpdate, shift, useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

type BoundaryOption = 'viewport' | 'layoutViewport' | 'rect';

const BOUNDARY_OPTIONS: BoundaryOption[] = [
  'viewport',
  'layoutViewport',
  'rect',
];

export function LayoutViewport() {
  const [boundaryOption, setBoundaryOption] =
    useState<BoundaryOption>('viewport');

  // The raw rect emulates the documented workaround for a layout viewport
  // boundary before `layoutViewport` existed. It does not account for
  // `scrollbar-gutter: stable` space.
  const rootBoundary: RootBoundary =
    boundaryOption === 'rect'
      ? {
          x: 0,
          y: 0,
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
        }
      : boundaryOption;

  const {x, y, refs, strategy} = useFloating({
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [shift({crossAxis: true, rootBoundary})],
  });

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.style.overflowY = 'hidden';
    html.style.scrollbarGutter = 'stable';
    return () => {
      html.style.overflowY = '';
      html.style.scrollbarGutter = '';
    };
  }, []);

  return (
    <>
      <h1>Layout Viewport</h1>
      <p>
        With <code>overflow: hidden</code> +{' '}
        <code>scrollbar-gutter: stable</code> on the root, the floating element
        should not be clipped by the reserved gutter space when using the{' '}
        <code>layoutViewport</code> root boundary.
      </p>
      <div
        ref={refs.setReference}
        className="reference"
        style={{position: 'absolute', top: 150, right: 0}}
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
          width: 250,
        }}
      >
        Floating
      </div>

      <Controls>
        {BOUNDARY_OPTIONS.map((option) => (
          <button
            key={option}
            data-testid={`rootboundary-${option}`}
            onClick={() => setBoundaryOption(option)}
            style={{
              backgroundColor: option === boundaryOption ? 'black' : '',
            }}
          >
            {option}
          </button>
        ))}
      </Controls>
    </>
  );
}
