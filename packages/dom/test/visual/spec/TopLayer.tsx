import {useFloating, autoUpdate, topLayer} from '@floating-ui/react-dom';
import {useEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

const BOOLS = [true, false];
const STACKED = ['none', 'dialog', 'popover'];
type STACKED_TYPES = (typeof STACKED)[number];

const transformStyles = {
  transform: 'rotateX(25deg) rotateY(10deg) translateZ(0px)',
} as const;

type Props = {
  children?: React.ReactNode;
  withMiddleware: boolean;
  withTransform: boolean;
};

function NotStacked({children}: Props) {
  return children;
}

function StackedOnDialog({children, withMiddleware, withTransform}: Props) {
  const {x, y, strategy, refs} = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'bottom',
    strategy: 'fixed',
    middleware: [withMiddleware && topLayer()],
  });

  const buttonStyles = {
    top: '100px',
    left: '100px',
    position: 'absolute',
  } as const;

  const dialogStyles = {
    inset: '0 auto auto 0',
  } as const;

  return (
    <>
      <div
        className="container host"
        style={{
          ...(withTransform ? transformStyles : {}),
          position: 'relative',
        }}
      >
        <button
          id="stack"
          ref={refs.setReference}
          style={buttonStyles}
          onClick={() => {
            (refs.floating.current as unknown as HTMLDialogElement).showModal();
          }}
        >
          Stacked button
        </button>
        <dialog
          ref={refs.setFloating}
          style={{
            ...dialogStyles,
            position: strategy,
            top: y,
            left: x,
          }}
        >
          <h2>Stacked content</h2>
          {children}
        </dialog>
      </div>
    </>
  );
}

function StackedOnPopover({children, withMiddleware, withTransform}: Props) {
  const {x, y, strategy, refs, update} = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'bottom',
    strategy: 'fixed',
    middleware: [withMiddleware && topLayer()],
  });

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }

    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.floating, refs.reference, update]);

  const buttonStyles = {
    top: '100px',
    left: '100px',
    position: 'absolute',
  } as const;

  const dialogStyles = {
    inset: '0 auto auto 0',
  } as const;

  return (
    <>
      <div
        className="container host"
        style={{
          ...(withTransform ? transformStyles : {}),
          position: 'relative',
        }}
      >
        <button
          id="stack"
          ref={refs.setReference}
          style={buttonStyles}
          onClick={() => {
            (
              refs.floating.current as unknown as HTMLDialogElement & {
                showPopover(): void;
              }
            ).showPopover();
          }}
        >
          Stacked button
        </button>
        <dialog
          // @ts-ignore
          popover="auto"
          ref={refs.setFloating}
          style={{
            ...dialogStyles,
            position: strategy,
            top: y ?? '',
            left: x ?? '',
          }}
        >
          <h2>Stacked content</h2>
          {children}
        </dialog>
      </div>
    </>
  );
}

export function TopLayer() {
  const [withMiddleware, setWithMiddleware] = useState(true);
  const [withTransform, setWithTransform] = useState(true);
  const [withPopover, setPopover] = useState(true);
  const [stackedOn, setStackedOn] = useState<STACKED_TYPES>('none');

  const {x, y, strategy, refs} = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'top',
    strategy: 'fixed',
    middleware: [withMiddleware && topLayer()],
  });

  const tooltipStyles = {
    background: '#222',
    color: 'white',
    fontWeight: 'bold',
    padding: '5px',
    borderRadius: '4px',
    fontSize: '90%',
    inset: '0 auto auto 0',
  } as const;

  const styles = `
        dialog:popover-open {
            display: block;
        }
    `;

  const Stack =
    stackedOn === 'none'
      ? NotStacked
      : stackedOn === 'dialog'
        ? StackedOnDialog
        : StackedOnPopover;

  const stackProps = {
    withMiddleware,
    withTransform,
  };

  const classes = `container ${stackedOn === 'none' ? 'host' : ''}`;

  return (
    <>
      <style>{styles}</style>
      <h1>Top Layer Over Transforms</h1>
      <Stack {...stackProps}>
        <div
          className={classes}
          style={{
            ...(withTransform ? transformStyles : {}),
            width: 200,
            height: 200,
          }}
        >
          <button
            id="reference"
            onClick={() => {
              if (withPopover) {
                (
                  refs.floating.current as unknown as HTMLDialogElement & {
                    showPopover(): void;
                  }
                ).showPopover();
              } else {
                (
                  refs.floating.current as unknown as HTMLDialogElement
                ).showModal();
              }
            }}
            ref={refs.setReference}
            aria-describedby="tooltip"
          >
            Test button
          </button>
          <dialog
            // @ts-ignore
            popover="auto"
            ref={refs.setFloating}
            id="tooltip"
            role="tooltip"
            style={{
              ...tooltipStyles,
              position: strategy,
              top: y,
              left: x,
            }}
          >
            Test tooltip
          </dialog>
        </div>
      </Stack>

      <h2>withMiddleware</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`withMiddleware-${bool}`}
            onClick={() => setWithMiddleware(bool)}
            style={{
              backgroundColor: bool === withMiddleware ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>withTransform</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`withTransform-${bool}`}
            onClick={() => setWithTransform(bool)}
            style={{
              backgroundColor: bool === withTransform ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>withPopover</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`withPopover-${bool}`}
            onClick={() => setPopover(bool)}
            style={{
              backgroundColor: bool === withPopover ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>stackedOn</h2>
      <Controls>
        {STACKED.map((stack) => (
          <button
            key={String(stack)}
            data-testid={`stackedOn-${stack}`}
            onClick={() => setStackedOn(stack)}
            style={{
              backgroundColor: stack === stackedOn ? 'black' : '',
            }}
          >
            {stack}
          </button>
        ))}
      </Controls>
    </>
  );
}
