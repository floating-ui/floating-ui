import * as React from 'react';
import {TYPEABLE_SELECTOR} from './isTypeableElement';

export const SELECTOR =
  'select:not([disabled]),a[href],button:not([disabled]),[tabindex],' +
  'iframe,object,embed,area[href],audio[controls],video[controls],' +
  TYPEABLE_SELECTOR;

export const FocusGuard = React.forwardRef<
  HTMLSpanElement,
  React.HTMLProps<HTMLSpanElement>
>(function FocusGuard(props, ref) {
  return (
    <span
      {...props}
      aria-hidden="true"
      ref={ref}
      tabIndex={0}
      style={{
        position: 'fixed',
        opacity: '0',
        pointerEvents: 'none',
        outline: '0',
      }}
    />
  );
});
