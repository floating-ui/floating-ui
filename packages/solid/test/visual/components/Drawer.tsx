import {createMediaQuery} from '@solid-primitives/media';
import {
  Accessor,
  createMemo,
  createSignal,
  createUniqueId,
  JSX,
  Show,
} from 'solid-js';

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '../../../src';
import {Button} from '../lib/Button';

export const Main = (props: Partial<Props>) => {
  return (
    <>
      <h1 class="mb-8 text-5xl font-bold">Drawer</h1>
      <div class="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <Drawer
          {...props}
          render={({labelId, descriptionId, close}) => (
            <>
              <h2 id={labelId} class="text-xl font-bold">
                Title
              </h2>
              <p id={descriptionId}>Description</p>
              <Button class="mt-4 bg-white" onClick={close}>
                Close
              </Button>
            </>
          )}
        >
          <Button>My button</Button>
        </Drawer>
        <Button>Next button</Button>
        <div id="drawer-root"></div>
      </div>
    </>
  );
};
interface Props {
  render: (data: {
    close: () => void;
    labelId: string;
    descriptionId: string;
  }) => JSX.Element;
  children?: JSX.Element;
  modal?: boolean;
}

export function Drawer(props: Props) {
  const [open, setOpen] = createSignal(false);

  const isLargeScreen = createMediaQuery('(min-width: 1400px)', true);
  const {refs, context} = useFloating({open, onOpenChange: setOpen});

  const id = createUniqueId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const modal = createMemo(() =>
    props.modal !== undefined ? props.modal : !isLargeScreen(),
  );

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context, {
      outsidePress: modal,
      outsidePressEvent: 'mousedown',
    }),
  ]);

  const Content = () => (
    <FloatingFocusManager
      context={context()}
      modal={modal()}
      closeOnFocusOut={modal()}
    >
      <div
        ref={refs.setFloating}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        class="absolute top-0 right-0 w-48 h-full p-4 bg-slate-100"
        {...getFloatingProps()}
      >
        {props.render({
          labelId,
          descriptionId,
          close: () => setOpen(false),
        })}
      </div>
    </FloatingFocusManager>
  );

  return (
    <>
      {/* {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ref: refs.setReference}))} */}
      <div {...getReferenceProps()} tabIndex={-1}>
        {props.children}
      </div>
      <FloatingPortal id="drawer-root">
        <Show when={open()}>
          <Show when={modal()} fallback={<Content />}>
            <FloatingOverlay
              lockScroll
              style={{background: 'rgba(0, 0, 0, 0.8)', 'z-index': 1}}
            >
              {<Content />}
            </FloatingOverlay>
          </Show>
        </Show>
      </FloatingPortal>
    </>
  );
}
