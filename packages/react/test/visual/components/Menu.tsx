import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTransitionStyles,
  useTypeahead,
} from '@floating-ui/react';
import {ChevronRightIcon} from '@radix-ui/react-icons';
import c from 'clsx';
import * as React from 'react';

interface MenuItemProps {
  label: string;
  disabled?: boolean;
}

export const MenuItem = React.forwardRef<
  HTMLButtonElement,
  MenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({label, disabled, ...props}, ref) => {
  return (
    <button
      type="button"
      {...props}
      className={c(
        'text-left flex py-1 px-2 focus:bg-blue-500 focus:text-white outline-none rounded',
        {
          'opacity-40': disabled,
        }
      )}
      ref={ref}
      role="menuitem"
      disabled={disabled}
    >
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
>(({children, label, ...props}, forwardedRef) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [allowHover, setAllowHover] = React.useState(false);
  const [hasFocusInside, setHasFocusInside] = React.useState(false);

  const listItemsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const listContentRef = React.useRef<Array<string | null>>([]);

  React.useEffect(() => {
    const strings: Array<string | null> = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        strings.push(
          child.props.label && !child.props.disabled ? child.props.label : null
        );
      }
    });
    listContentRef.current = strings;
  });

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const isNested = parentId != null;

  const {x, y, strategy, refs, context} = useFloating<HTMLButtonElement>({
    nodeId,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: isNested ? 'right-start' : 'bottom-start',
    middleware: [
      offset({mainAxis: isNested ? 0 : 4, alignmentAxis: isNested ? -4 : 0}),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    enabled: isNested && allowHover,
    delay: {open: 75},
    handleClose: safePolygon({
      restMs: 25,
      blockPointerEvents: true,
    }),
  });
  const click = useClick(context, {
    event: 'mousedown',
    toggle: !isNested || !allowHover,
    ignoreMouse: isNested,
  });
  const role = useRole(context, {role: 'menu'});
  const dismiss = useDismiss(context, {bubbles: true});
  const listNavigation = useListNavigation(context, {
    listRef: listItemsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    listRef: listContentRef,
    onMatch: isOpen ? setActiveIndex : undefined,
    activeIndex,
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    hover,
    click,
    role,
    dismiss,
    listNavigation,
    typeahead,
  ]);

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  React.useEffect(() => {
    if (!tree) return;

    function handleTreeClick() {
      setIsOpen(false);
    }

    function onSubMenuOpen(event: {nodeId: string; parentId: string}) {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        setIsOpen(false);
      }
    }

    tree.events.on('click', handleTreeClick);
    tree.events.on('menuopen', onSubMenuOpen);

    return () => {
      tree.events.off('click', handleTreeClick);
      tree.events.off('menuopen', onSubMenuOpen);
    };
  }, [tree, nodeId, parentId]);

  React.useEffect(() => {
    if (isOpen && tree) {
      tree.events.emit('menuopen', {parentId, nodeId});
    }
  }, [tree, isOpen, nodeId, parentId]);

  // Determine if "hover" logic can run based on the modality of input. This
  // prevents unwanted focus synchronization as menus open and close with
  // keyboard navigation and the cursor is resting on the menu.
  React.useEffect(() => {
    function onPointerMove({pointerType}: PointerEvent) {
      if (pointerType !== 'touch') {
        setAllowHover(true);
      }
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

  const {isMounted, styles} = useTransitionStyles(context, {
    duration: 100,
  });

  const referenceRef = useMergeRefs([refs.setReference, forwardedRef]);
  const referenceProps = getReferenceProps({
    ...props,
    onFocus(event: React.FocusEvent<HTMLButtonElement>) {
      props.onFocus?.(event);
      setHasFocusInside(false);
    },
    onClick(event) {
      event.stopPropagation();
    },
    ...(isNested && {
      // Indicates this is a nested <Menu /> acting as a <MenuItem />.
      role: 'menuitem',
    }),
  });

  return (
    <FloatingNode id={nodeId}>
      <button
        ref={referenceRef}
        data-open={isOpen ? '' : undefined}
        {...referenceProps}
        className={c(
          'text-left flex gap-4 justify-between items-center rounded py-1 px-2',
          {
            'focus:bg-blue-500 focus:text-white outline-none': isNested,
            'bg-blue-500 text-white': isOpen && isNested && !hasFocusInside,
            'bg-slate-200 rounded py-1 px-2':
              isNested && isOpen && hasFocusInside,
            'bg-slate-200': !isNested && isOpen,
          }
        )}
      >
        {label}{' '}
        {isNested && (
          <span aria-hidden className="ml-4">
            <ChevronRightIcon />
          </span>
        )}
      </button>
      <FloatingPortal>
        {isMounted && (
          <FloatingFocusManager
            context={context}
            // Prevent outside content interference.
            modal={false}
            // Only initially focus the root floating menu.
            initialFocus={isNested ? -1 : 0}
            // Only return focus to the root menu's reference when menus close.
            returnFocus={!isNested}
          >
            <div
              ref={refs.setFloating}
              className="flex flex-col rounded bg-white shadow-lg outline-none p-1 border border-slate-900/10 bg-clip-padding"
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                ...styles,
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
                      className: 'MenuItem',
                      ref(node: HTMLButtonElement) {
                        listItemsRef.current[index] = node;
                      },
                      onClick(event) {
                        child.props.onClick?.(event);
                        tree?.events.emit('click');
                      },
                      onFocus(event) {
                        child.props.onFocus?.(event);
                        setHasFocusInside(true);
                      },
                      // Allow focus synchronization if the cursor did not move.
                      onMouseEnter() {
                        if (allowHover && isOpen) {
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

  if (parentId === null) {
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
    <>
      <h1 className="text-5xl font-bold mb-8">Menu</h1>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
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
      </div>
    </>
  );
};
