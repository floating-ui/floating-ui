import {JSX} from 'solid-js';
import {hydrate as solidHydrate, render as solidRender} from 'solid-js/web';

interface Options {
  hydrate?: boolean;
}

interface Result {
  element: Element | null; //mr added null
  cleanup: () => void;
}

export function render(
  component: () => JSX.Element,
  {hydrate}: Options = {},
): Result {
  const container = document.body.appendChild(document.createElement('div'));

  const dispose = hydrate
    ? (solidHydrate(component, container) as unknown as () => void)
    : solidRender(component, container);

  return {
    element: container.firstElementChild,
    cleanup: dispose,
  };
}

export const promiseRequestAnimationFrame = async () =>
  await new Promise((resolve) =>
    requestAnimationFrame(() => {
      //in SolidJS we need to wait for a requestAnimationFrame to be finished because of the enqueueFocus function
      expect(true).toBe(true);
      resolve(null);
    }),
  );
