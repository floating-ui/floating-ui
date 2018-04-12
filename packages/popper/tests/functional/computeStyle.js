import Popper from '../../src/index.js';

import '@popperjs/test-utils';
const jasmineWrapper = document.getElementById('jasmineWrapper');
const arrowSize = 5;

// Utils
import appendNewPopper from '@popperjs/test-utils/utils/appendNewPopper';
import appendNewRef from '@popperjs/test-utils/utils/appendNewRef';
import getRect from '../utils/getRect';

[true, false].forEach((positionFixed) => {
  beforeEach(function(){
    Popper.Defaults.positionFixed = positionFixed;
  });

  describe('[computeStyle]' + (positionFixed ? ' Fixed' : ''), () => {
    describe('x="top" y="left"', () => {
      it('positions a popper on the body correctly', (done) => {
        const reference = appendNewRef(1);
        const popper = appendNewPopper(2);

        new Popper(reference, popper, {
          modifiers: {
            computeStyle: {
              x: 'top',
              y: 'left',
            },
          },
          onCreate(data) {
            const popRect = getRect(popper);
            const refRect = getRect(reference);
            expect(popRect.top - arrowSize).toBeApprox(refRect.bottom);
            expect(popRect.left).toBeApprox(5);
            data.instance.destroy();
            done();
          },
        });
      });

      it('positions a popper on a scrolled body correctly', (done) => {
        jasmineWrapper.style.height = '500vh';
        jasmineWrapper.style.width = '500vw';

        const reference = appendNewRef(1);
        const popper = appendNewPopper(2);

        new Popper(reference, popper, {
          modifiers: {
            computeStyle: {
              x: 'top',
              y: 'left',
            },
          },
          onCreate(data) {
            const popRect = getRect(popper);
            const refRect = getRect(reference);
            expect(popRect.top - arrowSize).toBeApprox(refRect.bottom);
            expect(popRect.left).toBeApprox(5);
            jasmineWrapper.style.cssText = null;
            data.instance.destroy();
            done();
          },
        });
      });
    });
  });
});
