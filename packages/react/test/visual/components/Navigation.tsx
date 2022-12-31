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
} from '@floating-ui/react';
import * as React from 'react';
import mergeRefs from 'react-merge-refs';

interface SubItemProps {
  label: string;
  href: string;
}

export const NavigationSubItem = React.forwardRef<
  HTMLAnchorElement,
  SubItemProps & React.HTMLProps<HTMLAnchorElement>
>(({label, href, ...props}, ref) => {
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
>(({children, label, href, ...props}, ref) => {
  const [open, setOpen] = React.useState(false);
  const hasChildren = !!children;

  const nodeId = useFloatingNodeId();

  const {x, y, reference, floating, strategy, context} =
    useFloating<HTMLAnchorElement>({
      open,
      nodeId,
      onOpenChange: setOpen,
      middleware: [offset({mainAxis: 4, alignmentAxis: -5}), flip(), shift()],
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

  const mergedReferenceRef = React.useMemo(
    () => mergeRefs([ref, reference]),
    [reference, ref]
  );

  return (
    <FloatingNode id={nodeId}>
      <li>
        <a
          href={href}
          ref={mergedReferenceRef}
          {...getReferenceProps({
            ...props,
            className: `NavigationItem`,
          })}
        >
          {label}
        </a>
      </li>
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            modal={false}
            returnFocus={true}
            initialFocus={-1}
          >
            <div
              data-testid="subnavigation"
              ref={floating}
              className="SubNavigation"
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
              }}
              {...getFloatingProps()}
            >
              <button type="button" onClick={() => setOpen(false)}>
                Close
              </button>
              <ul className="NavigationList">{children}</ul>
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
    <Navigation>
      <NavigationItem label="Home" href="#" />
      <NavigationItem label="Product" href="#">
        <NavigationSubItem label="Link 1" href="#" />
        <NavigationSubItem label="Link 2" href="#" />
        <NavigationSubItem label="Link 3" href="#" />
      </NavigationItem>
      <NavigationItem label="About" href="#" />
    </Navigation>
  );
};
