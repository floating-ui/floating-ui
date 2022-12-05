import cn from 'classnames';

export default function Notice({
  type = 'note',
  title = type,
  gap,
  children,
  className,
}) {
  return (
    <div
      className={cn(
        'py-3 px-4 rounded bg-opacity-25 mb-4 text-base not-prose',
        className,
        {
          'bg-blue-500 text-blue-200': type === 'note',
          'bg-orange-500 text-orange-200': type === 'warning',
          'bg-rose-600 text-rose-200': type === 'error',
          'bg-green-500 text-green-200': type === 'version',
          'mt-8': gap === 'above',
          'mb-8': gap === 'below',
        }
      )}
    >
      <strong className="block mt-1 mb-2 text-gray-100">
        {title[0].toUpperCase() + title.slice(1)}
      </strong>
      <span>{children}</span>
    </div>
  );
}
