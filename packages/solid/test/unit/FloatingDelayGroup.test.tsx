import '@testing-library/jest-dom';

import {cleanup, fireEvent, render, screen} from '@solidjs/testing-library';
import {createSignal, createUniqueId, JSX, Show} from 'solid-js';
import {vi} from 'vitest';

import {
  FloatingDelayGroup,
  useDelayGroup,
  useDelayGroupContext,
  useFloating,
  useHover,
  useInteractions,
} from '../../src';

interface Props {
  label: string;
  children: JSX.Element;
}

function Tooltip(props: Props) {
  const delayContext = useDelayGroupContext();
  const id = createUniqueId();

  const [isOpen, setIsOpen] = createSignal(false);

  const position = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const hover = useHover(position.context, {delay: () => delayContext.delay});

  // const instantDuration = 0
  // const duration = 200

  // const transition = useTransitionStyles(position.context, {
  // 	duration: delayContext.isInstantPhase
  // 		? {
  // 				open: instantDuration,
  // 				// `id` is this component's `id`
  // 				// `currentId` is the current group's `id`
  // 				close: delayContext.currentId === id ? duration : instantDuration,
  // 		  }
  // 		: duration,
  // 	// ...
  // })

  // createEffect(() => console.log('delay', delayContext.delay));
  const delayGroup = useDelayGroup(position.context, {
    // Must be unique
    id: props.label,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    hover,
    delayGroup,
  ]);

  return (
    <>
      <button
        data-testid={`reference-${props.label}`}
        ref={position.context().refs.setReference}
        class="bg-sky-600 w-[200px] h-[50px] relative m-5"
        {...getReferenceProps({})}
      >
        {props.children}
      </button>

      {/* <Show when={transition.isMounted()}> */}
      <Show when={isOpen()}>
        <div
          id={props.label}
          data-testid={`floating-${props.label}`}
          ref={position.context().refs.setFloating}
          class="bg-blue-600 w-[100px] h-32 m-auto relative z-50"
          style={{
            padding: '1rem',
            ...position.floatingStyles,
            // ...transition.styles,
          }}
          {...getFloatingProps()}
        >
          {props.label}
        </div>
      </Show>
    </>
  );
}

function App() {
  return (
    <>
      <FloatingDelayGroup delay={{open: 1000, close: 200}}>
        <Tooltip label="one">
          <button data-testid="treference-one_" />
        </Tooltip>
        <Tooltip label="two">
          <button data-testid="treference-two_" />
        </Tooltip>
        <Tooltip label="three">
          <button data-testid="treference-three_" />
        </Tooltip>
      </FloatingDelayGroup>
    </>
  );
}

vi.useFakeTimers();
describe('FloatingDelayGroup Timer', async () => {
  afterEach(cleanup);
  test('groups delays correctly', async () => {
    render(() => <App />);

    fireEvent.mouseEnter(screen.getByTestId('reference-one'));
    await Promise.resolve(vi.advanceTimersByTime(1));
    expect(screen.queryByTestId('floating-one')).not.toBeInTheDocument();
    await Promise.resolve(vi.advanceTimersByTime(999));

    expect(screen.queryByTestId('floating-one')).toBeInTheDocument();

    /*
  	 Reference 2
  	*/

    fireEvent.mouseEnter(screen.getByTestId('reference-two'));
    await Promise.resolve(vi.advanceTimersByTime(1));
    expect(screen.queryByTestId('floating-one')).not.toBeInTheDocument();
    expect(screen.queryByTestId('floating-two')).toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByTestId('reference-three'));
    await Promise.resolve(vi.advanceTimersByTime(1));
    expect(screen.queryByTestId('floating-two')).not.toBeInTheDocument();
    expect(screen.queryByTestId('floating-three')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByTestId('reference-three'));
    await Promise.resolve(vi.advanceTimersByTime(1));
    expect(screen.queryByTestId('floating-three')).toBeInTheDocument();
    await Promise.resolve(vi.advanceTimersByTime(199));
    expect(screen.queryByTestId('floating-three')).not.toBeInTheDocument();
  });

  test('timeoutMs', async () => {
    cleanup();
    function App() {
      return (
        <FloatingDelayGroup delay={{open: 1000, close: 100}} timeoutMs={500}>
          <Tooltip label="one">
            <button data-testid="reference-one_" />
          </Tooltip>
          <Tooltip label="two">
            <button data-testid="reference-two_" />
          </Tooltip>
          <Tooltip label="three">
            <button data-testid="reference-three_" />
          </Tooltip>
        </FloatingDelayGroup>
      );
    }

    render(() => (
      <>
        <App />
      </>
    ));

    fireEvent.mouseEnter(screen.getByTestId('reference-one'));
    await Promise.resolve(vi.advanceTimersByTime(1000));

    fireEvent.mouseLeave(screen.getByTestId('reference-one'));
    expect(screen.queryByTestId('floating-one')).toBeInTheDocument();
    await Promise.resolve(vi.advanceTimersByTime(499));
    expect(screen.queryByTestId('floating-one')).not.toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByTestId('reference-two'));
    await Promise.resolve(vi.advanceTimersByTime(1));
    expect(screen.queryByTestId('floating-two')).toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByTestId('reference-three'));

    await Promise.resolve(vi.advanceTimersByTime(1));

    expect(screen.queryByTestId('floating-two')).not.toBeInTheDocument();
    expect(screen.queryByTestId('floating-three')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByTestId('reference-three'));

    await Promise.resolve(vi.advanceTimersByTime(1));

    expect(screen.queryByTestId('floating-three')).toBeInTheDocument();

    await Promise.resolve(vi.advanceTimersByTime(99));

    expect(screen.queryByTestId('floating-three')).not.toBeInTheDocument();
  });
});
