import Tippy from '@tippyjs/react/headless';
import {useState} from 'react';

export const VisibleProp = () => {
  const [visible, setVisible] = useState(false);

  return (
    <Tippy
      render={() => (
        <div className="bg-blue-600 text-gray-50 rounded px-2 py-1">
          Tooltip
        </div>
      )}
      visible={visible}
      animation={false}
    >
      <button
        className="px-4 py-2 bg-gray-700 text-gray-50 rounded"
        onClick={() => setVisible((v) => !v)}
      >
        Click
      </button>
    </Tippy>
  );
};
