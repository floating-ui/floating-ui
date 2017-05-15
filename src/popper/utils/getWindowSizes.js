import mathMax from './mathMax';

export default function getWindowSizes() {
  const body = window.document.body;
  const html = window.document.documentElement;
  return {
    height: mathMax(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    ),
    width: mathMax(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth
    ),
  };
}
