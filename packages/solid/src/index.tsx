import { arrow as arrowInternal } from '@floating-ui/dom';

export {
	autoPlacement,
	autoUpdate,
	detectOverflow,
	flip,
	hide,
	inline,
	limitShift,
	offset,
	platform,
	shift,
	size,
} from '@floating-ui/dom';
export function arrow({
	element,
	padding,
}: { element: HTMLElement | null | undefined; padding?: number }) {
	return arrowInternal({ element: element as Element, padding: padding ?? 0 });
}
export * from './types';
export { createFloating } from './hooks/createFloating';
