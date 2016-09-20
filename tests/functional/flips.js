import Popper from '../../src/popper';
import getOppositePlacement from '../../src/utils/getOppositePlacement';

// Utils
import appendNewPopper from '../utils/appendNewPopper';
import appendNewRef from '../utils/appendNewRef';
const jasmineWrapper = document.getElementById('jasmineWrapper');

describe('[flipping]', () => {
    const flippingDefault = [
        'top', 'top-start', 'top-end',
        'bottom', 'bottom-start', 'bottom-end',
        'left', 'left-start', 'left-end',
        'right', 'right-start', 'right-end',];

    const flippingVariations = {
        'top-start' : 'top-end',
        'top-end' : 'top-start',
        'bottom-start' : 'bottom-end',
        'bottom-end' : 'bottom-start',
        'left-start' : 'left-end',
        'left-end' : 'left-start',
        'right-start' : 'right-end',
        'right-end' : 'right-start',
    };

    flippingDefault.forEach((val) => {
        it(`should flip from ${val} to ${getOppositePlacement(val)} if boundariesElement is set`, (done) => {
            var relative = document.createElement('div');
            relative.style.margin = '100px 300px';
            relative.style.height = '100px';
            relative.style.width = '100px';
            relative.style.background = '#ffff00';
            jasmineWrapper.appendChild(relative);

            var ref = appendNewRef(1, 'ref', relative);
            ref.style.width = '70px';
            ref.style.height = '70px';
            ref.style.background = "green";
            // ref.style.marginTop = '100px';
            var popper = appendNewPopper(2, 'popper');

            new Popper(ref, popper,
                { placement: val, boundariesElement: relative }).onCreate((data) => {
                expect(data.flipped).toBe(true);
                expect(data.placement).toBe(getOppositePlacement(val));
                expect(data.originalPlacement).toBe(val);
                data.instance.destroy();
                done();
            });
        });

        it(`should NOT flip if there is no boundariesElement`, (done) => {
            var relative = document.createElement('div');
            relative.style.margin = '100px 300px';
            relative.style.height = '100px';
            relative.style.width = '100px';
            relative.style.background = '#ffff00';
            jasmineWrapper.appendChild(relative);

            var ref = appendNewRef(1, 'ref', relative);
            ref.style.width = '70px';
            ref.style.height = '70px';
            ref.style.background = "green";
            // ref.style.marginTop = '100px';
            var popper = appendNewPopper(3, 'popper');

            new Popper(ref, popper,
                { placement: val }).onCreate((data) => {
                expect(data.flipped).not.toBe(true);
                expect(data.placement).toBe(val);
                expect(data.originalPlacement).toBe(val);
                data.instance.destroy();
                done();
            });
        });
    });
    function getSecondaryMargin(val) {
        return (val === 'start' ? '-' : '') + '100px'
    }

    Object.keys(flippingVariations).forEach((val) => {
        it(`should flip from ${val} to ${flippingVariations[val]} if boundariesElement is set`, (done) => {
            var relative = document.createElement('div');
            relative.style.margin = '100px 300px';
            relative.style.height = '300px';
            relative.style.width = '300px';
            relative.style.background = '#ffff00';
            relative.style.position = 'relative';
            jasmineWrapper.appendChild(relative);

            var ref = appendNewRef(1, 'ref', relative);
            ref.style.width = '200px';
            ref.style.height = '200px';
            ref.style.background = "green";
            ref.style.position = "absolute";
            ref.style.zIndex = "10";
            var valElems = val.split('-');

            switch(valElems[0]) {
                case 'top':
                    ref.style.top = '100px';
                    ref.style.left = getSecondaryMargin(valElems[1]);
                    break;
                case 'bottom':
                    ref.style.bottom = '100px';
                    ref.style.left = getSecondaryMargin(valElems[1]);
                    break;
                case 'left':
                    ref.style.top = getSecondaryMargin(valElems[1]);
                    ref.style.left = '200px';
                    break;
                case 'right':
                    ref.style.top = getSecondaryMargin(valElems[1]);
                    ref.style.right = '200px';
                    break;
            };

            var popper = appendNewPopper(2, 'popper');

            new Popper(ref, popper,
                { placement: val, boundariesElement: relative,
                    modifiers: {
                        preventOverflow: {
                            enabled: true,
                            moveWithTarget: true
                        },
                        flip: {
                            flipVariations: true
                        }
                    } }).onCreate((data) => {
                expect(data.flipped).toBe(true);
                expect(data.placement).toBe(flippingVariations[val]);
                expect(data.originalPlacement).toBe(val);
                data.instance.destroy();
                done();
            });
        });
    })
});
