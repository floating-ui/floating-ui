import Popper from '../../src/popper';
import '../setup';

const jasmineWrapper = document.getElementById('jasmineWrapper');

describe('[rendering]', () => {
    const makePopper = makePopperFactory();

    it('renders to the DOM before the first paint', (done) => {
        const spy = jasmine.createSpy('paint watcher');
        requestAnimationFrame(spy);

        const instance = makePopper(makeElement(), makeElement());

        instance.onCreate(() => {
            expect(spy).not.toHaveBeenCalled();
            done();
        });
    });

    function makeElement() {
        const div = document.createElement('div');
        return jasmineWrapper.appendChild(div);
    }
});


/**
 * Create a factory function that produces auto-cleanup popper instances.
 *
 * This function must be called in the context of a `describe`, as it utilises
 * the `afterEach` API to schedule cleanup.
 */
function makePopperFactory() {
    let poppers = [];

    afterEach(() => {
        poppers.forEach((instance) => instance.destroy());
        poppers = [];
    });

    return function factory(...args) {
        const popper = new Popper(...args);
        poppers.push(popper);
        return popper;
    };
}
