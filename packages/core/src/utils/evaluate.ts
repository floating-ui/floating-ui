export function evaluate<T, P>(value: T | ((param: P) => T), param: P): T {
  return typeof value === 'function'
    ? (value as (param: P) => T)(param)
    : value;
}
