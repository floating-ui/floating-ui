import * as React from 'react';

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
