import {screen, within, render, waitFor} from '@testing-library/react';
import ReactDOM from 'react-dom';
import userEvent from '@testing-library/user-event';
import {ReactNode, useState} from 'react';
import {
  useFloating,
  useInteractions,
  useClick,
  FloatingFocusManager,
  FloatingTree,
  FloatingNode,
  useFloatingNodeId,
} from '../../src';
import {activeElement} from '../../src/utils/activeElement';

/**
 * Create an input field with testId inputId inside the element with testid containerId
 */
function createInputInside(container: HTMLElement, inputId: string) {
  const customElement = container.appendChild(
    document.createElement('custom-element')
  );
  const shadowRoot = customElement.attachShadow({mode: 'open'});
  const inputInsideShadowRoot = shadowRoot.appendChild(
    document.createElement('input')
  );
  inputInsideShadowRoot.dataset.testid = inputId;
  return inputInsideShadowRoot;
}

const TestComponent: React.FC<{
  children?: ReactNode;
  referenceLabel?: ReactNode;
  portalRoot?: Element;
  'data-testid'?: string;
}> = ({
  referenceLabel = 'reference',
  children,
  portalRoot,
  'data-testid': testId,
}) => {
  const [open, setOpen] = useState(false);
  const nodeId = useFloatingNodeId();
  const {context, x, y, reference, floating, strategy} = useFloating({
    open,
    nodeId,
    onOpenChange: setOpen,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context),
  ]);

  const content = open && (
    <FloatingFocusManager context={context} modal={false}>
      <div
        data-testid={testId ?? 'floating'}
        ref={floating}
        style={{
          position: strategy,
          top: y ?? '',
          left: x ?? '',
        }}
        {...getFloatingProps()}
      >
        Tooltip
        {children}
      </div>
    </FloatingFocusManager>
  );

  return (
    <>
      <button ref={reference} {...getReferenceProps()}>
        {referenceLabel}
      </button>
      <FloatingNode id={nodeId}>
        {portalRoot ? ReactDOM.createPortal(content, portalRoot) : content}
      </FloatingNode>
    </>
  );
};

function createShadowContainer() {
  const shadowContainer = document.body.appendChild(
    document.createElement('shadow-container')
  );
  const shadowRoot = shadowContainer.attachShadow({mode: 'open'});
  const container = shadowRoot.appendChild(document.createElement('div'));

  return container;
}

