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
  useMergeRefs,
} from '@floating-ui/react';
import {ChevronRightIcon} from '@radix-ui/react-icons';
import * as React from 'react';

interface SubItemProps {
  label: string;
  href: string;
}

export const NavigationSubItem = React.forwardRef<
  HTMLAnchorElement,
  SubItemProps & React.HTMLProps<HTMLAnchorElement>
>(function NavigationSubItem({label, href, ...props}, ref) {
  return (
    <a {...props} ref={ref} href={href} className="NavigationItem">
      {label}
    </a>
  );
});

interface ItemProps {
  label: string;
  href: string;
  children?: React.ReactNode;
}

export const NavigationItem = React.forwardRef<
  HTMLAnchorElement,
  ItemProps & React.HTMLProps<HTMLAnchorElement>
>(function NavigationItem({children, label, href, ...props}, ref) {
  const [open, setOpen] = React.useState(false);
  const hasChildren = !!children;

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

  const mergedReferenceRef = useMergeRefs([ref, refs.setReference]);

  return (
    <FloatingNode id={nodeId}>
      <li>
        <a
          href={href}
          ref={mergedReferenceRef}
          className="w-48 bg-slate-100 p-2 rounded my-1 flex justify-between items-center"
          {...getReferenceProps(props)}
        >
          {label}
          {hasChildren && <ChevronRightIcon />}
        </a>
      </li>
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={-1}
          >
            <div
              data-testid="subnavigation"
              ref={refs.setFloating}
              className="flex flex-col bg-slate-100 overflow-y-auto rounded outline-none px-4 py-2 backdrop-blur-sm"
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <button type="button" onClick={() => setOpen(false)}>
                Close
              </button>
              <ul className="flex flex-col">{children}</ul>
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </FloatingNode>
  );
});

interface NavigationProps {
  children?: React.ReactNode;
}

export const Navigation = (props: NavigationProps) => {
  return (
    <nav className="Navigation">
      <ul className="NavigationList">{props.children}</ul>
    </nav>
  );
};

export const Main = () => {
  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Navigation</h1>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
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
