import Popper from '../../src/index.js';
import getOppositePlacement from '../../src/utils/getOppositePlacement';

// Utils
import appendNewPopper from '@popperjs/test-utils/utils/appendNewPopper';
import appendNewRef from '@popperjs/test-utils/utils/appendNewRef';
import simulateScroll from '@popperjs/test-utils/utils/simulateScroll';
import getRect from '../utils/getRect';
const jasmineWrapper = document.getElementById('jasmineWrapper');

const isIPHONE = window.navigator.userAgent.match(/iPhone/i);
[true, false].forEach((positionFixed) => {

  describe('[flipping]' + (positionFixed ? ' Fixed' : ''), () => {

    beforeEach(function(){
      Popper.Defaults.positionFixed = positionFixed;
    });

    it('should flip from top to bottom', done => {
      const ref = appendNewRef(1, 'ref', jasmineWrapper);
      ref.style.marginLeft = '100px';
      const popper = appendNewPopper(2, 'popper');
      new Popper(ref, popper, {
        placement: 'top',
        onCreate: data => {
          expect(data.placement).toBe('bottom');
          data.instance.destroy();
          done();
        },
      });
    });

    const flippingDefault = [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ];

    const flippingVariations = {
      'top-start': 'top-end',
      'top-end': 'top-start',
      'bottom-start': 'bottom-end',
      'bottom-end': 'bottom-start',
      'left-start': 'left-end',
      'left-end': 'left-start',
      'right-start': 'right-end',
      'right-end': 'right-start',
    };

    flippingDefault.forEach(val => {
      it(`should flip from ${val} to ${getOppositePlacement(
        val
      )} if boundariesElement is set`, done => {
        const relative = document.createElement('div');
        relative.style.margin = '100px 300px';
        relative.style.height = '100px';
        relative.style.width = '100px';
        relative.style.background = '#ffff00';
        jasmineWrapper.appendChild(relative);

        const ref = appendNewRef(1, 'ref', relative);
        ref.style.width = '70px';
        ref.style.height = '70px';
        ref.style.background = 'green';
        // ref.style.marginTop = '100px';
        const popper = appendNewPopper(2, 'popper');

        new Popper(ref, popper, {
          placement: val,
          modifiers: {
            flip: { boundariesElement: relative },
          },
          onCreate: data => {
            expect(data.flipped).toBe(true);
            expect(data.placement).toBe(getOppositePlacement(val));
            expect(data.originalPlacement).toBe(val);
            data.instance.destroy();
            done();
          },
        });
      });

      it('should NOT flip if there is no boundariesElement', done => {
        const relative = document.createElement('div');
        relative.style.margin = '100px 300px';
        relative.style.height = '100px';
        relative.style.width = '100px';
        relative.style.background = '#ffff00';
        jasmineWrapper.appendChild(relative);

        const ref = appendNewRef(1, 'ref', relative);
        ref.style.width = '70px';
        ref.style.height = '70px';
        ref.style.background = 'green';
        // ref.style.marginTop = '100px';
        const popper = appendNewPopper(3, 'popper');

        new Popper(ref, popper, {
          placement: val,
          onCreate: data => {
            expect(data.flipped).not.toBe(true);
            expect(data.placement).toBe(val);
            expect(data.originalPlacement).toBe(val);
            data.instance.destroy();
            done();
          },
        });
      });
    });
    function getSecondaryMargin(val) {
      return (val === 'start' ? '-' : '') + '100px';
    }

    Object.keys(flippingVariations).forEach(val => {
      it(`(variations) should flip from ${val} to ${flippingVariations[
        val
      ]} if boundariesElement is set`, done => {
        const relative = document.createElement('div');
        relative.style.margin = '100px 300px';
        relative.style.height = '300px';
        relative.style.width = '300px';
        relative.style.background = '#ffff00';
        relative.style.position = 'relative';
        jasmineWrapper.appendChild(relative);

        const ref = appendNewRef(1, 'ref', relative);
        ref.style.width = '200px';
        ref.style.height = '200px';
        ref.style.background = 'green';
        ref.style.position = 'absolute';
        ref.style.zIndex = '10';
        const valElems = val.split('-');

        switch (valElems[0]) {
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
        }

        const popper = appendNewPopper(2, 'popper');

        new Popper(ref, popper, {
          placement: val,
          modifiers: {
            preventOverflow: {
              enabled: true,
              escapeWithReference: true,
            },
            flip: {
              flipVariations: true,
              boundariesElement: relative,
            },
          },
          onCreate: data => {
            expect(data.flipped).toBe(true);
            expect(data.placement).toBe(flippingVariations[val]);
            expect(data.originalPlacement).toBe(val);
            data.instance.destroy();
            done();
          },
        });
      });
    });

    it('flips to opposite side when rendered inside a positioned parent', done => {
      const page = document.createElement('div');
      page.style.paddingTop = '110vh'; // Simulates page content
      page.style.background = 'lightskyblue';
      jasmineWrapper.appendChild(page);

      const parent = document.createElement('div');
      parent.style.position = 'relative';
      parent.style.background = 'yellow';
      page.appendChild(parent);

      const ref = appendNewRef(1, 'reference', parent);
      const popper = appendNewPopper(2, 'popper', parent);

      new Popper(ref, popper, {
        onCreate: data => {
          simulateScroll(page, { scrollTop: '110vh', delay: 10 });

          const popperRect = popper.getBoundingClientRect();
          const refRect = ref.getBoundingClientRect();
          const arrowSize = 5;

          expect(data.flipped).toBe(true);
          expect(popperRect.bottom + arrowSize).toBeApprox(refRect.top);

          data.instance.destroy();
          done();
        },
      });
    });

    it('flips to bottom when hits top viewport edge', done => {
      if (isIPHONE) {
        pending();
      }

      jasmineWrapper.innerHTML = `
        <div id="s1" style="height: 3000px; background: red;">
          <div id="reference" style="background: pink; margin-top: 200px">reference</div>
          <div id="popper" style="background: purple">popper</div>
        </div>
      `;

      const reference = document.getElementById('reference');
      const popper = document.getElementById('popper');

      new Popper(reference, popper, {
        placement: 'top',
        onCreate() {
          simulateScroll(document.body, { scrollTop: 200 });
        },
        onUpdate(data) {
          expect(getRect(popper).top).toBeApprox(getRect(reference).bottom);
          data.instance.destroy();
          done();
        },
      });
    });

    it('flip properly with large popper width', done => {
      jasmineWrapper.innerHTML = `
        <style>body { margin: 0; }</style>
        <div style="background: grey; height: 100vh;">
          <div
            id="reference"
            style="background: yellow; width: 200px; height: 80vh;"
          >
            ref
          </div>
          <div
            id="popper"
            style="background: purple; width: 95vw; height: 30px;"
          >
            popper
          </div>
        </div>
      `;

      const reference = document.getElementById('reference');
      const popper = document.getElementById('popper');

      new Popper(reference, popper, {
        placement: 'auto',
        onCreate(data) {
          expect(data.placement).toBe('bottom');
          expect(getRect(reference).bottom).toBeApprox(getRect(popper).top);
          data.instance.destroy();
          done();
        },
      });
    });

    it('init popper on fixed reference aligned to left and flips to right', done => {
      jasmineWrapper.innerHTML = `             
                <div id="reference" style="position: fixed; top: 50px; left: 1px; background: pink">reference</div>
                <div id="popper" style="background: purple; width: 5px">popper</div>
            `;

      const reference = document.getElementById('reference');
      const popper = document.getElementById('popper');

      new Popper(reference, popper, {
        placement: 'left-start',
        onCreate() {
          expect(popper.getBoundingClientRect().top).toBeApprox(
            reference.getBoundingClientRect().top
          );
          expect(popper.getBoundingClientRect().left).toBeApprox(
            reference.getBoundingClientRect().right
          );
          done();
        },
      });
    });

    it('init popper on fixed reference aligned to right and flips to left', done => {
      jasmineWrapper.innerHTML = `             
                <div id="reference" style="position: fixed; top: 50px; right: 1px; background: pink">reference</div>
                <div id="popper" style="background: purple;">popper</div>
            `;

      const reference = document.getElementById('reference');
      const popper = document.getElementById('popper');

      new Popper(reference, popper, {
        placement: 'right-start',
        onCreate() {
          expect(popper.getBoundingClientRect().top).toBeApprox(
            reference.getBoundingClientRect().top
          );
          expect(popper.getBoundingClientRect().right).toBeApprox(
            reference.getBoundingClientRect().left
          );
          done();
        },
      });
    });

    it('init popper on fixed reference aligned to top and flips to bottom', done => {
      jasmineWrapper.innerHTML = `             
                <div id="reference" style="position: fixed; top: 1px; left: 50px; background: pink">reference</div>
                <div id="popper" style="background: purple;">popper</div>
            `;

      const reference = document.getElementById('reference');
      const popper = document.getElementById('popper');

      new Popper(reference, popper, {
        placement: 'top-start',
        onCreate() {
          expect(popper.getBoundingClientRect().top).toBeApprox(
            reference.getBoundingClientRect().bottom
          );
          expect(popper.getBoundingClientRect().left).toBeApprox(
            reference.getBoundingClientRect().left
          );
          done();
        },
      });
    });

    it('init popper on fixed reference aligned to bottom and flips to top', done => {
      jasmineWrapper.innerHTML = `             
                <div id="reference" style="position: fixed; bottom: 1px; right: 50px; background: pink">reference</div>
                <div id="popper" style="background: purple;">popper</div>
            `;

      const reference = document.getElementById('reference');
      const popper = document.getElementById('popper');

      new Popper(reference, popper, {
        placement: 'bottom-start',
        onCreate() {
          expect(popper.getBoundingClientRect().bottom).toBeApprox(
            reference.getBoundingClientRect().top
          );
          expect(popper.getBoundingClientRect().left).toBeApprox(
            reference.getBoundingClientRect().left
          );
          done();
        },
      });
    });

    it('init popper on transformed parent flips to top', done => {
      jasmineWrapper.innerHTML = `        
              <div id="container" style="position: relative; margin-left: 100px; margin-top:100px; height: 100vh; transform: translateZ(0)">                    
                <div style="height:100%"></div> 
                <div id="reference" style="background: pink">reference</div>
                <div id="popper" style="background: purple;">popper</div>
                <div style="height:200%"></div> 
                </div>
            `;

      const reference = document.getElementById('reference');
      const popper = document.getElementById('popper');
      new Popper(reference, popper, {
        placement: 'bottom-start',
        onCreate() {
          expect(popper.getBoundingClientRect().bottom).toBeApprox(
            reference.getBoundingClientRect().top
          );
          expect(popper.getBoundingClientRect().left).toBeApprox(
            reference.getBoundingClientRect().left
          );
          done();
        },
      });
    });

    // This one will fail on IE10 - See #211
    xit('properly positions a bottom popper inside very high body', done => {
      jasmineWrapper.innerHTML = `
        <div id="reference" style="background: pink; margin-top: 100vh; width: 100px; height: 100px;">reference</div>
        <div id="popper" style="background: purple; width: 100px; height: 100px;">popper</div>
      `;
      document.body.style.height = '200vh';

      const reference = document.getElementById('reference');
      const popper = document.getElementById('popper');

      new Popper(reference, popper, {
        onCreate() {
          simulateScroll(document.body, {
            scrollTop: getRect(document.body).height,
            delay: 50,
          });
        },
        onUpdate(data) {
          expect(getRect(popper).top).toBeApprox(getRect(reference).bottom);
          data.instance.destroy();
          document.body.style.cssText = null;
          done();
        },
      });
    });
  });
});
