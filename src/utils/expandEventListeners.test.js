// @flow
import expandEventListeners from './expandEventListeners';

it('expands all the possible cases', () => {
  expect(expandEventListeners(true)).toMatchSnapshot('true');
  expect(expandEventListeners(false)).toMatchSnapshot('false');
  expect(expandEventListeners({ scroll: true, resize: true })).toMatchSnapshot(
    'true, true'
  );
  expect(expandEventListeners({ scroll: true, resize: false })).toMatchSnapshot(
    'scroll: true, resize: false'
  );
  expect(expandEventListeners({ scroll: true })).toMatchSnapshot(
    'scroll: true, resize: undefined'
  );
});
