import Popper from '../../src/popper';
import '../setup';

// Utils
import appendNewPopper from '../utils/appendNewPopper';
import appendNewRef from '../utils/appendNewRef';

describe('[offset]', () => {
    it('creates a popper with single implicit px offset', (done) => {
        var reference = appendNewRef(1);
        reference.style.marginLeft = '100px';
        var popper    = appendNewPopper(2);

        var offset = 10;

        new Popper(reference, popper, {
            placement: 'bottom',
            modifiers: {
                offset: {
                    offset: offset
                }
            }
        }).onCreate(() => {
            var refLeft = reference.getBoundingClientRect().left;
            var refWidth = reference.offsetWidth;
            var popperLeft = popper.getBoundingClientRect().left;
            var popperWidth = popper.offsetWidth;
            var expectedPopperLeft = refLeft + (refWidth / 2) - (popperWidth / 2) + offset;

            expect(popperLeft).toBeApprox(expectedPopperLeft);
            done();
        });
    });

    it('creates a popper with double implicit px offset', (done) => {
        var reference = appendNewRef(1);
        reference.style.marginLeft = '100px';
        var popper    = appendNewPopper(2);

        var offset = '10 10';
        var arrowHeight = 5;

        new Popper(reference, popper, {
            placement: 'bottom',
            modifiers: {
                offset: {
                    offset: offset
                }
            }
        }).onCreate(() => {
            var refLeft = reference.getBoundingClientRect().left;
            var refBottom = reference.getBoundingClientRect().bottom;
            var refWidth = reference.offsetWidth;
            var popperLeft = popper.getBoundingClientRect().left;
            var popperTop = popper.getBoundingClientRect().top;
            var popperWidth = popper.offsetWidth;
            var expectedPopperLeft = refLeft + (refWidth / 2) - (popperWidth / 2) + +offset.split(' ')[0];

            expect(popperLeft).toBeApprox(expectedPopperLeft);
            expect(popperTop - arrowHeight).toBeApprox(refBottom + +offset.split(' ')[1]);
            done();
        });
    });

    it('creates a popper with single explicit % offset', (done) => {
        var reference = appendNewRef(1);
        reference.style.marginLeft = '100px';
        var popper    = appendNewPopper(2);

        var offset = '25%';

        new Popper(reference, popper, {
            placement: 'bottom',
            modifiers: {
                offset: {
                    offset: offset
                }
            }
        }).onCreate(() => {
            var refLeft = reference.getBoundingClientRect().left;
            var refWidth = reference.offsetWidth;
            var popperLeft = popper.getBoundingClientRect().left;
            var popperWidth = popper.offsetWidth;
            var expectedPopperLeft = refLeft + (refWidth / 2) - (popperWidth / 2) + (refWidth / 4);

            expect(popperLeft).toBeApprox(expectedPopperLeft);
            done();
        });
    });

    it('creates a popper with double explicit % offset', (done) => {
        var reference = appendNewRef(1);
        reference.style.marginLeft = '100px';
        var popper    = appendNewPopper(2);

        var offset = '25% 25%';
        var arrowHeight = 5;

        new Popper(reference, popper, {
            placement: 'bottom',
            modifiers: {
                offset: {
                    offset: offset
                }
            }
        }).onCreate(() => {
            var refLeft = reference.getBoundingClientRect().left;
            var refBottom = reference.getBoundingClientRect().bottom;
            var refWidth = reference.offsetWidth;
            var refHeight = reference.offsetHeight;
            var popperLeft = popper.getBoundingClientRect().left;
            var popperTop = popper.getBoundingClientRect().top;
            var popperWidth = popper.offsetWidth;
            var expectedPopperLeft = refLeft + (refWidth / 2) - (popperWidth / 2) + (refWidth / 4);

            expect(popperLeft).toBeApprox(expectedPopperLeft);
            expect(popperTop - arrowHeight).toBeApprox(refBottom + (refHeight / 4));
            done();
        });
    });
});
