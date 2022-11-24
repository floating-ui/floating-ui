import * as React from 'react';

export const HIDDEN_STYLES: React.CSSProperties = {
  position: 'fixed',
  opacity: '0',
  pointerEvents: 'none',
  outline: '0',
};

export const FocusGuard = React.forwardRef<
  HTMLSpanElement,
  React.HTMLProps<HTMLSpanElement>
>(function FocusGuard(props, ref) {
  return (
    <span
      {...props}
      ref={ref}
      tabIndex={0}
      aria-hidden="true"
      data-floating-ui-focus-guard=""
      style={HIDDEN_STYLES}
    />
  );
});
