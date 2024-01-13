import * as React from 'react';
import {Database, Eye, Move} from 'react-feather';

export function MiddlewareContainer({children}) {
  return <div className="-my-2 flex gap-1">{children}</div>;
}

export function MiddlewareBadge({type}) {
  let badgeColor = '';
  let icon = null;

  switch (type) {
    case 'Visibility Optimizer':
      badgeColor = 'bg-purple-500 dark:bg-purple-200 dark:text-purple-900';
      icon = <Eye size={16} />;
      break;
    case 'Placement Modifier':
      badgeColor = 'bg-blue-500 dark:bg-blue-200 dark:text-blue-900';
      icon = <Move size={16} />;
      break;
    case 'Data Provider':
      badgeColor = 'bg-cyan-500 dark:bg-cyan-200 dark:text-cyan-900';
      icon = <Database size={16} />;
      break;
    default:
      badgeColor = 'bg-gray-500';
  }

  return (
    <em
      className={`flex w-[max-content] items-center gap-1 px-2 py-1 text-xs font-black uppercase text-white ${badgeColor} rounded-full`}
    >
      {icon}
      {type}
    </em>
  );
}
