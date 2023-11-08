import {
  children,
  Component,
  createMemo,
  createSignal,
  JSX,
  ParentComponent,
  ParentProps,
  Show,
  splitProps,
} from 'solid-js';

import {
  flip,
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFocus,
  useHover,
  useInteractions,
} from '../../../src';
// import {ChevronRightIcon} from '@radix-ui/react-icons';

interface SubItemProps {
  label: string;
  href: string;
}

// export const NavigationSubItem = React.forwardRef<
//   HTMLAnchorElement,
//   SubItemProps & React.HTMLProps<HTMLAnchorElement>
// >(({label, href, ...props}, ref)
export const NavigationSubItem: Component<
  JSX.HTMLAttributes<HTMLAnchorElement> & SubItemProps
> = (props) => {
  return (
    <a {...props} class="NavigationItem">
      {props.label}
    </a>
  );
};

interface ItemProps {
  label: string;
  href: string;
}

// export const NavigationItem = React.forwardRef<
//   HTMLAnchorElement,
//   ItemProps & React.HTMLProps<HTMLAnchorElement>
// >(({children, label, href, ...props}, ref) => {
export const NavigationItem: ParentComponent<
  JSX.AnchorHTMLAttributes<HTMLAnchorElement> & ItemProps
> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [local, rest] = splitProps(props, ['label', 'href', 'children', 'ref']);
  const getChildren = children(() => local.children);
  const hasChildren = createMemo(() => getChildren.toArray().length > 0);

  const nodeId = useFloatingNodeId();

  const {floatingStyles, refs, context} = useFloating<HTMLAnchorElement>({
    open,
    nodeId,
    onOpenChange: setOpen,
    middleware: [offset(8), flip(), shift()],
    placement: 'right-start',
  });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, {
      handleClose: safePolygon(),
      enabled: hasChildren,
    }),
    useFocus(context, {
      enabled: hasChildren,
    }),
    useDismiss(context, {
      enabled: hasChildren,
    }),
  ]);

  // const mergedReferenceRef = useMergeRefs([ref, refs.setReference]);

  return (
    <FloatingNode id={nodeId}>
      <li>
        <a
          href={local.href}
          ref={(el) => {
            // eslint-disable-next-line solid/reactivity
            typeof local.ref === 'function' ? local.ref(el) : (local.ref = el);
            refs.setReference(el);
          }}
          class="w-48 bg-slate-100 p-2 rounded my-1 flex justify-between items-center"
          {...getReferenceProps(rest as any)}
        >
          {local.label}
          <Show when={hasChildren()}>
            <span>{' >> '}</span>
          </Show>
        </a>
      </li>
      <FloatingPortal>
        <Show when={open()}>
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={-1}
          >
            <div
              data-testid="subnavigation"
              ref={refs.setFloating}
              class="flex flex-col bg-slate-100 overflow-y-auto rounded outline-none px-4 py-2 backdrop-blur-sm"
              style={floatingStyles()}
              {...getFloatingProps()}
            >
              <button type="button" onClick={() => setOpen(false)}>
                Close
              </button>
              <ul class="flex flex-col">{getChildren()}</ul>
            </div>
          </FloatingFocusManager>
        </Show>
      </FloatingPortal>
    </FloatingNode>
  );
};

export const Navigation = (props: ParentProps) => {
  return (
    <nav class="Navigation">
      <ul class="NavigationList">{props.children}</ul>
    </nav>
  );
};

export const Main = () => {
  return (
    <>
      <h1 class="text-5xl font-bold mb-8">Navigation</h1>
      <div class="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <Navigation>
          <NavigationItem label="Home" href="#" />
          <NavigationItem label="Product" href="#">
            <NavigationSubItem label="Link 1" href="#" />
            <NavigationSubItem label="Link 2" href="#" />
            <NavigationSubItem label="Link 3" href="#" />
          </NavigationItem>
          <NavigationItem label="About" href="#" />
        </Navigation>
      </div>
    </>
  );
};
