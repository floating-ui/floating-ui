import Popper from 'src/popper/index.js';
import '../setup';

// Utils
import appendNewPopper from '../utils/appendNewPopper';
import appendNewRef from '../utils/appendNewRef';

describe('[offset]', () => {
  it('creates a popper with single implicit px offset', done => {
    const reference = appendNewRef(1);
    reference.style.marginLeft = '100px';
    const popper = appendNewPopper(2);

    const offset = 10;

    new Popper(reference, popper, {
      placement: 'bottom',
      modifiers: {
        offset: {
          offset: offset,
        },
      },
      onCreate: () => {
        const refLeft = reference.getBoundingClientRect().left;
        const refWidth = reference.offsetWidth;
        const popperLeft = popper.getBoundingClientRect().left;
        const popperWidth = popper.offsetWidth;
        const expectedPopperLeft =
          refLeft + refWidth / 2 - popperWidth / 2 + offset;

        expect(popperLeft).toBeApprox(expectedPopperLeft);
        done();
      },
    });
  });

  it('creates a popper with double implicit px offset', done => {
    const reference = appendNewRef(1);
    reference.style.marginLeft = '100px';
    const popper = appendNewPopper(2);

    const offset = '10 10';
    const arrowHeight = 5;

    new Popper(reference, popper, {
      placement: 'bottom',
      modifiers: {
        offset: {
          offset: offset,
        },
      },
      onCreate: () => {
        const refLeft = reference.getBoundingClientRect().left;
        const refBottom = reference.getBoundingClientRect().bottom;
        const refWidth = reference.offsetWidth;
        const popperLeft = popper.getBoundingClientRect().left;
        const popperTop = popper.getBoundingClientRect().top;
        const popperWidth = popper.offsetWidth;
        const expectedPopperLeft =
          refLeft + refWidth / 2 - popperWidth / 2 + +offset.split(' ')[0];

        expect(popperLeft).toBeApprox(expectedPopperLeft);
        expect(popperTop - arrowHeight).toBeApprox(
          refBottom + +offset.split(' ')[1]
        );
        done();
      },
    });
  });

  it('creates a popper with single explicit % offset', done => {
    const reference = appendNewRef(1);
    reference.style.marginLeft = '100px';
    const popper = appendNewPopper(2);

    const offset = '25%';

    new Popper(reference, popper, {
      placement: 'bottom',
      modifiers: {
        offset: {
          offset: offset,
        },
      },
      onCreate: () => {
        const refLeft = reference.getBoundingClientRect().left;
        const refWidth = reference.offsetWidth;
        const popperLeft = popper.getBoundingClientRect().left;
        const popperWidth = popper.offsetWidth;
        const expectedPopperLeft =
          refLeft + refWidth / 2 - popperWidth / 2 + refWidth / 4;

        expect(popperLeft).toBeApprox(expectedPopperLeft);
        done();
      },
    });
  });

  it('creates a popper with double explicit % offset', done => {
    const reference = appendNewRef(1);
    reference.style.marginLeft = '100px';
    const popper = appendNewPopper(2);

    const offset = '25% 25%';
    const arrowHeight = 5;

    new Popper(reference, popper, {
      placement: 'bottom',
      modifiers: {
        offset: {
          offset: offset,
        },
      },
      onCreate: () => {
        const refLeft = reference.getBoundingClientRect().left;
        const refBottom = reference.getBoundingClientRect().bottom;
        const refWidth = reference.offsetWidth;
        const refHeight = reference.offsetHeight;
        const popperLeft = popper.getBoundingClientRect().left;
        const popperTop = popper.getBoundingClientRect().top;
        const popperWidth = popper.offsetWidth;
        const expectedPopperLeft =
          refLeft + refWidth / 2 - popperWidth / 2 + refWidth / 4;

        expect(popperLeft).toBeApprox(expectedPopperLeft);
        expect(popperTop - arrowHeight).toBeApprox(refBottom + refHeight / 4);
        done();
      },
    });
  });
});
