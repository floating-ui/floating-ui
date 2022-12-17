import {useState, useLayoutEffect} from 'react';
import {flushSync} from 'react-dom';

export const useSize = (
  initialSize = 80,
  key = 'floating'
): [number, (event: React.ChangeEvent<HTMLInputElement>) => void] => {
  const [size, setSize] = useState(initialSize);

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    flushSync(() => setSize(Number(event.target.value)));
  };

  useLayoutEffect(() => {
    // Allow Playwright tests to easily hook into this handler
    (window as any)[`__handleSizeChange_${key}`] = handleSizeChange;
  });

  return [size, handleSizeChange];
};