describe('<FloatingFocusManager />', () => {
  it('stays open if focus is moved to an element inside a shadowRoot inside a nested portaled floating element', async () => {
    const portalShadowContainer = document.body.appendChild(
      document.createElement('portal-root')
    );
    const portalShadowRoot = portalShadowContainer.attachShadow({mode: 'open'});
    const portalContainer = portalShadowRoot.appendChild(
      document.createElement('div')
    );

    // render two portaled floating elements nested in each other
    render(
      <FloatingTree>
        <TestComponent
          portalRoot={portalContainer}
          data-testid="floating1"
          referenceLabel="outer"
        >
          <input data-testid="floating1-input" />
          <TestComponent
            portalRoot={portalContainer}
            data-testid="floating2"
            referenceLabel="nested"
          >
            <input data-testid="floating2-input" />
          </TestComponent>
        </TestComponent>
      </FloatingTree>
    );

    // open first floating element
    userEvent.click(screen.getByRole('button', {name: 'outer'}));

    // wait for the first floating element to be opened and have its first element focused
    await waitFor(() => {
      expect(activeElement(document)).toBe(
        within(within(portalContainer).getByTestId('floating1')).getByTestId(
          'floating1-input'
        )
      );
    });

    // open second floating element
    const floating1 = within(portalContainer).getByTestId('floating1');
    userEvent.click(within(floating1).getByRole('button', {name: 'nested'}));

    // wait for the second floating element to be opened and have its first element focused
    await waitFor(() => {
      expect(activeElement(document)).toBe(
        within(within(portalContainer).getByTestId('floating2')).getByTestId(
          'floating2-input'
        )
      );
    });

    // create an input field inside a shadowRoot inside the second floating element
    const floating2 = within(portalContainer).getByTestId('floating2');
    const inputInsideShadowRoot = createInputInside(
      floating2,
      'floating2-shadow-dom-input'
    );
    inputInsideShadowRoot.focus();

    await waitFor(() =>
      expect(activeElement(document)).toBe(inputInsideShadowRoot)
    );
  });

  it('focuses the first element even if it is in a shadow root', async () => {
    const El = 'an-element-with-an-input' as 'div';

    customElements.define(
      'an-element-with-an-input',
      class Element extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({mode: 'open'}).appendChild(
            document.createElement('input')
          ).dataset.testid = 'input-in-shadow-dom';
        }
      }
    );

    const {container} = render(
      <TestComponent>
        <El data-tesid="shadow-dom-wrapper" />
        <input data-testid="input-inside-floating" />
      </TestComponent>
    );

    userEvent.click(within(container).getByRole('button', {name: 'reference'}));

    // TODO: This currently fails as `refs.floating.current?.querySelectorAll` in `FloatingFocusManager` does not traverse into shadow roots
    await waitFor(() => {
      expect(activeElement(document)).toBe(
        within(
          container.querySelector('an-element-with-an-input')
            ?.shadowRoot as unknown as HTMLElement
        ).getByTestId('input-in-shadow-dom')
      );
    });
  });

  [true, false].forEach((isNestedInShadowRoot) => {
    describe(
      isNestedInShadowRoot ? 'nested in shadowRoot' : 'not in shadowRoot',
      () => {
        it('stays open if focus is moved to an element inside a shadowRoot', async () => {
          const {container} = render(
            <TestComponent>
              <input data-testid="input-inside-floating" />
            </TestComponent>,
            {
              container: isNestedInShadowRoot
                ? createShadowContainer()
                : undefined,
            }
          );

          userEvent.click(
            within(container).getByRole('button', {name: 'reference'})
          );

          await waitFor(() => {
            expect(activeElement(document)).toBe(
              within(container).getByTestId('input-inside-floating')
            );
          });

          const inputInsideShadowRoot = createInputInside(
            within(container).getByTestId('floating'),
            'input-inside-floating-inside-shadow-root'
          );

          // Can not use userEvent.tab(); here as it would move focus out of the floating element as it can't deal with shadowRoot
          inputInsideShadowRoot.focus();

          // focus stays inside floating but nested in a shadowRoot, floating should stay visible
          expect(within(container).getByTestId('floating')).toBeInTheDocument();

          expect(activeElement(document)).toBe(inputInsideShadowRoot);
        });

        it('closes when focus moves outside floating', async () => {
          const {container} = render(
            <>
              <TestComponent>
                <input data-testid="input-inside-floating" />
              </TestComponent>
              <input data-testid="input-outside-floating" />
            </>,
            {
              container: isNestedInShadowRoot
                ? createShadowContainer()
                : undefined,
            }
          );

          userEvent.click(
            within(container).getByRole('button', {name: 'reference'})
          );

          await waitFor(() =>
            expect(activeElement(document)).toBe(
              within(container).getByTestId('input-inside-floating')
            )
          );

          // Can not use userEvent.tab(); here as it would move focus out of the floating element as it can't deal with shadowRoot
          within(container).getByTestId('input-outside-floating').focus();

          // focus goes outside floating, floating should be hidden
          await waitFor(() =>
            expect(
              within(container).queryByTestId('floating')
            ).not.toBeInTheDocument()
          );
        });

        it('closes when focus moves outside floating but inside shadowRoot', async () => {
          const {container} = render(
            <TestComponent>
              <input data-testid="input-inside-floating" />
            </TestComponent>,
            {
              container: isNestedInShadowRoot
                ? createShadowContainer()
                : undefined,
            }
          );

          userEvent.click(
            within(container).getByRole('button', {name: 'reference'})
          );

          await waitFor(() =>
            expect(activeElement(document)).toBe(
              within(container).getByTestId('input-inside-floating')
            )
          );

          const inputInsideShadowRoot = createInputInside(
            container,
            'input-outside-floating-inside-shadow-root'
          );

          // Can not use userEvent.tab(); here as it would move focus out of the floating element as it can't deal with shadowRoot
          inputInsideShadowRoot.focus();

          // focus goes outside floating but nested in a shadowRoot, floating should be hidden
          await waitFor(() =>
            expect(
              within(container).queryByTestId('floating')
            ).not.toBeInTheDocument()
          );
        });
      }
    );
  });
});
