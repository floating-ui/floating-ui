import Tooltip from 'src/tooltip/index.js';
import '../setup.js';
import then from '../utils/then.js';
import '../utils/customEventPolyfill.js';

const jasmineWrapper = document.getElementById('jasmineWrapper');

let reference;
let instance;
function createReference() {
  reference = document.createElement('div');
  reference.style.width = '100px';
  reference.style.height = '100px';
  reference.style.margin = '100px';
  reference.innerText = 'reference';
  jasmineWrapper.appendChild(reference);
}

describe('[tooltip.js]', () => {
  describe('manual', () => {
    beforeEach(() => {
      createReference();
    });

    it('should show tooltip', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
      });

      instance.show();

      then(() => {
        expect(document.querySelector('.tooltip')).not.toBeNull();
        done();
      });
    });

    it('should hide tooltip', done => {
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

    it('should toggle (show) tooltip', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
      });

      instance.toggle();

      then(() => {
        expect(document.querySelector('.tooltip')).not.toBeNull();
        done();
      });
    });

    it('should toggle (hide) tooltip', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
      });

      instance.show();
      then(() => instance.toggle());

      then(() => {
        expect(document.querySelector('.tooltip').style.display).toBe('none');
        done();
      });
    });

    it('should show, hide and show again a tooltip', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
      });

      instance.show();
      then(() => instance.hide());
      then(() => instance.show());

      then(() => {
        expect(document.querySelector('.tooltip')).not.toBeNull();
        done();
      });
    });

    it('should dispose tooltip', done => {
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

  describe('container', () => {
    beforeEach(() => {
      createReference();
    });

    it('should show tooltip as child of body', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
        container: 'body',
      });

      instance.show();

      then(() => {
        expect(document.querySelector('.tooltip').parentNode).toBe(
          document.body
        );
        instance.dispose();
        done();
      });
    });
  });

  describe('content', () => {
    beforeEach(() => {
      createReference();
    });

    it('should show text tooltip', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
      });

      instance.show();

      then(() => {
        expect(
          document.querySelector('.tooltip .tooltip-inner').textContent
        ).toBe('foobar');
        done();
      });
    });

    it('should show HTML tooltip', done => {
      instance = new Tooltip(reference, {
        title: '<strong>foobar</strong>',
        html: true,
      });

      instance.show();

      then(() => {
        expect(
          document.querySelector('.tooltip .tooltip-inner').innerHTML
        ).toBe('<strong>foobar</strong>');
        done();
      });
    });

    it('should show stripped out HTML tooltip', done => {
      instance = new Tooltip(reference, {
        title: '<strong>foobar</strong>',
        html: true,
      });

      instance.show();

      then(() => {
        expect(
          document.querySelector('.tooltip .tooltip-inner').textContent
        ).toBe('foobar');
        done();
      });
    });

    it('should use a DOM node as tooltip content', done => {
      const content = document.createElement('div');
      content.innerText = 'foobar';
      instance = new Tooltip(reference, {
        title: content,
        html: true,
      });

      instance.show();

      then(() => {
        expect(
          document.querySelector('.tooltip .tooltip-inner').innerHTML
        ).toBe('<div>foobar</div>');
        done();
      });
    });

    it('should use a function result as tooltip content', done => {
      instance = new Tooltip(reference, {
        title: () => 'foobar',
      });

      instance.show();

      then(() => {
        expect(
          document.querySelector('.tooltip .tooltip-inner').textContent
        ).toBe('foobar');
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

    it('should show a tooltip when hovered', done => {
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

    it('should hide a tooltip on reference mouseleave', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
        trigger: 'hover',
      });

      expect(document.querySelector('.tooltip')).toBeNull();

      reference.dispatchEvent(new CustomEvent('mouseenter'));
      then(() => reference.dispatchEvent(new CustomEvent('mouseleave')), 200);
      then(() => {
        expect(document.querySelector('.tooltip').style.display).toBe('none');
        done();
      }, 200);
    });

    it('should hide a tooltip on tooltip mouseleave', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
        trigger: 'hover',
      });

      expect(document.querySelector('.tooltip')).toBeNull();

      reference.dispatchEvent(new CustomEvent('mouseenter'));
      then(() => reference.dispatchEvent(new CustomEvent('mouseleave')));
      then(() =>
        document
          .querySelector('.tooltip')
          .dispatchEvent(new CustomEvent('mouseenter'))
      );
      then(() =>
        document
          .querySelector('.tooltip')
          .dispatchEvent(new CustomEvent('mouseleave'))
      );
      then(() => {
        expect(document.querySelector('.tooltip').style.display).toBe('none');
        done();
      }, 200);
    });

    it('should not hide a tooltip if user mouseenter tooltip and then mouseenter reference element again', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
        trigger: 'hover',
      });

      expect(document.querySelector('.tooltip')).toBeNull();

      reference.dispatchEvent(new CustomEvent('mouseenter'));
      then(() => reference.dispatchEvent(new CustomEvent('mouseleave')));
      then(() =>
        document
          .querySelector('.tooltip')
          .dispatchEvent(new CustomEvent('mouseenter'))
      );
      then(() =>
        document
          .querySelector('.tooltip')
          .dispatchEvent(new CustomEvent('mouseleave'))
      );
      then(() => reference.dispatchEvent(new CustomEvent('mouseenter')));
      then(() => {
        expect(document.querySelector('.tooltip').style.display).toBe('');
        done();
      }, 200);
    });

    it('should show a tooltip on click', done => {
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

    it('should hide a tooltip on click while open', done => {
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
