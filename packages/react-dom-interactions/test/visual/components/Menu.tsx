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
  useInteractions,
  useRole,
  useClick,
  useDismiss,
  autoUpdate,
  safePolygon,
  FloatingPortal,
  useFloatingTree,
  useFloatingNodeId,
  useFloatingParentNodeId,
  FloatingNode,
  FloatingTree,
  FloatingFocusManager,
} from '@floating-ui/react-dom-interactions';
import mergeRefs from 'react-merge-refs';

export const Main = () => (
  <>
    <h1>Menu</h1>
    <p>
      A floating element that displays a list of buttons that perform an action,
      like an OS menu.
    </p>
    <div className="container">
      <Menu label="File">
        <MenuItem label="New tab" />
        <MenuItem label="New window" />
        <MenuItem label="Close Tab" disabled />
        <Menu label="Share...">
          <MenuItem label="Mail" />
          <MenuItem label="Instagram" />
          <Menu label="Other...">
            <MenuItem label="Reddit" />
            <MenuItem label="LinkedIn" />
          </Menu>
        </Menu>
      </Menu>
    </div>
  </>
);

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
  children?: React.ReactNode;
}

export const MenuComponent = forwardRef<
  any,
  Props & React.HTMLProps<HTMLButtonElement>
>(({children, label, ...props}, ref) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [allowHover, setAllowHover] = useState(false);

  const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listContentRef = useRef(
    Children.map(children, (child) =>
      isValidElement(child) ? child.props.label : null
    ) as Array<string | null>
  );

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const nested = parentId != null;

  const {x, y, reference, floating, strategy, refs, context} =
    useFloating<HTMLButtonElement>({
      open,
      onOpenChange: setOpen,
      middleware: [
        offset({mainAxis: 4, alignmentAxis: nested ? -5 : 0}),
        flip(),
        shift(),
      ],
      placement: nested ? 'right-start' : 'bottom-start',
      nodeId,
      whileElementsMounted: autoUpdate,
    });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useHover(context, {
      handleClose: safePolygon({restMs: 25}),
      enabled: nested && allowHover,
      delay: {open: 50},
    }),
    useClick(context, {
      toggle: !nested,
      pointerDown: true,
      ignoreMouse: nested,
    }),
    useRole(context, {role: 'menu'}),
    useDismiss(context),
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

  // Event emitter closes all menus when an item gets clicked anywhere in the
  // tree.
  useEffect(() => {
    function onTreeClick() {
      setOpen(false);

      if (parentId === null) {
        refs.reference.current?.focus();
      }
    }

    tree?.events.on('click', onTreeClick);
    return () => {
      tree?.events.off('click', onTreeClick);
    };
  }, [nodeId, open, parentId, tree, refs.reference]);

  // Determine if "hover" logic can run based on the modality of input. This
  // prevents unwanted focus synchronization as menus open and close with
  // keyboard navigation and the cursor is resting on the menu.
  useEffect(() => {
    function onPointerMove() {
      setAllowHover(true);
    }

    function onKeyDown() {
      setAllowHover(false);
    }

    window.addEventListener('pointermove', onPointerMove, {
      once: true,
      capture: true,
    });
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('pointermove', onPointerMove, {
        capture: true,
      });
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [allowHover]);

  const mergedReferenceRef = useMemo(
    () => mergeRefs([ref, reference]),
    [reference, ref]
  );

  return (
    <FloatingNode id={nodeId}>
      <button
        {...getReferenceProps({
          ...props,
          ref: mergedReferenceRef,
          onClick: ({currentTarget}) =>
            (currentTarget as HTMLButtonElement).focus(),
          ...(nested
            ? {
                role: 'menuitem',
                className: `MenuItem${open ? ' open' : ''}`,
                onKeyDown(event) {
                  // Prevent more than one menu from being open.
                  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    setOpen(false);
                  }
                },
              }
            : {className: `RootMenu${open ? ' open' : ''}`}),
        })}
      >
        {label} {nested && <span style={{marginLeft: 10}}>➔</span>}
      </button>
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            preventTabbing
            modal={!nested}
            order={['reference', 'content']}
          >
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
                  cloneElement(
                    child,
                    getItemProps({
                      role: 'menuitem',
                      className: 'MenuItem',
                      ref(node: HTMLButtonElement) {
                        listItemsRef.current[index] = node;
                      },
                      onClick() {
                        tree?.events.emit('click');
                      },
                      // By default `focusItemOnHover` uses `pointermove` sync,
                      // but when a menu closes we want this to sync it on
                      // `enter` even if the cursor didn't move.
                      onPointerEnter() {
                        if (allowHover) {
                          setActiveIndex(index);
                        }
                      },
                    })
                  )
              )}
            </div>
          </FloatingFocusManager>
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
