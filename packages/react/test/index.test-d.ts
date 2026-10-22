import type {
  CompositeProps,
  ExtendedRefs,
  FloatingContext,
  FloatingEvents,
  FloatingNodeType,
  FloatingRootContext,
  FloatingTreeType,
  UseFloatingOptions,
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

// The same guarantee for the function-valued members that are declared as
// properties so that reading one without calling it is not treated as an
// unbound method. Each regresses to TS2322 if it loses `BivariantCallback`.

// `node` narrowed from `Element | null` to `HTMLDivElement | null`.
export const setReference: ExtendedRefs<Element>['setReference'] = (
  node: HTMLDivElement | null,
) => {
  void node;
};

// `node` narrowed from `HTMLElement | null` to `HTMLDivElement | null`.
export const setFloating: ExtendedRefs<Element>['setFloating'] = (
  node: HTMLDivElement | null,
) => {
  void node;
};

// `node` narrowed from `ReferenceType | null` to `Element | null`.
export const setPositionReference: ExtendedRefs<Element>['setPositionReference'] =
  (node: Element | null) => {
    void node;
  };

export const setRootPositionReference: FloatingRootContext['refs']['setPositionReference'] =
  (node: Element | null) => {
    void node;
  };

// `event` narrowed from `string` to a literal union.
export const on: FloatingEvents['on'] = (
  event: 'open' | 'close',
  handler: (data: any) => void,
) => {
  void [event, handler];
};

export const off: FloatingEvents['off'] = (
  event: 'open' | 'close',
  handler: (data: any) => void,
) => {
  void [event, handler];
};

// `node.id` narrowed from `string | undefined` to `string`.
export const addNode: FloatingTreeType['addNode'] = (
  node: FloatingNodeType & {id: string},
) => {
  void node;
};

export const removeNode: FloatingTreeType['removeNode'] = (
  node: FloatingNodeType & {id: string},
) => {
  void node;
};

// `event` narrowed from `Event` to `MouseEvent`.
export const contextOnOpenChange: FloatingContext['onOpenChange'] = (
  open: boolean,
  event?: MouseEvent,
) => {
  void [open, event];
};

// `emit` keeps its type parameter. Regresses to TS2558 if the signature is
// ever wrapped in a helper that resolves `Parameters<T>`, which erases it.
export function emitStaysGeneric(events: FloatingEvents) {
  events.emit<'custom-event'>('custom-event');
}
