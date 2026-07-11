import type {MiddlewareState} from '../src';
import {size} from '../src';

// A callback with a narrower parameter type stays assignable to `apply`,
// matching the behavior before optional callbacks gained an explicit
// `| undefined` for `exactOptionalPropertyTypes`. Regresses to a TS2322 error
// if `apply` loses its bivariant callback treatment.
const narrowSizeApply = (
  args: MiddlewareState & {
    availableWidth: number;
    availableHeight: number;
    custom: true;
  },
) => {
  args.custom;
};

size({apply: narrowSizeApply});
