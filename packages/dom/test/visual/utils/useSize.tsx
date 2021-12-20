import {useState, useLayoutEffect} from 'react';

export const useSize = (
  initialSize = 80
): [number, (event: React.ChangeEvent<HTMLInputElement>) => void] => {
  const [size, setSize] = useState(initialSize);

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(Number(event.target.value));
  };

  useLayoutEffect(() => {
    // Allow Playwright tests to easily hook into this handler
    (window as any).__HANDLE_SIZE_CHANGE__ = handleSizeChange;
  });

  return [size, handleSizeChange];
};
