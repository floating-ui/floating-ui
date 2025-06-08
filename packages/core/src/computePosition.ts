import {computePositionGen} from './computePositionGen';
import type {ComputePositionConfig, ComputePositionReturn} from './types';

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to the provided reference element.
 */
export function computePosition(
  reference: unknown,
  floating: unknown,
  config: ComputePositionConfig,
): ComputePositionReturn {
  const gen = computePositionGen(reference, floating, config);
  let step = gen.next();

  while (!step.done) {
    step = gen.next(step.value);
  }

  return step.value;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to the provided reference element, supporting asynchronous platform
 * measurements.
 */
export async function computePositionAsync(
  reference: unknown,
  floating: unknown,
  config: ComputePositionConfig,
): Promise<ComputePositionReturn> {
  const gen = computePositionGen(reference, floating, config);
  let step = gen.next();

  while (!step.done) {
    const result = await step.value;
    step = gen.next(result);
  }

  return step.value;
}
