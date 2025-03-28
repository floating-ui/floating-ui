export function roundByDPR(element: Element, value: number) {
	const dpr = getDPR(element)
	return Math.round(value * dpr) / dpr
}

export function getDPR(element: Element): number {
	if (typeof window === 'undefined') {
		return 1
	}
	const win = element.ownerDocument.defaultView || window
	return win.devicePixelRatio || 1
}
