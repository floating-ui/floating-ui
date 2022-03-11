import {autoUpdate} from '@floating-ui/dom';
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  useListNavigation,
  useHover,
  useTypeahead,
} from '../';
import {useInteractions} from '../useInteractions';
import {useRole} from '../hooks/useRole';
import {useClick} from '../hooks/useClick';
import {useDismiss} from '../hooks/useDismiss';
import {useFocusTrap} from '../hooks/useFocusTrap';
import mergeRefs from 'react-merge-refs';
import {safePolygon} from '../safePolygon';
import {FloatingPortal} from '../FloatingPortal';
import {
  useFloatingTree,
  useFloatingNodeId,
  useFloatingParentNodeId,
  FloatingNode,
  FloatingTree,
} from '../FloatingTree';
import useLayoutEffect from 'use-isomorphic-layout-effect';

export const MenuItem = forwardRef<
  HTMLButtonElement,
  {label: string; disabled?: boolean}
>(({label, disabled, ...props}, ref) => {
  return (
    <button {...props} ref={ref} role="menuitem" disabled={disabled}>
      {label}
    </button>
  );
});

interface Props {
  label?: string;
  nested?: boolean;
}

export const MenuComponent = forwardRef<
  any,
  Props & React.HTMLProps<HTMLButtonElement>
>(({children, label}, ref) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listContentRef = useRef(
    Children.map(children, (child) =>
      isValidElement(child) ? child.props.label : null
    ) as Array<string | null>
  );

  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const tree = useFloatingTree();
  const nested = parentId != null;

  useEffect(() => {
    function onTreeOpenChange({
      open,
      reference,
      parentId,
    }: {
      open: boolean;
      reference: Element;
      parentId: string;
    }) {
      if (parentId !== nodeId) {
        return;
      }

      listItemsRef.current.forEach((item) => {
        if (item && item !== reference) {
          item.style.pointerEvents = open ? 'none' : '';
        }
      });
    }

    tree?.events.on('openChange', onTreeOpenChange);
    return () => {
      tree?.events.off('openChange', onTreeOpenChange);
    };
  }, [tree, nodeId]);

  const {x, y, reference, floating, strategy, refs, update, context} =
    useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [
        offset({mainAxis: 4, alignmentAxis: nested ? -5 : 0}),
        flip(),
        shift(),
      ],
      placement: nested ? 'right-start' : 'bottom-start',
      nodeId,
    });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, {
      handleClose: safePolygon(),
      enabled: nested,
    }),
    useClick(context),
    useRole(context, {role: 'menu'}),
    useDismiss(context),
    useFocusTrap(context, {inert: true}),
    useListNavigation(context, {
      listRef: listItemsRef,
      activeIndex,
      nested,
      onNavigate: setActiveIndex,
    }),
    useTypeahead(context, {
      listRef: listContentRef,
      onMatch: open ? setActiveIndex : undefined,
      activeIndex,
    }),
  ]);

  useLayoutEffect(() => {
    tree?.events.emit('openChange', {
      open,
      parentId,
      reference: refs.reference.current,
    });
  }, [tree, open, parentId, refs.reference]);

  useEffect(() => {
    if (open && refs.reference.current && refs.floating.current) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [open, update, refs.reference, refs.floating]);

  const pointerFocusListeners: React.HTMLProps<HTMLButtonElement> = {
    onPointerEnter({currentTarget}) {
      const target = currentTarget as HTMLButtonElement | null;
      if (target) {
        currentTarget.focus({preventScroll: true});
        setActiveIndex(listItemsRef.current.indexOf(target));
      }
    },
    onPointerLeave() {
      refs.floating.current?.focus({preventScroll: true});
    },
  };

  const mergedReferenceRef = useMemo(
    () => mergeRefs([ref, reference]),
    [reference, ref]
  );

  return (
    <FloatingNode id={nodeId}>
      <button
        {...getReferenceProps({
          ref: mergedReferenceRef,
          ...(parentId && {
            ...pointerFocusListeners,
            role: 'menuitem',
            className: `MenuItem${open ? ' open' : ''}`,
          }),
        })}
      >
        {label} {nested && <span>➔</span>}
      </button>
      <FloatingPortal>
        {open && (
          <div
            {...getFloatingProps({
              className: 'Menu',
              ref: floating,
              style: {
                position: strategy,
                top: y ?? '',
                left: x ?? '',
              },
            })}
          >
            {Children.map(
              children,
              (child, index) =>
                isValidElement(child) &&
                cloneElement(child, {
                  role: 'menuitem',
                  className: 'MenuItem',
                  ref(node: HTMLButtonElement) {
                    listItemsRef.current[index] = node;
                  },
                  ...pointerFocusListeners,
                  style: {
                    display: 'block',
                    width: '100%',
                  },
                })
            )}
          </div>
        )}
      </FloatingPortal>
    </FloatingNode>
  );
});

export const Menu: React.FC<Props> = forwardRef((props, ref) => {
  const parentId = useFloatingParentNodeId();

  if (parentId == null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} ref={ref} />
      </FloatingTree>
    );
  }

  return <MenuComponent {...props} ref={ref} />;
});
