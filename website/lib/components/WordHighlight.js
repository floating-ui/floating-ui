import cn from 'classnames';

export function WordHighlight({children, id}) {
  return (
    <span
      className={cn('rounded p-1', {
        'text-rose-900 bg-rose-100 dark:text-rose-200 dark:bg-rose-800':
          id === 'a',
        'text-cyan-900 bg-cyan-100 dark:text-cyan-200 dark:bg-cyan-800':
          id === 'b',
      })}
    >
      {children}
    </span>
  );
}
