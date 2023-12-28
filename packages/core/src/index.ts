export {computePosition} from './computePosition';
export {detectOverflow, DetectOverflowOptions} from './detectOverflow';
export {arrow, ArrowOptions} from './middleware/arrow';
export {
  type AutoPlacementOptions,
  autoPlacement,
} from './middleware/autoPlacement';
export {flip, FlipOptions} from './middleware/flip';
export {hide, HideOptions} from './middleware/hide';
export {inline, InlineOptions} from './middleware/inline';
export {offset, OffsetOptions} from './middleware/offset';
export {
  type LimitShiftOptions,
  type ShiftOptions,
  limitShift,
  shift,
} from './middleware/shift';
export {size, SizeOptions} from './middleware/size';
export type {
  Boundary,
  ComputePosition,
  ComputePositionConfig,
  ComputePositionReturn,
  Coords,
  Derivable,
  Dimensions,
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
export {rectToClientRect} from '@floating-ui/utils';
