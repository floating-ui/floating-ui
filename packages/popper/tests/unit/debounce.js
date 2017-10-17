import { microtaskDebounce, taskDebounce } from '../../src/utils/debounce';
const microTasksAvailable = window.Promise

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
