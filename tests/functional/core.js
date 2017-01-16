import Popper from 'src/popper/index.js';

import '../setup';
const jasmineWrapper = document.getElementById('jasmineWrapper');

// Utils
import appendNewPopper from '../utils/appendNewPopper';
import appendNewRef from '../utils/appendNewRef';
import getRect from '../utils/getRect';
import simulateScroll from '../utils/simulateScroll';
import { createElements, attachElements, detachElements } from '../utils/_helpers';

const simplePopper = { attrs: { 'class': 'popper', id: 'simplePopper' }, text: 'popper' };
const arrowPopper = { ...simplePopper, children: [{ attrs: { 'class': 'popper__arrow', 'x-arrow': '', id: 'arrowPopper' } }] };
const simpleRef = { attrs: { 'class': 'ref', id: 'simpleRef' }, text: 'ref' };

describe('[core]', () => {
    let nodes;
    const arrowSize = 5;

    afterEach(function() {
        jasmineWrapper.scrollTop = 0;
        jasmineWrapper.scrollLeft = 0;
        detachElements(nodes);
    });

    it('can access the AMD module to create a new instance', () => {
        nodes = createElements([ {...simpleRef}, {...arrowPopper}]);
        const [ popper, reference ] = nodes;
        attachElements(nodes);

        // initialize new popper instance
        const pop = new Popper(reference, popper);
        expect(pop).toBeDefined();
    });

    it('inits a bottom popper', () => {
        nodes = createElements([ {...simpleRef}, {...arrowPopper}]);
        const [ reference, popper ] = nodes;
        attachElements(nodes);

        new Popper(reference, popper);
        const top = popper.getBoundingClientRect().top;
        expect(top).toBeApprox(reference.getBoundingClientRect().bottom + arrowSize);
    });

    it('inits a right scrollable popper ', (done) => {
        nodes = createElements([ {...simpleRef}, {...arrowPopper, styles: { overflow: 'auto' }}]);
        const [ reference, popper ] = nodes;
        attachElements(nodes);

        new Popper(reference, popper, {
            placement: 'right',
            onCreate() {
                const left = popper.getBoundingClientRect().left;
                expect(left).toBeApprox(reference.getBoundingClientRect().right + arrowSize);
                done();
            }
        });

    });

    describe(['inner modifier'], () => {
        it('inits a bottom inner popper', (done) => {
            nodes = createElements([ {...simpleRef, styles: { height: '200px' }}, {...arrowPopper}]);
            const [ reference, popper ] = nodes;
            attachElements(nodes);

            new Popper(reference, popper, {
                modifiers: { inner: { enabled: true } },
                onCreate() {
                    const bottom = popper.getBoundingClientRect().bottom + arrowSize;
                    expect(bottom).toBeApprox(reference.getBoundingClientRect().bottom);
                    done();
                }
            });
        });

        it('inits a top inner popper', (done) => {
            nodes = createElements([ {...simpleRef, styles: { height: '200px' }}, {...arrowPopper}]);
            const [ reference, popper ] = nodes;
            attachElements(nodes);

            new Popper(reference, popper, {
                placement: 'top',
                modifiers: { inner: { enabled: true } },
                onCreate() {
                    const top = popper.getBoundingClientRect().top - arrowSize;
                    expect(top).toBeApprox(reference.getBoundingClientRect().top);
                    done();
                }
            });
        });

        it('inits a right inner popper', (done) => {
            nodes = createElements([ {...simpleRef, styles: { height: '200px', width: '200px' }}, {...arrowPopper}]);
            const [ reference, popper ] = nodes;
            attachElements(nodes);

            new Popper(reference, popper, {
                placement: 'right',
                modifiers: { inner: { enabled: true } },
                onCreate() {
                    const right = popper.getBoundingClientRect().right + arrowSize;
                    expect(right).toBeApprox(reference.getBoundingClientRect().right);
                    done();
                }
            });
        });

        it('inits a left inner popper', (done) => {
            nodes = createElements([ {...simpleRef, styles: { height: '200px', width: '200px' }}, {...arrowPopper}]);
            const [ reference, popper ] = nodes;
            attachElements(nodes);

            new Popper(reference, popper, {
                placement: 'left',
                modifiers: { inner: { enabled: true } },
                onCreate() {
                    const left = popper.getBoundingClientRect().left - arrowSize;
                    expect(left).toBeApprox(reference.getBoundingClientRect().left);
                    done();
                }
            });
        });
    });

    describe('[auto placement]', () => {
        it('should be computed to `top`', (done) => {
            nodes = createElements([
                {
                    styles: { overflow: 'auto', position: 'relative', width: '500px', height: '500px' },
                    children: [
                        {...simpleRef, styles: { position: 'absolute', bottom: 0, left: '50%' }},
                        {...arrowPopper},
                    ]
                }
            ]);

            const [ reference, popper ] = nodes[0].children;
            attachElements(nodes);

            new Popper(reference, popper, {
                placement: 'auto',
                onCreate: () => {
                    const bottom = popper.getBoundingClientRect().bottom + arrowSize;
                    expect(bottom).toBeApprox(reference.getBoundingClientRect().top);
                    done();
                }
            });
        });

        it('should be computed to `right`', (done) => {
            nodes = createElements([
                {
                    styles: { overflow: 'auto', position: 'relative', width: '500px', height: '500px', backgroundColor: 'green' },
                    children: [
                        {...simpleRef, styles: { position: 'absolute', left: 0, top: '50%' }},
                        {...arrowPopper},
                    ]
                }
            ]);

            const [ reference, popper ] = nodes[0].children;
            attachElements(nodes);

            new Popper(reference, popper, {
                placement: 'auto',
                onCreate: () => {
                    const left = popper.getBoundingClientRect().left - arrowSize;
                    expect(left).toBeApprox(reference.getBoundingClientRect().right);
                    done();
                }
            });
        });

        it('should be computed to `bottom`', (done) => {
            nodes = createElements([
                {
                    styles: { overflow: 'auto', position: 'relative', width: '500px', height: '500px', backgroundColor: 'green' },
                    children: [
                        {...simpleRef, styles: { position: 'absolute', top: 0, left: '50%' }},
                        {...arrowPopper},
                    ]
                }
            ]);

            const [ reference, popper ] = nodes[0].children;
            attachElements(nodes);

            new Popper(reference, popper, {
                placement: 'auto',
                onCreate: () => {
                    const top = popper.getBoundingClientRect().top - arrowSize;
                    expect(top).toBeApprox(reference.getBoundingClientRect().bottom);
                    done();
                }
            });
        });

        it('should be computed to `left`', (done) => {
            nodes = createElements([
                {
                    styles: { overflow: 'auto', position: 'relative', width: '500px', height: '500px', backgroundColor: 'green' },
                    children: [
                        {...simpleRef, styles: { position: 'absolute', right: 0, top: '50%' }},
                        {...arrowPopper},
                    ]
                }
            ]);

            const [ reference, popper ] = nodes[0].children;
            attachElements(nodes);

            new Popper(reference, popper, {
                placement: 'auto',
                onCreate: () => {
                    const right = popper.getBoundingClientRect().right + arrowSize;
                    expect(right).toBeApprox(reference.getBoundingClientRect().left);
                    done();
                }
            });
        });
    });

    it('inits a bottom popper attached to an inline reference', (done) => {
        nodes = createElements([ {...simpleRef, styles: { display: 'inline' }}, {...arrowPopper}]);
        const [ reference, popper ] = nodes;
        attachElements(nodes);

        new Popper(reference, popper);

        // give some time to the browser to render...
        // otherwise `getBoundingClientRect` returns wrong values
        setTimeout(() => {
            const top = popper.getBoundingClientRect().top;
            expect(top).toBeApprox(reference.getBoundingClientRect().bottom + arrowSize);
            done();
        }, 10);
    });

    it('inits a bottom-start popper', (done) => {
        nodes = createElements([ {...simpleRef, styles: { marginLeft: '200px' }}, {...arrowPopper}]);
        const [ reference, popper ] = nodes;
        attachElements(nodes);

        new Popper(reference, popper, {
            placement: 'bottom-start',
            onCreate: (data) => {
                expect(popper.getBoundingClientRect().left).toBeApprox(reference.getBoundingClientRect().left);
                done();
            },
        });
    });

    it('inits a right popper', (done) => {
        nodes = createElements([ {...simpleRef}, {...arrowPopper}]);
        const [ reference, popper ] = nodes;
        attachElements(nodes);

        new Popper(reference, popper, {
            placement: 'right',
            onCreate: (data) => {
                expect(popper.getBoundingClientRect().left - arrowSize).toBeApprox(reference.getBoundingClientRect().right);
                done();
            },
        });
    });

    it('inits a popper inside a scrolling div, contained in a relative div', (done) => {
        nodes = createElements([
            {
                attrs: { id: 'relative' },
                styles: { width: '800px', height: '700px', position: 'relative', backgroundColor: 'green' },
                children: [
                    {
                        attrs: { id: 'scrolling' },
                        styles: {  width: '800px', height: '500px', overflow: 'auto', backgroundColor: 'blue' },
                        children: [
                            { attrs: { id: 'superHigh1' }, styles: {  width: '800px', height: '450px' } },
                            {...simpleRef},
                            {...arrowPopper},
                            { attrs: { id: 'superHigh2' }, styles: {  width: '800px', height: '500px' } }
                        ]
                    }
                ]
            }
        ]);

        attachElements(nodes);
        const relative = nodes[0];
        const scrolling = relative.querySelector('#scrolling');
        const reference = relative.querySelector('#simpleRef');
        const popper = relative.querySelector('#arrowPopper');

        simulateScroll(scrolling, { scrollTop:  400 });
        new Popper(reference, popper, {
            placement: 'top',
            onCreate: () => {
                // placement should be top
                expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(reference).top);
                simulateScroll(scrolling, { scrollTop: 100, delay: 10 });
            },
            onUpdate: (data) => {
                // placement should be top
                expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(reference).top);
                done();
            },
        });
    });


    it('inits a popper inside a scrolling div with an huge border', (done) => {
        nodes = createElements([
            {
                attrs: { id: 'scrolling' },
                styles: {  width: '800px', height: '500px', overflow: 'auto', backgroundColor: 'blue', border: '50px green solid' },
                children: [
                    { attrs: { id: 'superHigh1' }, styles: {  width: '800px', height: '450px' } },
                    {...simpleRef},
                    {...arrowPopper},
                    { attrs: { id: 'superHigh2' }, styles: {  width: '800px', height: '500px' } }
                ]
            }
        ]);

        attachElements(nodes);
        const scrolling = nodes[0];
        const reference = scrolling.querySelector('#simpleRef');
        const popper = scrolling.querySelector('#arrowPopper');

        simulateScroll(scrolling, { scrollTop:  400 });
        new Popper(reference, popper, {
            placement: 'top',
            onCreate: () => {
                // placement should be top
                expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(reference).top);

                simulateScroll(scrolling, { scrollTop: 100, delay: 10 });
            },
            onUpdate: (data) => {
                // placement should be top
                expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(reference).top);
                done();
            },
        });
    });

    it('inits a popper inside a body, with its reference element inside a relative div', (done) => {
        nodes = createElements([
            {
                attrs: { id: 'relative' },
                styles: { position: 'relative', margin: '20px' },
                children: [
                    {...simpleRef},
                ]
            },
            {...arrowPopper},
        ]);
        const reference = nodes[0].children[0];
        const popper = nodes[1];
        attachElements(nodes);

        new Popper(reference, popper, {
            onCreate: (data) => {
                expect(getRect(popper).top - arrowSize).toBeApprox(getRect(reference).bottom);
                expect(getRect(popper).left).toBeApprox(5);
                done();
            },
        });
    });

    it('inits a popper inside a body without any positioned or scrollable parents and scrolls the body', (done) => {
        nodes = createElements([ {...simpleRef}, {...arrowPopper}]);
        const [ reference, popper ] = nodes;
        attachElements(nodes);

        simulateScroll(document.body, { scrollTop: 300 });

        new Popper(reference, popper, {
            onCreate: (data) => {
                expect(getRect(popper).top - arrowSize).toBeApprox(getRect(reference).bottom);
                expect(getRect(popper).left).toBeApprox(5);
                simulateScroll(document.body, { scrollTop: 0 });
                done();
            },
        });
    });

    it('inits a popper inside a scrolled body, with its reference element inside a relative div', (done) => {
        simulateScroll(document.body, { scrollTop: 300 });
        nodes = createElements([
            {
                attrs: { id: 'relative' },
                styles: { position: 'relative', margin: '20px', height: '300vh' },
                children: [
                    {...simpleRef, styles: { marginTop: '300px' }},
                ]
            },
            {...arrowPopper},
        ]);
        const reference = nodes[0].children[0];
        const popper = nodes[1];
        attachElements(nodes);

        new Popper(reference, popper, {
            onCreate: (data) => {
                expect(getRect(popper).top - arrowSize).toBeApprox(getRect(reference).bottom);
                expect(popper.getBoundingClientRect().left).toBeApprox(5);
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper near a reference element, both inside a fixed element, inside a scrolled body', (done) => {
        simulateScroll(document.body, { scrollTop: 800 });
        nodes = createElements([
            {
                attrs: { id: 'fixed' },
                styles: { position: 'fixed', margin: '20px', height: '50px', width: '100%', backgroundColor: 'grey' },
                children: [
                    {...simpleRef},
                    {...arrowPopper},
                ]
            },
            {
                attrs: { id: 'relative'},
                styles: { position: 'relative', margin: '20px', height: '200vh' }
            }
        ]);
        const [ reference, popper ] = nodes[0].children;
        attachElements(nodes);

        new Popper(reference, popper, {
            onCreate: (data) => {
                expect(popper.getBoundingClientRect().top).toBeApprox(83);
                expect(popper.getBoundingClientRect().left).toBeApprox(5);
                simulateScroll(document.body, { scrollTop: 0 });
                done();
            },
        });
    });

    it('inits a popper near a reference element, both inside a fixed element with CSS transforms, inside a scrolled body', (done) => {
        simulateScroll(document.body, { scrollTop: 800 });
        nodes = createElements([
            {
                attrs: { id: 'fixed' },
                styles: { position: 'fixed', margin: '20px', height: '50px', width: '100%', backgroundColor: 'grey', transform: 'translateX(0.1)' },
                children: [
                    {...simpleRef},
                    {...arrowPopper},
                ]
            },
            {
                attrs: { id: 'relative'},
                styles: { position: 'relative', margin: '20px', height: '200vh' }
            }
        ]);
        const [ reference, popper ] = nodes[0].children;
        attachElements(nodes);

        new Popper(reference, popper, {
            onCreate: (data) => {
                expect(popper.getBoundingClientRect().top).toBeApprox(83);
                expect(popper.getBoundingClientRect().left).toBeApprox(5);
                simulateScroll(document.body, { scrollTop: 0 });
                done();
            },
        });
    });

    it('inits a popper near a reference element, both inside a fixed element on bottom of viewport, inside a scrolled body', (done) => {
        simulateScroll(document.body, { scrollTop: 800 });
        nodes = createElements([
            {
                attrs: { id: 'fixed' },
                styles: { position: 'fixed', bottom: '5px', height: '38px', width: '100%' },
                children: [
                    {...simpleRef},
                    {...arrowPopper},
                ]
            },
            {
                attrs: { id: 'relative'},
                styles: { position: 'relative', margin: '20px', height: '200vh' }
            }
        ]);
        const [ reference, popper ] = nodes[0].children;
        attachElements(nodes);


        new Popper(reference, popper, {
            placement: 'top',
            onCreate: (data) => {
                expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(reference).top);
                expect(getRect(popper).left).toBeApprox(5);
                expect(popper.getAttribute('x-placement')).toBe('top');
                simulateScroll(document.body, { scrollTop: 0 });
                done();
            },
        });
    });

    it('inits a popper and destroy it using its callback', (done) => {
        const reference = appendNewRef(1);
        const popper    = appendNewPopper(2);

        new Popper(reference, popper, {
            onCreate: (data) => {
                data.instance.destroy();
                expect(popper.style.top).toBe('');
                done();
            },
        });
    });

    it('inits a popper with an empty form as parent, then auto remove it on destroy', (done) => {
        const form      = document.createElement('form');
        const reference = appendNewRef(1, 'ref', form);
        const popper    = appendNewPopper(2, 'test', form);
        jasmineWrapper.appendChild(form);

        new Popper(reference, popper, {
            removeOnDestroy: true,
            onCreate: (data) => {
                expect(data.instance.popper).toBeDefined();
                expect(data.instance.popper.innerText.trim()).toBe('test');
                data.instance.destroy();
                expect(document.body.contains(data.instance.popper)).toBeFalsy();
                done();
            },
        });
    });

    it('inits a popper with a not empty form as parent, then auto remove it on destroy', (done) => {
        const form   = document.createElement('form');
        const input  = document.createElement('input');
        const popper = appendNewPopper(2, 'test', form);
        form.appendChild(input);
        const reference = appendNewRef(1, 'ref', form);
        jasmineWrapper.appendChild(form);

        new Popper(reference, popper, {
            removeOnDestroy: true,
            onCreate: (data) => {
                expect(data.instance.popper).toBeDefined();
                expect(data.instance.popper.innerText.trim()).toBe('test');
                data.instance.destroy();
                expect(document.body.contains(data.instance.popper)).toBeFalsy();
                done();
            },
        });
    });

    it('inits a popper and make sure its position is correct on init', (done) => {
        const reference = appendNewRef(1);
        const popper = appendNewPopper(2, 'popper');

        new Popper(reference, popper, {
            placement: 'right',
            removeOnDestroy: true,
            onCreate: (data) => {
                expect(getRect(popper).left - arrowSize).toBeApprox(getRect(reference).right);
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper inside a scrolled body, with its reference element inside a scrolling div, wrapped in a relative div', (done) => {
        const relative = document.createElement('div');
        relative.style.position = 'relative';
        relative.style.margin = '20px';
        relative.style.height = '200vh';
        relative.style.paddingTop = '100px';
        relative.style.backgroundColor = 'yellow';
        jasmineWrapper.appendChild(relative);
        simulateScroll(document.body, { scrollTop: 100 });

        const scrolling = document.createElement('div');
        scrolling.style.width = '100%';
        scrolling.style.height = '100vh';
        scrolling.style.overflow = 'auto';
        scrolling.style.backgroundColor = 'green';
        relative.appendChild(scrolling);

        const superHigh = document.createElement('div');
        superHigh.style.width = '1px';
        superHigh.style.float = 'right';
        superHigh.style.height = '300vh';
        scrolling.appendChild(superHigh);

        simulateScroll(scrolling, { scrollTop: 100 });

        const ref = appendNewRef(1, 'ref', scrolling);
        ref.style.width = '100px';
        ref.style.height = '100px';
        ref.style.marginTop = '100px';
        const popper = appendNewPopper(2, 'popper', scrolling);

        new Popper(ref, popper, {
            placement: 'right-start',
            onCreate: (data) => {
                expect(getRect(popper).top).toBeApprox(getRect(ref).top + 5); // 5 is the boundaries margin
                expect(getRect(popper).left - arrowSize).toBeApprox(getRect(ref).right);

                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper with boundariesElement set to viewport, the popper should not be in the viewport', (done) => {
        const relative = document.createElement('div');
        relative.style.position = 'relative';
        relative.style.margin = '20px';
        relative.style.paddingTop = '100px';
        relative.style.backgroundColor = 'yellow';
        jasmineWrapper.appendChild(relative);
        simulateScroll(document.body, { scrollTop: 100 });

        const ref = appendNewRef(1, 'ref', relative);
        ref.style.width = '100px';
        ref.style.height = '100px';
        ref.style.marginTop = '2000px';
        ref.style.marginBottom = '200px';
        const popper = appendNewPopper(2, 'popper', relative);

        new Popper(ref, popper,{
            placement: 'bottom',
            modifiers: {
                flip: {
                    boundariesElement: 'viewport'
                }
            },
            onCreate: () => {
                expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(ref).top);
                simulateScroll(document.body, { scrollTop:  3000 });
            },
            onUpdate: (data) => {
                expect(getRect(popper).top - arrowSize).toBeApprox(getRect(ref).bottom);
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper with a custom modifier that should hide it', (done) => {
        const reference = appendNewRef(1);
        const popper    = appendNewPopper(2);

        function hidePopper(data) {
            data.styles.display = 'none';
            return data;
        }


        new Popper(reference, popper, {
            modifiers: {
                hidePopper: { order: 790, enabled: true, function: hidePopper }
            },
            onCreate: (data) => {
                expect(popper.style.display).toBe('none');
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper with a custom modifier that set its top to 3px', (done) => {
        const reference = appendNewRef(1);
        const popper    = appendNewPopper(2);

        function movePopper(data) {
            data.styles.top = '3px';
            return data;
        }

        new Popper(reference, popper, {
            modifiers: {
                movePopper: { order: 690, enabled: true, function: movePopper }
            },
            onCreate: (data) => {
                expect(popper.style.top).toBe('3px');
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper inside a Shadow DOM with its reference element inside DOM', (done) => {
        if (!document.head.createShadowRoot) {
            return done();
        }

        const reference = appendNewRef(1);

        const shadowParent = document.createElement('div');
        jasmineWrapper.appendChild(shadowParent);
        const shadow = shadowParent.createShadowRoot();

        const popper = appendNewPopper(2, 'popper', shadow);

        new Popper(reference, popper, {
            placement: 'right',
            onCreate: (data) => {
                expect(getRect(popper).left).toBeApprox(getRect(reference).right);
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper inside DOM with its reference element inside Shadow DOM', (done) => {
        if (!document.head.createShadowRoot) {
            return done();
        }

        const shadowParent1 = document.createElement('div');
        jasmineWrapper.appendChild(shadowParent1);
        const shadow1 = shadowParent1.createShadowRoot();

        const reference = appendNewRef(1, 'reference', shadow1);
        reference.style.display = 'block';
        reference.style.width = '100px';

        const popper = appendNewPopper(2, 'popper');

        new Popper(reference, popper, {
            placement: 'right',
            onCreate: (data) => {
                expect(getRect(popper).left - arrowSize).toBeApprox(getRect(reference).right);
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper inside a Shadow DOM with its reference element inside different Shadow DOM', (done) => {
        if (!document.head.createShadowRoot) {
            return done();
        }

        const shadowParent1 = document.createElement('div');
        jasmineWrapper.appendChild(shadowParent1);
        const shadow1 = shadowParent1.createShadowRoot();

        const reference = appendNewRef(1, 'reference', shadow1);
        reference.style.display = 'block';
        reference.style.width = '100px';

        const shadowParent2 = document.createElement('div');
        jasmineWrapper.appendChild(shadowParent2);
        const shadow2 = shadowParent2.createShadowRoot();

        const popper = appendNewPopper(2, 'popper', shadow2);

        new Popper(reference, popper, {
            placement: 'right',
            onCreate: (data) => {
                expect(getRect(popper).left).toBeApprox(getRect(reference).right);
                data.instance.destroy();
                done();
            },
        });
    });

    it('init a bottom-end popper near the right side of its container and make sure it stays between boundaries', (done) => {
        const container = document.createElement('div');
        container.style.width = '800px';
        container.style.height = '600px';
        container.style.background = 'grey';
        container.style.position = 'relative';
        container.style.overflow = 'scroll'

        const scroller = document.createElement('div');
        scroller.style.width = '2000px';
        scroller.style.height = '1px';

        const button = document.createElement('div');
        button.style.width ='20px';
        button.style.height = '50px';
        button.style.position = 'absolute';
        button.style.top = 0;
        button.style.right = 0;
        button.style.background = 'green';

        const dropdown = document.createElement('div');
        dropdown.style.background = 'yellow';
        dropdown.style.position = 'absolute';
        dropdown.style.height = '200px';
        dropdown.style.width = '150px';

        container.appendChild(button);
        container.appendChild(dropdown);
        container.appendChild(scroller);
        jasmineWrapper.appendChild(container);

        const scrollLeft = 50;

        new Popper(button, dropdown, {
            placement: 'bottom-end',
            onCreate: () => {
                expect(getRect(dropdown).right).toBeApprox(getRect(container).right - 5);
                container.scrollLeft = scrollLeft;
            },
            onUpdate: (data) => {
                expect(getRect(dropdown).right).toBeApprox(getRect(container).right - scrollLeft);
                data.instance.destroy();
                done();
            },
        });
    });

    it('init a bottom-start popper near the right side of its container and make sure it stays between boundaries', (done) => {
        const container = document.createElement('div');
        container.style.width = '800px';
        container.style.height = '600px';
        container.style.background = 'grey';
        container.style.position = 'relative';
        container.style.overflow = 'scroll'

        const scroller = document.createElement('div');
        scroller.style.width = '2000px';
        scroller.style.height = '1px';

        const button = document.createElement('div');
        button.style.width ='20px';
        button.style.height = '50px';
        button.style.position = 'absolute';
        button.style.top = 0;
        button.style.right = 0;
        button.style.background = 'green';

        const dropdown = document.createElement('div');
        dropdown.style.background = 'yellow';
        dropdown.style.position = 'absolute';
        dropdown.style.height = '200px';
        dropdown.style.width = '150px';

        container.appendChild(button);
        container.appendChild(dropdown);
        container.appendChild(scroller);
        jasmineWrapper.appendChild(container);

        const scrollLeft = 50;

        new Popper(button, dropdown, {
            placement: 'bottom-start',
            modifiers: {
                //preventOverflow: { enabled: false },
                //flip: { enabled: false },
            },
            onCreate: () => {
                expect(getRect(dropdown).right).toBeApprox(getRect(container).right - 5);
                container.scrollLeft = scrollLeft;
            },
            onUpdate: (data) => {
                expect(getRect(dropdown).right).toBeApprox(getRect(container).right - 5);
                data.instance.destroy();
                done();
            },
        });
    });

    it('init a popper near the right side of its container and make sure it stays between custom boundaries', (done) => {
        const container = document.createElement('div');
        container.style.width = '800px';
        container.style.height = '600px';
        container.style.background = 'grey';
        container.style.position = 'relative';
        container.style.overflow = 'scroll'

        const scroller = document.createElement('div');
        scroller.style.width = '2000px';
        scroller.style.height = '1px';

        const button = document.createElement('div');
        button.style.width ='20px';
        button.style.height = '50px';
        button.style.position = 'absolute';
        button.style.top = 0;
        button.style.right = 0;
        button.style.background = 'green';

        const dropdown = document.createElement('div');
        dropdown.style.background = 'yellow';
        dropdown.style.position = 'absolute';
        dropdown.style.height = '200px';
        dropdown.style.width = '150px';

        container.appendChild(button);
        container.appendChild(dropdown);
        container.appendChild(scroller);
        jasmineWrapper.appendChild(container);

        const scrollLeft = 50;

        new Popper(button, dropdown, {
            placement: 'bottom-end',
            modifiers: {
                preventOverflow: { boundariesElement: container },
            },
            onCreate: () => {
                expect(getRect(dropdown).right).toBeApprox(getRect(container).right - 5);
                container.scrollLeft = scrollLeft;
            },
            onUpdate: (data) => {
                expect(getRect(dropdown).right).toBeApprox(getRect(container).right - scrollLeft);
                data.instance.destroy();
                done();
            },
        });
    });

    it('init a popper near the right side of a custom container and make sure it stays between boundaries', (done) => {
        const container = document.createElement('div');
        container.style.width = '800px';
        container.style.height = '600px';
        container.style.background = 'grey';
        container.style.position = 'relative';
        container.style.overflow = 'scroll'

        const scroller = document.createElement('div');
        scroller.style.width = '2000px';
        scroller.style.height = '1px';

        const button = document.createElement('div');
        button.style.width ='20px';
        button.style.height = '50px';
        button.style.position = 'absolute';
        button.style.top = 0;
        button.style.right = 0;
        button.style.background = 'green';

        const dropdown = document.createElement('div');
        dropdown.style.background = 'yellow';
        dropdown.style.position = 'absolute';
        dropdown.style.height = '200px';
        dropdown.style.width = '150px';

        container.appendChild(button);
        container.appendChild(scroller);
        jasmineWrapper.appendChild(container);
        jasmineWrapper.appendChild(dropdown);

        const scrollLeft = 50;

        new Popper(button, dropdown, {
            placement: 'bottom-end',
            modifiers: {
                preventOverflow: { boundariesElement: container },
            },
            onCreate: () => {
                expect(getRect(dropdown).right).toBe(getRect(container).right - 5);
                container.scrollLeft = scrollLeft;
            },
            onUpdate: (data) => {
                expect(getRect(dropdown).right).toBe(getRect(container).right - scrollLeft);
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper near the left side of a custom absolute container contained in a relative parent', (done) => {
        const parent = document.createElement('div');
        parent.style.width = '600px';
        parent.style.height = '300px';
        parent.style.top = '50px';
        parent.style.left = '80px';
        parent.style.background = 'grey';
        parent.style.position = 'relative';
        parent.style.overflow = 'scroll';

        const container = document.createElement('div');
        container.style.top = 0;
        container.style.right = 0;
        container.style.bottom = 0;
        container.style.left = 0;
        container.style.position = 'absolute';

        const button = document.createElement('div');
        button.style.width ='20px';
        button.style.height = '50px';
        button.style.position = 'absolute';
        button.style.top = 0;
        button.style.left = 0;
        button.style.background = 'green';

        const dropdown = document.createElement('div');
        dropdown.style.background = 'yellow';
        dropdown.style.position = 'absolute';
        dropdown.style.height = '200px';
        dropdown.style.width = '150px';

        container.appendChild(button);
        parent.appendChild(container);
        jasmineWrapper.appendChild(parent);
        jasmineWrapper.appendChild(dropdown);

        new Popper(button, dropdown, {
            placement: 'bottom-end',
            modifiers: {
                preventOverflow: { boundariesElement: container },
            },
            onCreate: (data) => {
                expect(getRect(dropdown).left).toBe(getRect(container).left + 5);

                data.instance.destroy();
                done();
            },
        });
    });
});
