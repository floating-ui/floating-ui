import {cloneElement, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import * as FloatingUI from '@floating-ui/react-dom';

export function Floating({
  children,
  content,
  tooltipStyle = {},
  middleware,
  portaled,
  minHeight,
  ...options
}) {
  const [{height}, setDimensions] = useState({
    width: null,
    height: null,
  });
  const {
    x,
    y,
    reference,
    floating,
    update,
    middlewareData,
    refs,
  } = FloatingUI.useFloating({
    middleware:
      middleware
        ?.map(({name, options}) =>
          name !== 'size'
            ? FloatingUI[name]?.(options)
            : FloatingUI.size?.({
                ...options,
                apply: ({width, height}) => {
                  setDimensions({
                    width,
                    height: minHeight
                      ? Math.max(height, minHeight)
                      : height,
                  });
                },
              })
        )
        .filter((v) => v) ?? [],
    ...options,
  });

  useEffect(() => {
    const nodes = [
      ...FloatingUI.getScrollParents(refs.reference.current),
      ...FloatingUI.getScrollParents(refs.floating.current),
    ];

    nodes.forEach((node) => {
      node.addEventListener('scroll', update);
      node.addEventListener('resize', update);
    });

    return () => {
      nodes.forEach((node) => {
        node.removeEventListener('scroll', update);
        node.removeEventListener('resize', update);
      });
    };
  }, [reference, floating, update, refs]);

  const tooltipJsx = (
    <div
      className="grid place-items-center bg-gray-1000 text-gray-50 z-10"
      ref={floating}
      style={{
        ...tooltipStyle,
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate3d(${Math.round(x)}px,${Math.round(
          y
        )}px,0)`,
        maxHeight: height ? `${height}px` : '',
        backgroundColor: middlewareData.hide?.escaped
          ? 'red'
          : '',
        visibility:
          middlewareData.hide?.referenceHidden || x == null
            ? 'hidden'
            : '',
      }}
    >
      <div className="px-4 py-2">{content ?? 'Floating'}</div>
    </div>
  );

  return (
    <>
      {cloneElement(children, {ref: reference})}
      {portaled && typeof document !== 'undefined'
        ? createPortal(
            tooltipJsx,
            document.getElementById('floating-root')
          )
        : tooltipJsx}
    </>
  );
}
