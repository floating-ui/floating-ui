import {platform} from '@floating-ui/dom';
import {Component, createMemo, createUniqueId, JSX, splitProps} from 'solid-js';
import styleToObject from 'style-to-object';

// import {useId} from '../hooks/useId';
import type {Alignment, Side, UseFloatingReturn} from '../types';

export interface FloatingArrowProps {
  // Omit the original `refs` property from the context to avoid issues with
  // generics: https://github.com/floating-ui/floating-ui/issues/2483
  /**
   * The floating context.
   */
  context: UseFloatingReturn;

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
export const FloatingArrow: Component<
  JSX.SvgSVGAttributes<SVGSVGElement> & FloatingArrowProps
> = (
  // {
  //   context: {
  //     placement,
  //     elements: {floating},
  //     middlewareData: {arrow},
  //   },
  //   width = 14,
  //   height = 7,
  //   tipRadius = 0,
  //   strokeWidth = 0,
  //   staticOffset,
  //   stroke,
  //   d,
  //   style: {transform, ...restStyle} = {},
  //   ...rest
  // }
  props
) => {
  if (!import.meta.env.PROD) {
    if (!props.ref) {
      console.warn(
        'Floating UI: The `ref` prop is required for the `FloatingArrow`',
        'component.'
      );
    }
  }
  const [local, rest] = splitProps(props, [
    'context',
    'width',
    'height',
    'tipRadius',
    'strokeWidth',
    'staticOffset',
    'stroke',
    'd',
    'style',
  ]);
  const clipPathId = createUniqueId();

  if (!local.context.refs.floating()) {
    return null;
  }

  // Strokes must be double the border width, this ensures the stroke's width
  // works as you'd expect.
  const calculated = createMemo(() => {
    //initial values and default values
    const {context, staticOffset} = local;
    const placement = context.placement;

    const strokeWidth = (local.strokeWidth ?? 0) * 2;
    const width = local.width ?? 14;
    const height = local.height ?? 7;
    const tipRadius = local.tipRadius ?? 0;
    const arrow = context.middlewareData.arrow;
    const style =
      typeof local.style === 'string'
        ? styleToObject(local.style)
        : local.style ?? {};

    const halfStrokeWidth = strokeWidth / 2;

    const svgX = (width / 2) * (tipRadius / -8 + 1);
    const svgY = ((height / 2) * tipRadius) / 4;

    const [side, alignment] = placement.split('-') as [Side, Alignment];
    const isRTL = platform.isRTL(context.refs.floating() as HTMLElement); //we already return early
    const isCustomShape = !!local.d;
    const isVerticalSide = side === 'top' || side === 'bottom';

    const yOffsetProp = isVerticalSide
      ? side
      : staticOffset && alignment === 'end'
      ? 'bottom'
      : 'top';

    let xOffsetProp = !isVerticalSide
      ? side //otherwise wont work when flip middleware changes the side from left to right
      : staticOffset && alignment === 'end'
      ? 'right'
      : 'left';
    if (staticOffset && isRTL) {
      xOffsetProp = alignment === 'end' ? 'left' : 'right';
    }

    const arrowX = arrow?.x != null ? staticOffset || arrow.x : '';
    const arrowY = arrow?.y != null ? staticOffset || arrow.y : '';

    const dValue =
      local.d ||
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

    const transform = style?.transform ?? '';
    delete style?.transform;
    const restStyle = style;

    return {
      width,
      height,
      strokeWidth,
      rotation,
      xOffsetProp,
      yOffsetProp,
      arrowX,
      arrowY,
      dValue,
      halfStrokeWidth,
      isCustomShape,
      isVerticalSide,
      side,
      transform,
      restStyle,
    };
  });
  return (
    <svg
      {...rest}
      aria-hidden
      width={
        calculated().isCustomShape
          ? calculated().width
          : calculated().width + calculated().strokeWidth
      }
      height={calculated().width}
      viewBox={`0 0 ${calculated().width} ${
        calculated().height > calculated().width
          ? calculated().height
          : calculated().width
      }`}
      style={{
        position: 'absolute',
        'pointer-events': 'none',
        [calculated().xOffsetProp]: `${calculated().arrowX}px`,
        [calculated().yOffsetProp]: `${calculated().arrowY}px`,
        [calculated().side]:
          calculated().isVerticalSide || calculated().isCustomShape
            ? '100%'
            : `calc(100% - ${calculated().strokeWidth / 2}px)`,
        transform: `${calculated().rotation}${calculated().transform}`,
        ...calculated().restStyle,
      }}
    >
      {calculated().strokeWidth > 0 && (
        <path
          clip-path={`url(#${clipPathId})`}
          fill="none"
          stroke={local.stroke ?? 'currentColor'}
          // Account for the stroke on the fill path rendered below.
          stroke-width={
            calculated().strokeWidth + (calculated().dValue ? 0 : 1)
          }
          d={calculated().dValue}
        />
      )}
      {/* In Firefox, for left/right placements there's a ~0.5px gap where the
      border can show through. Adding a stroke on the fill removes it. */}
      <path
        stroke={
          calculated().strokeWidth && !calculated().dValue ? rest.fill : 'none'
        }
        d={calculated().dValue}
      />
      {/* Assumes the border-width of the floating element matches the 
      stroke. */}
      <clipPath id={clipPathId}>
        <rect
          x={-calculated().halfStrokeWidth}
          y={
            calculated().halfStrokeWidth * (calculated().isCustomShape ? -1 : 1)
          }
          width={calculated().width + calculated().strokeWidth}
          height={calculated().width}
        />
      </clipPath>
    </svg>
  );
};
