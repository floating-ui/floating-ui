import * as React from 'react';

export function PackageLimited({children}) {
  return (
    <em
      className={`flex w-[max-content] items-center gap-1 rounded-full bg-purple-500 px-2 py-1 text-sm font-black text-white dark:bg-purple-600/75 dark:text-purple-100`}
    >
      {children}
    </em>
  );
}
