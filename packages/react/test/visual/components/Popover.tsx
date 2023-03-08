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
  useTransitionStatus,
} from '@floating-ui/react';
import * as Checkbox from '@radix-ui/react-checkbox';
import {CheckIcon} from '@radix-ui/react-icons';
import {cloneElement, isValidElement, useState} from 'react';

import {Button} from '../lib/Button';

export const Main = () => {
  const [modal, setModal] = useState(true);

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Popover</h1>
      <div className="flex place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <Popover
          modal={modal}
          bubbles={true}
          transitionDuration={1000}
          render={({labelId, descriptionId, close}) => (
            <>
              <h2 id={labelId} className="text-2xl font-bold mb-2">
                Title
              </h2>
              <p id={descriptionId} className="mb-2">
                Description
              </p>
              <Popover
                modal={modal}
                bubbles={true}
                transitionDuration={1000}
                render={({labelId, descriptionId, close}) => (
                  <>
                    <h2 id={labelId} className="text-2xl font-bold mb-2">
                      Title
                    </h2>
                    <p id={descriptionId} className="mb-2">
                      Description
                    </p>
                    <Popover
                      modal={modal}
                      bubbles={false}
                      transitionDuration={1000}
                      render={({labelId, descriptionId, close}) => (
                        <>
                          <h2 id={labelId} className="text-2xl font-bold mb-2">
                            Title
                          </h2>
                          <p id={descriptionId} className="mb-2">
                            Description
                          </p>
                          <button onClick={close} className="font-bold">
                            Close
                          </button>
                        </>
                      )}
                    >
                      <Button>First third button</Button>
                    </Popover>
                    <button onClick={close} className="font-bold">
                      Close
                    </button>
                  </>
                )}
              >
                <Button>First second button</Button>
              </Popover>
              <button onClick={close} className="font-bold">
                Close
              </button>
            </>
          )}
        >
          <Button>First button</Button>
        </Popover>
        <Popover
          modal={modal}
          bubbles={true}
          transitionDuration={1000}
          render={({labelId, descriptionId, close}) => (
            <>
              <h2 id={labelId} className="text-2xl font-bold mb-2">
                Title
              </h2>
              <p id={descriptionId} className="mb-2">
                Description
              </p>
              <Popover
                modal={modal}
                bubbles={true}
                transitionDuration={1000}
                render={({labelId, descriptionId, close}) => (
                  <>
                    <h2 id={labelId} className="text-2xl font-bold mb-2">
                      Title
                    </h2>
                    <p id={descriptionId} className="mb-2">
                      Description
                    </p>
                    <Popover
                      modal={modal}
                      bubbles={false}
                      transitionDuration={1000}
                      render={({labelId, descriptionId, close}) => (
                        <>
                          <h2 id={labelId} className="text-2xl font-bold mb-2">
                            Title
                          </h2>
                          <p id={descriptionId} className="mb-2">
                            Description
                          </p>
                          <button onClick={close} className="font-bold">
                            Close
                          </button>
                        </>
                      )}
                    >
                      <Button>Second third button</Button>
                    </Popover>
                    <button onClick={close} className="font-bold">
                      Close
                    </button>
                  </>
                )}
              >
                <Button>Second second button</Button>
              </Popover>
              <button onClick={close} className="font-bold">
                Close
              </button>
            </>
          )}
        >
          <Button>Second button</Button>
        </Popover>
      </div>

      <label className="flex items-center">
        <Checkbox.Root
          className="bg-slate-900 text-white rounded w-5 h-5 mr-2 grid place-items-center shadow"
          checked={modal}
          onCheckedChange={(value) =>
            value ? setModal(true) : setModal(false)
          }
        >
          <Checkbox.Indicator>
            <CheckIcon className="h-5" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        Modal focus management
      </label>
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
  children?: React.ReactElement<HTMLElement>;
  bubbles?: boolean;
  transitionDuration?: number;
}

function PopoverComponent({
  children,
  render,
  placement,
  modal = true,
  bubbles = true,
  transitionDuration = 0,
}: Props) {
  const [open, setOpen] = useState(false);

  const nodeId = useFloatingNodeId();
  const {x, y, strategy, refs, context} = useFloating({
    nodeId,
    open,
    placement,
    onOpenChange: setOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
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

  const {isMounted} = useTransitionStatus(context, {
    duration: transitionDuration,
  });

  return (
    <FloatingNode id={nodeId}>
      {isValidElement(children) &&
        cloneElement(
          children,
          getReferenceProps({
            ref: refs.setReference,
            'data-open': open ? '' : undefined,
          } as React.HTMLProps<Element>)
        )}
      <FloatingPortal>
        {isMounted && (
          <FloatingFocusManager context={context} modal={modal}>
            <div
              className="bg-white border border-slate-900/10 shadow-md rounded px-4 py-6 bg-clip-padding"
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
              }}
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              {...getFloatingProps()}
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
