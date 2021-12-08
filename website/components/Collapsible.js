import {useState} from 'react';
import {ChevronDown, ChevronUp} from 'react-feather';

export default function Collapsible({children, title}) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div>
      <button
        className="flex gap-2 items-center"
        onClick={() => setCollapsed((v) => !v)}
      >
        {collapsed ? 'View' : 'Hide'} {title ?? 'contents'}
        {collapsed ? <ChevronDown /> : <ChevronUp />}
      </button>
      {collapsed ? null : children}
    </div>
  );
}
