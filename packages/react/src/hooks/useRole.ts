import * as React from 'react';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {useId} from './useId';

type AriaRole =
  | 'tooltip'
  | 'dialog'
  | 'alertdialog'
  | 'menu'
  | 'listbox'
  | 'grid'
  | 'tree';
type ComponentRole = 'select' | 'label';

export interface UseRoleProps {
  enabled?: boolean;
  role?: AriaRole | ComponentRole;
}

const componentRoleToAriaRoleMap = new Map<
  AriaRole | ComponentRole,
  AriaRole | false
>([
  ['select', 'listbox'],
  ['label', false],
]);

/**
 * Adds base screen reader props to the reference and floating elements for a
 * given floating element `role`.
 * @see https://floating-ui.com/docs/useRole
 */
export function useRole<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseRoleProps = {},
): ElementProps {
  const {open, floatingId} = context;
  const {enabled = true, role = 'dialog'} = props;

  const ariaRole = (componentRoleToAriaRoleMap.get(role) ?? role) as
    | AriaRole
    | false
    | undefined;

  const referenceId = useId();

  return React.useMemo(() => {
    if (!enabled) return {};

    const floatingProps = {
      id: floatingId,
      ...(ariaRole && {role: ariaRole}),
    };

    if (ariaRole === 'tooltip' || role === 'label') {
      return {
        reference: {
          [`aria-${role === 'label' ? 'labelledby' : 'describedby'}`]: open
            ? floatingId
            : undefined,
        },
        floating: floatingProps,
      };
    }

    return {
      reference: {
        'aria-expanded': open ? 'true' : 'false',
        'aria-haspopup': ariaRole === 'alertdialog' ? 'dialog' : ariaRole,
        'aria-controls': open ? floatingId : undefined,
        ...(ariaRole === 'listbox' && {role: 'combobox'}),
        ...(ariaRole === 'menu' && {id: referenceId}),
        ...(role === 'select' && {'aria-autocomplete': 'none'}),
      },
      floating: {
        ...floatingProps,
        ...(ariaRole === 'menu' && {'aria-labelledby': referenceId}),
      },
      item({active, selected}) {
        if (role === 'select') {
          return {
            tabIndex: active ? 0 : -1,
            role: 'option',
            'aria-selected': active && selected,
          };
        }
        return {};
      },
    };
  }, [enabled, role, ariaRole, open, floatingId, referenceId]);
}
