import * as React from 'react';
import {twMerge} from 'tailwind-merge';

export const Button = React.forwardRef(function Button(
  {div, ...props},
  ref,
) {
  const className = twMerge(
    'cursor-default rounded bg-gray-100/75 p-2 px-3 dark:bg-gray-600/50',
    'transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-600',
    'data-[open]:bg-gray-200/50 dark:data-[open]:bg-gray-600 select-none',
    props.className,
  );

  if (div) {
    return (
      <div
        {...props}
        ref={ref}
        className={className}
        tabIndex={0}
      />
    );
  }

  return <button {...props} ref={ref} className={className} />;
});
