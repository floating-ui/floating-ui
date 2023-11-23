import * as React from 'react';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {useId} from './useId';

type TypeKeys = 'tooltip' | 'label' | 'autocomplete' | 'select' | 'multiselect';

export interface UseRoleProps {
  enabled?: boolean;
  role?:
    | 'tooltip'
    | 'label'
    | 'dialog'
    | 'alertdialog'
    | 'menu'
    | 'listbox'
    | 'grid'
    | 'tree';
  type?: TypeKeys;
}

type FloatingProps = {
  [key: string]: string | boolean | undefined;
};

/**
 * Adds base screen reader props to the reference and floating elements for a
 * given floating element `role`.
 * @see https://floating-ui.com/docs/useRole
 */
export function useRole<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseRoleProps = {}
): ElementProps {
  const {open, floatingId} = context;
  const {enabled = true, role = 'dialog', type} = props;

  const referenceId = useId();

  if (
    role &&
    ![
      'tooltip',
      'label',
      'dialog',
      'alertdialog',
      'menu',
      'listbox',
      'grid',
      'tree',
    ].includes(role)
  ) {
    throw new Error(`Invalid role: ${role}`);
  }

  if (
    type &&
    !['tooltip', 'label', 'autocomplete', 'select', 'multiselect'].includes(
      type
    )
  ) {
    throw new Error(`Invalid type: ${type}`);
  }

  return React.useMemo(() => {
    if (!enabled) return {};

    const floatingProps: FloatingProps = {
      id: floatingId,
      ...(role !== 'label' && {role}),
    };

    const typeToAriaProp: Record<TypeKeys, string> = {
      tooltip: 'aria-describedby',
      label: 'aria-labelledby',
      autocomplete: 'aria-autocomplete',
      select: 'aria-haspopup',
      multiselect: 'aria-multiselectable',
    };

    const typeToAriaValue: Partial<Record<TypeKeys, string>> = {
      autocomplete: 'both',
      select: 'listbox',
      multiselect: 'true',
    };

    if (type) {
      const ariaProp = typeToAriaProp[type];
      if (ariaProp) {
        floatingProps[ariaProp] = typeToAriaValue[type] || floatingId;
      }
    }

    if (role === 'tooltip' || role === 'label') {
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
        'aria-haspopup': role === 'alertdialog' ? 'dialog' : role,
        'aria-controls': open ? floatingId : undefined,
        ...(role === 'listbox' && {
          role: 'combobox',
        }),
        ...(role === 'menu' && {
          id: referenceId,
        }),
      },
      floating: {
        ...floatingProps,
        ...(role === 'menu' && {
          'aria-labelledby': referenceId,
        }),
      },
    };
  }, [enabled, floatingId, role, type, open, referenceId]);
}
