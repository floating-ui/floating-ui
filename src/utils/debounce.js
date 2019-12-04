// @flow
export default function microtaskDebounce(fn: Function) {
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
