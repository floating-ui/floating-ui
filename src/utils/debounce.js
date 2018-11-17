// @flow
export default function microtaskDebounce(fn: Function) {
  let called = false;
  return () =>
    new Promise<void>(resolve => {
      if (called) {
        return resolve();
      }
      called = true;
      Promise.resolve().then(() => {
        called = false;
        resolve(fn());
      });
    });
}
