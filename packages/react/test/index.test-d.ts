import type {
  CompositeProps,
  FloatingContext,
  FloatingRootContext,
  UseFloatingOptions,
  useTransitionStatus,
} from '../src';

// Callbacks with a narrower parameter type stay assignable, matching the
// behavior before these optional callbacks gained an explicit `| undefined`
// for `exactOptionalPropertyTypes`. Each regresses to a TS2322 error if the
// callback loses its bivariant treatment.

// `event` narrowed from `Event` to `MouseEvent`.
export const onOpenChange: UseFloatingOptions['onOpenChange'] = (
  open: boolean,
  event?: MouseEvent,
) => {
  void [open, event];
};

// `index` narrowed from `number` to a literal union.
export const onNavigate: CompositeProps['onNavigate'] = (index: 0 | 1) => {
  void index;
};

// `useTransitionStatus` accepts the root context as well as the full context.
declare const rootContext: FloatingRootContext;
declare const fullContext: FloatingContext;
export const transitionStatusContexts: Array<
  Parameters<typeof useTransitionStatus>[0]
> = [rootContext, fullContext];
