export {computePosition} from './computePosition';
export {type DetectOverflowOptions, detectOverflow} from './detectOverflow';
export {type ArrowOptions, arrow} from './middleware/arrow';
export {
  type AutoPlacementOptions,
  autoPlacement,
} from './middleware/autoPlacement';
export {type FlipOptions, flip} from './middleware/flip';
export {type HideOptions, hide} from './middleware/hide';
export {type InlineOptions, inline} from './middleware/inline';
export {type OffsetOptions, offset} from './middleware/offset';
export {
  type LimitShiftOptions,
  type ShiftOptions,
  limitShift,
  shift,
} from './middleware/shift';
export {type SizeOptions, size} from './middleware/size';
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
