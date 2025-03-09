import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import {ChevronRightIcon} from '@radix-ui/react-icons';
import c from 'clsx';
import * as React from 'react';

type MenuContextType = {
  getItemProps: (
    userProps?: React.HTMLProps<HTMLElement>,
  ) => Record<string, unknown>;
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
  allowHover: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  parent: MenuContextType | null;
};

const MenuContext = React.createContext<MenuContextType>({
  getItemProps: () => ({}),
  activeIndex: null,
  setActiveIndex: () => {},
  setHasFocusInside: () => {},
  allowHover: true,
  isOpen: false,
  setIsOpen: () => {},
  parent: null,
});

interface MenuProps {
  label: string;
  nested?: boolean;
  children?: React.ReactNode;
  virtualItemRef: React.RefObject<HTMLElement>;
}

export const MenuComponent = React.forwardRef<
  HTMLElement,
  MenuProps & React.HTMLAttributes<HTMLElement>
>(function Menu({children, label, virtualItemRef, ...props}, forwardedRef) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [allowHover, setAllowHover] = React.useState(false);
  const [hasFocusInside, setHasFocusInside] = React.useState(false);

  const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const isNested = parentId != null;

  const parent = React.useContext(MenuContext);
  const item = useListItem();

  const {floatingStyles, refs, context} = useFloating({
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
    handleClose: safePolygon({blockPointerEvents: true}),
  });
  const role = useRole(context, {role: 'menu'});
  const dismiss = useDismiss(context, {bubbles: true});
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
    virtual: true,
    virtualItemRef,
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    hover,
    role,
    dismiss,
    listNavigation,
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

  const id = React.useId();
  const mergedRef = useMergeRefs([refs.setReference, item.ref, forwardedRef]);

  return (
    <FloatingNode id={nodeId}>
      {isNested ? (
        <div
          id={id}
          ref={mergedRef}
          data-open={isOpen ? '' : undefined}
          tabIndex={-1}
          role="menuitem"
          aria-autocomplete="list"
          className={c(
            props.className ||
              'text-left flex gap-4 justify-between items-center rounded py-1 px-2 cursor-default',
            {
              'bg-red-500 text-white': parent.activeIndex === item.index,
              'focus:bg-red-500 outline-none': isNested,
              'bg-red-100 text-red-900': isOpen && isNested && !hasFocusInside,
              'bg-red-100 rounded py-1 px-2':
                isNested && isOpen && hasFocusInside,
            },
          )}
          {...getReferenceProps({
            ...parent.getItemProps({
              ...props,
              onFocus(event) {
                props.onFocus?.(event);
                setHasFocusInside(false);
                parent.setHasFocusInside(true);
              },
              onMouseEnter(event) {
                props.onMouseEnter?.(event);
                if (parent.allowHover && parent.isOpen) {
                  parent.setActiveIndex(item.index);
                }
              },
            }),
          })}
        >
          {label}
          {isNested && (
            <span aria-hidden className="ml-4">
              <ChevronRightIcon />
            </span>
          )}
        </div>
      ) : (
        <input
          className="border border-slate-500"
          ref={mergedRef}
          id={id}
          data-open={isOpen ? '' : undefined}
          tabIndex={isNested ? -1 : 0}
          role="combobox"
          aria-autocomplete="list"
          {...getReferenceProps({
            onKeyDown(event) {
              if (event.key === ' ' || event.key === 'Enter') {
                console.log('clicked', virtualItemRef.current);
              }
            },
          })}
        />
      )}
      <MenuContext.Provider
        value={{
          activeIndex,
          setActiveIndex,
          getItemProps,
          setHasFocusInside,
          allowHover,
          isOpen,
          setIsOpen,
          parent,
        }}
      >
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          {isOpen && (
            <FloatingPortal>
              <FloatingFocusManager
                context={context}
                initialFocus={-1}
                returnFocus={!isNested}
              >
                <div
                  ref={refs.setFloating}
                  className="flex flex-col rounded bg-white shadow-lg outline-none p-1 border border-slate-900/10 bg-clip-padding"
                  style={floatingStyles}
                  {...getFloatingProps()}
                >
                  {children}
                </div>
              </FloatingFocusManager>
            </FloatingPortal>
          )}
        </FloatingList>
      </MenuContext.Provider>
    </FloatingNode>
  );
});

interface MenuItemProps {
  label: string;
  disabled?: boolean;
}

export const MenuItem = React.forwardRef<
  HTMLElement,
  MenuItemProps & React.HTMLAttributes<HTMLElement>
>(function MenuItem({label, disabled, ...props}, forwardedRef) {
  const menu = React.useContext(MenuContext);
  const item = useListItem({label: disabled ? null : label});
  const tree = useFloatingTree();
  const isActive = item.index === menu.activeIndex;
  const id = React.useId();

  return (
    <div
      {...props}
      id={id}
      ref={useMergeRefs([item.ref, forwardedRef])}
      role="option"
      tabIndex={-1}
      aria-selected={isActive}
      aria-disabled={disabled}
      className={c(
        'text-left flex py-1 px-2 focus:bg-red-500 outline-none rounded cursor-default',
        {'opacity-40': disabled, 'bg-red-500 text-white': isActive},
      )}
      {...menu.getItemProps({
        onClick(event: React.MouseEvent<HTMLButtonElement>) {
          props.onClick?.(event);
          tree?.events.emit('click');
        },
        onFocus(event: React.FocusEvent<HTMLButtonElement>) {
          props.onFocus?.(event);
          menu.setHasFocusInside(true);
        },
        onMouseEnter(event: React.MouseEvent<HTMLButtonElement>) {
          props.onMouseEnter?.(event);
          if (menu.allowHover && menu.isOpen) {
            menu.setActiveIndex(item.index);
          }
        },
        onKeyDown(event) {
          function closeParents(parent: MenuContextType | null) {
            parent?.setIsOpen(false);
            if (parent?.parent) {
              closeParents(parent.parent);
            }
          }

          if (
            event.key === 'ArrowRight' &&
            // If the root reference is in a menubar, close parents
            tree?.nodesRef.current[0].context?.elements.domReference?.closest(
              '[role="menubar"]',
            )
          ) {
            closeParents(menu.parent);
          }
        },
      })}
    >
      {label}
    </div>
  );
});

export const Menu = React.forwardRef<
  HTMLButtonElement,
  MenuProps & React.HTMLProps<HTMLButtonElement>
>(function MenuWrapper(props, ref) {
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
  const virtualItemRef = React.useRef<HTMLElement | null>(null);

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Menu Virtual</h1>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <Menu label="Edit" virtualItemRef={virtualItemRef}>
          <MenuItem label="Undo" onClick={() => console.log('Undo')} />
          <MenuItem label="Redo" />
          <MenuItem label="Cut" disabled />
          <Menu label="Copy as" virtualItemRef={virtualItemRef}>
            <MenuItem label="Text" />
            <MenuItem label="Video" />
            <Menu label="Image" virtualItemRef={virtualItemRef}>
              <MenuItem label=".png" />
              <MenuItem label=".jpg" />
              <MenuItem label=".svg" />
              <MenuItem label=".gif" />
            </Menu>
            <MenuItem label="Audio" />
          </Menu>
          <Menu label="Share" virtualItemRef={virtualItemRef}>
            <MenuItem label="Mail" />
            <MenuItem label="Instagram" />
          </Menu>
        </Menu>
      </div>
    </>
  );
};
