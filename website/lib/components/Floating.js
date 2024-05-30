import * as FloatingUI from '@floating-ui/react';
import {cloneElement, useEffect, useRef, useState} from 'react';
import {flushSync} from 'react-dom';

import {useChromeContext} from './Chrome';

export function Floating({
  children,
  content,
  strategy: strategyOption,
  tooltipStyle = {},
  middleware = [],
  portaled,
  bounded,
  minHeight,
  transition,
  arrow,
  lockedFromArrow,
  ...options
}) {
  const boundaryRef = useChromeContext();

  const arrowRef = useRef();
  const {
    middlewareData,
    refs,
    floatingStyles,
    placement,
    isPositioned,
  } = FloatingUI.useFloating({
    whileElementsMounted: FloatingUI.autoUpdate,
    strategy: strategyOption,
    middleware:
      [
        ...middleware,
        ...(arrow
          ? [
              {
                name: 'arrow',
                options: {element: arrowRef, padding: 5},
              },
            ]
          : []),
        ...(lockedFromArrow
          ? [
              {
                name: 'shift',
                options: middleware.find(
                  (m) => m.name === 'shift',
                )?.options,
              },
            ]
          : []),
      ]
        ?.map(({name, options}) => {
          if (name === 'size') {
            return FloatingUI.size?.({
              ...options,
              apply: ({availableHeight}) => {
                Object.assign(
                  refs.floating.current.style ?? {},
                  {
                    maxHeight: minHeight
                      ? `${Math.max(
                          availableHeight,
                          minHeight,
                        )}px`
                      : `${Math.max(availableHeight, 0)}px`,
                  },
                );
              },
            });
          }

          if (name === 'hide') {
            return [
              FloatingUI.hide(),
              FloatingUI.hide({strategy: 'escaped'}),
            ];
          }

          return FloatingUI[name]?.(
            name === 'shift'
              ? {
                  ...options,
                  boundary: bounded
                    ? boundaryRef.current || undefined
                    : undefined,
                }
              : options,
          );
        })
        .flat()
        .filter((v) => v) ?? [],
    ...options,
  });

  const [moveTransition, setMoveTransition] = useState(false);

  useEffect(() => {
    function handleResize() {
      flushSync(() => setMoveTransition(false));
      requestAnimationFrame(() => setMoveTransition(transition));
    }

    if (isPositioned && transition) {
      setMoveTransition(true);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isPositioned, transition, refs.floating]);

  const staticSide = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top',
  }[placement.split('-')[0]];

  const tooltipJsx = (
    <div
      className="z-10 grid place-items-center bg-rose-500 text-base font-semibold text-gray-50"
      ref={refs.setFloating}
      style={{
        ...tooltipStyle,
        ...floatingStyles,
        maxWidth: bounded ? '60vw' : undefined,
        opacity: middlewareData.hide?.escaped
          ? '0.5'
          : undefined,
        visibility:
          middlewareData.hide?.referenceHidden || !isPositioned
            ? 'hidden'
            : undefined,
        transition: moveTransition
          ? 'transform 0.65s cubic-bezier(0.43, 0.33, 0.14, 1.01)'
          : undefined,
      }}
    >
      <div className="px-2 py-2">{content ?? 'Floating'}</div>
      {arrow && (
        <div
          ref={arrowRef}
          className="h-4 w-4 bg-gray-800 [left:-0.5rem]"
          style={{
            position: 'absolute',
            left:
              middlewareData.arrow?.x != null
                ? middlewareData.arrow.x
                : undefined,
            top:
              middlewareData.arrow?.y != null
                ? middlewareData.arrow.y
                : undefined,
            right: undefined,
            bottom: undefined,
            [staticSide]: lockedFromArrow ? '-0.5rem' : '-1rem',
            background: lockedFromArrow ? 'inherit' : 'inherit',
            transition: lockedFromArrow
              ? 'transform 0.2s ease'
              : 'none',
            transform: lockedFromArrow
              ? middlewareData.arrow?.centerOffset !== 0
                ? 'translateX(1rem) rotate(45deg)'
                : 'rotate(45deg)'
              : '',
          }}
        />
      )}
    </div>
  );

  return (
    <>
      {cloneElement(children, {ref: refs.setReference})}
      {portaled ? (
        <FloatingUI.FloatingPortal id="floating-container">
          {tooltipJsx}
        </FloatingUI.FloatingPortal>
      ) : (
        tooltipJsx
      )}
    </>
  );
}
