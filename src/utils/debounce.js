// @flow

export default function debounce(fn: Function) {
  let pending;
  return () => {
    if (!pending) {
      pending = new Promise<void>(resolve => {
        Promise.resolve().then(() => {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}
