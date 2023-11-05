import {autoUpdate, flip, offset, shift} from '@floating-ui/dom';
// import {ChevronRightIcon} from '@radix-ui/react-icons';
import {
  Accessor,
  Component,
  ComponentProps,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  ParentComponent,
  Setter,
  Show,
  splitProps,
  useContext,
} from 'solid-js';

import {
  createFloatingListContext,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  safePolygon,
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
  useRole,
  useTypeahead,
  useUnsafeListItem,
} from '../../../src';

const MenuContext = createContext<{
  getItemProps: (
    userProps?: ComponentProps<'HTMLElement'>,
  ) => Record<string, unknown>;
  activeIndex: Accessor<number | null>;
  setActiveIndex: Setter<number | null>;
  setHasFocusInside: Setter<boolean>;
  allowHover: Accessor<boolean>;
  isOpen: Accessor<boolean>;
  isTyping: Accessor<boolean>;
}>({
  getItemProps: () => ({}),
  activeIndex: () => null,
  setActiveIndex: () => {},
  setHasFocusInside: () => {},
  allowHover: () => true,
  isOpen: () => false,
  isTyping: () => false,
});

interface MenuProps {
  label: string;
  nested?: boolean;
}

export const MenuComponent: ParentComponent<
  // ComponentProps<'button'>
  ComponentProps<'button'> & MenuProps
