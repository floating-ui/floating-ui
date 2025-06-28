import {useCallback, useState, useLayoutEffect} from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  useLayoutEffect(() => {
    try {
      const item = localStorage.getItem(key);
      item != null && setStoredValue(JSON.parse(item));
    } catch (_e) {
      //
    }
  }, [initialValue, key]);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          typeof value === 'function'
            ? value(storedValue)
            : value;

        localStorage.setItem(key, JSON.stringify(valueToStore));
        setStoredValue(valueToStore);
      } catch (_e) {
        //
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}
