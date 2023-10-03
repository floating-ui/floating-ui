import {Accessor, createUniqueId, mergeProps} from 'solid-js';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';

export interface UseRoleProps {
  enabled?: Accessor<boolean>;

  role?:
    | 'tooltip'
    | 'dialog'
    | 'alertdialog'
    | 'menu'
    | 'listbox'
    | 'grid'
    | 'tree';
}

/**
 * Adds base screen reader props to the reference and floating elements for a
 * given floating element `role`.
 * @see https://floating-ui.com/docs/useRole
 */
export function useRole<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseRoleProps = {}
): ElementProps {
  const mergedProps = mergeProps(
    {
      enabled: () => true,
      role: 'dialog',
    } as Required<UseRoleProps>,
    props
  );

  const referenceId = createUniqueId();

  const floatingProps = {id: context.floatingId, role: mergedProps.role};

  if (mergedProps.role === 'tooltip') {
    return {
      reference: {
        'aria-describedby': context.open() ? context.floatingId : undefined,
      },
      floating: floatingProps,
    };
  }
  return !mergedProps.enabled()
    ? {}
    : {
        reference: {
          'aria-expanded': context.open() ? 'true' : 'false',
          'aria-haspopup':
            mergedProps.role === 'alertdialog' ? 'dialog' : mergedProps.role,
          'aria-controls': context.open() ? context.floatingId : undefined,
          ...(mergedProps.role === 'listbox' && {
            role: 'combobox',
          }),
          ...(mergedProps.role === 'menu' && {
            id: referenceId,
          }),
        },
        floating: {
          ...floatingProps,
          ...(mergedProps.role === 'menu' && {
            'aria-labelledby': referenceId,
          }),
        },
      };
}
