import {ArrowLeft, ArrowRight} from 'react-feather';

import {Link} from './Link';

export default function Navigation({prev, next}) {
  return (
    <div className="mt-16 flex text-xl font-bold lg:text-xl">
      {prev ? (
        <Link
          href={prev.url}
          className="flex-1 basis-auto items-center gap-2 overflow-hidden overflow-ellipsis break-words rounded py-12 px-2 lg:basis-0 lg:px-4 lg:hover:bg-gray-100 dark:lg:hover:bg-purple-300/10"
          aria-label={`Prev: ${prev.title}`}
        >
          <div className="mb-2 flex items-center text-right text-sm text-gray-500 lg:hidden">
            <ArrowLeft className="inline text-gray-500" />
            Prev
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden lg:block">
              <ArrowLeft className="min-width-[24] text-rose-600 dark:text-rose-300" />
            </span>
            <span className="truncate dark:text-gray-50">
              {prev.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={next.url}
          className="flex-1 basis-auto items-center justify-end gap-2 overflow-hidden overflow-ellipsis break-words rounded py-12 px-2 lg:basis-0 lg:px-4 lg:hover:bg-gray-100 dark:lg:hover:bg-purple-300/10"
          aria-label={`Next: ${next.title}`}
        >
          <div className="mb-2 flex items-center justify-end text-right text-sm text-gray-500 lg:hidden">
            Next
            <ArrowRight className="min-width-[24] inline text-gray-500" />
          </div>
          <div className="flex items-center justify-end gap-4">
            <span className="truncate dark:text-gray-50">
              {next.title}
            </span>{' '}
            <span className="hidden lg:block">
              <ArrowRight className="min-width-[24] text-rose-600 dark:text-rose-300" />
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
