import c from 'clsx';
import * as React from 'react';

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Button(props, ref) {
  return (
    <button
      {...props}
      ref={ref}
      className={c(
        props.className,
        'bg-slate-200/90 rounded p-2 px-3 transition-colors hover:bg-slate-200/50 data-[open]:bg-slate-200/50',
      )}
    />
  );
});
