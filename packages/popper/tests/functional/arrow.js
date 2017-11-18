import Popper from '../../src/index.js';

import '@popperjs/test-utils';
const jasmineWrapper = document.getElementById('jasmineWrapper');

// Utils
import getRect from '../utils/getRect';
[true, false].forEach((positionFixed) => {
describe('[arrow core]' + (positionFixed ? ' Fixed' : ''), () => {

  beforeEach(function(){
    Popper.Defaults.positionFixed = positionFixed;
  });

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

    new Popper(reference, popper, {
      placement: 'bottom',
      onCreate(data) {
        expect(data.arrowStyles.left).toBeApprox(getRect(popper).width / 2 - 8);
        expect(data.arrowStyles.top).toBe('');
        data.instance.destroy();
        done();
      },
    });
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
        expect(getRect(arrow).left + getRect(arrow).width / 2).toBeApprox(
          getRect(popper).left + getRect(popper).width / 2
        );
        data.instance.destroy();
        done();
      },
    });
  });

  it('arrow addresses popper border width', done => {
    jasmineWrapper.innerHTML = `
      <style>
        #reference {
          background: red;
          width: 100px;
          height: 100px;
          margin-top:50px
        }

        #popper {
          background: green;
          width: 100px;
          height: 100px;
          margin-left:10px;
          border-top:20px solid black;
          border-bottom:20px solid black;
        }

        [x-arrow] {
          position:absolute;
          width:10px;
          height:10px;
          left:-10px;
          background-color:blue;

        }
      </style>
      <div id="reference" aria-describedby="pop">ref</div>
      <div id="popper" role="tooltip" class="">
        <div x-arrow id="arrow"></div>pop
      </div>
    `;

    const reference = document.getElementById('reference');
    const popper = document.getElementById('popper');
    const arrow = document.getElementById('arrow');

    new Popper(reference, popper, {
      placement: 'right',
      onCreate(data) {
        expect(getRect(arrow).top + getRect(arrow).height / 2).toBeApprox(
          getRect(popper).top + getRect(popper).height / 2
        );
        data.instance.destroy();
        done();
      },
    });
  });
});
});
