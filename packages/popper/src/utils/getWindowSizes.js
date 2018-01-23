import isIE from './isIE';

function getSize(axis, body, html, computedStyle) {
  return Math.max(
    body[`offset${axis}`],
    body[`scroll${axis}`],
    html[`client${axis}`],
    html[`offset${axis}`],
    html[`scroll${axis}`],
    isIE(10)
      ? html[`offset${axis}`] +
        computedStyle[`margin${axis === 'Height' ? 'Top' : 'Left'}`] +
        computedStyle[`margin${axis === 'Height' ? 'Bottom' : 'Right'}`]
      : 0
  );
}

export default function getWindowSizes() {
  const body = document.body;
  const html = document.documentElement;
  const computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle),
  };
}
