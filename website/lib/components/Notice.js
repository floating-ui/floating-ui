import cn from 'classnames';

export default function Notice({
  type = 'note',
  title = type,
  gap,
  children,
  className,
}) {
  const ChildrenTag = type === 'version' ? 'strong' : 'span';

  return (
    <aside
      className={cn(
        'py-3 px-4 rounded bg-opacity-25 mb-4 text-base not-prose',
        className,
        {
          'bg-blue-300 dark:bg-blue-500/20 text-blue-900 dark:text-blue-200':
            type === 'note',
          'bg-orange-300 dark:bg-orange-500/20 text-orange-900 dark:text-orange-200':
            type === 'warning',
          'bg-rose-400 dark:bg-rose-600/20 text-rose-900 dark:text-rose-200':
            type === 'error',
          'bg-green-300 dark:bg-green-500/20 text-green-900 dark:text-green-200':
            type === 'version',
          'mt-8': gap === 'above',
          'mb-8': gap === 'below',
        }
      )}
    >
      {type !== 'version' && (
        <strong className="block mt-1 mb-2 text-gray-900 dark:text-gray-100">
          {title[0].toUpperCase() + title.slice(1)}
        </strong>
      )}
      <ChildrenTag>{children}</ChildrenTag>
    </aside>
  );
}
