export function remToPx(value) {
  if (typeof document === 'undefined') {
    return value * 16;
  }

  return (
    value *
    parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    )
  );
}
