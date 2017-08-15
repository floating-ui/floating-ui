import Popper from '../../src/index.js';

import '@popperjs/test-utils';
const jasmineWrapper = document.getElementById('jasmineWrapper');

// Utils
import getRect from '../utils/getRect';

describe('[core]', () => {
  afterEach(function() {
    jasmineWrapper.scrollTop = 0;
    jasmineWrapper.scrollLeft = 0;
  });

  it('arrowStyles gets defined', done => {
    jasmineWrapper.innerHTML = `
      <style>
        table {
          margin-top: 60px;
        }
        #reference {
          background: orange;
          width: 60px;
          height: 60px;
          margin-left: 60px;
        }
        #popper {
          background: green;
          width: 60px;
          height: 60px;
          margin: 20px;
          box-shadow: 0 0 0 20px rgba(0, 128, 0, .2);
        }
        [x-arrow] {
          position: absolute;
          border-bottom: 8px solid green;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          top: -8px;
        }
      </style>
      <div id="reference">
        ref
      </div>
      <div id="popper">
        <div x-arrow id="arrow"></div>
        pop
      </div>
    `;

    const reference = document.getElementById('reference');
    const popper = document.getElementById('popper');

    new Popper(reference, popper, { placement: 'bottom', onCreate(data) {
        expect(data.arrowStyles.left).toBeApprox(getRect(popper).width / 2 - 8);
        expect(data.arrowStyles.top).toBe('');
        data.instance.destroy();
        done();
      } });
  });

  it('arrow addresses popper margin', done => {
    jasmineWrapper.innerHTML = `
      <style>
        table {
          margin-top: 60px;
        }
        #reference {
          background: orange;
          width: 60px;
          height: 60px;
          margin-left: 60px;
        }
        #popper {
          background: green;
          width: 60px;
          height: 60px;
          margin: 20px;
          box-shadow: 0 0 0 20px rgba(0, 128, 0, .2);
        }
        [x-arrow] {
          position: absolute;
          border-bottom: 8px solid green;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          top: -8px;
        }
      </style>
      <div id="reference">
        ref
      </div>
      <div id="popper">
        <div x-arrow id="arrow"></div>
        pop
      </div>
    `;

    const reference = document.getElementById('reference');
    const popper = document.getElementById('popper');
    const arrow = document.getElementById('arrow');

    new Popper(reference, popper, {
      placement: 'bottom',
      onCreate(data) {
        expect(getRect(arrow).left + getRect(arrow).width / 2).toBeApprox(getRect(popper).left + getRect(popper).width / 2);
        data.instance.destroy();
        done();
      },
    });
  });
});
