import Tooltip from '../../src/index.js';
import '@popperjs/test-utils';
import then from '@popperjs/test-utils/utils/then.js';
import '@popperjs/test-utils/utils/customEventPolyfill.js';

const jasmineWrapper = document.getElementById('jasmineWrapper');
const isIE10 = navigator.appVersion.indexOf('MSIE 10') !== -1;

let reference;
let instance;
function createReference() {
  reference = document.createElement('div');
  reference.style.width = '100px';
  reference.style.height = '100px';
  reference.style.margin = '100px';
  reference.textContent = 'reference';
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
        expect(document.querySelector('.tooltip').style.visibility).toBe('hidden');
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
        expect(document.querySelector('.tooltip').style.visibility).toBe('hidden');
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
      });

      then(() => {
        reference.click();
      });

      then(() => {
        expect(document.querySelector('.tooltip')).toBeNull();
        done();
      });
    });

    it('should dispose tooltip despite never being shown', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
      });

      instance.dispose();

      then(() => {
        expect(document.querySelector('.tooltip')).toBeNull();
      });

      then(() => {
        reference.dispatchEvent(new CustomEvent('mouseenter'));
      });

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
      content.textContent = 'foobar';
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

    it('should use a document fragment as tooltip content', done => {
      const content = document.createDocumentFragment();
      const inner = document.createElement('div');
      inner.textContent = 'test';
      content.appendChild(inner);
      instance = new Tooltip(reference, {
        title: content,
        html: true,
      });

      instance.show();

      then(() => {
        expect(
          document.querySelector('.tooltip .tooltip-inner').innerHTML
        ).toBe('<div>test</div>');
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

    it('should use a custom template with empty leading&trailing spaces', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
        template: `
          <div class="tooltip" role="tooltip">
            <div class="tooltip-arrow"></div>
            <div class="foobar"><div class="tooltip-inner"></div></div>
          </div>
        `,
      });

      instance.show();

      then(() => {
        expect(document.querySelector('.tooltip .foobar').textContent).toBe(
          'foobar'
        );
        done();
      });
    });

    it('should update title content with String', done => {
      const updatedContent = 'Updated string';
      instance = new Tooltip(reference, {
        title: 'Constructor message',
      });

      instance.show();

      instance.updateTitleContent(updatedContent);

      then(() => {
        expect(
          document.querySelector('.tooltip .tooltip-inner').textContent
        ).toBe(updatedContent);
        done();
      });
    });

    it('should update title content with HTMLElement', done => {
      const updatedContent = 'Updated with div element';
      const el = document.createElement('div');
      el.textContent = updatedContent;
      instance = new Tooltip(reference, {
        title: 'Constructor message',
        html: true,
      });

      instance.show();

      instance.updateTitleContent(el);

      then(() => {
        expect(document.querySelector('.tooltip-inner').innerHTML).toBe(
          el.outerHTML
        );
        done();
      });
    });

    it('should update the tooltip position when changing the title', done => {
      // Unreliable on IE...
      if (isIE10) {
        pending();
      }
      const updatedContent = 'Updated string with a different length';
      instance = new Tooltip(reference, {
        title: 'Constructor message',
      });

      instance.show();

      const oldPosition = document
        .querySelector('.tooltip .tooltip-inner')
        .getBoundingClientRect().left;

      instance.updateTitleContent(updatedContent);

      then(() => {
        expect(
          document
            .querySelector('.tooltip .tooltip-inner')
            .getBoundingClientRect().left
        ).not.toBe(oldPosition);
        done();
      }, 500);
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
        expect(document.querySelector('.tooltip').style.visibility).toBe('hidden');
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
        expect(document.querySelector('.tooltip').style.visibility).toBe('hidden');
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
        expect(document.querySelector('.tooltip').style.visibility).toBe('visible');
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

    it('should not show tooltip if mouse leaves reference before tooltip is shown', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
        trigger: 'hover',
        delay: { show: 1000, hide: 0 },
      });

      expect(document.querySelector('.tooltip')).toBeNull();

      reference.dispatchEvent(new CustomEvent('mouseenter'));
      reference.dispatchEvent(new CustomEvent('mouseleave'));

      then(() => {
        expect(document.querySelector('.tooltip')).toBeNull();
        done();
      });
    });

    it('should not flash the tooltip if mouse leaves reference before tooltip is shown', done => {
      const delay = 500;
      const hoverTime = 200;

      instance = new Tooltip(reference, {
        title: 'foobar',
        trigger: 'hover',
        delay,
      });

      spyOn(instance, '_show');
      
      expect(document.querySelector('.tooltip')).toBeNull();

      then(() => reference.dispatchEvent(new CustomEvent('mouseenter')), hoverTime);
      then(() => reference.dispatchEvent(new CustomEvent('mouseleave')), delay * 2);
      
      then(() => {
        expect(instance._show).not.toHaveBeenCalled();
        done()
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
        expect(document.querySelector('.tooltip').style.visibility).toBe('hidden');
        done();
      });
    });
  });

  describe('options', () => {
    beforeEach(() => {
      createReference();
    });

    it('should proxy the `options.offset` value to the Popper.js instance', done => {
      instance = new Tooltip(reference, {
        title: 'test',
        offset: 10,
      }).show();
      expect(instance._popperOptions.modifiers.offset.offset).toBe(10);
      done();
    });

    it('should hide on click outside with `options.closeOnClickOutside`', done => {
      instance = new Tooltip(reference, {
        title: 'foobar',
        trigger: 'click',
        closeOnClickOutside: true,
      });
      reference.dispatchEvent(new CustomEvent('click'));
      then(() => expect(document.querySelector('.tooltip')).not.toBeNull());
      then(() => document.body.dispatchEvent(new CustomEvent('mousedown')));
      then(() => expect(document.querySelector('.tooltip').style.visibility).toBe('hidden'));
      then(done);
    });

    it('should proxy the arrow modifier to the Popper.js instance', done => {
      instance = new Tooltip(reference, {
        title: 'test',
        popperOptions: {
          modifiers: {
            arrow: {
              enabled: false,
            },
          },
        },
      }).show();
      expect(instance._popperOptions.modifiers.arrow.enabled).toBe(false);
      done();
    });

    it('should proxy the offset modifier to the Popper.js instance', done => {
      instance = new Tooltip(reference, {
        title: 'test',
        popperOptions: {
          modifiers: {
            offset: {
              enabled: false,
            },
          },
        },
      }).show();
      expect(instance._popperOptions.modifiers.offset.enabled).toBe(false);
      done();
    });
  });
});
