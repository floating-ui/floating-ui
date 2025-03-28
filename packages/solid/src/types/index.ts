import {
	ComputePositionReturn,
	Middleware,
	Placement,
	Strategy,
} from '@floating-ui/dom';
import { Accessor } from 'solid-js';

import { JSX } from 'solid-js/jsx-runtime';

export type MiddlewareType = Array<Middleware | null | undefined | false>;

export interface useFloatingProps {
	placement?: Placement;
	strategy?: Strategy;
	isOpen: () => boolean;
	middleware?: Accessor<MiddlewareType> | MiddlewareType | undefined;
	whileElementsMounted?: (
		refrence: HTMLElement,
		floating: HTMLElement,
		update: () => void,
	) => () => void;
	elements?: {
		reference:  Accessor<FloatingElement>;
		floating: Accessor<FloatingElement>;
	}
	transform?: boolean;
}
export type Data = ComputePositionReturn & { isPositioned: boolean };

export type FloatingElement = HTMLElement | null | undefined;

export type CSSProperties = JSX.CSSProperties;
