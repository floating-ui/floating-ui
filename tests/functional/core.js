import Popper from '../../src/popper/index.js';

import '../setup';
const jasmineWrapper = document.getElementById('jasmineWrapper');

// Utils
import appendNewPopper from '../utils/appendNewPopper';
import appendNewRef from '../utils/appendNewRef';
import getRect from '../utils/getRect';
import simulateScroll from '../utils/simulateScroll';

describe('[core]', () => {
    afterEach(function() {
        jasmineWrapper.scrollTop = 0;
        jasmineWrapper.scrollLeft = 0;
    });

    const arrowSize = 5;

    it('can access the AMD module to create a new instance', () => {
        // append popper element
        var popper = document.createElement('div');
        popper.style.width = '100px';
        popper.style.height = '100px';
        jasmineWrapper.appendChild(popper);

        // append trigger element
        var trigger = document.createElement('div');
        jasmineWrapper.appendChild(trigger);

        // initialize new popper instance
        var pop = new Popper(trigger, popper);

        expect(pop).toBeDefined();

        pop.destroy();
    });

    it('inits a bottom popper', () => {
        var reference = appendNewRef(1);
        var popper    = appendNewPopper(2);

        var pop = new Popper(reference, popper);

        var top = popper.getBoundingClientRect().top;
        expect(top).toBeApprox(reference.getBoundingClientRect().bottom + arrowSize);

        pop.destroy();
    });

    it('inits a bottom popper attached to an inline reference', (done) => {
        var reference = appendNewRef(1);
        reference.style.display = 'inline';
        var popper    = appendNewPopper(2);

        var pop = new Popper(reference, popper);

        // give some time to the browser to render...
        // otherwise `getBoundingClientRect` returns wrong values
        setTimeout(() => {
            var top = popper.getBoundingClientRect().top;
            expect(top).toBeApprox(reference.getBoundingClientRect().bottom + arrowSize);
            pop.destroy();
            done();
        }, 10);
    });

    it('inits a bottom-start popper', (done) => {
        var reference = appendNewRef(1);
        reference.style.marginLeft = '200px';
        var popper    = appendNewPopper(2);

        new Popper(reference, popper, {
            placement: 'bottom-start',
            onCreate: (data) => {
                expect(popper.getBoundingClientRect().left).toBeApprox(reference.getBoundingClientRect().left);

                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a right popper', (done) => {
        var reference = appendNewRef(1);
        var popper    = appendNewPopper(2);

        new Popper(reference, popper, {
            placement: 'right',
            onCreate: (data) => {
                expect(popper.getBoundingClientRect().left - arrowSize).toBeApprox(reference.getBoundingClientRect().right);

                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper inside a scrolling div, contained in a relative div', (done) => {
        var relative = document.createElement('div');
        relative.style.width = '800px';
        relative.style.height = '700px';
        relative.style.position = 'relative';
        relative.style.backgroundColor = 'green';
        jasmineWrapper.appendChild(relative);

        var scrolling = document.createElement('div');
        scrolling.style.width = '800px';
        scrolling.style.height = '500px';
        scrolling.style.overflow = 'auto';
        scrolling.style.backgroundColor = 'blue';
        relative.appendChild(scrolling);

        var superHigh1 = document.createElement('div');
        superHigh1.style.width = '800px';
        superHigh1.style.height = '450px';
        scrolling.appendChild(superHigh1);

        var ref = appendNewRef(1, 'ref', scrolling);
        var popper = appendNewPopper(2, 'popper', scrolling);

        var superHigh2 = document.createElement('div');
        superHigh2.style.width = '800px';
        superHigh2.style.height = '500px';
        scrolling.appendChild(superHigh2);

        simulateScroll(scrolling, { scrollTop:  400 });
        new Popper(ref, popper, {
            placement: 'top',
            onCreate: () => {
                // placement should be top
                expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(ref).top);

                simulateScroll(scrolling, { scrollTop: 100, delay: 10 });
            },
            onUpdate: (data) => {
                // placement should be top
                expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(ref).top);

                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper inside a body, with its reference element inside a relative div', (done) => {
        var relative = document.createElement('div');
        relative.style.position = 'relative';
        relative.style.margin = '20px';
        jasmineWrapper.appendChild(relative);

        var ref = appendNewRef(1, 'ref', relative);
        var popper = appendNewPopper(2, 'popper');

        new Popper(ref, popper, {
            onCreate: (data) => {
                expect(getRect(popper).top - arrowSize).toBeApprox(getRect(ref).bottom);
                expect(getRect(popper).left).toBeApprox(5);
                data.instance.destroy();
                done();
            },
        });

    });

    it('inits a popper inside a scrolled body, with its reference element inside a relative div', (done) => {
        var relative = document.createElement('div');
        relative.style.position = 'relative';
        relative.style.margin = '20px';
        relative.style.height = '300vh';
        jasmineWrapper.appendChild(relative);
        simulateScroll(document.body, { scrollTop: 300 });

        var ref = appendNewRef(1, 'ref', relative);
        ref.style.marginTop = '300px';
        var popper = appendNewPopper(2, 'popper');

        new Popper(ref, popper, {
            onCreate: (data) => {
                expect(getRect(popper).top - arrowSize).toBeApprox(getRect(ref).bottom);
                expect(popper.getBoundingClientRect().left).toBeApprox(5);
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper near a reference element, both inside a fixed element, inside a scrolled body', (done) => {
        var fixed = document.createElement('div');
        fixed.style.position = 'fixed';
        fixed.style.margin = '20px';
        fixed.style.height = '50px';
        fixed.style.width = '100%';
        fixed.style.backgroundColor = 'grey';
        jasmineWrapper.appendChild(fixed);

        var relative = document.createElement('div');
        relative.style.position = 'relative';
        relative.style.margin = '20px';
        relative.style.height = '200vh';
        jasmineWrapper.appendChild(relative);
        simulateScroll(document.body, { scrollTop: 800 });

        var ref = appendNewRef(1, 'ref', fixed);
        var popper = appendNewPopper(2, 'popper', fixed);

        new Popper(ref, popper, {
            onCreate: (data) => {
                expect(popper.getBoundingClientRect().top).toBeApprox(83);
                expect(popper.getBoundingClientRect().left).toBeApprox(5);
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper near a reference element, both inside a fixed element with CSS transforms, inside a scrolled body', (done) => {
        var fixed = document.createElement('div');
        fixed.style.position = 'fixed';
        fixed.style.margin = '20px';
        fixed.style.height = '50px';
        fixed.style.width = '100%';
        fixed.style.transform = 'translateX(0.1)';
        fixed.style.background = 'green';
        jasmineWrapper.appendChild(fixed);

        var relative = document.createElement('div');
        relative.style.position = 'relative';
        relative.style.margin = '20px';
        relative.style.height = '200vh';
        relative.style.background = 'rgba(100, 100, 100, 0.5)';
        jasmineWrapper.appendChild(relative);
        simulateScroll(document.body, { scrollTop: 800 });

        var ref = appendNewRef(1, 'ref', fixed);
        var popper = appendNewPopper(2, 'popper', fixed);

        new Popper(ref, popper, {
            onCreate: (data) => {
                expect(popper.getBoundingClientRect().top).toBeApprox(83);
                expect(popper.getBoundingClientRect().left).toBeApprox(5);
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper near a reference element, both inside a fixed element on bottom of viewport, inside a scrolled body', (done) => {
        var fixed = document.createElement('div');
        fixed.style.position = 'fixed';
        fixed.style.bottom = '5px';
        fixed.style.height = '38px';
        fixed.style.width = '100%';
        jasmineWrapper.appendChild(fixed);

        var relative = document.createElement('div');
        relative.style.position = 'relative';
        relative.style.margin = '20px';
        relative.style.height = '200vh';
        jasmineWrapper.appendChild(relative);
        simulateScroll(document.body, { scrollTop: 800 });

        var ref = appendNewRef(1, 'ref', fixed);
        var popper = appendNewPopper(2, 'popper', fixed);

        new Popper(ref, popper, {
            placement: 'top',
            onCreate: (data) => {
                expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(ref).top);
                expect(getRect(popper).left).toBeApprox(5);
                expect(popper.getAttribute('x-placement')).toBe('top');
                data.instance.destroy();
                done();
            },
        });
    });

    it('inits a popper and destroy it using its callback', (done) => {
        var reference = appendNewRef(1);
        var popper    = appendNewPopper(2);

        new Popper(reference, popper, {
            onCreate: (data) => {
                data.instance.destroy();
                expect(popper.style.top).toBe('');
                done();
            },
        });
    });

    it('inits a popper with an empty form as parent, then auto remove it on destroy', (done) => {
        var form      = document.createElement('form');
        var reference = appendNewRef(1, 'ref', form);
        var popper    = appendNewPopper(2, 'test', form);
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
        var form   = document.createElement('form');
        var input  = document.createElement('input');
        var popper = appendNewPopper(2, 'test', form);
        form.appendChild(input);
        var reference = appendNewRef(1, 'ref', form);
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
        var reference = appendNewRef(1);
        var popper = appendNewPopper(2, 'popper');

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
        var relative = document.createElement('div');
        relative.style.position = 'relative';
        relative.style.margin = '20px';
        relative.style.height = '200vh';
        relative.style.paddingTop = '100px';
        relative.style.backgroundColor = 'yellow';
        jasmineWrapper.appendChild(relative);
        simulateScroll(document.body, { scrollTop: 100 });

        var scrolling = document.createElement('div');
        scrolling.style.width = '100%';
        scrolling.style.height = '100vh';
        scrolling.style.overflow = 'auto';
        scrolling.style.backgroundColor = 'green';
        relative.appendChild(scrolling);

        var superHigh = document.createElement('div');
        superHigh.style.width = '1px';
        superHigh.style.float = 'right';
        superHigh.style.height = '300vh';
        scrolling.appendChild(superHigh);

        simulateScroll(scrolling, { scrollTop: 100 });

        var ref = appendNewRef(1, 'ref', scrolling);
        ref.style.width = '100px';
        ref.style.height = '100px';
        ref.style.marginTop = '100px';
        var popper = appendNewPopper(2, 'popper', scrolling);

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
        var relative = document.createElement('div');
        relative.style.position = 'relative';
        relative.style.margin = '20px';
        relative.style.paddingTop = '100px';
        relative.style.backgroundColor = 'yellow';
        jasmineWrapper.appendChild(relative);
        simulateScroll(document.body, { scrollTop: 100 });

        var ref = appendNewRef(1, 'ref', relative);
        ref.style.width = '100px';
        ref.style.height = '100px';
        ref.style.marginTop = '2000px';
        ref.style.marginBottom = '200px';
        var popper = appendNewPopper(2, 'popper', relative);

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
        var reference = appendNewRef(1);
        var popper    = appendNewPopper(2);

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
        var reference = appendNewRef(1);
        var popper    = appendNewPopper(2);

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

        var popper = appendNewPopper(2, 'popper', shadow);

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

        var popper = appendNewPopper(2, 'popper');

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

        var popper = appendNewPopper(2, 'popper', shadow2);

        new Popper(reference, popper, {
            placement: 'right',
            onCreate: (data) => {
                expect(getRect(popper).left).toBeApprox(getRect(reference).right);
                data.instance.destroy();
                done();
            },
        });
    });

    it('init a popper near the right side of its container and make sure it stays between boundaries', (done) => {
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
