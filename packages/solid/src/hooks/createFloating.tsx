import { batch, createEffect, createSignal, onCleanup } from 'solid-js';
import { computePosition, MiddlewareData } from '@floating-ui/dom';
import { getDPR, roundByDPR } from '../utils';
import {
	CSSProperties,
	Data,
	FloatingElement,
	useFloatingProps,
} from '../types';

export const createFloating = (props: useFloatingProps) => {
	const [_reference, setReference] = createSignal<FloatingElement>(null);
	const [_floating, setFloating] = createSignal<FloatingElement>(null);

	const strategyProps = () => props.strategy ?? 'absolute';
	const placementProps = () => props.placement ?? 'bottom';
	const transformProps = () => props.transform ?? true;

	const mainReference = () => props.elements?.reference() || _reference();
	const mainFloating = () => props.elements?.floating() || _floating();

	const [floatingStylesInternal, setFloatingStylesInternal] =
		createSignal<CSSProperties>({
			top: '0px',
			left: '0px',
			position: strategyProps(),
			transform: transformProps() ? 'translate(0px, 0px)' : 'none',
		});

	const [data, setData] = createSignal<Data>({
		x: 0,
		y: 0,
		strategy: strategyProps(),
		middlewareData: {},
		placement: placementProps(),
		isPositioned: false,
	});

	let cleanupFn: { current: undefined | (() => void) } = { current: undefined };

	function update() {
		const refrenceEl = mainReference();
		const floatingEl = mainFloating();

		if (refrenceEl && floatingEl) {
			computePosition(refrenceEl, floatingEl, {
				middleware:
					typeof props.middleware === 'function'
						? props.middleware?.()
						: props.middleware,
				placement: placementProps(),
				strategy: strategyProps(),
			}).then(
				// eslint-disable-next-line solid/reactivity
				(computeData) => {
					const fullData = { ...computeData, isPositioned: true };
					const newStyles = transformProps()
						? {
								transform: `translate(${roundByDPR(floatingEl, fullData.x)}px, ${roundByDPR(floatingEl, fullData.y)}px)`,
								...(getDPR(floatingEl) >= 1.5 && { willChange: 'transform' }),
							}
						: {
								top: `${fullData.y}px`,
								left: `${fullData.x}px`,
							};

					batch(() => {
						setData({
							...fullData,
							middlewareData: fullData.middlewareData,
							isPositioned: true,
						});
						setFloatingStylesInternal((prev) => ({ ...prev, ...newStyles }));
					});
				},
				(err) => {
					console.error(err);
				},
			);
		}
	}

	createEffect(() => {
		const floatingEl = mainReference();
		const refrenceEl = mainFloating();
		props?.whileElementsMounted;
		strategyProps();
		placementProps();
		transformProps();
		typeof props.middleware === 'function'
			? props.middleware?.()
			: props.middleware;
		if (refrenceEl && floatingEl) {
			if (props?.whileElementsMounted === undefined) {
				update();
				return;
			}

			if (typeof props.whileElementsMounted === 'function') {
				cleanupFn = {
					current: props.whileElementsMounted(refrenceEl, floatingEl, update),
				};
			}
		}
	});

	createEffect(() => {
		const open = props?.isOpen();

		if (open === false && data().isPositioned) {
			setData({ ...data(), isPositioned: false });
		}

		onCleanup(() => {
			if (typeof cleanupFn.current === 'function') {
				cleanupFn.current?.();

				cleanupFn = { current: undefined };
			}
		});
	});

	return {
		x: () => data().x,
		y: () => data().y,
		placement: () => data().placement,
		strategy: () => data().strategy,
		isPositioned: () => data().isPositioned,
		floatingStyles: floatingStylesInternal,
		setFloatingStyles: (params: CSSProperties) =>
			setFloatingStylesInternal(params),
		middleware: () => data().middlewareData as MiddlewareData,
		elements: {
			reference: () => _reference(),
			floating: () => _floating(),
		},
		refs: {
			setReference: setReference,
			setFloating: setFloating,
		},
		update,
	};
};