> = (props) => {
  // = forwardRef<
  //   HTMLButtonElement,
  //   MenuProps & HTMLProps<HTMLButtonElement>
  // >(({children, label, ...props}, forwardedRef) => {
  const [_local, buttonProps] = splitProps(props, ['children', 'label']);
  const [isOpen, setIsOpen] = createSignal(false);
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  const [allowHover, setAllowHover] = createSignal(false);
  const [hasFocusInside, setHasFocusInside] = createSignal(false);

  // const elementsRef: Array<HTMLButtonElement | null> = [];
  // const labelsRef: Array<string | null> = [];

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const isNested = parentId != null;

  const parent = useContext(MenuContext);
  const floatingListContext = createFloatingListContext();

  onMount(
    () => isNested && floatingListContext.parent?.register(refs.reference()),
  );
  onCleanup(() => floatingListContext.parent?.unregister(refs.reference()));

  const floating = useFloating<HTMLButtonElement>({
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
  const {refs, context} = floating;

  const hover = useHover(context, {
    enabled: () => isNested && allowHover(),
    delay: {open: 75},
    handleClose: safePolygon({blockPointerEvents: true}),
  });
  const click = useClick(context, {
    event: 'mousedown',
    toggle: () => !isNested || !allowHover(),
    ignoreMouse: isNested,
  });
  const role = useRole(context, {role: 'menu'});
  const dismiss = useDismiss(context, {bubbles: true});

  const listRef = createMemo(() =>
    floatingListContext
      .items()
      .map((o, i) => (o.hasAttribute('disabled') ? '' : o.textContent ?? '')),
  );
  // const [isTyping, setIsTyping] = createSignal(false);
  const typeahead = useTypeahead(context, {
    listRef,
    onMatch: (i: number) => (isOpen() ? setActiveIndex(i) : undefined),
    // onMatch: setActiveIndex,

    activeIndex,
    // onTypingChange: setIsTyping,
  });

  const listNavigation = useListNavigation(context, {
    enabled: () => !parent.isTyping(), //disable if typing on parent
    listRef: floatingListContext.items, //elementsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
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
  // in the tree().
  function handleTreeClick() {
    setIsOpen(false);
  }

  function onSubMenuOpen(event: {nodeId: string; parentId: string}) {
    if (event.nodeId !== nodeId && event.parentId === parentId) {
      setIsOpen(false);
    }
  }
  createEffect(() => {
    if (!tree()) return;

    tree().events.on('click', handleTreeClick);
    tree().events.on('menuopen', onSubMenuOpen);
    onCleanup(() => {
      tree().events.off('click', handleTreeClick);
      tree().events.off('menuopen', onSubMenuOpen);
    });
  });

  createEffect(() => {
    if (isOpen() && tree()) {
      tree().events.emit('menuopen', {parentId, nodeId});
    }
  });

  // Determine if "hover" logic can run based on the modality of input. This
  // prevents unwanted focus synchronization as menus open and close with
  // keyboard navigation and the cursor is resting on the menu.
  function onPointerMove({pointerType}: PointerEvent) {
    if (pointerType !== 'touch') {
      setAllowHover(true);
    }
  }

  function onKeyDown() {
    setAllowHover(false);
  }
  createEffect(() => {
    window.addEventListener('pointermove', onPointerMove, {
      once: true,
      capture: true,
    });
    window.addEventListener('keydown', onKeyDown, true);
    onCleanup(() => {
      window.removeEventListener('pointermove', onPointerMove, {
        capture: true,
      });
      window.removeEventListener('keydown', onKeyDown, true);
    });
  });

  return (
    <FloatingNode id={nodeId}>
      <button
        ref={(el) => {
          refs.setReference(el);
          props.ref && (props.ref = el);
        }}
        data-open={isOpen() ? '' : undefined}
        tabIndex={
          !isNested
            ? undefined
            : parent.activeIndex() ===
              floatingListContext.getItemIndex(refs.reference())
            ? 0
            : -1
        }
        role={isNested ? 'menuitem' : undefined}
        class={
          'text-left flex gap-4 justify-between items-center rounded py-1 px-2'
        }
        classList={{
          'focus:bg-blue-500 focus:text-white outline-none': isNested,
          'bg-blue-500 text-white': isOpen() && isNested && !hasFocusInside,
          'bg-slate-200 rounded': isNested && isOpen() && hasFocusInside(),
          'bg-slate-200': !isNested && isOpen(),
        }}
        {...getReferenceProps(
          parent.getItemProps({
            ...buttonProps,
            onFocus(
              event: FocusEvent & {
                currentTarget: HTMLButtonElement;
                target: Element;
              },
            ) {
              typeof props.onFocus === 'function' && props.onFocus?.(event);
              setHasFocusInside(false);
              parent.setHasFocusInside(true);
            },
            onMouseEnter(
              event: MouseEvent & {
                currentTarget: HTMLButtonElement;
                target: Element;
              },
            ) {
              typeof props.onMouseEnter === 'function' &&
                props.onMouseEnter?.(event);
              if (parent.allowHover() && parent.isOpen()) {
                parent.setActiveIndex(
                  floatingListContext.getItemIndex(refs.reference()),
                );
              }
            },
          }),
        )}
      >
        {props.label}

        <Show when={isNested}>
          <span aria-hidden class="ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              ></path>
            </svg>
          </span>
        </Show>
      </button>
      <MenuContext.Provider
        value={{
          activeIndex,
          setActiveIndex,
          getItemProps,
          setHasFocusInside,
          allowHover,
          isOpen,
          isTyping: () => context().dataRef.typing,
        }}
      >
        <FloatingList context={floatingListContext}>
          <Show when={isOpen()}>
            <FloatingPortal>
              <FloatingFocusManager
                context={context()}
                modal={false}
                initialFocus={isNested ? -1 : 0}
                returnFocus={!isNested}
              >
                <div
                  data-testId="floating"
                  ref={refs.setFloating}
                  class="flex flex-col p-1 bg-white border rounded shadow-lg outline-none border-slate-900/10 bg-clip-padding"
                  style={floating.floatingStyles}
                  {...getFloatingProps()}
                >
                  {_local.children}
                </div>
              </FloatingFocusManager>
            </FloatingPortal>
          </Show>
        </FloatingList>
      </MenuContext.Provider>
    </FloatingNode>
  );
};

interface MenuItemProps {
  label: string;
  disabled?: boolean;
}

export const MenuItem: Component<ComponentProps<'button'> & MenuItemProps> = (
  props,
) => {
  // = forwardRef<
  //   HTMLButtonElement,
  //   MenuItemProps & ButtonHTMLAttributes<HTMLButtonElement>
  // >(({label, disabled, ...props}, forwardedRef) => {
  let ref!: HTMLButtonElement;
  const menu = useContext(MenuContext);
  const item = useListItem();
  const tree = useFloatingTree();
  const isActive = createMemo(
    () => item.getItemIndex(ref) === menu.activeIndex(),
  );
  onMount(() => item.register(ref));
  onCleanup(() => item.unregister(ref));
  return (
    <button
      {...props}
      ref={(el) => {
        props.ref && (props.ref = el);
        ref = el;
      }}
      type="button"
      role="menuitem"
      tabIndex={isActive() ? 0 : -1}
      disabled={props.disabled}
      class={
        'text-left flex py-1 px-2 focus:bg-blue-500 focus:text-white outline-none rounded'
      }
      classList={{'opacity-40': props.disabled}}
      {...menu.getItemProps({
        onClick(
          event: MouseEvent & {
            currentTarget: HTMLButtonElement;
            target: Element;
          },
        ) {
          typeof props.onClick === 'function' && props.onClick?.(event);
          tree().events.emit('click');
        },
        onFocus(
          event: FocusEvent & {
            currentTarget: HTMLButtonElement;
            target: Element;
          },
        ) {
          typeof props.onFocus === 'function' && props.onFocus?.(event);
          menu.setHasFocusInside(true);
        },
        onMouseEnter(
          event: MouseEvent & {
            currentTarget: HTMLButtonElement;
            target: Element;
          },
        ) {
          typeof props.onMouseEnter === 'function' &&
            props.onMouseEnter?.(event);
          if (menu.allowHover() && menu.isOpen()) {
            menu.setActiveIndex(item.getItemIndex(ref));
          }
        },
      })}
    >
      {props.label}
    </button>
  );
};

export const Menu: ParentComponent<ComponentProps<'button'> & MenuProps> = (
  props,
) => {
  // = forwardRef<
  //   HTMLButtonElement,
  //   MenuProps & HTMLProps<HTMLButtonElement>
  // >((props, ref) => {
  const parentId = useFloatingParentNodeId();

  return (
    <Show when={parentId === null} fallback={<MenuComponent {...props} />}>
      <FloatingTree>
        <MenuComponent {...props} />
      </FloatingTree>
    </Show>
  );
};

export const Main = () => {
  return (
    <>
      <h1 class="mb-8 text-5xl font-bold">Menu</h1>
      <div class="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <Menu label="Edit">
          <MenuItem label="Undo" />
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
