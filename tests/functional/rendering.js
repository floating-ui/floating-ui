import makePopperFactory from '../utils/makePopperFactory';
import makeConnectedElement from '../utils/makeConnectedElement';
import '../setup';


describe('[rendering]', () => {
    const makePopper = makePopperFactory();

    it('renders to the DOM before the first paint', (done) => {
        const spy = jasmine.createSpy('paint watcher');
        requestAnimationFrame(spy);

        const instance = makePopper(makeConnectedElement(), makeConnectedElement());

        instance.onCreate(() => {
            expect(spy).not.toHaveBeenCalled();
            done();
        });
    });
});