import {getScrollParents} from './dist/index.mjs';

const reference = document.querySelector('#reference');
const floating = document.querySelector('#floating');
const arrowElement = document.querySelector('#arrowElement');

export function position(data) {
  Object.assign(floating.style, {
    position: data.strategy,
    left: `${data.x}px`,
    top: `${data.y}px`,
    opacity: data.middlewareData.hide?.escaped ? '0.5' : '1',
    visibility: data.middlewareData.hide?.referenceHidden
      ? 'hidden'
      : 'visible',
  });

  if (arrowElement) {
    Object.assign(arrowElement.style, {
      position: 'absolute',
      left:
        data.middlewareData.arrow?.x != null
          ? `${data.middlewareData.arrow?.x}px`
          : '',
      top:
        data.middlewareData.arrow?.y != null
          ? `${data.middlewareData.arrow?.y}px`
          : '',
      [{top: 'bottom', bottom: 'top', left: 'right', right: 'left'}[
        data.placement.split('-')[0]
      ]]: `-${arrowElement.getBoundingClientRect().height}px`,
      opacity: data.middlewareData.arrow?.centerOffset !== 0 ? '0.5' : '1',
    });
  }
}

export function addEventListeners(callback) {
  [...getScrollParents(reference), ...getScrollParents(floating)].forEach(
    (element) => {
      element.addEventListener('scroll', callback);
      element.addEventListener('resize', callback);
    }
  );

  callback();
}
