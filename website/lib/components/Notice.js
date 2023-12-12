import cn from 'classnames';

export default function Notice({
  type = 'note',
  title = type,
  gap,
  children,
  className,
}) {
  return (
    <aside
      className={cn(
        'mb-4 rounded bg-opacity-40 p-6 dark:bg-opacity-40 [&_pre:last-child]:mt-2 [&_*:last-child]:mb-0',
        className,
        {
          'bg-blue-300 text-blue-900 dark:bg-blue-500 dark:text-blue-200':
            type === 'note',
          'bg-orange-300 text-orange-900 dark:bg-orange-500 dark:text-orange-200':
            type === 'warning',
          'bg-rose-400/30 text-rose-900 dark:bg-rose-600 dark:text-rose-200':
            type === 'error',
          'bg-green-300 text-green-900 dark:bg-green-500 dark:text-green-200':
            type === 'version',
          'mt-8': gap === 'above',
          'mb-8': gap === 'below',
        },
      )}
    >
      <h5 className="-mb-2 text-xl font-bold text-gray-900 dark:text-gray-50">
        {title[0].toUpperCase() + title.slice(1)}
      </h5>
      <span>{children}</span>
    </aside>
  );
}
