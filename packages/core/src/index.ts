export {computePosition} from './computePosition';
export type {DetectOverflowOptions} from './detectOverflow';
export {detectOverflow} from './detectOverflow';
export type {ArrowOptions} from './middleware/arrow';
export {arrow} from './middleware/arrow';
export type {AutoPlacementOptions} from './middleware/autoPlacement';
export {autoPlacement} from './middleware/autoPlacement';
export type {FlipOptions} from './middleware/flip';
export {flip} from './middleware/flip';
export type {HideOptions} from './middleware/hide';
export {hide} from './middleware/hide';
export type {InlineOptions} from './middleware/inline';
export {inline} from './middleware/inline';
export type {OffsetOptions} from './middleware/offset';
export {offset} from './middleware/offset';
export type {LimitShiftOptions, ShiftOptions} from './middleware/shift';
export {limitShift, shift} from './middleware/shift';
export type {SizeOptions} from './middleware/size';
export {size} from './middleware/size';
export type {
  Boundary,
  ComputePosition,
  ComputePositionConfig,
  ComputePositionReturn,
  Derivable,
  ElementContext,
  Elements,
  FloatingElement,
  Middleware,
  MiddlewareArguments,
  MiddlewareData,
  MiddlewareReturn,
  MiddlewareState,
  Platform,
  ReferenceElement,
  RootBoundary,
} from './types';
export type {
  AlignedPlacement,
  Alignment,
  Axis,
  ClientRectObject,
  Coords,
  Dimensions,
  ElementRects,
  Length,
  Padding,
  Placement,
  Rect,
  Side,
  SideObject,
  Strategy,
  VirtualElement,
} from '@floating-ui/utils';
// This export exists only for backwards compatibility. It will be removed in
// the next major version.
export {rectToClientRect} from '@floating-ui/utils';
