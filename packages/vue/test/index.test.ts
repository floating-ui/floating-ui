import {cleanup, fireEvent, render, waitFor} from '@testing-library/vue';
import {vi} from 'vitest';
import {defineComponent, effectScope, ref, toRef} from 'vue';

import {arrow, offset, useFloating} from '../src';
import type {
  FloatingElement,
  Middleware,
  Placement,
  ReferenceElement,
  Strategy,
} from '../src/types';
import type {ArrowOptions, UseFloatingOptions} from '../src/types';

describe('useFloating', () => {
  function setup(options?: UseFloatingOptions) {
    const reference = ref<ReferenceElement | null>(null);
    const floating = ref<FloatingElement | null>(null);
    const position = useFloating(reference, floating, options);

    return {reference, floating, ...position};
  }

  test('updates floating coords on placement change', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['placement'],
      setup(props: {placement?: Placement}) {
        return setup({
          placement: toRef(props, 'placement'),
          middleware: [offset(5)],
        });
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="x">{{x}}</div>
        <div data-testid="y">{{y}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {placement: 'bottom'},
    });

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('0');
      expect(getByTestId('y').textContent).toBe('5');
    });

    await rerender({placement: 'right'});

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('5');
      expect(getByTestId('y').textContent).toBe('0');
    });
  });

  test('updates floating coords on middleware change', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['middleware'],
      setup(props: {middleware?: Middleware[]}) {
        return setup({middleware: toRef(props, 'middleware')});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="x">{{x}}</div>
        <div data-testid="y">{{y}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {middleware: []},
    });

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('0');
      expect(getByTestId('y').textContent).toBe('0');
    });

    await rerender({middleware: [offset(10)]});

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('0');
      expect(getByTestId('y').textContent).toBe('10');
    });
  });

  test('updates floating position on strategy change', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['strategy'],
      setup(props: {strategy?: Strategy}) {
        return setup({strategy: toRef(props, 'strategy')});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="position">{{strategy}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {strategy: 'absolute'},
    });

    await waitFor(() => {
      expect(getByTestId('position').textContent).toBe('absolute');
    });

    await rerender({strategy: 'fixed'});

    await waitFor(() => {
      expect(getByTestId('position').textContent).toBe('fixed');
    });
  });

  test('updates `isPositioned` when position is computed', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        return setup();
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="isPositioned">{{isPositioned}}</div>
      `,
    });

    const {getByTestId} = render(App);

    await waitFor(() => {
      expect(getByTestId('isPositioned').textContent).toBe('false');
    });

    await waitFor(() => {
      expect(getByTestId('isPositioned').textContent).toBe('true');
    });
  });

  test('updates floating coords when placement is a getter function', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['placement'],
      setup(props: {placement?: Placement}) {
        return setup({
          placement: () => props.placement,
          middleware: [offset(5)],
        });
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="x">{{x}}</div>
        <div data-testid="y">{{y}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {placement: 'bottom'},
    });

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('0');
      expect(getByTestId('y').textContent).toBe('5');
    });

    await rerender({placement: 'right'});

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('5');
      expect(getByTestId('y').textContent).toBe('0');
    });
  });

  test('updates floating coords when middleware is a getter function', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['middleware'],
      setup(props) {
        return setup({middleware: () => props.middleware});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="x">{{x}}</div>
        <div data-testid="y">{{y}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {middleware: []},
    });

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('0');
      expect(getByTestId('y').textContent).toBe('0');
    });

    await rerender({middleware: [offset(10)]});

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('0');
      expect(getByTestId('y').textContent).toBe('10');
    });
  });

  test('updates floating position when strategy is a getter function', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['strategy'],
      setup(props: {strategy?: Strategy}) {
        return setup({strategy: () => props.strategy});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="position">{{strategy}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {strategy: 'absolute'},
    });

    await waitFor(() => {
      expect(getByTestId('position').textContent).toBe('absolute');
    });

    await rerender({strategy: 'fixed'});

    await waitFor(() => {
      expect(getByTestId('position').textContent).toBe('fixed');
    });
  });

  test('updates `isPositioned` on open change', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['open'],
      setup(props: {open?: boolean}) {
        return setup({open: toRef(props, 'open')});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="isPositioned">{{isPositioned}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {open: false},
    });

    await waitFor(() => {
      expect(getByTestId('isPositioned').textContent).toBe('false');
    });

    await rerender({open: true});

    await waitFor(() => {
      expect(getByTestId('isPositioned').textContent).toBe('true');
    });
  });

  test('resets `isPositioned` on open change', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['open'],
      setup(props: {open?: boolean}) {
        return setup({open: toRef(props, 'open')});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="isPositioned">{{isPositioned}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {open: true},
    });

    await waitFor(() => {
      expect(getByTestId('isPositioned').textContent).toBe('true');
    });

    await rerender({open: false});

    await waitFor(() => {
      expect(getByTestId('isPositioned').textContent).toBe('false');
    });
  });

  test('resets `isPositioned` on open change and open is a getter function', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['open'],
      setup(props: {open?: boolean}) {
        return setup({open: () => props.open});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="isPositioned">{{isPositioned}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {open: true},
    });

    await waitFor(() => {
      expect(getByTestId('isPositioned').textContent).toBe('true');
    });

    await rerender({open: false});

    await waitFor(() => {
      expect(getByTestId('isPositioned').textContent).toBe('false');
    });
  });

  test('does not set `isPositioned` to true when open is false', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['open', 'strategy'],
      setup(props: {open?: boolean; strategy?: Strategy}) {
        return setup({
          open: toRef(props, 'open'),
          strategy: toRef(props, 'strategy'),
        });
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="position">{{strategy}}</div>
        <div data-testid="isPositioned">{{isPositioned}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {open: false, strategy: 'absolute'},
    });

    await waitFor(() => {
      expect(getByTestId('position').textContent).toBe('absolute');
      expect(getByTestId('isPositioned').textContent).toBe('false');
    });

    await rerender({strategy: 'fixed'});

    await waitFor(() => {
      expect(getByTestId('position').textContent).toBe('fixed');
      expect(getByTestId('isPositioned').textContent).toBe('false');
    });
  });

  test('fallbacks to default when placement becomes undefined', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['placement'],
      setup(props: {placement?: Placement}) {
        return setup({placement: toRef(props, 'placement')});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="placement">{{placement}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {placement: 'right'},
    });

    await waitFor(() => {
      expect(getByTestId('placement').textContent).toBe('right');
    });

    await rerender({placement: undefined});

    await waitFor(() => {
      expect(getByTestId('placement').textContent).toBe('bottom');
    });
  });

  test('fallbacks to default when strategy becomes undefined', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['strategy'],
      setup(props: {strategy?: Strategy}) {
        return setup({strategy: toRef(props, 'strategy')});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="strategy">{{strategy}}</div>
      `,
    });

    const {rerender, getByTestId} = render(App, {
      props: {strategy: 'fixed'},
    });

    await waitFor(() => {
      expect(getByTestId('strategy').textContent).toBe('fixed');
    });

    await rerender({strategy: undefined});

    await waitFor(() => {
      expect(getByTestId('strategy').textContent).toBe('absolute');
    });
  });

  test('calls `whileElementsMounted` callback when reference and floating are mounted', async () => {
    const whileElementsMounted = vi.fn();
    const App = defineComponent({
      name: 'App',
      setup() {
        return setup({whileElementsMounted});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
      `,
    });

    render(App);

    expect(whileElementsMounted).toHaveBeenCalledTimes(1);

    const [reference, floating, update] = whileElementsMounted.mock.calls[0];

    expect(reference).toBeInstanceOf(HTMLElement);
    expect(floating).toBeInstanceOf(HTMLElement);
    expect(typeof update).toBe('function');
  });

  test('does not call `whileElementsMounted` callback on reference change', async () => {
    const whileElementsMounted = vi.fn();
    const App = defineComponent({
      name: 'App',
      props: ['content'],
      setup() {
        return setup({whileElementsMounted});
      },
      template: /* HTML */ `
        <div ref="reference">{{content}}</div>
        <div ref="floating" />
      `,
    });

    const {rerender} = render(App, {props: {content: 'A'}});

    await rerender({content: 'B'});

    expect(whileElementsMounted).toHaveBeenCalledTimes(1);
  });

  test('does not call `whileElementsMounted` callback on floating change', async () => {
    const whileElementsMounted = vi.fn();
    const App = defineComponent({
      name: 'App',
      props: ['content'],
      setup() {
        return setup({whileElementsMounted});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating">{{content}}</div>
      `,
    });

    const {rerender} = render(App, {props: {content: 'A'}});

    await rerender({content: 'B'});

    expect(whileElementsMounted).toHaveBeenCalledTimes(1);
  });

  test('calls `whileElementsMounted` cleanup callback on reference visibility change', async () => {
    const whileElementsMountedCleanup = vi.fn();
    const App = defineComponent({
      name: 'App',
      props: ['visible'],
      setup() {
        return setup({
          whileElementsMounted() {
            return whileElementsMountedCleanup;
          },
        });
      },
      template: /* HTML */ `
        <div v-if="visible" ref="reference" />
        <div ref="floating" />
      `,
    });

    const {rerender} = render(App, {props: {visible: true}});

    await rerender({visible: false});

    expect(whileElementsMountedCleanup).toHaveBeenCalledTimes(1);
  });

  test('calls `whileElementsMounted` cleanup callback on floating visibility change', async () => {
    const whileElementsMountedCleanup = vi.fn();
    const App = defineComponent({
      name: 'App',
      props: ['visible'],
      setup() {
        return setup({
          whileElementsMounted() {
            return whileElementsMountedCleanup;
          },
        });
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div v-if="visible" ref="floating" />
      `,
    });

    const {rerender} = render(App, {props: {visible: true}});

    await rerender({visible: false});

    expect(whileElementsMountedCleanup).toHaveBeenCalledTimes(1);
  });

  test('calls `whileElementsMounted` cleanup callback on unmount', async () => {
    const whileElementsMountedCleanup = vi.fn();
    const App = defineComponent({
      name: 'App',
      setup() {
        return setup({
          whileElementsMounted() {
            return whileElementsMountedCleanup;
          },
        });
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
      `,
    });

    render(App);
    cleanup();

    expect(whileElementsMountedCleanup).toHaveBeenCalledTimes(1);
  });

  test('calls `whileElementsMounted` cleanup callback on scope dispose', async () => {
    const whileElementsMountedCleanup = vi.fn();
    const scope = effectScope();
    const App = defineComponent({
      name: 'App',
      setup() {
        return scope.run(() =>
          setup({
            whileElementsMounted() {
              return whileElementsMountedCleanup;
            },
          }),
        );
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
      `,
    });

    render(App);
    scope.stop();

    expect(whileElementsMountedCleanup).toHaveBeenCalledTimes(1);
  });

  test('does not call `whileElementsMounted` cleanup callback on reference change', async () => {
    const whileElementsMountedCleanup = vi.fn();
    const App = defineComponent({
      name: 'App',
      props: ['content'],
      setup() {
        return setup({
          whileElementsMounted() {
            return whileElementsMountedCleanup;
          },
        });
      },
      template: /* HTML */ `
        <div ref="reference">{{content}}</div>
        <div ref="floating" />
      `,
    });

    const {rerender} = render(App, {props: {content: 'A'}});

    await rerender({content: 'B'});

    expect(whileElementsMountedCleanup).not.toBeCalled();
  });

  test('does not call `whileElementsMounted` cleanup callback on floating change', async () => {
    const whileElementsMountedCleanup = vi.fn();
    const App = defineComponent({
      name: 'App',
      props: ['content'],
      setup() {
        return setup({
          whileElementsMounted() {
            return whileElementsMountedCleanup;
          },
        });
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating">{{content}}</div>
      `,
    });

    const {rerender} = render(App, {props: {content: 'A'}});

    await rerender({content: 'B'});

    expect(whileElementsMountedCleanup).not.toBeCalled();
  });

  test('assigns `middlewareData` without infinite loop', async () => {
    const App = defineComponent({
      name: 'App',
      props: ['middleware'],
      setup(props: {middleware?: Middleware[]}) {
        return setup({middleware: toRef(props, 'middleware')});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="middleware-data-test-content">
          {{middlewareData.test?.content}}
        </div>
      `,
    });

    const {getByTestId} = render(App, {
      props: {
        middleware: [
          {
            name: 'test',
            fn() {
              return {data: {content: 'Content'}};
            },
          },
        ],
      },
    });

    await waitFor(() => {
      expect(getByTestId('middleware-data-test-content').textContent).toBe(
        'Content',
      );
    });
  });

  test('updates floating when `update` function is called', async () => {
    const data = {offset: 5};
    const App = defineComponent({
      name: 'App',
      setup() {
        return setup({middleware: [offset(() => data.offset)]});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <div data-testid="x">{{x}}</div>
        <div data-testid="y">{{y}}</div>
        <button @click="update" type="button" data-testid="update" />
      `,
    });

    const {getByTestId} = render(App);

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('0');
      expect(getByTestId('y').textContent).toBe('5');
    });

    data.offset = 10;

    await fireEvent.click(getByTestId('update'));

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('0');
      expect(getByTestId('y').textContent).toBe('10');
    });
  });

  test('allows to use with virtual reference', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const {reference, ...rest} = setup();

        reference.value = {
          getBoundingClientRect() {
            return {
              x: 8,
              y: 8,
              top: 8,
              left: 8,
              bottom: 58,
              right: 58,
              width: 50,
              height: 50,
            };
          },
        };

        return rest;
      },
      template: /* HTML */ `
        <div ref="floating" />
        <div data-testid="x">{{x}}</div>
        <div data-testid="y">{{y}}</div>
      `,
    });

    const {getByTestId} = render(App);

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('33');
      expect(getByTestId('y').textContent).toBe('58');
    });
  });

  test('allows to use with component type reference', async () => {
    const FloatingReference = defineComponent({
      name: 'FloatingReference',
      template: /* HTML */ `<div />`,
    });
    const App = defineComponent({
      name: 'App',
      components: {FloatingReference},
      setup() {
        return setup({middleware: [offset(5)]});
      },
      template: /* HTML */ `
        <FloatingReference ref="reference" />
        <div ref="floating" />
        <div data-testid="x">{{x}}</div>
        <div data-testid="y">{{y}}</div>
      `,
    });

    const {getByTestId} = render(App);

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('0');
      expect(getByTestId('y').textContent).toBe('5');
    });
  });

  test('allows to use with component type floating', async () => {
    const FloatingFloating = defineComponent({
      name: 'FloatingFloating',
      template: /* HTML */ `<div />`,
    });
    const App = defineComponent({
      name: 'App',
      components: {FloatingFloating},
      setup() {
        return setup({middleware: [offset(5)]});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <FloatingFloating ref="floating" />
        <div data-testid="x">{{x}}</div>
        <div data-testid="y">{{y}}</div>
      `,
    });

    const {getByTestId} = render(App);

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('0');
      expect(getByTestId('y').textContent).toBe('5');
    });
  });

  test('does not throw when component type reference renders nothing', () => {
    const FloatingReference = defineComponent({
      name: 'FloatingReference',
      render() {
        return null;
      },
    });
    const App = defineComponent({
      name: 'App',
      components: {FloatingReference},
      setup() {
        return setup({});
      },
      template: /* HTML */ `
        <FloatingReference ref="reference" />
        <div ref="floating" />
      `,
    });

    render(App);
  });

  test('does not throw when component type floating renders nothing', () => {
    const FloatingFloating = defineComponent({
      name: 'FloatingFloating',
      render() {
        return null;
      },
    });
    const App = defineComponent({
      name: 'App',
      components: {FloatingFloating},
      setup() {
        return setup({});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <FloatingFloating ref="floating" />
      `,
    });

    render(App);
  });

  test('does not throw when component type reference renders nothing and "$el" is null', () => {
    const FloatingReference = defineComponent({
      name: 'FloatingReference',
      setup(props, {expose}) {
        expose({$el: null});
      },
      render() {
        return null;
      },
    });
    const App = defineComponent({
      name: 'App',
      components: {FloatingReference},
      setup() {
        return setup({});
      },
      template: /* HTML */ `
        <FloatingReference ref="reference" />
        <div ref="floating" />
      `,
    });

    render(App);
  });

  test('does not throw when component type floating renders nothing and "$el" is null', () => {
    const FloatingFloating = defineComponent({
      name: 'FloatingFloating',
      setup(props, {expose}) {
        expose({$el: null});
      },
      render() {
        return null;
      },
    });
    const App = defineComponent({
      name: 'App',
      components: {FloatingFloating},
      setup() {
        return setup({});
      },
      template: /* HTML */ `
        <div ref="reference" />
        <FloatingFloating ref="floating" />
      `,
    });

    render(App);
  });
});

describe('arrow', () => {
  function setup(options?: Omit<ArrowOptions, 'element'>) {
    const reference = ref<ReferenceElement | null>(null);
    const floating = ref<FloatingElement | null>(null);
    const floatingArrow = ref<HTMLElement | null>(null);
    const position = useFloating(reference, floating, {
      middleware: [arrow({...options, element: floatingArrow})],
    });

    return {reference, floating, floatingArrow, ...position};
  }

  test('allows to use with component type arrow', async () => {
    const FloatingArrow = defineComponent({
      name: 'FloatingArrow',
      template: /* HTML */ `<div />`,
    });
    const App = defineComponent({
      name: 'App',
      components: {FloatingArrow},
      setup() {
        return setup();
      },
      template: /* HTML */ `
        <div ref="reference" />
        <div ref="floating" />
        <FloatingArrow ref="floatingArrow" />
        <div data-testid="x">{{middlewareData.arrow?.x}}</div>
        <div data-testid="y">{{middlewareData.arrow?.y}}</div>
      `,
    });

    const {getByTestId} = render(App);

    await waitFor(() => {
      expect(getByTestId('x').textContent).toBe('0');
      expect(getByTestId('y').textContent).toBe('');
    });
  });
});
