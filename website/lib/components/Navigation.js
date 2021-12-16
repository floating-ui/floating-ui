import Link from 'next/link';
import {ArrowLeft, ArrowRight} from 'react-feather';

export default function Navigation({back, next}) {
  return (
    <div className="flex text-xl sm:text-2xl mt-16 text-blue-400">
      {back ? (
        <Link href={back.url}>
          <a
            href={back.url}
            className="break-all basis-auto sm:basis-0 flex-1 gap-2 items-center py-12 px-2 sm:px-4 sm:hover:bg-gray-800 rounded overflow-ellipsis overflow-hidden"
            aria-label="Back"
          >
            <div className="flex sm:hidden text-sm items-center text-right mb-2 text-gray-500">
              <ArrowLeft className="inline text-gray-500" />
              Back
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block">
                <ArrowLeft className="min-width-[24]" />
              </span>
              {back.title}
            </div>
          </a>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link href={next.url}>
          <a
            href={next.url}
            className="break-all basis-auto sm:basis-0 flex-1 gap-2 justify-end items-center py-12 px-2 sm:px-4 sm:hover:bg-gray-800 rounded overflow-ellipsis overflow-hidden"
            aria-label="Next"
          >
            <div className="flex justify-end sm:hidden text-sm items-center text-right mb-2 text-gray-500">
              Next
              <ArrowRight className="min-width-[24] inline" />
            </div>
            <div className="flex items-center gap-4 justify-end">
              {next.title}{' '}
              <span className="hidden sm:block">
                <ArrowRight className="min-width-[24]" />
              </span>
            </div>
          </a>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
