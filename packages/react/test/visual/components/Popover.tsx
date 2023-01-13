import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useId,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import {cloneElement, isValidElement, useEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

export const Main = () => {
  const [modal, setModal] = useState(true);

  return (
    <>
      <h1>Popover</h1>
      <p>A floating element that displays rich content.</p>
      <div className="container">
        <Popover
          modal={modal}
          bubbles={true}
          render={({labelId, descriptionId, close}) => (
            <>
              <h2 id={labelId}>A label/title</h2>
              <p id={descriptionId}>A description/paragraph</p>
              <Popover
                modal={modal}
                bubbles={true}
                render={({labelId, descriptionId, close}) => (
                  <>
                    <h2 id={labelId}>A label/title</h2>
                    <p id={descriptionId}>A description/paragraph</p>
                    <Popover
                      modal={modal}
                      bubbles={false}
                      render={({labelId, descriptionId, close}) => (
                        <>
                          <h2 id={labelId}>A label/title</h2>
                          <p id={descriptionId}>A description/paragraph</p>
                          <button onClick={close}>Close</button>
                        </>
                      )}
                    >
                      <button>My button</button>
                    </Popover>
                    <button onClick={close}>Close</button>
                  </>
                )}
              >
                <button>My button</button>
              </Popover>
              <button onClick={close}>Close</button>
            </>
          )}
        >
          <button>My button</button>
        </Popover>
      </div>

      <h2>Modal</h2>
      <Controls>
        <button
          onClick={() => setModal(true)}
          style={{background: modal ? 'black' : ''}}
        >
          true
        </button>
        <button
          onClick={() => setModal(false)}
          style={{background: !modal ? 'black' : ''}}
        >
          false
        </button>
      </Controls>
    </>
  );
};
interface Props {
  render: (data: {
    close: () => void;
    labelId: string;
    descriptionId: string;
  }) => React.ReactNode;
  placement?: Placement;
  modal?: boolean;
  children?: React.ReactNode;
  bubbles?: boolean;
}

function PopoverComponent({
  children,
  render,
  placement,
  modal = true,
  bubbles = true,
}: Props) {
  const [open, setOpen] = useState(false);

  const nodeId = useFloatingNodeId();
  const {x, y, reference, floating, strategy, refs, update, context} =
    useFloating({
      nodeId,
      open,
      onOpenChange: setOpen,
      middleware: [offset(5), flip(), shift()],
      placement,
    });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context, {
      bubbles,
    }),
  ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [open, update, refs.reference, refs.floating]);

  return (
    <FloatingNode id={nodeId}>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ref: reference}))}
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context} modal={modal}>
            <div
              {...getFloatingProps({
                className: 'Popover',
                ref: floating,
                style: {
                  position: strategy,
                  top: y ?? '',
                  left: x ?? '',
                },
                'aria-labelledby': labelId,
                'aria-describedby': descriptionId,
              })}
            >
              {render({
                labelId,
                descriptionId,
                close: () => setOpen(false),
              })}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </FloatingNode>
  );
}

export function Popover(props: Props) {
  const parentId = useFloatingParentNodeId();

  // This is a root, so we wrap it with the tree
  if (parentId === null) {
    return (
      <FloatingTree>
        <PopoverComponent {...props} />
      </FloatingTree>
    );
  }

  return <PopoverComponent {...props} />;
}
