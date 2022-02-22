import type {ClientRectObject} from '@floating-ui/core';
import {getScrollableAncestors} from './utils/getScrollableAncestors';
import {isElement} from './utils/is';

type Options = {
  ancestorScroll: boolean;
  ancestorResize: boolean;
  elementResize: boolean;
  everyFrame: boolean;
};

export function autoUpdate(
  reference:
    | Element
    | {getBoundingClientRect(): ClientRectObject; contextElement?: Element},
  floating: HTMLElement,
  update: () => void,
  options: Partial<Options> = {}
) {
  const everyFrame = options.everyFrame;
  const ancestorScroll = options.ancestorScroll && !everyFrame;
  const ancestorResize = options.ancestorResize && !everyFrame;
  const elementResize = options.elementResize && !everyFrame;

  const ancestors = [
    ...(isElement(reference) ? getScrollableAncestors(reference) : []),
    ...getScrollableAncestors(floating),
  ];

  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener('scroll', update);
    ancestorResize && ancestor.addEventListener('resize', update);
  });

  let observer: ResizeObserver | null = null;
  if (elementResize) {
    observer = new ResizeObserver(update);
    isElement(reference) && observer.observe(reference);
    observer.observe(floating);
  }

  let frameId: number;
  let prevRefRect = everyFrame ? reference.getBoundingClientRect() : null;

  if (everyFrame) {
    frameLoop();
  }

  function frameLoop() {
    const nextRefRect = reference.getBoundingClientRect();

    if (
      prevRefRect &&
      (nextRefRect.x !== prevRefRect.x ||
        nextRefRect.y !== prevRefRect.y ||
        nextRefRect.width !== prevRefRect.width ||
        nextRefRect.height !== prevRefRect.height)
    ) {
      update();
    }

    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }

  return () => {
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });

    if (elementResize) {
      observer?.disconnect();
    }

    if (everyFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
