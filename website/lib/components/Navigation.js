import Link from 'next/link';
import {ArrowLeft, ArrowRight} from 'react-feather';

export default function Navigation({back, next}) {
  return (
    <div className="grid sm:grid-cols-2 text-xl md:text-2xl mt-8">
      {back ? (
        <Link href={back.url}>
          <a
            href={back.url}
            className="flex gap-2 items-center py-12 px-4 hover:bg-gray-800 rounded overflow-ellipsis overflow-hidden"
          >
            <ArrowLeft style={{minWidth: 24}} /> {back.title}
          </a>
        </Link>
      ) : (
        <div />
      )}
      {next && (
        <Link href={next.url}>
          <a
            href={next.url}
            className="flex gap-2 justify-end items-center py-12 px-4 hover:bg-gray-800 rounded overflow-ellipsis overflow-hidden"
          >
            {next.title} <ArrowRight style={{minWidth: 24}} />
          </a>
        </Link>
      )}
    </div>
  );
}
