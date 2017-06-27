import isNative from '../../src/utils/isNative';
import makePopperFactory from '../utils/makePopperFactory';
import makeConnectedElement from '@popperjs/test-utils/utils/makeConnectedElement';
import '@popperjs/test-utils/setup';

describe('[rendering]', () => {
  const makePopper = makePopperFactory();
  const microTasksAvailable = isNative(window.MutationObserver);

  it('renders to the DOM before the first paint when microtasks are available', done => {
    if (!microTasksAvailable) {
      pending();
    }

    const spy = jasmine.createSpy('paint watcher');
    requestAnimationFrame(spy);

    makePopper(makeConnectedElement(), makeConnectedElement(), {
      onCreate: () => {
        expect(spy).not.toHaveBeenCalled();
        done();
      },
    });
  });
});
