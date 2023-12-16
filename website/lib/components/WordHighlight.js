import cn from 'classnames';

export function WordHighlight({children, id}) {
  return (
    <span
      className={cn('rounded border-b p-1', {
        'border-b-rose-300 bg-rose-100 text-rose-900 dark:border-b-rose-500 dark:bg-rose-800 dark:text-rose-200':
          id === 'a',
        'border-b-cyan-300 bg-cyan-100 text-cyan-900 dark:border-b-cyan-500 dark:bg-cyan-800 dark:text-cyan-200':
          id === 'b',
        'border-b-purple-300 bg-purple-100 text-purple-900 dark:border-b-purple-500 dark:bg-purple-800 dark:text-purple-200':
          id === 'c',
      })}
    >
      {children}
    </span>
  );
}
