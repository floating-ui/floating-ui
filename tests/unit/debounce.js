import debounce from '../../src/popper/utils/debounce';

describe('utils/debounce', () => {
  it('should be called only once', (done) => {
    let i = 0;
    const debounced = debounce(() => (i++));
    debounced();
    debounced();
    debounced();
    setTimeout(() => {
      expect(i).toBe(1, 'debounce is called only once');
      done();
    }, 1);
  });
});
