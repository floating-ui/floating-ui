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

import {Button} from '../lib/Button';

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
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [allowHover, setAllowHover] = React.useState(false);
  const [landed, setLanded] = React.useState(false);

  if (!open && landed) {
    setLanded(false);
  }

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

  const {x, y, strategy, refs, context} = useFloating<HTMLButtonElement>({
    open,
    nodeId,
    onOpenChange: setOpen,
    placement: nested ? 'right-start' : 'bottom-start',
    middleware: [
      offset({mainAxis: nested ? -1 : 5, alignmentAxis: nested ? -5 : 0}),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useHover(context, {
      handleClose: safePolygon({
        restMs: 25,
        blockPointerEvents: true,
      }),
      enabled: nested && allowHover,
      delay: {open: 75},
    }),
    useClick(context, {
      toggle: !nested || !allowHover,
      event: 'mousedown',
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
  }, [tree]);

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
    ref: referenceRef,
    ...props,
    onFocus(event: React.FocusEvent<HTMLButtonElement>) {
      props.onFocus?.(event);
      setLanded(false);
    },
    onClick(event) {
      event.stopPropagation();
    },
    ...(nested && {
      // Indicates this is a nested <Menu /> acting as a <MenuItem />.
      role: 'menuitem',
    }),
  });

  return (
    <FloatingNode id={nodeId}>
      {nested ? (
        <button
          {...referenceProps}
          className={c(
            'text-left flex gap-4 justify-between items-center rounded py-1 px-2',
            {
              'focus:bg-blue-500 focus:text-white outline-none': nested,
              'bg-blue-500 text-white': open && !landed && nested,
              'bg-slate-200': open && landed,
              'border border-slate-300': !nested,
              'bg-slate-200 rounded py-1 px-2': !nested && open,
            }
          )}
          data-open={open ? '' : undefined}
        >
          {label} {nested && <ChevronRightIcon aria-hidden />}
        </button>
      ) : (
        <Button {...referenceProps} data-open={open ? '' : undefined}>
          Edit
        </Button>
      )}
      <FloatingPortal>
        {isMounted && (
          <FloatingFocusManager
            context={context}
            modal={false}
            returnFocus={nested ? !allowHover : true}
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
                      ref(node: HTMLButtonElement) {
                        listItemsRef.current[index] = node;
                      },
                      onFocus() {
                        setLanded(true);
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
    <>
      <h1 className="text-5xl font-bold mb-8">Menu</h1>
      <div className="grid place-items-center border border-slate-400 rounded w-[40rem] h-[20rem] mb-4">
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
