import type {ClientRectObject} from '@floating-ui/core';
import {getBoundingClientRect} from './utils/getBoundingClientRect';
import {getOverflowAncestors} from './utils/getOverflowAncestors';
import {isElement} from './utils/is';

type Options = {
  ancestorScroll: boolean;
  ancestorResize: boolean;
  elementResize: boolean;
  animationFrame: boolean;
};

export function autoUpdate(
  reference:
    | Element
    | {getBoundingClientRect(): ClientRectObject; contextElement?: Element},
  floating: HTMLElement,
  update: () => void,
  options: Partial<Options> = {
    ancestorScroll: true,
    ancestorResize: true,
    elementResize: true,
    animationFrame: false,
  }
) {
  let cleanedUp = false;
  const animationFrame = options.animationFrame;
  const ancestorScroll = options.ancestorScroll && !animationFrame;
  const ancestorResize = options.ancestorResize && !animationFrame;
  const elementResize = options.elementResize && !animationFrame;

  const ancestors =
    ancestorScroll || ancestorResize
      ? [
          ...(isElement(reference) ? getOverflowAncestors(reference) : []),
          ...getOverflowAncestors(floating),
        ]
      : [];

  ancestors.forEach((ancestor) => {
    ancestorScroll &&
      ancestor.addEventListener('scroll', update, {passive: true});
    ancestorResize && ancestor.addEventListener('resize', update);
  });

  let observer: ResizeObserver | null = null;
  if (elementResize) {
    observer = new ResizeObserver(update);
    isElement(reference) && observer.observe(reference);
    observer.observe(floating);
  }

  let frameId: number;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;

  if (animationFrame) {
    frameLoop();
  }

  function frameLoop() {
    if (cleanedUp) {
      return;
    }

    const nextRefRect = getBoundingClientRect(reference);

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
    cleanedUp = true;

    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });

    observer?.disconnect();

    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
