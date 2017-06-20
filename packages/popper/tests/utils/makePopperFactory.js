import Popper from '../../src/index.js';

/**
 * Create a factory function that produces auto-cleanup popper instances.
 *
 * This function must be called in the context of a `describe`, as it utilises
 * the `afterEach` API to schedule cleanup.
 */
export default function makePopperFactory() {
  let poppers = [];

  afterEach(() => {
    poppers.forEach(instance => instance.destroy());
    poppers = [];
  });

  return function factory(...args) {
    const popper = new Popper(...args);
    poppers.push(popper);
    return popper;
  };
}
