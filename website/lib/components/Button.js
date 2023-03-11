import * as React from 'react';
import {twMerge} from 'tailwind-merge';

export const Button = React.forwardRef(function Button(
  props,
  ref
) {
  return (
    <button
      {...props}
      ref={ref}
      className={twMerge(
        'cursor-default bg-gray-100/75 dark:bg-gray-800/95 rounded p-2 px-3',
        'transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-600',
        'data-[open]:bg-gray-200/50 dark:data-[open]:bg-gray-600',
        props.className
      )}
    />
  );
});
