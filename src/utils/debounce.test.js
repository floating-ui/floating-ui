// @flow
import debounce from './debounce';

it('should debounce all the calls in the same tick', () => {
  let called = 0;
  const debounced = debounce(() => {
    called += 1;
    return called;
  });
  debounced();
  debounced();
  return debounced().then(one => {
    expect(called).toEqual(1);
    expect(called).toEqual(one);
  });
});

it('should allow next tick calls to run', () => {
  let called = 0;
  const debounced = debounce(() => (called += 1));
  debounced();
  return debounced().then(one => {
    debounced();
    expect(one).toEqual(1);
    return debounced().then(two => {
      expect(called).toEqual(2);
      expect(called).toEqual(two);
    });
  });
});
