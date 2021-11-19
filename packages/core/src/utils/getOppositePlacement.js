// @flow
const hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };

export default function getOppositePlacement<T: string>(placement: T): T {
  return (placement.replace(
    /left|right|bottom|top/g,
    (matched) => hash[matched]
  ): any);
}
