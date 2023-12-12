import {useState} from 'react';

const sizes: Record<string, number> = {
  large: 150,
  medium: 100,
  small: 50,
  tiny: 10,
};

export const useBoxSize = (
  initialSize = 'large',
): [number, string, (value: string) => void] => {
  const [size, setSize] = useState(initialSize);

  return [sizes[size], size, setSize];
};
