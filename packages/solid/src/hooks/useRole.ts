import {MaybeAccessor} from '@solid-primitives/utils';
import {Accessor, createUniqueId, mergeProps} from 'solid-js';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {destructure} from '../utils/destructure';

type Role =
  | 'tooltip'
  | 'dialog'
  | 'alertdialog'
  | 'menu'
  | 'listbox'
  | 'grid'
  | 'tree';
export interface UseRoleProps {
  enabled?: MaybeAccessor<boolean>;

  role?: MaybeAccessor<Role>;
}

/**
 * Adds base screen reader props to the reference and floating elements for a
 * given floating element `role`.
 * @see https://floating-ui.com/docs/useRole
 */
export function useRole<RT extends ReferenceType = ReferenceType>(
  context: Accessor<FloatingContext<RT>>,
  props: UseRoleProps = {},
): Accessor<ElementProps> {
  const mergedProps = mergeProps(
    {
      enabled: true,
      role: 'dialog',
    } as Required<UseRoleProps>,
    props,
  );
  const {enabled, role} = destructure(mergedProps, {
    normalize: true,
  });
  const referenceId = createUniqueId();

  const floatingProps = {id: context().floatingId, role: role()};

  return () =>
    !enabled()
      ? {}
      : role() === 'tooltip'
      ? {
          reference: {
            'aria-describedby': context().open()
              ? context().floatingId
              : undefined,
          },
          floating: floatingProps,
        }
      : {
          reference: {
            'aria-expanded': context().open() ? 'true' : 'false',
            'aria-haspopup':
              role() === 'alertdialog'
                ? 'dialog'
                : (role() as 'dialog' | 'menu' | 'listbox' | 'grid' | 'tree'),
            'aria-controls': context().open()
              ? context().floatingId
              : undefined,
            ...(role() === 'listbox' && {
              role: 'combobox',
            }),
            ...(role() === 'menu' && {
              id: referenceId,
            }),
          },
          floating: {
            ...floatingProps,
            ...(role() === 'menu' && {
              'aria-labelledby': referenceId,
            }),
          },
        };
}
