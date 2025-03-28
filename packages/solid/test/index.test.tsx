import { createFloating } from '../src/hooks/createFloating';

import { createEffect, createSignal, onMount } from 'solid-js';
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
	cleanup,
	fireEvent,
	getByTestId,
	render,
	waitFor,
} from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import {
	arrow,
	flip,
	hide,
	limitShift,
	offset,
	shift,
	size,
} from '../src/index';

const user = userEvent.setup();

describe('createFloating', () => {
	afterEach(() => {
		cleanup();
	});
	it('createFloating x & y should start from 0', () => {
		const [show, setShow] = createSignal(false);
		const { x, y } = createFloating({
			isOpen: show,
			placement: 'bottom',
		});

		expect(x()).toBe(0);
		expect(y()).toBe(0);
	});

	it('createFloating x & y should not be null after hovering', async () => {
		function TestComponent() {
			const [visible, setVisible] = createSignal(false);
			const { refs, x, y } = createFloating({
				isOpen: visible,
				placement: 'bottom',
			});
			const [ref, setRef] = createSignal<HTMLDivElement | null>(null);

			return (
				<div>
					<div class="x" data-testid="x" ref={setRef}>
						{x()}
					</div>
					<div class="y" data-testid="y">
						{y()}
					</div>
					<div ref={refs.setReference} data-testid="reference">
						Reference Element
					</div>
					{visible() && <div ref={refs.setFloating}>Floating Element</div>}
				</div>
			);
		}

		const { container } = render(() => <TestComponent />);

		const element = getByTestId(container, 'reference');
		const xElement = getByTestId(container, 'x');
		const yElement = getByTestId(container, 'y');
		await user.hover(element);
		expect(xElement).not.toBe(0);
		expect(yElement).not.toBe(0);
	});
	it('createFloating should be called one time', async () => {
		const cl = vi.fn();
		function TestComponent() {
			const [visible, setVisible] = createSignal(false);
			const { refs, x, y } = createFloating({
				isOpen: visible,
				placement: 'bottom',
				whileElementsMounted: cl,
			});
			const [ref, setRef] = createSignal<HTMLDivElement | null>(null);

			return (
				<div>
					<div class="x" data-testid="x" ref={setRef}>
						{x()}
					</div>
					<div class="y" data-testid="y">
						{y()}
					</div>
					<div ref={refs.setReference} data-testid="reference">
						Reference Element
					</div>
					<div ref={refs.setFloating}>Floating Element</div>
				</div>
			);
		}

		const renderComponent = () => render(() => <TestComponent />);
		const { unmount, container } = renderComponent();

		expect(cl).toHaveBeenCalledTimes(1);
	});

	it('createFloating called one time when both elements are mounted', async () => {
		const spy = vi.fn();
		function TestComponent() {
			const [visible, setVisible] = createSignal(false);
			const { refs } = createFloating({
				isOpen: visible,
				placement: 'bottom',
				whileElementsMounted: spy,
			});

			return (
				<div>
					<div ref={refs.setReference}>Reference Element</div>
					<div ref={refs.setFloating}>Floating Element</div>
				</div>
			);
		}
		const renderx = render(() => <TestComponent />);
		expect(spy).toHaveBeenCalledOnce();
	});

	it('createFloating should be called one time after mounting conditionally', async () => {
		const cl = vi.fn();
		function TestComponent() {
			const [visible, setVisible] = createSignal(false);
			const { refs, x, y } = createFloating({
				isOpen: visible,
				placement: 'bottom',
				whileElementsMounted: cl,
			});
			const [ref, setRef] = createSignal<HTMLDivElement | null>(null);

			return (
				<div>
					<div class="x" data-testid="x" ref={setRef}>
						{x()}
					</div>
					<div class="y" data-testid="y">
						{y()}
					</div>
			
					<div
						ref={refs.setReference}
						onClick={() => setVisible((prev) => !prev)}
						data-testid="reference"
					>
						Reference Element
					</div>
					{visible() && <div ref={refs.setFloating}>Floating Element</div>}
				</div>
			);
		}

		const renderComponent = () => render(() => <TestComponent />);
		const { container } = renderComponent();
		expect(cl).toHaveBeenCalledTimes(0);
		const element = getByTestId(container, 'reference');

		await user.click(element);

		expect(cl).toHaveBeenCalledTimes(1);
	});

	it('createFloating should be called when both elements are mounted conditionally', async () => {
		const spy = vi.fn();

		function TestComponent() {
			const [visible, setVisible] = createSignal(false);
			const { refs } = createFloating({
				isOpen: visible,
				placement: 'bottom',
				whileElementsMounted: spy,
			});

			onMount(() => {
				setVisible(true);
			});

			return (
				<div>
					{visible() && <div ref={refs.setFloating}>Floating Element</div>}
					{visible() && <div ref={refs.setReference}>Reference Element</div>}
				</div>
			);
		}

		const { container } = render(() => <TestComponent />);
		expect(spy).toHaveBeenCalledOnce();
	});
	it('createFloating calls the cleanup function', async () => {
		const cleanupSpy = vi.fn();
		const spy = vi.fn(() => cleanupSpy);

		function TestComponent() {
			const [visible, setVisible] = createSignal(true);
			const { refs } = createFloating({
				isOpen: visible,
				whileElementsMounted: spy,
			});

			onMount(() => {
				setVisible(false);
			});

			return (
				<div>
					{visible() && <div ref={refs.setFloating}>Floating Element</div>}
					{visible() && <div ref={refs.setReference}>Reference Element</div>}
				</div>
			);
		}

		const { container } = render(() => <TestComponent />);
		expect(cleanupSpy).toHaveBeenCalledOnce();
		expect(spy).toHaveBeenCalledOnce();
		cleanup();
	});

	it('createFloating isPositioned', async () => {
		const spy = vi.fn();

		function TestComponent() {
			const [visible, setVisible] = createSignal(false);
			const { refs, isPositioned } = createFloating({
				isOpen: visible,
			});

			createEffect(() => {
				spy(isPositioned());
			});

			return (
				<>
					<button
						ref={refs.setReference}
						onClick={() => setVisible(!visible())}
					>
						Reference Element
					</button>
					{visible() && <div ref={refs.setFloating}>Floating Element</div>}
				</>
			);
		}
		const { getByRole } = render(() => <TestComponent />);
		const element = getByRole('button');
		fireEvent.click(element);

		expect(spy?.mock?.calls?.[0]?.[0]).toBe(false);

		await waitFor(() => {
			expect(spy?.mock?.calls?.[1]?.[0]).toBe(true);
		});
		fireEvent.click(element);

		await waitFor(() => {
			expect(spy?.mock?.calls?.[2]?.[0]).toBe(false);
		});

		fireEvent.click(element);

		await waitFor(() => {
			expect(spy?.mock?.calls?.[3]?.[0]).toBe(true);
		});

		fireEvent.click(element);

		await waitFor(() => {
			expect(spy?.mock?.calls?.[4]?.[0]).toBe(false);
		});
	});

	it('createFloating external floating elements sync', async () => {
		function TestComponent() {
			const [visible, setVisible] = createSignal(false);
			const { refs, x, y } = createFloating({
				isOpen: visible,
			});

			const [reference, setReference] = createSignal<HTMLDivElement | null>(
				null,
			);
			const [floating, setFloating] = createSignal<HTMLDivElement | null>(null);

			createEffect(() => {
				refs.setReference(reference());
			});
			createEffect(() => {
				refs.setFloating(floating());
			});

			return (
				<>
					<div ref={setReference} />
					<div ref={setFloating} />
					<div data-testid="value">{`${x()},${y()}`}</div>
				</>
			);
		}

		const { getByTestId } = render(() => <TestComponent />);

		expect(getByTestId('value').textContent).toBe('0,0');
	});

	it('createFloating external elements sync', async () => {
		function TestComponent() {
			const [referenceEl, setReferenceEl] = createSignal<
				HTMLDivElement | null | undefined
			>(null);
			const [floatingEl, setFloatingEl] = createSignal<
				HTMLDivElement | null | undefined
			>(null);
			const [visible, setVisible] = createSignal(false);
			const { x, y } = createFloating({
				isOpen: visible,
				elements: {
					floating: floatingEl,
					reference: referenceEl,
				},
			});

			return (
				<>
					<div data-testid="reference" ref={setReferenceEl} />
					<div ref={setFloatingEl} />
					<div data-testid="value">{`${x()},${y()}`}</div>
				</>
			);
		}

		const { getByTestId } = render(() => <TestComponent />);

		const mockBoundingClientRect = vi.fn(() => ({
			x: 0,
			y: 0,
			width: 50,
			height: 50,
			top: 0,
			right: 50,
			bottom: 50,
			left: 0,
			toJSON: () => {},
		}));
		const reference = getByTestId('reference');
		reference.getBoundingClientRect = mockBoundingClientRect;

		await waitFor(() => {
			expect(getByTestId('value').textContent).toBe('25,50');
		});
	});

	it('createFloating external elements sync update', async () => {
		function TestComponent() {
			const [referenceEl, setReferenceEl] = createSignal<
				HTMLDivElement | null | undefined
			>(null);
			const [floatingEl, setFloatingEl] = createSignal<
				HTMLDivElement | null | undefined
			>(null);
			const [visible] = createSignal(false);

			const { x, y } = createFloating({
				isOpen: visible,
				elements: {
					floating: floatingEl,
					reference: referenceEl,
				},
			});

			return (
				<>
					<div data-testid="reference" ref={setReferenceEl} />
					<div ref={setFloatingEl} />
					<div data-testid="value">{`${x()},${y()}`}</div>
				</>
			);
		}

		const { getByTestId } = render(() => <TestComponent />);
		await waitFor(() => {
			expect(getByTestId('value').textContent).toBe('0,0');
		});
	});

	it('createFloating floatingStyles no transform', async () => {
		function TestComponent() {
			const [visible, setVisible] = createSignal(false);
			const { refs, floatingStyles } = createFloating({
				transform: false,
				isOpen: visible,
			});

			return (
				<>
					<div data-testid="reference" ref={refs.setReference} />
					<div
						data-testid="floating"
						ref={refs.setFloating}
						style={floatingStyles()}
					/>
				</>
			);
		}
		const { getByTestId } = render(() => <TestComponent />);

		const mockBoundingClientRect = vi.fn(() => ({
			x: 0,
			y: 0,
			width: 50,
			height: 50,
			top: 0,
			right: 50,
			bottom: 50,
			left: 0,
			toJSON: () => {},
		}));
		const reference = getByTestId('reference');
		reference.getBoundingClientRect = mockBoundingClientRect;

		expect(getByTestId('floating').style.position).toBe('absolute');
		expect(getByTestId('floating').style.top).toBe('0px');
		expect(getByTestId('floating').style.left).toBe('0px');

		await waitFor(() => {
			expect(getByTestId('floating').style.position).toBe('absolute');
			expect(getByTestId('floating').style.top).toBe('50px');
			expect(getByTestId('floating').style.left).toBe('25px');
		});
	});

	it('createFloating floatingStyles default', async () => {
		function TestComponent() {
			const [visible, setVisible] = createSignal(true);
			const { refs, floatingStyles } = createFloating({
				isOpen: visible,
			});

			return (
				<>
					<div data-testid="reference" ref={refs.setReference} />
					<div
						data-testid="floating"
						ref={refs.setFloating}
						style={floatingStyles()}
					/>
				</>
			);
		}

		const { getByTestId } = render(() => <TestComponent />);

		const mockBoundingClientRect = vi.fn(() => ({
			x: 0,
			y: 0,
			width: 50,
			height: 50,
			top: 0,
			right: 50,
			bottom: 50,
			left: 0,
			toJSON: () => {},
		}));
		const reference = getByTestId('reference');
		reference.getBoundingClientRect = mockBoundingClientRect;

		expect(getByTestId('floating').style.position).toBe('absolute');
		expect(getByTestId('floating').style.top).toBe('0px');
		expect(getByTestId('floating').style.left).toBe('0px');
		expect(getByTestId('floating').style.transform).toBe('translate(0px, 0px)');

		await waitFor(() => {
			expect(getByTestId('floating').style.position).toBe('absolute');
			expect(getByTestId('floating').style.top).toBe('0px');
			expect(getByTestId('floating').style.left).toBe('0px');
			expect(getByTestId('floating').style.transform).toBe(
				'translate(25px, 50px)',
			);
		});
	});

	it('createFloating middleware is always fresh and does not cause an infinite loop', async () => {
		function TestComponent() {
			const [visible, setVisible] = createSignal(false);
			const [arrowRef, setArrowRef] = createSignal<HTMLElement | null>(null);
			const { refs, setFloatingStyles } = createFloating({
				isOpen: visible,
				placement: 'right',
				middleware: [
					offset(),
					offset(10),
					offset(() => 5),
					offset(() => ({ crossAxis: 10 })),
					offset({ crossAxis: 10, mainAxis: 10 }),

					flip({ fallbackPlacements: ['top', 'bottom'] }),

					shift(),
					shift({ crossAxis: true }),
					shift({ boundary: document.createElement('div') }),
					shift({ boundary: [document.createElement('div')] }),
					shift({ limiter: limitShift() }),
					shift({ limiter: limitShift({ offset: 10 }) }),
					shift({ limiter: limitShift({ offset: { crossAxis: 10 } }) }),
					shift({ limiter: limitShift({ offset: () => 5 }) }),
					shift({ limiter: limitShift({ offset: () => ({ crossAxis: 10 }) }) }),

					// eslint-disable-next-line solid/reactivity
					arrow({ element: arrowRef() }),

					hide(),

					size({
						apply({ availableHeight, elements }) {
							setFloatingStyles({ 'max-height': `${availableHeight}px` });
						},
					}),
				],
			});

			return (
				<>
					<div ref={refs.setReference} />
					<div ref={refs.setFloating} />
				</>
			);
		}

		function TestComponent2() {
			const [arrowRef] = createSignal<HTMLElement | null>(null);
			const [middleware, setMiddleware] = createSignal([
				offset(),
				offset(10),
				offset(() => 5),
				offset(() => ({ crossAxis: 10 })),
				offset({ crossAxis: 10, mainAxis: 10 }),

				// should also test `autoPlacement.allowedPlacements`
				// can't have both `flip` and `autoPlacement` in the same middleware
				// array, or multiple `flip`s
				flip({ fallbackPlacements: ['top', 'bottom'] }),

				shift(),
				shift({ crossAxis: true }),
				shift({ boundary: document.createElement('div') }),
				shift({ boundary: [document.createElement('div')] }),
				shift({ limiter: limitShift() }),
				shift({ limiter: limitShift({ offset: 10 }) }),
				shift({ limiter: limitShift({ offset: { crossAxis: 10 } }) }),
				shift({ limiter: limitShift({ offset: () => 5 }) }),
				shift({ limiter: limitShift({ offset: () => ({ crossAxis: 10 }) }) }),

				// eslint-disable-next-line solid/reactivity
				arrow({ element: arrowRef() }),

				hide(),

				size({
					apply({ availableHeight, elements }) {
						Object.assign(elements.floating.style, {
							maxHeight: `${availableHeight}px`,
						});
					},
				}),
			]);
			const [visible, setVisible] = createSignal(false);
			const { x, y, refs } = createFloating({
				placement: 'right',
				middleware: middleware,
				isOpen: visible,
			});
			return (
				<>
					<div ref={refs.setReference} />
					<div ref={refs.setFloating} />
					<button
						data-testid="step1"
						onClick={() => setMiddleware([offset(10)])}
					/>
					<button
						data-testid="step2"
						onClick={() => setMiddleware([offset(() => 5)])}
					/>
					<button data-testid="step3" onClick={() => setMiddleware([])} />
					<button data-testid="step4" onClick={() => setMiddleware([flip()])} />
					<div data-testid="x">{x()}</div>
					<div data-testid="y">{y()}</div>
				</>
			);
		}

		render(() => <TestComponent />);

		const { getByTestId } = render(() => <TestComponent2 />);
		fireEvent.click(getByTestId('step1'));

		await waitFor(() => {
			expect(getByTestId('x').textContent).toBe('10');
		});

		fireEvent.click(getByTestId('step2'));
		await waitFor(() => {
			expect(getByTestId('x').textContent).toBe('5');
		});

		// No `expect` as this test will fail if a render loop occurs
		fireEvent.click(getByTestId('step3'));
		fireEvent.click(getByTestId('step4'));

		await waitFor(() => {});
	});
});
