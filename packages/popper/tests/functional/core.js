import Popper from '../../src/index.js';

import '@popperjs/test-utils';
const jasmineWrapper = document.getElementById('jasmineWrapper');

// Utils
import appendNewPopper from '@popperjs/test-utils/utils/appendNewPopper';
import appendNewRef from '@popperjs/test-utils/utils/appendNewRef';
import simulateScroll from '@popperjs/test-utils/utils/simulateScroll';
import prepend from '@popperjs/test-utils/utils/prepend';
import isMSBrowser from '@popperjs/test-utils/utils/isMSBrowser';
import getRect from '../utils/getRect';

const isIE10 = navigator.appVersion.indexOf('MSIE 10') !== -1;
const isIPHONE = window.navigator.userAgent.match(/iPhone/i);
const arrowSize = 5;

describe('[core]', () => {
  afterEach(function() {
    jasmineWrapper.scrollTop = 0;
    jasmineWrapper.scrollLeft = 0;
  });

  it('can access the AMD module to create a new instance', () => {
    // append popper element
    const popper = document.createElement('div');
    popper.style.width = '100px';
    popper.style.height = '100px';
    jasmineWrapper.appendChild(popper);

    // append trigger element
    const trigger = document.createElement('div');
    jasmineWrapper.appendChild(trigger);

    // initialize new popper instance
    const pop = new Popper(trigger, popper);

    expect(pop).toBeDefined();

    pop.destroy();
  });

  it('inits a bottom popper', () => {
    const reference = appendNewRef(1);
    const popper = appendNewPopper(2);

    const pop = new Popper(reference, popper);

    const top = getRect(popper).top;
    expect(top).toBeApprox(getRect(reference).bottom + arrowSize);

    pop.destroy();
  });

  it('inits a bottom popper inside document with margins', done => {
    const doc = document.documentElement;
    doc.style.marginLeft = '300px';
    doc.style.marginTop = '300px';

    const wrp = document.createElement('div');
    wrp.innerHTML = `
        <div id="reference" style="
            width: 100px;
            height: 50px;
            background-color: red;
        "></div><div id="popper" style="background: black; color: white; width: 50px;">1</div>
    `.trim();
    const popper = wrp.childNodes[1];
    const reference = wrp.childNodes[0];
    prepend(reference, document.body);
    prepend(popper, document.body);

    new Popper(reference, popper, {
      placement: 'top',
      onCreate(data) {
        const bottom = getRect(popper).bottom;
        expect(bottom).toBeApprox(getRect(reference).top);

        data.instance.destroy();
        document.body.removeChild(popper);
        document.body.removeChild(reference);
        doc.style.cssText = null;
        done();
      },
    });
  });

  it('inits a bottom popper inside document with margins, it should correctly flip', done => {
    if (isIPHONE) {
      pending();
    }

    const doc = document.documentElement;
    doc.style.marginLeft = '50vw';
    doc.style.marginTop = '100vh';

    const wrp = document.createElement('div');
    wrp.innerHTML = `
      <div id="reference" style="
          width: 100px;
          height: 50px;
          background-color: red;
      "></div><div id="popper" style="background: black; color: white; width: 50px;">1</div>
    `.trim();
    const popper = wrp.childNodes[1];
    const reference = wrp.childNodes[0];
    prepend(reference, document.body);
    prepend(popper, document.body);

    new Popper(reference, popper, {
      onCreate(data) {
        const bottom = getRect(popper).bottom;
        expect(bottom).toBeApprox(getRect(reference).top);

        data.instance.destroy();
        document.body.removeChild(popper);
        document.body.removeChild(reference);
        doc.style.cssText = null;
        done();
      },
    });
  });

  it('inits a top popper inside body with margins relative to absolute reference rotated by 90 degs', done => {
    const wrp = document.createElement('div');
    wrp.innerHTML = `
          <div id="reference" style="
              position: absolute;
              top: 100px;
              width: 100px;
              height: 50px;
              background-color: red;
              margin-left: 50px;
              -ms-transform: rotate(90deg);
              -webkit-transform: rotate(90deg);
              transform: rotate(90deg);
          "></div><div id="popper" style="background: black; color: white; width: 50px;">1</div>
      `.trim();
    const popper = wrp.childNodes[1];
    const reference = wrp.childNodes[0];
    prepend(reference, document.body);
    prepend(popper, document.body);

    new Popper(reference, popper, {
      placement: 'top',
      onCreate(data) {
        const pop = getRect(popper);
        const ref = getRect(reference);
        expect(pop.bottom).toBeApprox(ref.top);
        expect(pop.left).toBe(ref.left);

        data.instance.destroy();
        document.body.style.cssText = null;
        document.body.removeChild(popper);
        document.body.removeChild(reference);
        done();
      },
    });
  });

  it('inits a right scrollable popper ', done => {
    const reference = appendNewRef(1);
    const popper = appendNewPopper(2);
    popper.style.overflow = 'auto';

    const pop = new Popper(reference, popper, {
      placement: 'right',
      onCreate() {
        const left = getRect(popper).left;
        expect(left).toBeApprox(getRect(reference).right + arrowSize);

        pop.destroy();

        done();
      },
    });
  });

  describe(['inner modifier'], () => {
    it('inits a bottom inner popper', done => {
      const reference = appendNewRef(1);
      reference.style.height = '200px';
      const popper = appendNewPopper(2);

      const pop = new Popper(reference, popper, {
        modifiers: { inner: { enabled: true } },
        onCreate() {
          const bottom = getRect(popper).bottom + arrowSize;
          expect(bottom).toBeApprox(getRect(reference).bottom);
          pop.destroy();
          done();
        },
      });
    });

    it('inits a top inner popper', done => {
      const reference = appendNewRef(1);
      reference.style.height = '200px';
      const popper = appendNewPopper(2);

      const pop = new Popper(reference, popper, {
        placement: 'top',
        modifiers: { inner: { enabled: true } },
        onCreate() {
          const top = getRect(popper).top - arrowSize;
          expect(top).toBeApprox(getRect(reference).top);
          pop.destroy();
          done();
        },
      });
    });

    it('inits a right inner popper', done => {
      const reference = appendNewRef(1);
      reference.style.height = '200px';
      reference.style.width = '200px';
      const popper = appendNewPopper(2);

      const pop = new Popper(reference, popper, {
        placement: 'right',
        modifiers: { inner: { enabled: true } },
        onCreate() {
          const right = getRect(popper).right + arrowSize;
          expect(right).toBeApprox(getRect(reference).right);
          pop.destroy();
          done();
        },
      });
    });

    it('inits a left inner popper', done => {
      const reference = appendNewRef(1);
      reference.style.height = '200px';
      reference.style.width = '200px';
      const popper = appendNewPopper(2);

      const pop = new Popper(reference, popper, {
        placement: 'left',
        modifiers: { inner: { enabled: true } },
        onCreate() {
          const left = getRect(popper).left - arrowSize;
          expect(left).toBeApprox(getRect(reference).left);
          pop.destroy();
          done();
        },
      });
    });

    it('inits a right-start inner popper', done => {
      const reference = appendNewRef(1);
      reference.style.height = '200px';
      reference.style.width = '200px';
      const popper = appendNewPopper(2);

      const pop = new Popper(reference, popper, {
        placement: 'right-start',
        modifiers: { inner: { enabled: true } },
        onCreate() {
          const right = getRect(popper).right + arrowSize;
          expect(right).toBeApprox(getRect(reference).right);
          pop.destroy();
          done();
        },
      });
    });
  });

  describe('[auto placement]', () => {
    it('should be computed to `top`', done => {
      const parent = document.createElement('div');
      parent.style.overflow = 'auto';
      parent.style.position = 'relative';
      parent.style.width = '500px';
      parent.style.height = '500px';
      parent.style.backgroundColor = 'green';
      const reference = appendNewRef(1, 'ref', parent);
      reference.style.position = 'absolute';
      reference.style.bottom = '0';
      reference.style.left = '50%';
      const popper = appendNewPopper(2, 'pop', parent);
      jasmineWrapper.appendChild(parent);

      const pop = new Popper(reference, popper, {
        placement: 'auto',
        modifiers: { flip: { boundariesElement: 'scrollParent' } },
        onCreate: () => {
          const bottom = getRect(popper).bottom + arrowSize;
          expect(bottom).toBeApprox(getRect(reference).top);
          pop.destroy();
          done();
        },
      });
    });

    it('should be computed to `right`', done => {
      const parent = document.createElement('div');
      parent.style.overflow = 'auto';
      parent.style.position = 'relative';
      parent.style.width = '500px';
      parent.style.height = '500px';
      parent.style.backgroundColor = 'green';
      const reference = appendNewRef(1, 'ref', parent);
      reference.style.position = 'absolute';
      reference.style.left = '0';
      reference.style.top = '50%';
      const popper = appendNewPopper(2, 'pop', parent);
      jasmineWrapper.appendChild(parent);

      const pop = new Popper(reference, popper, {
        placement: 'auto',
        modifiers: { flip: { boundariesElement: 'scrollParent' } },
        onCreate: () => {
          const left = getRect(popper).left - arrowSize;
          expect(left).toBeApprox(getRect(reference).right);
          pop.destroy();
          done();
        },
      });
    });

    it('should be computed to `bottom`', done => {
      const parent = document.createElement('div');
      parent.style.overflow = 'auto';
      parent.style.position = 'relative';
      parent.style.width = '500px';
      parent.style.height = '500px';
      parent.style.backgroundColor = 'green';
      const reference = appendNewRef(1, 'ref', parent);
      reference.style.position = 'absolute';
      reference.style.top = '0';
      reference.style.left = '50%';
      const popper = appendNewPopper(2, 'pop', parent);
      jasmineWrapper.appendChild(parent);

      const pop = new Popper(reference, popper, {
        placement: 'auto',
        modifiers: { flip: { boundariesElement: 'scrollParent' } },
        onCreate: () => {
          const top = getRect(popper).top - arrowSize;
          expect(top).toBeApprox(getRect(reference).bottom);
          pop.destroy();
          done();
        },
      });
    });

    it('should be computed to `left`', done => {
      const parent = document.createElement('div');
      parent.style.overflow = 'auto';
      parent.style.position = 'relative';
      parent.style.width = '500px';
      parent.style.height = '500px';
      parent.style.backgroundColor = 'green';
      const reference = appendNewRef(1, 'ref', parent);
      reference.style.position = 'absolute';
      reference.style.right = '0';
      reference.style.top = '50%';
      const popper = appendNewPopper(2, 'pop', parent);
      jasmineWrapper.appendChild(parent);

      const pop = new Popper(reference, popper, {
        placement: 'auto',
        modifiers: { flip: { boundariesElement: 'scrollParent' } },
        onCreate: () => {
          const right = getRect(popper).right + arrowSize;
          expect(right).toBeApprox(getRect(reference).left);
          pop.destroy();
          done();
        },
      });
    });
  });

  it('inits a bottom popper attached to an inline reference', done => {
    const reference = appendNewRef(1);
    reference.style.display = 'inline';
    const popper = appendNewPopper(2);

    const pop = new Popper(reference, popper);

    // give some time to the browser to render...
    // otherwise `getBoundingClientRect` returns wrong values
    setTimeout(() => {
      const top = getRect(popper).top;
      expect(top).toBeApprox(getRect(reference).bottom + arrowSize);
      pop.destroy();
      done();
    }, 10);
  });

  it('inits a bottom-start popper', done => {
    const reference = appendNewRef(1);
    reference.style.marginLeft = '200px';
    const popper = appendNewPopper(2);

    new Popper(reference, popper, {
      placement: 'bottom-start',
      onCreate: data => {
        expect(getRect(popper).left).toBeApprox(getRect(reference).left);

        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a right popper', done => {
    const reference = appendNewRef(1);
    const popper = appendNewPopper(2);

    new Popper(reference, popper, {
      placement: 'right',
      onCreate: data => {
        expect(getRect(popper).left - arrowSize).toBeApprox(
          getRect(reference).right
        );

        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper inside a scrolling div, contained in a relative div', done => {
    const relative = document.createElement('div');
    relative.style.width = '800px';
    relative.style.height = '700px';
    relative.style.position = 'relative';
    relative.style.backgroundColor = 'green';
    relative.style.border = '1px solid';
    jasmineWrapper.appendChild(relative);

    const scrolling = document.createElement('div');
    scrolling.style.width = '800px';
    scrolling.style.height = '500px';
    scrolling.style.overflow = 'auto';
    scrolling.style.backgroundColor = 'blue';
    scrolling.style.marginTop = '100px';
    relative.appendChild(scrolling);

    const superHigh1 = document.createElement('div');
    superHigh1.style.width = '800px';
    superHigh1.style.height = '450px';
    scrolling.appendChild(superHigh1);

    const ref = appendNewRef(1, 'ref', scrolling);
    const popper = appendNewPopper(2, 'popper', scrolling);

    const superHigh2 = document.createElement('div');
    superHigh2.style.width = '800px';
    superHigh2.style.height = '500px';
    scrolling.appendChild(superHigh2);

    simulateScroll(scrolling, { scrollTop: 400 });
    new Popper(ref, popper, {
      placement: 'top',
      onCreate: () => {
        // placement should be top
        expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(ref).top);

        simulateScroll(scrolling, { scrollTop: 100, delay: 10 });
      },
      onUpdate: data => {
        // placement should be top
        expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(ref).top);

        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper inside a scrolling div with an huge border', done => {
    const scrolling = document.createElement('div');
    scrolling.style.width = '800px';
    scrolling.style.height = '500px';
    scrolling.style.overflow = 'auto';
    scrolling.style.backgroundColor = 'blue';
    scrolling.style.border = '50px green solid';
    jasmineWrapper.appendChild(scrolling);

    const superHigh1 = document.createElement('div');
    superHigh1.style.width = '800px';
    superHigh1.style.height = '450px';
    scrolling.appendChild(superHigh1);

    const ref = appendNewRef(1, 'ref', scrolling);
    const popper = appendNewPopper(2, 'popper', scrolling);

    const superHigh2 = document.createElement('div');
    superHigh2.style.width = '800px';
    superHigh2.style.height = '500px';
    scrolling.appendChild(superHigh2);

    simulateScroll(scrolling, { scrollTop: 400 });
    new Popper(ref, popper, {
      placement: 'top',
      onCreate: () => {
        //placement should be top
        expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(ref).top);

        simulateScroll(scrolling, { scrollTop: 100, delay: 10 });
      },
      onUpdate: data => {
        // placement should be top
        expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(ref).top);

        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper inside a body, with its reference element inside a relative div', done => {
    const relative = document.createElement('div');
    relative.style.position = 'relative';
    relative.style.margin = '20px';
    jasmineWrapper.appendChild(relative);

    const ref = appendNewRef(1, 'ref', relative);
    const popper = appendNewPopper(2, 'popper');

    new Popper(ref, popper, {
      onCreate: data => {
        expect(getRect(popper).top - arrowSize).toBeApprox(getRect(ref).bottom);
        expect(getRect(popper).left).toBeApprox(5);
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper inside a body without any positioned or scrollable parents and scrolls the body', done => {
    const ref = appendNewRef(1, 'ref');
    const popper = appendNewPopper(2, 'popper');
    document.body.scrollTop = 100;

    new Popper(ref, popper, {
      onCreate: data => {
        expect(getRect(popper).top - arrowSize).toBeApprox(getRect(ref).bottom);
        expect(getRect(popper).left).toBeApprox(5);
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper inside a scrolled body, with its reference element inside a relative div', done => {
    const relative = document.createElement('div');
    relative.style.position = 'relative';
    relative.style.margin = '20px';
    relative.style.height = '300vh';
    jasmineWrapper.appendChild(relative);
    simulateScroll(document.body, { scrollTop: 300 });

    const ref = appendNewRef(1, 'ref', relative);
    ref.style.marginTop = '300px';
    const popper = appendNewPopper(2, 'popper');

    new Popper(ref, popper, {
      onCreate: data => {
        expect(getRect(popper).top - arrowSize).toBeApprox(getRect(ref).bottom);
        expect(getRect(popper).left).toBeApprox(5);
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper near a reference element, both inside a fixed element, inside a scrolled body', done => {
    const fixed = document.createElement('div');
    fixed.style.position = 'fixed';
    fixed.style.margin = '20px';
    fixed.style.height = '50px';
    fixed.style.width = '100%';
    fixed.style.backgroundColor = 'grey';
    jasmineWrapper.appendChild(fixed);

    const relative = document.createElement('div');
    relative.style.position = 'relative';
    relative.style.margin = '20px';
    relative.style.height = '200vh';
    jasmineWrapper.appendChild(relative);
    simulateScroll(document.body, { scrollTop: 800 });

    const ref = appendNewRef(1, 'ref', fixed);
    const popper = appendNewPopper(2, 'popper', fixed);

    new Popper(ref, popper, {
      onCreate: data => {
        expect(getRect(popper).top - arrowSize).toBeApprox(getRect(ref).bottom);
        expect(getRect(popper).left).toBeApprox(5);
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper near a reference element, both inside a fixed element with CSS transforms, inside a scrolled body', done => {
    const relative = document.createElement('div');
    relative.style.position = 'relative';
    relative.style.margin = '20px';
    relative.style.height = '200vh';
    relative.style.background = 'rgba(100, 100, 100, 0.5)';

    const fixed = document.createElement('div');
    fixed.style.position = 'fixed';
    fixed.style.margin = '20px';
    fixed.style.height = '50px';
    fixed.style.width = '100%';
    fixed.style.transform = 'translateX(0.1)';
    fixed.style.background = 'green';
    relative.appendChild(fixed);

    jasmineWrapper.appendChild(relative);

    const ref = appendNewRef(1, 'ref', fixed);
    const popper = appendNewPopper(2, 'popper', fixed);

    simulateScroll(document.body, { scrollTop: 800 });

    new Popper(ref, popper, {
      onCreate: data => {
        expect(getRect(popper).top - arrowSize).toBeApprox(getRect(ref).bottom);
        expect(getRect(popper).left).toBeApprox(5);
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper near a reference element, both inside a fixed element on bottom of viewport, inside a scrolled body', done => {
    const fixed = document.createElement('div');
    fixed.style.position = 'fixed';
    fixed.style.bottom = '5px';
    fixed.style.height = '38px';
    fixed.style.width = '100%';
    jasmineWrapper.appendChild(fixed);

    const relative = document.createElement('div');
    relative.style.position = 'relative';
    relative.style.margin = '20px';
    relative.style.height = '200vh';
    jasmineWrapper.appendChild(relative);
    simulateScroll(document.body, { scrollTop: 800 });

    const ref = appendNewRef(1, 'ref', fixed);
    const popper = appendNewPopper(2, 'popper', fixed);

    new Popper(ref, popper, {
      placement: 'top',
      onCreate: data => {
        expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(ref).top);
        expect(getRect(popper).left).toBeApprox(5);
        expect(popper.getAttribute('x-placement')).toBe('top');
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper and destroy it using its callback', done => {
    const reference = appendNewRef(1);
    const popper = appendNewPopper(2);

    new Popper(reference, popper, {
      onCreate: data => {
        data.instance.destroy();
        expect(popper.style.top).toBe('');
        done();
      },
    });
  });

  it('inits a popper with an empty form as parent, then auto remove it on destroy', done => {
    const form = document.createElement('form');
    const reference = appendNewRef(1, 'ref', form);
    const popper = appendNewPopper(2, 'test', form);
    jasmineWrapper.appendChild(form);

    new Popper(reference, popper, {
      removeOnDestroy: true,
      onCreate: data => {
        expect(data.instance.popper).toBeDefined();
        expect(data.instance.popper.innerText.trim()).toBe('test');
        data.instance.destroy();
        expect(document.body.contains(data.instance.popper)).toBeFalsy();
        done();
      },
    });
  });

  it('inits a popper with a not empty form as parent, then auto remove it on destroy', done => {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const popper = appendNewPopper(2, 'test', form);
    form.appendChild(input);
    const reference = appendNewRef(1, 'ref', form);
    jasmineWrapper.appendChild(form);

    new Popper(reference, popper, {
      removeOnDestroy: true,
      onCreate: data => {
        expect(data.instance.popper).toBeDefined();
        expect(data.instance.popper.innerText.trim()).toBe('test');
        data.instance.destroy();
        expect(document.body.contains(data.instance.popper)).toBeFalsy();
        done();
      },
    });
  });

  it('inits a popper and make sure its position is correct on init', done => {
    const reference = appendNewRef(1);
    const popper = appendNewPopper(2, 'popper');

    new Popper(reference, popper, {
      placement: 'right',
      removeOnDestroy: true,
      onCreate: data => {
        expect(getRect(popper).left - arrowSize).toBeApprox(
          getRect(reference).right
        );
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper inside a scrolled body, with its reference element inside a scrolling div, wrapped in a relative div', done => {
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
      onCreate: data => {
        expect(getRect(popper).top).toBeApprox(getRect(ref).top + 5); // 5 is the boundaries margin
        expect(getRect(popper).left - arrowSize).toBeApprox(getRect(ref).right);

        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper and its reference element inside of an offsetParent, which is inside of an offsetParent', done => {
    const outterWrapper = document.createElement('div');
    outterWrapper.style.position = 'relative';
    outterWrapper.style.left = '90vw';
    outterWrapper.style.backgroundColor = 'yellow';
    jasmineWrapper.appendChild(outterWrapper);

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.left = '5vw';
    wrapper.style.backgroundColor = 'green';
    outterWrapper.appendChild(wrapper);

    const ref = appendNewRef(1, 'ref', wrapper);
    ref.style.width = '100px';
    ref.style.height = '100px';
    ref.style.marginTop = '100px';
    wrapper.appendChild(ref);

    const popper = document.createElement('div');
    popper.style.width = '100px';
    popper.style.height = '100px';
    wrapper.appendChild(popper);

    new Popper(ref, popper, {
      modifiers: {
        preventOverflow: {
          boundariesElement: 'viewport',
        },
      },
      onCreate: data => {
        expect(getRect(popper).right).toBeApprox(window.innerWidth - 5); // 5 is the boundaries margin

        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper with boundariesElement set to viewport, the popper should not be in the viewport', done => {
    if (isIPHONE) {
      pending();
    }

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

    new Popper(ref, popper, {
      placement: 'bottom',
      modifiers: {
        flip: {
          boundariesElement: 'viewport',
        },
      },
      onCreate: () => {
        expect(getRect(popper).bottom + arrowSize).toBeApprox(getRect(ref).top);
        simulateScroll(document.body, { scrollTop: getRect(ref).top });
      },
      onUpdate: data => {
        expect(getRect(popper).top - arrowSize).toBeApprox(getRect(ref).bottom);
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper with a custom modifier that should hide it', done => {
    const reference = appendNewRef(1);
    const popper = appendNewPopper(2);

    function hidePopper(data) {
      data.styles.display = 'none';
      return data;
    }

    new Popper(reference, popper, {
      modifiers: {
        hidePopper: { order: 790, enabled: true, fn: hidePopper },
      },
      onCreate: data => {
        expect(popper.style.display).toBe('none');
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper with a custom modifier that set its top to 3px', done => {
    const reference = appendNewRef(1);
    const popper = appendNewPopper(2);

    function movePopper(data) {
      data.styles.top = '3px';
      return data;
    }

    new Popper(reference, popper, {
      modifiers: {
        movePopper: { order: 690, enabled: true, fn: movePopper },
      },
      onCreate: data => {
        expect(popper.style.top).toBe('3px');
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper inside a Shadow DOM with its reference element inside DOM', done => {
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
      onCreate: data => {
        expect(getRect(popper).left).toBeApprox(getRect(reference).right);
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper inside DOM with its reference element inside Shadow DOM', done => {
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
      onCreate: data => {
        expect(getRect(popper).left - arrowSize).toBeApprox(
          getRect(reference).right
        );
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper inside a Shadow DOM with its reference element inside different Shadow DOM', done => {
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
      onCreate: data => {
        expect(getRect(popper).left).toBeApprox(getRect(reference).right);
        data.instance.destroy();
        done();
      },
    });
  });

  it('init a bottom-end popper near the right side of its container and make sure it stays between boundaries', done => {
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    container.style.background = 'grey';
    container.style.position = 'relative';
    container.style.overflow = 'scroll';

    const scroller = document.createElement('div');
    scroller.style.width = '2000px';
    scroller.style.height = '1px';

    const button = document.createElement('div');
    button.style.width = '20px';
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
        expect(getRect(dropdown).right).toBeApprox(
          getRect(container).right - 5
        );
        container.scrollLeft = scrollLeft;
      },
      onUpdate: data => {
        expect(getRect(dropdown).right).toBeApprox(
          getRect(container).right - scrollLeft
        );
        data.instance.destroy();
        done();
      },
    });
  });

  it('init a bottom-start popper near the right side of its container and make sure it stays between boundaries', done => {
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    container.style.background = 'grey';
    container.style.position = 'relative';
    container.style.overflow = 'scroll';

    const scroller = document.createElement('div');
    scroller.style.width = '2000px';
    scroller.style.height = '1px';

    const button = document.createElement('div');
    button.style.width = '20px';
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
        expect(getRect(dropdown).right).toBeApprox(
          getRect(container).right - 5
        );
        container.scrollLeft = scrollLeft;
      },
      onUpdate: data => {
        expect(getRect(dropdown).right).toBeApprox(
          getRect(container).right - 5
        );
        data.instance.destroy();
        done();
      },
    });
  });

  it('init a popper near the right side of its container and make sure it stays between custom boundaries', done => {
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    container.style.background = 'grey';
    container.style.position = 'relative';
    container.style.overflow = 'scroll';

    const scroller = document.createElement('div');
    scroller.style.width = '2000px';
    scroller.style.height = '1px';

    const button = document.createElement('div');
    button.style.width = '20px';
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
        expect(getRect(dropdown).right).toBeApprox(
          getRect(container).right - 5
        );
        container.scrollLeft = scrollLeft;
      },
      onUpdate: data => {
        expect(getRect(dropdown).right).toBeApprox(
          getRect(container).right - scrollLeft
        );
        data.instance.destroy();
        done();
      },
    });
  });

  it('init a popper near the right side of a custom container and make sure it stays between boundaries', done => {
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    container.style.background = 'grey';
    container.style.position = 'relative';
    container.style.overflow = 'scroll';

    const scroller = document.createElement('div');
    scroller.style.width = '2000px';
    scroller.style.height = '1px';

    const button = document.createElement('div');
    button.style.width = '20px';
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
      onUpdate: data => {
        expect(getRect(dropdown).right).toBe(
          getRect(container).right - scrollLeft
        );
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper near the left side of a custom absolute container contained in a relative parent', done => {
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
    button.style.width = '20px';
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
      onCreate: data => {
        expect(getRect(dropdown).left).toBe(getRect(container).left + 5);

        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper near a reference element, both inside an element with CSS translateX', done => {
    const fixed = document.createElement('div');
    fixed.style.position = 'fixed';
    fixed.style.left = '50%';
    fixed.style.top = '20px';
    fixed.style.transform = 'translateX(0)';
    fixed.style.background = 'green';
    jasmineWrapper.appendChild(fixed);

    const popper = appendNewPopper(2, 'popper', fixed);
    const ref = appendNewRef(1, 'ref', fixed);

    new Popper(ref, popper, {
      placement: 'bottom-end',
      onCreate: data => {
        expect(getRect(popper).right).toBeApprox(getRect(ref).right);
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper near the reference element when it is a child of ref and a parent is relatively positioned', done => {
    const relative = document.createElement('div');
    relative.style.position = 'relative';
    relative.style.left = '50%';
    relative.style.top = '20px';
    relative.style.background = 'green';
    jasmineWrapper.appendChild(relative);

    const ref = appendNewRef(1, 'ref', relative);
    const popper = appendNewPopper(2, 'popper', ref);

    new Popper(ref, popper, {
      placement: 'bottom-end',
      onCreate: data => {
        expect(getRect(popper).right).toBeApprox(getRect(ref).right);
        data.instance.destroy();
        done();
      },
    });
  });

  it('inits a popper near the reference element when it is a child of ref and the ref is relatively positioned', done => {
    const ref = appendNewRef(1, 'ref');
    ref.style.position = 'relative';
    ref.style.left = '300px';
    ref.style.top = '20px';
    ref.style.background = 'green';

    const popper = appendNewPopper(2, 'popper', ref);

    new Popper(ref, popper, {
      placement: 'bottom-end',
      onCreate: data => {
        expect(getRect(popper).right).toBeApprox(getRect(ref).right);
        data.instance.destroy();
        done();
      },
    });
  });

  it('checks that all the scrollable parents have an event listener attached', done => {
    jasmineWrapper.innerHTML = `
            <div id="s1" style="overflow: scroll; height: 300px; background: red;">
                <div id="s2" style="overflow: scroll; height: 300px; margin-top: 50px; background: green;">
                    <div style="overflow: scroll; height: 300px; margin-top: 50px; background: yellow;">
                        <div id="reference" style="background: pink">popper</div>
                    </div>
                </div>
            </div>
            <div id="popper" style="background: purple">popper</div>
        `;

    const reference = document.getElementById('reference');
    const popper = document.getElementById('popper');
    const s1 = document.getElementById('s1');
    const s2 = document.getElementById('s2');

    new Popper(reference, popper, {
      onCreate() {
        simulateScroll(s1, { scrollTop: 50 });
        simulateScroll(s2, { scrollTop: 50 });
      },
      onUpdate(data) {
        expect(getRect(reference).bottom).toBeApprox(getRect(popper).top);
        data.instance.destroy();
        done();
      },
    });
  });

  it('uses an object instead of the reference element to position its popper', done => {
    // Skip IE10 here because the current implementation doesn't work with it and
    // I don't want to add extra logic to support a "nice to have" feature on an
    // ancient browser
    if (isIE10) {
      pending();
    }

    jasmineWrapper.innerHTML = `
      <div id="popper" style="background: purple;">popper</div>
    `;

    const popper = document.getElementById('popper');

    const reference = {
      getBoundingClientRect() {
        return {
          top: 10,
          left: 100,
          right: 150,
          bottom: 90,
          width: 50,
          height: 80,
        };
      },
      clientWidth: 50,
      clientHeight: 80,
    };

    new Popper(reference, popper, {
      placement: 'bottom-start',
      onCreate() {
        expect(getRect(popper).top).toBe(
          reference.getBoundingClientRect().bottom
        );
        expect(getRect(popper).left).toBe(
          reference.getBoundingClientRect().left
        );
        done();
      },
    });
  });

  // test for #224
  it('checks that only the needed parents scroll offsets are included', done => {
    jasmineWrapper.innerHTML = `
      <div id="s1" style="overflow: scroll; height: 300px; background: red;">
        <div style="height: 100px;">
          <div id="reference" style="background: pink; margin-top: 100px; margin-bottom: 400px;">reference</div>
        </div>
      </div>
      <div style="height: 100vh;">spacer</div>
      <div id="popper" style="background: purple">popper</div>
    `;

    const reference = document.getElementById('reference');
    const popper = document.getElementById('popper');
    const s1 = document.getElementById('s1');

    new Popper(reference, popper, {
      onCreate() {
        simulateScroll(s1, { scrollTop: 20 });
        simulateScroll(document.body, { scrollTop: 50 });
      },
      onUpdate(data) {
        expect(getRect(reference).bottom).toBeApprox(getRect(popper).top);
        data.instance.destroy();
        done();
      },
    });
  });

  // test for #310
  it('properly avoids overflow when parent is transformed', done => {
    jasmineWrapper.innerHTML = `
      <style>
        .transform {
          will-change: transform;
        }
        #reference {
          width: 50px;
          height: 50px;
          background: lightgrey;
        }
        #popper {
          background: cyan;
          width: 200px;
          height: 100px;
        }
      </style>
      <div class="transform">
        <div id="reference">
          Box 2
        </div>
        <div id="popper">
          My Tooltip Content
        </div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const popper = document.getElementById('popper');

    new Popper(reference, popper, {
      placement: 'bottom',
      onCreate(data) {
        expect(getRect(reference).bottom).toBeApprox(getRect(popper).top);
        expect(getRect(popper).left).toBeApprox(5);
        data.instance.destroy();
        done();
      },
    });
  });

  // test for #305
  it('correct position if offset parent has borders', done => {
    jasmineWrapper.innerHTML = `
      <style>
        .container {
          align-items: center;
          background: blue;
          border: 20px solid red;
          display: flex;
          height: 400px;
          justify-content: center;
          margin: auto;
          position: relative;
          width: 400px;
        }
        #reference {
          background: orange;
          width: 50px;
          height: 50px;
        }
        #popper {
          background: green;
          width: 50px;
          height: 50px;
        }
      </style>
      <div class="container">
        <div id="reference">ref</div>
        <div id="popper">pop</div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const popper = document.getElementById('popper');

    new Popper(reference, popper, {
      placement: 'bottom',
      onCreate(data) {
        expect(getRect(reference).bottom).toBeApprox(getRect(popper).top);
        expect(getRect(reference).left).toBeApprox(getRect(popper).left);
        data.instance.destroy();
        done();
      },
    });
  });

  // Test for #253
  xit('sticky parent', done => {
    // MS Browsers (IE and Edge) don't support Sticky position
    if (isMSBrowser()) {
      pending();
    }
    jasmineWrapper.innerHTML = `
      <div id="s1" style="background: blue; height: 400px; overflow-y: scroll;">
        <div style="background: green; height: 50px; position: sticky; top: 0;">
          <div id="reference" style="background: orange; width: 50px; height: 50px;">ref</div>
          <div id="popper" style="background: steelblue; width: 50px; height: 50px;">pop</div>
        </div>
        <div style="height: 1000px;"></div>
      </div>
    `;
    const s1 = document.getElementById('s1');
    const reference = document.getElementById('reference');
    const popper = document.getElementById('popper');

    simulateScroll(s1, { scrollTop: 100 });

    new Popper(reference, popper, {
      onCreate(data) {
        expect(getRect(reference).bottom).toBeApprox(getRect(popper).top);
        data.instance.destroy();
        done();
      },
    });
  });

  // test for #302
  xit(
    'correct position on height:100% scrolled body with fixed popper parent',
    done => {
      jasmineWrapper.innerHTML = `
      <style>
        html, body {
          height: 100%;
        }
        .padder {
          height: 120vh;
          width: 10px;
          background-color: yellow;
        }
        .wrapper {
          position: fixed;
          bottom: 10px;
          left: 0px;
          right: 0px;
        }
        #reference {
          background: orange;
          width: 50px;
          height: 50px;
        }
        #popper {
          background: green;
          width: 50px;
          height: 50px;
        }
      </style>
      <div class="padder"></div>
      <div class="wrapper">
        <div id="reference">ref</div>
        <div id="popper">pop</div>
      </div>
    `;

      const reference = document.getElementById('reference');
      const popper = document.getElementById('popper');

      new Popper(reference, popper, {
        placement: 'top',
        onCreate() {
          simulateScroll(document.body, { scrollTop: 400 });
        },
        onUpdate(data) {
          expect(getRect(reference).bottom).toBeApprox(getRect(popper).top);
          data.instance.destroy();
          done();
        },
      });
    }
  );

  // test for #276
  it('works inside tables', done => {
    jasmineWrapper.innerHTML = `
      <style>
        table {
          margin-top: 50px;
        }
        #reference {
          background: orange;
          width: 50px;
          height: 50px;
        }
        #popper {
          background: green;
          width: 50px;
          height: 50px;
        }
      </style>
      <table>
        <tbody>
          <tr>
            <td>
              <div id="reference">
                ref
              </div>
              <div id="popper">
                pop
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    `;

    const reference = document.getElementById('reference');
    const popper = document.getElementById('popper');

    new Popper(reference, popper, {
      placement: 'bottom',
      onCreate(data) {
        expect(getRect(reference).bottom).toBeApprox(getRect(popper).top);
        expect(getRect(reference).left).toBeApprox(getRect(popper).left);
        data.instance.destroy();
        done();
      },
    });
  });
});
