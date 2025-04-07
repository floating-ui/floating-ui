import type {Placement} from '@floating-ui/react';
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
  useHover,
  useId,
  useInteractions,
  useRole,
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
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <Popover
          modal={modal}
          bubbles={true}
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
                      <Button>My button</Button>
                    </Popover>
                    <button onClick={close} className="font-bold">
                      Close
                    </button>
                  </>
                )}
              >
                <Button>My button</Button>
              </Popover>
              <button onClick={close} className="font-bold">
                Close
              </button>
            </>
          )}
        >
          <Button>My button</Button>
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
  hover?: boolean;
}

function PopoverComponent({
  children,
  render,
  placement,
  modal = true,
  bubbles = true,
  hover = false,
}: Props) {
  const [open, setOpen] = useState(false);

  const nodeId = useFloatingNodeId();
  const {floatingStyles, refs, context} = useFloating({
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
    useHover(context, {
      enabled: hover,
      handleClose: safePolygon({blockPointerEvents: true}),
    }),
    useClick(context),
    useRole(context),
    useDismiss(context, {
      bubbles,
    }),
  ]);

  return (
    <FloatingNode id={nodeId}>
      {isValidElement(children) &&
        cloneElement(
          children,
          getReferenceProps({
            ref: refs.setReference,
            'data-open': open ? '' : undefined,
          } as React.HTMLProps<Element>),
        )}
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context} modal={modal}>
            <div
              className="bg-white border border-slate-900/10 shadow-md rounded px-4 py-6 bg-clip-padding"
              ref={refs.setFloating}
              style={floatingStyles}
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
