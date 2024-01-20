import {
  useFloating,
  autoUpdate,
  topLayer,
  flip,
  platform,
} from '@floating-ui/react-dom';
import {useState} from 'react';

import {Controls} from '../utils/Controls';

const BOOLS = [true, false];
const STACKED = ['none', 'dialog', 'popover'];
type STACKED_TYPES = (typeof STACKED)[number];

const transformStyles = {
  transform: 'translateZ(0px)',
} as const;

type Props = {
  children?: React.ReactNode;
  withMethod: boolean;
  withTransform: boolean;
};

function NotStacked({children}: Props) {
  return children;
}

function StackedOnDialog({children, withMethod, withTransform}: Props) {
  const {x, y, strategy, refs} = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'bottom',
    strategy: 'fixed',
    middleware: [flip()],
    platform: {
      ...platform,
      topLayer: withMethod ? topLayer : undefined,
    },
  });

  const buttonStyles = {
    position: 'absolute',
    top: 100,
    left: 100,
  } as const;

  const dialogStyles = {
    margin: 0,
    border: 'none',
    backgroundColor: '#ccc',
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

function StackedOnPopover({children, withMethod, withTransform}: Props) {
  const {x, y, strategy, refs} = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'bottom',
    strategy: 'fixed',
    middleware: [flip()],
    platform: {
      ...platform,
      topLayer: withMethod ? topLayer : undefined,
    },
  });

  const buttonStyles = {
    position: 'absolute',
    top: 100,
    left: 100,
  } as const;

  const dialogStyles = {
    margin: 0,
    border: 'none',
    backgroundColor: '#ccc',
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

export function TopLayer() {
  const [withMethod, setWithMethod] = useState(true);
  const [withTransform, setWithTransform] = useState(true);
  const [withPopover, setPopover] = useState(true);
  const [stackedOn, setStackedOn] = useState<STACKED_TYPES>('none');
  const [collision, setCollision] = useState(false);

  const {x, y, strategy, refs} = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'top',
    strategy: 'fixed',
    middleware: [collision && flip()],
    platform: {
      ...platform,
      topLayer: withMethod ? topLayer : undefined,
    },
  });

  const tooltipStyles = {
    width: 100,
    height: 75,
    margin: 0,
    border: 'none',
  } as const;

  const styles = `
    dialog:popover-open {
      display: block;
    }

    .host {
      border-width: 5px;
    }
`;

  const Stack =
    stackedOn === 'none'
      ? NotStacked
      : stackedOn === 'dialog'
        ? StackedOnDialog
        : StackedOnPopover;

  const stackProps = {
    withMethod,
    withTransform,
  };

  const classes = `container ${stackedOn === 'none' ? 'host' : ''}`;

  return (
    <>
      <style>{styles}</style>
      <h1
        style={{display: 'flex', alignItems: 'center', height: 100, margin: 0}}
      >
        Top Layer
      </h1>
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
            Reference
          </button>
          <dialog
            // @ts-ignore
            popover="auto"
            ref={refs.setFloating}
            id="tooltip"
            role="tooltip"
            className="floating"
            style={{
              ...tooltipStyles,
              display: 'revert',
              position: strategy,
              top: y,
              left: x,
              ...(collision && {
                height: 100,
              }),
            }}
          >
            Floating
          </dialog>
        </div>
      </Stack>

      <h2>Collision</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`collision-${bool}`}
            onClick={() => setCollision(bool)}
            style={{
              backgroundColor: bool === collision ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>withMethod</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`withMethod-${bool}`}
            onClick={() => setWithMethod(bool)}
            style={{
              backgroundColor: bool === withMethod ? 'black' : '',
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
