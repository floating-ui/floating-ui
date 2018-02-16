import Popper from '../../src/index.js';
import makePopperFactory from '../utils/makePopperFactory';
import makeConnectedElement from '@popperjs/test-utils/utils/makeConnectedElement';
import makeConnectedScrollElement from '@popperjs/test-utils/utils/makeConnectedScrollElement';
import makeElement from '@popperjs/test-utils/utils/makeElement';
import '@popperjs/test-utils/setup';

[true, false].forEach((positionFixed) => {

  describe('[lifecycle]' + (positionFixed ? ' Fixed' : ''), () => {

    beforeEach(function(){
      Popper.Defaults.positionFixed = positionFixed;
    });

    const makePopper = makePopperFactory();

    describe('on creation', () => {
      it('adds a resize event listener', () => {
        spyOn(window, 'addEventListener');

        const { state } = makePopper(
          makeConnectedElement(),
          makeConnectedElement()
        );

        expect(window.addEventListener.calls.argsFor(0)).toEqual([
          'resize',
          state.updateBound,
          { passive: true },
        ]);
      });

      it('adds a scroll event listener to window when boundariesElement is viewport', () => {
        spyOn(window, 'addEventListener');

        const {
          state,
        } = makePopper(makeConnectedElement(), makeConnectedElement(), {
          boundariesElement: 'viewport',
        });

        expect(window.addEventListener.calls.argsFor(1)).toEqual([
          'scroll',
          state.updateBound,
          { passive: true },
        ]);
      });

      it('adds a scroll event listener to the closest scroll ancestor of reference when boundariesElement is an element', () => {
        const boundariesElement = makeConnectedElement();
        const scrollAncestor = document.createElement('div');
        const reference = document.createElement('div');
        const popper = document.createElement('div');

        boundariesElement.appendChild(scrollAncestor);
        scrollAncestor.appendChild(reference);
        scrollAncestor.appendChild(popper);

        scrollAncestor.style.overflow = 'scroll';

        spyOn(scrollAncestor, 'addEventListener');
        const { state } = makePopper(reference, popper, {
          boundariesElement: boundariesElement,
        });

        expect(scrollAncestor.addEventListener.calls.allArgs()).toEqual([
          ['scroll', state.updateBound, { passive: true }],
        ]);
      });

      it('should not add resize/scroll event if eventsEnabled option is set to false', () => {
        const {
          state,
        } = makePopper(makeConnectedElement(), makeConnectedElement(), {
          eventsEnabled: false,
        });

        expect(state.eventsEnabled).toBe(false);
        expect(state.updateBound).toBeUndefined();
        expect(state.scrollElement).toBeUndefined();
      });
    });

    describe('on update', () => {
      it('should call update callback', done => {
        const popperElement = makeConnectedElement();

        let isOnCreateCalled = false;

        new Popper(makeConnectedElement(), popperElement, {
          onCreate: data => {
            isOnCreateCalled = true;
            data.instance.scheduleUpdate();
          },
          onUpdate: () => {
            // makes sure it's executed after `onCreate`
            expect(isOnCreateCalled).toBe(true);
            // makes sure it's executed
            done();
          },
        });
      });
    });

    describe('on destroy', () => {

      const mockStyles = {
        top: '100px',
        left: '100px',
        right: '100px',
        bottom: '100px',
        position: 'absolute',
        transform: 'translate3d(100px, 100px, 0)',
        willChange: 'transform',
      }

      it('removes the resize event listener from window', () => {
        spyOn(window, 'removeEventListener');

        const instance = new Popper(
          makeConnectedElement(),
          makeConnectedElement()
        );
        const { updateBound } = instance.state;
        instance.destroy();

        expect(window.removeEventListener.calls.argsFor(0)).toEqual([
          'resize',
          updateBound,
        ]);
      });

      it('removes the scroll event listener from window', () => {
        spyOn(window, 'removeEventListener');

        const instance = new Popper(
          makeConnectedElement(),
          makeConnectedElement()
        );
        const { updateBound } = instance.state;
        instance.destroy();

        expect(window.removeEventListener.calls.argsFor(1)).toEqual([
          'scroll',
          updateBound,
        ]);
      });

      it('should clean up the popper element\'s styles if modifiers.applyStyle is enabled', () => {
        const popperElement = makeConnectedElement();

        for (const key in mockStyles) {
          if (mockStyles.hasOwnProperty(key)) {
            popperElement.style[key] = mockStyles[key];
          }
        }

        const instance = new Popper(makeConnectedElement(), popperElement, {
          modifiers: { applyStyle: { enabled: true } },
        });

        instance.destroy();

        for (const key in mockStyles) {
          if (mockStyles.hasOwnProperty(key)) {
            expect(popperElement.style[key]).toBe('');
          }
        }
      });

      it('should not modify the popper element\'s styles if modifiers.applyStyle is disabled', () => {
        const popperElement = makeConnectedElement();

        for (const key in mockStyles) {
          if (mockStyles.hasOwnProperty(key)) {
            popperElement.style[key] = mockStyles[key];
          }
        }

        const instance = new Popper(makeConnectedElement(), popperElement, {
          modifiers: { applyStyle: { enabled: false } },
        });

        instance.destroy();

        for (const key in mockStyles) {
          if (mockStyles.hasOwnProperty(key)) {
            expect(popperElement.style[key]).not.toBe('');
          }
        }
      });

      it('should not call update after destroy', () => {
        let isUpdateCalled = false;

        const popperElement = makeConnectedElement();

        const instance = new Popper(makeConnectedElement(), popperElement, {
          onUpdate: () => {
            isUpdateCalled = true;
          },
        });
        instance.update();
        instance.destroy();
        expect(isUpdateCalled).toBe(false);
      });

      describe('when boundariesElement is not `window` and the scroll parent is not `window`', () => {
        it('removes the scroll event listener from the scroll parent', () => {
          const boundariesElement = makeConnectedScrollElement();
          const reference = boundariesElement.appendChild(makeElement());
          const popper = boundariesElement.appendChild(makeElement());

          spyOn(boundariesElement, 'removeEventListener');

          const instance = new Popper(reference, popper, {
            boundariesElement: boundariesElement,
          });
          const { updateBound } = instance.state;
          instance.destroy();

          expect(boundariesElement.removeEventListener.calls.allArgs()).toEqual([
            ['scroll', updateBound],
          ]);
        });

        describe('when the reference is disconnected from the DOM', () => {
          it('removes the scroll event listener from the scroll parent when the reference is disconnected from the DOM', () => {
            const boundariesElement = makeConnectedScrollElement();
            const reference = boundariesElement.appendChild(makeElement());
            const popper = boundariesElement.appendChild(makeElement());

            spyOn(boundariesElement, 'removeEventListener');

            const instance = new Popper(reference, popper, {
              boundariesElement: boundariesElement,
            });
            const { updateBound } = instance.state;

            boundariesElement.removeChild(reference);
            instance.destroy();

            expect(
              boundariesElement.removeEventListener.calls.allArgs()
            ).toEqual([['scroll', updateBound]]);
          });
        });
      });
    });

    describe('methods: enableEventListeners/disableEventListeners', () => {
      it('enableEventListeners', () => {
        spyOn(window, 'addEventListener');
        const instance = makePopper(
          makeConnectedElement(),
          makeConnectedElement(),
          { eventsEnabled: false }
        );

        instance.enableEventListeners();
        expect(window.addEventListener.calls.count()).toEqual(2);
        expect(window.addEventListener.calls.argsFor(0)).toEqual([
          'resize',
          instance.state.updateBound,
          { passive: true },
        ]);
        expect(window.addEventListener.calls.argsFor(1)).toEqual([
          'scroll',
          instance.state.updateBound,
          { passive: true },
        ]);
        expect(instance.state.eventsEnabled).toBe(true);
      });

      it('disableEventListeners', () => {
        spyOn(window, 'removeEventListener');
        const instance = makePopper(
          makeConnectedElement(),
          makeConnectedElement()
        );
        const { updateBound } = instance.state;

        instance.disableEventListeners();
        expect(window.removeEventListener.calls.argsFor(0)).toEqual([
          'resize',
          updateBound,
        ]);
        expect(window.removeEventListener.calls.argsFor(1)).toEqual([
          'scroll',
          updateBound,
        ]);
        expect(instance.state.eventsEnabled).toBe(false);
        expect(instance.state.updateBound).toBe(null);
        expect(instance.state.scrollElement).toBe(null);
      });
    });
  });
});
