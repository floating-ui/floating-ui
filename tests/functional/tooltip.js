import '../setup.js';
import then from '../utils/then.js';
import '../utils/customEventPolyfill.js';

const jasmineWrapper = document.getElementById('jasmineWrapper');

import Tooltip from '../../src/tooltip/index.js';

let reference;
let instance;
function createReference() {
    reference = document.createElement('div');
    reference.style.width = '100px';
    reference.style.height = '100px';
    reference.style.margin = '100px';
    jasmineWrapper.appendChild(reference);
}

describe('[tooltip.js]', () => {
    describe('manual', () => {
        beforeEach(() => {
            createReference()
        });

        it('should show tooltip', (done) => {
            instance = new Tooltip(reference, {
                title: 'foobar',
            });

            instance.show();

            then(() => {
                expect(document.querySelector('.tooltip')).not.toBeNull();
                done();
            });
        });

        it('should hide tooltip', (done) => {
            instance = new Tooltip(reference, {
                title: 'foobar',
            });

            instance.show();
            then(() => instance.hide());

            then(() => {
                expect(document.querySelector('.tooltip').style.display).toBe('none');
                done();
            });
        });


        it('should dispose tooltip', (done) => {
            instance = new Tooltip(reference, {
                title: 'foobar',
            });

            instance.show();
            then(() => instance.dispose());

            then(() => {
                expect(document.querySelector('.tooltip')).toBeNull();
                done();
            });
        });
    });

    describe('events', () => {
        beforeEach(() => {
            createReference();
        });

        afterEach(() => {
            instance.dispose();
            jasmineWrapper.innerHTML = '';
        });

        it('should show a tooltip when hovered', (done) => {
            instance = new Tooltip(reference, {
                title: 'foobar',
                trigger: 'hover',
            });

            expect(document.querySelector('.tooltip')).toBeNull();

            reference.dispatchEvent(new CustomEvent('mouseenter'));

            then(() => {
                expect(document.querySelector('.tooltip')).not.toBeNull();
                done();
            });
        });

        it('should hide a tooltip on mouseleave', (done) => {
            instance = new Tooltip(reference, {
                title: 'foobar',
                trigger: 'hover',
            });

            expect(document.querySelector('.tooltip')).toBeNull();

            reference.dispatchEvent(new CustomEvent('mouseenter'));
            then(() => reference.dispatchEvent(new CustomEvent('mouseleave')));
            then(() => {
                expect(document.querySelector('.tooltip').style.display).toBe('none');
                done();
            });
        });

        it('should show a tooltip on click', (done) => {
            instance = new Tooltip(reference, {
                title: 'foobar',
                trigger: 'click',
            });

            expect(document.querySelector('.tooltip')).toBeNull();

            reference.dispatchEvent(new CustomEvent('click'));

            then(() => {
                expect(document.querySelector('.tooltip')).not.toBeNull();
                done();
            });
        });

        it('should hide a tooltip on click while open', (done) => {
            instance = new Tooltip(reference, {
                title: 'foobar',
                trigger: 'click',
            });

            expect(document.querySelector('.tooltip')).toBeNull();

            reference.dispatchEvent(new CustomEvent('click'));
            then(() => reference.dispatchEvent(new CustomEvent('click')));
            then(() => {
                expect(document.querySelector('.tooltip').style.display).toBe('none');
                done();
            });
        });
    });
});
