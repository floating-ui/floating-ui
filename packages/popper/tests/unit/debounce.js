import { microtaskDebounce, taskDebounce } from '../../src/utils/debounce';
import supportsMutationObserver from '../../src/utils/supportsMutationObserver';
const microTasksAvailable = supportsMutationObserver();

describe('utils/debounce', () => {
  it('microtaskDebounce: should be called only once', done => {
    if (!microTasksAvailable) {
      pending();
    }

    let i = 0;
    const debounced = microtaskDebounce(() => i++);
    debounced();
    debounced();
    debounced();
    setTimeout(() => {
      expect(i).toBe(1, 'debounce is called only once');
      done();
    }, 1);
  });

  it('taskDebounce: should be called only once', done => {
    let i = 0;
    const debounced = taskDebounce(() => i++);
    debounced();
    debounced();
    debounced();
    setTimeout(() => {
      expect(i).toBe(1, 'debounce is called only once');
      done();
    }, 1);
  });
});
