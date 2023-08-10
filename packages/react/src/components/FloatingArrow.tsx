import {platform} from '@floating-ui/react-dom';
import * as React from 'react';

import {useId} from '../hooks/useId';
import type {Alignment, FloatingContext, Side} from '../types';

export interface FloatingArrowProps extends React.SVGAttributes<SVGSVGElement> {
  // Omit the original `refs` property from the context to avoid issues with
  // generics: https://github.com/floating-ui/floating-ui/issues/2483
  /**
   * The floating context.
   */
  context: Omit<FloatingContext, 'refs'> & {refs: any};

  /**
   * Width of the arrow.
   * @default 14
   */
  width?: number;

  /**
   * Height of the arrow.
   * @default 7
   */
  height?: number;

  /**
   * The corner radius (rounding) of the arrow tip.
   * @default 0 (sharp)
   */
  tipRadius?: number;

  /**
   * Forces a static offset over dynamic positioning under a certain condition.
   */
  staticOffset?: string | number | null;

  /**
   * Custom path string.
   */
  d?: string;

  /**
   * Stroke (border) color of the arrow.
   */
  stroke?: string;

  /**
   * Stroke (border) width of the arrow.
   */
  strokeWidth?: number;
}

/**
 * Renders a pointing arrow triangle.
 * @see https://floating-ui.com/docs/FloatingArrow
 */
export const FloatingArrow = React.forwardRef(function FloatingArrow(
  {
    context: {
      placement,
      elements: {floating},
      middlewareData: {arrow},
    },
    width = 14,
    height = 7,
    tipRadius = 0,
    strokeWidth = 0,
    staticOffset,
    stroke,
    d,
    style: {transform, ...restStyle} = {},
    ...rest
  }: FloatingArrowProps,
  ref: React.Ref<SVGSVGElement>
): JSX.Element | null {
  if (__DEV__) {
    if (!ref) {
      console.warn(
        'Floating UI: The `ref` prop is required for the `FloatingArrow`',
        'component.'
      );
    }
  }

  const clipPathId = useId();

  if (!floating) {
    return null;
  }

  // Strokes must be double the border width, this ensures the stroke's width
  // works as you'd expect.
  strokeWidth *= 2;
  const halfStrokeWidth = strokeWidth / 2;

  const svgX = (width / 2) * (tipRadius / -8 + 1);
  const svgY = ((height / 2) * tipRadius) / 4;

  const [side, alignment] = placement.split('-') as [Side, Alignment];
  const isRTL = platform.isRTL(floating);
  const isCustomShape = !!d;
  const isVerticalSide = side === 'top' || side === 'bottom';

  const yOffsetProp = staticOffset && alignment === 'end' ? 'bottom' : 'top';
  let xOffsetProp = staticOffset && alignment === 'end' ? 'right' : 'left';
  if (staticOffset && isRTL) {
    xOffsetProp = alignment === 'end' ? 'left' : 'right';
  }

  const arrowX = arrow?.x != null ? staticOffset || arrow.x : '';
  const arrowY = arrow?.y != null ? staticOffset || arrow.y : '';

  const dValue =
    d ||
    'M0,0' +
      ` H${width}` +
      ` L${width - svgX},${height - svgY}` +
      ` Q${width / 2},${height} ${svgX},${height - svgY}` +
      ' Z';

  const rotation = {
    top: isCustomShape ? 'rotate(180deg)' : '',
    left: isCustomShape ? 'rotate(90deg)' : 'rotate(-90deg)',
    bottom: isCustomShape ? '' : 'rotate(180deg)',
    right: isCustomShape ? 'rotate(-90deg)' : 'rotate(90deg)',
  }[side];

  return (
    <svg
      {...rest}
      aria-hidden
      ref={ref}
      width={isCustomShape ? width : width + strokeWidth}
      height={width}
      viewBox={`0 0 ${width} ${height > width ? height : width}`}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        [xOffsetProp]: arrowX,
        [yOffsetProp]: arrowY,
        [side]:
          isVerticalSide || isCustomShape
            ? '100%'
            : `calc(100% - ${strokeWidth / 2}px)`,
        transform: `${rotation}${transform ?? ''}`,
        ...restStyle,
      }}
    >
      {strokeWidth > 0 && (
        <path
          clipPath={`url(#${clipPathId})`}
          fill="none"
          stroke={stroke}
          // Account for the stroke on the fill path rendered below.
          strokeWidth={strokeWidth + (d ? 0 : 1)}
          d={dValue}
        />
      )}
      {/* In Firefox, for left/right placements there's a ~0.5px gap where the
      border can show through. Adding a stroke on the fill removes it. */}
      <path stroke={strokeWidth && !d ? rest.fill : 'none'} d={dValue} />
      {/* Assumes the border-width of the floating element matches the 
      stroke. */}
      <clipPath id={clipPathId}>
        <rect
          x={-halfStrokeWidth}
          y={halfStrokeWidth * (isCustomShape ? -1 : 1)}
          width={width + strokeWidth}
          height={width}
        />
      </clipPath>
    </svg>
  );
});
