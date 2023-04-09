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
  useClick,
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
  useTypeahead,
} from '@floating-ui/react';
import {ChevronRightIcon} from '@radix-ui/react-icons';
import c from 'clsx';
import * as React from 'react';

const MenuContext = React.createContext<{
  getItemProps: (
    userProps?: React.HTMLProps<HTMLElement>
  ) => Record<string, unknown>;
  activeIndex: number | null;
  setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  getItemProps: () => ({}),
  activeIndex: null,
  setHasFocusInside: () => {},
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

  const elementsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);

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
    handleClose: safePolygon({blockPointerEvents: true}),
  });
  const click = useClick(context, {
    event: 'mousedown',
    toggle: !isNested || !allowHover,
    ignoreMouse: isNested,
  });
  const role = useRole(context, {role: 'menu'});
  const dismiss = useDismiss(context, {bubbles: true});
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
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

  const menuCtx = React.useContext(MenuContext);
  const item = useListItem();

  return (
    <FloatingNode id={nodeId}>
      <button
        ref={useMergeRefs([refs.setReference, item.ref, forwardedRef])}
        data-open={isOpen ? '' : undefined}
        tabIndex={
          !isNested ? undefined : menuCtx.activeIndex === item.index ? 0 : -1
        }
        role={isNested ? 'menuitem' : undefined}
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
        {...getReferenceProps(
          menuCtx.getItemProps({
            ...props,
            onFocus(event: React.FocusEvent<HTMLButtonElement>) {
              props.onFocus?.(event);
              setHasFocusInside(false);
              menuCtx.setHasFocusInside(true);
            },
            onClick(event) {
              event.stopPropagation();
            },
          })
        )}
      >
        {label}
        {isNested && (
          <span aria-hidden className="ml-4">
            <ChevronRightIcon />
          </span>
        )}
      </button>
      <MenuContext.Provider
        value={{
          activeIndex,
          getItemProps,
          setHasFocusInside,
        }}
      >
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          {isOpen && (
            <FloatingPortal>
              <FloatingFocusManager
                context={context}
                modal={false}
                initialFocus={isNested ? -1 : 0}
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
                  }}
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
  HTMLButtonElement,
  MenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({label, disabled, ...props}, forwardedRef) => {
  const {activeIndex, setHasFocusInside, getItemProps} =
    React.useContext(MenuContext);
  const item = useListItem({label: disabled ? null : label});
  const tree = useFloatingTree();
  const isActive = item.index === activeIndex;

  return (
    <button
      {...props}
      ref={useMergeRefs([item.ref, forwardedRef])}
      type="button"
      role="menuitem"
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={c(
        'text-left flex py-1 px-2 focus:bg-blue-500 focus:text-white outline-none rounded',
        {'opacity-40': disabled}
      )}
      {...getItemProps({
        onClick(event: React.MouseEvent<HTMLButtonElement>) {
          props.onClick?.(event);
          tree?.events.emit('click');
        },
        onFocus(event: React.FocusEvent<HTMLButtonElement>) {
          props.onFocus?.(event);
          setHasFocusInside(true);
        },
      })}
    >
      {label}
    </button>
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
