import type {MiddlewareState} from '@floating-ui/dom';

export type FloatingUIMiddlewareData = Omit<MiddlewareState, 'platform'> & {
  type: 'FloatingUIMiddleware';
};

export type Datatype = FloatingUIMiddlewareData;
