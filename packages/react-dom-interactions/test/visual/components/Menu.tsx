import * as React from 'react';
import mergeRefs from 'react-merge-refs';
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

interface MenuItemProps {
  label: string;
  disabled?: boolean;
}

export const MenuItem = React.forwardRef<
  HTMLButtonElement,
  MenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({label, disabled, ...props}, ref) => {
  return (
    <button {...props} ref={ref} role="menuitem" disabled={disabled}>
      {label}
    </button>
  );
});

interface MenuProps {
  label: string;
  nested?: boolean;
  children?: React.ReactNode;
}

export const MenuComponent = React.forwardRef<
  HTMLButtonElement,
  MenuProps & React.HTMLProps<HTMLButtonElement>
>(({children, label, ...props}, ref) => {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [allowHover, setAllowHover] = React.useState(false);

  const listItemsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const listContentRef = React.useRef(
    React.Children.map(children, (child) =>
      React.isValidElement(child) ? child.props.label : null
    ) as Array<string | null>
  );

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const nested = parentId != null;

  const {x, y, reference, floating, strategy, context} =
    useFloating<HTMLButtonElement>({
      open,
      nodeId,
      onOpenChange: setOpen,
      middleware: [
        offset({mainAxis: 4, alignmentAxis: nested ? -5 : 0}),
        flip(),
        shift(),
      ],
      placement: nested ? 'right-start' : 'bottom-start',
      whileElementsMounted: autoUpdate,
    });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useHover(context, {
      handleClose: safePolygon({restMs: 25}),
      enabled: nested && allowHover,
      delay: {open: 75},
    }),
    useClick(context, {
      toggle: !nested,
      // event: 'mousedown',
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

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  React.useEffect(() => {
    function handleTreeClick() {
      setOpen(false);
    }

    tree?.events.on('click', handleTreeClick);
    return () => {
      tree?.events.off('click', handleTreeClick);
    };
  }, [parentId, nodeId, tree]);

  // Determine if "hover" logic can run based on the modality of input. This
  // prevents unwanted focus synchronization as menus open and close with
  // keyboard navigation and the cursor is resting on the menu.
  React.useEffect(() => {
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

  const mergedReferenceRef = React.useMemo(
    () => mergeRefs([ref, reference]),
    [reference, ref]
  );

  return (
    <FloatingNode id={nodeId}>
      <button
        ref={mergedReferenceRef}
        {...getReferenceProps({
          ...props,
          className: `${nested ? 'MenuItem' : 'RootMenu'}${
            open ? ' open' : ''
          }`,
          onClick(event) {
            // Normalize button focus in Safari.
            (event.currentTarget as HTMLButtonElement).focus();
          },
          ...(nested && {
            // Indicates this is a nested <Menu /> acting as a <MenuItem />.
            role: 'menuitem',
          }),
        })}
      >
        {label}{' '}
        {nested && (
          <span aria-hidden="true" style={{marginLeft: 10}}>
            ➔
          </span>
        )}
      </button>
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            // Make the root menu modal but nested submenus non-modal. Prevents
            // outside interference when using VoiceOver/screen readers.
            modal={!nested}
            // Only return focus to the root menu when menus close.
            returnFocus={!nested}
            // Let the useListNavigation hook handle initial focus.
            initialFocus={-1}
            // Ensure touch-based screen readers can escape the list without
            // needing to select anything due to the modal focus management
            // on the root menu.
            visuallyHiddenDismiss
          >
            <div
              ref={floating}
              className="Menu"
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
              }}
              {...getFloatingProps()}
            >
              {React.Children.map(
                children,
                (child, index) =>
                  React.isValidElement(child) &&
                  React.cloneElement(
                    child,
                    getItemProps({
                      tabIndex: activeIndex === index ? 0 : -1,
                      role: 'menuitem',
                      className: 'MenuItem',
                      ref(node: HTMLButtonElement) {
                        listItemsRef.current[index] = node;
                      },
                      onClick(event) {
                        child.props.onClick?.(event);
                        tree?.events.emit('click');
                      },
                      // Allow focus synchronization if the cursor did not move.
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

export const Menu = React.forwardRef<
  HTMLButtonElement,
  MenuProps & React.HTMLProps<HTMLButtonElement>
>((props, ref) => {
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

export const Main = () => {
  return (
    <Menu label="Edit">
      <MenuItem label="Undo" onClick={() => console.log('Undo')} />
      <MenuItem label="Redo" />
      <MenuItem label="Cut" disabled />
      <Menu label="Copy as">
        <MenuItem label="Text" />
        <MenuItem label="Video" />
        <Menu label="Image">
          <MenuItem label=".png" />
          <MenuItem label=".jpg" />
          <MenuItem label=".svg" />
          <MenuItem label=".gif" />
        </Menu>
        <MenuItem label="Audio" />
      </Menu>
      <Menu label="Share">
        <MenuItem label="Mail" />
        <MenuItem label="Instagram" />
      </Menu>
    </Menu>
  );
};
