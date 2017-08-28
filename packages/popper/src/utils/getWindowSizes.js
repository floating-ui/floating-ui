import isIE10 from './isIE10';

function getSize(axis, body, html, computedStyle, includeScroll) {
  return Math.max(
    body[`offset${axis}`],
    includeScroll ? body[`scroll${axis}`] : 0,
    html[`client${axis}`],
    html[`offset${axis}`],
    includeScroll ? html[`scroll${axis}`] : 0,
    isIE10()
      ? html[`offset${axis}`] +
        computedStyle[`margin${axis === 'Height' ? 'Top' : 'Left'}`] +
        computedStyle[`margin${axis === 'Height' ? 'Bottom' : 'Right'}`]
      : 0
  );
}

export default function getWindowSizes(includeScroll = true) {
  const body = window.document.body;
  const html = window.document.documentElement;
  const computedStyle = isIE10() && window.getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle, includeScroll),
    width: getSize('Width', body, html, computedStyle, includeScroll),
  };
}
