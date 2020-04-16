// @flow

type Debounce<T> = {
  (): Promise<T>,
  cancel: () => void,
};

export default function debounce<T>(fn: () => Promise<T> | T): Debounce<T> {
  let pending;

  const callback: Debounce<T> = function() {
    if (!pending) {
      pending = new Promise<T>(resolve => {
        Promise.resolve().then(() => {
          if (pending) {
            pending = undefined;
            resolve(fn());
          }
        });
      });
    }

    return pending;
  };

  callback.cancel = () => (pending = undefined);

  return callback;
}
