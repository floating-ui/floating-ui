import {
  ElementProps,
  ExtendedRefs,
  Placement,
  ReferenceType,
  useDismiss,
  useFloating,
  UseFloatingReturn,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';
import {
  createContext,
  forwardRef,
  HTMLAttributes,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {Button} from '../lib/Button';

type Id = string;
type ToastType = {
  id: Id;
  placement: Placement;
  render: () => ReactNode;
};
type ToastsType = Array<ToastType>;

type ContextType = {
  listRef: MutableRefObject<Array<HTMLElement | null>>;
  toasts: ToastsType;
  placements: Set<Placement>;
  dismiss: ElementProps;
  toast: (toast: Omit<ToastType, 'id'>) => void;
  close: (toastId: Id) => void;
  refs: ExtendedRefs<ReferenceType>;
} & UseFloatingReturn;

export const Main = () => (
  <ToastProvider>
    <Component />
  </ToastProvider>
);

const Component = () => {
  const {toast} = useToast();

  return (
    <ToastProvider>
      <>
        <h1 className="text-5xl font-bold mb-8">Toast</h1>
        <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
          <Button
            onClick={() =>
              toast({
                placement: 'top',
                render: () => (
                  <div className="w-[300px] bg-white p-4 mb-4 rounded-lg shadow-lg flex">
                    Hello
                  </div>
                ),
              })
            }
          >
            Add Toast
          </Button>
        </div>
      </>
    </ToastProvider>
  );
};

export function generateUEID() {
  const first = ('000' + ((Math.random() * 46656) | 0).toString(36)).slice(-3);
  const second = ('000' + ((Math.random() * 46656) | 0).toString(36)).slice(-3);
  return `${first}${second}`;
}

export function useToasts({placement = 'top'}: {placement?: Placement}) {
  const [toasts, setToasts] = useState<ToastsType>([]);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const [placements, setPlacements] = useState(new Set<Placement>([]));

  const data = useFloating({
    placement,
    open: true,
  });

  const toast = useCallback(({placement, render}: Omit<ToastType, 'id'>) => {
    setPlacements((prev) => {
      const placements = new Set(prev);
      placements.add(placement);
      return placements;
    });
    setToasts((prev) => [
      ...prev,
      {
        id: generateUEID(),
        placement,
        render,
      },
    ]);
  }, []);

  const close = useCallback((toastId: Id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const dismiss = useDismiss(data.context);

  return useMemo(
    () => ({
      listRef,
      toasts,
      placements,
      dismiss,
      toast,
      close,
      ...data,
    }),
    [listRef, toasts, placements, dismiss, toast, close, data]
  );
}

const ToastContext = createContext<ContextType>(null as any);

export const useToastsContext = () => {
  const context = useContext(ToastContext);

  if (context == null) {
    throw new Error('Toast components must be wrapped in <ToastProvider />');
  }

  return context;
};

const useToast = () => {
  return useToastsContext();
};

const getToastPosition = (placement?: Placement) => {
  if (placement == null) return {};

  const placements = placement.split('-');
  if (placements[0] === 'top' || placements[0] === 'bottom') {
    return {
      margin: '0 auto',
      top: placements[0] === 'top' ? '20px' : undefined,
      bottom: placements[0] === 'bottom' ? '20px' : undefined,
      left:
        placements[1] === undefined
          ? 0
          : placements[1] === 'start'
          ? '20px'
          : 'auto',
      right:
        placements[1] === undefined
          ? 0
          : placements[1] === 'end'
          ? '20px'
          : 'auto',
    };
  }

  if (placements[0] === 'left' || placements[0] === 'right') {
    return {
      left: placements[0] === 'left' ? '20px' : undefined,
      right: placements[0] === 'right' ? '20px' : undefined,
      top:
        placements[1] === undefined
          ? '50%'
          : placements[1] === 'start'
          ? '20px'
          : 'auto',
      bottom:
        placements[1] === undefined
          ? 0
          : placements[1] === 'end'
          ? '20px'
          : 'auto',
    };
  }

  return {};
};

export function ToastProvider({
  placement,
  children,
}: {
  placement?: Placement;
  children: ReactNode;
}) {
  const context = useToasts({placement});
  const {getFloatingProps} = useInteractions([context.dismiss]);

  return (
    <ToastContext.Provider value={context}>
      {Array.from(context.placements).map((placement) => {
        const toasts = context.toasts.filter(
          (toast) => toast.placement === placement
        );

        return (
          <ul
            key={placement}
            ref={context.refs.setFloating}
            aria-live="polite"
            style={{
              position: context.strategy,
              padding: 0,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 9999,
              ...getToastPosition(placement),
            }}
            {...getFloatingProps({
              role: 'region',
            })}
          >
            {toasts.map(({id, placement, render}, index) => (
              <ToastContent
                key={id}
                toastId={id}
                placement={placement}
                ref={(node) => {
                  context.listRef.current[index] = node;
                }}
              >
                {render()}
              </ToastContent>
            ))}
          </ul>
        );
      })}
      {children}
    </ToastContext.Provider>
  );
}

// Pauses closing the toast when the mouse is over the toast
export const useTimeout = (fn: (...args: any) => void, duration: number) => {
  const [isRunning, setIsRunning] = useState(true);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const timerId = setTimeout(() => {
        fn();
      }, duration);

      return () => clearTimeout(timerId);
    }
  }, [isRunning, duration, fn]);

  return {
    start,
    stop,
  };
};

type ToastContentProps = {
  toastId: Id;
  placement: Placement;
  isClosable?: boolean;
  children: ReactNode;
} & HTMLAttributes<HTMLLIElement>;

export const ToastContent = forwardRef<HTMLLIElement, ToastContentProps>(
  ({toastId, placement, children}, propRef) => {
    const duration = 300;
    const [closeStyle, setCloseStyle] = useState<React.CSSProperties>({});
    const {context, close, dismiss} = useToastsContext();
    const {getItemProps} = useInteractions([dismiss]);
    const {styles} = useTransitionStyles(context, {
      duration,
      initial: () => ({
        opacity: 0,
      }),
      open: ({side}) => ({
        opacity: 1,
        transform: {
          top: 'translateY(-0.5rem)',
          right: 'translateX(0.5rem)',
          bottom: 'translateY(0.5rem)',
          left: 'translateX(-0.5rem)',
        }[side],
      }),
    });

    const closeToast = useCallback(() => {
      setCloseStyle({
        opacity: 0,
        maxHeight: 0,
        transition: `max-height ${duration}ms, opacity ${duration}ms`,
      });
      setTimeout(() => {
        close(toastId);
      }, duration);
    }, [close, toastId, duration, setCloseStyle]);

    const {start, stop} = useTimeout(closeToast, 3000);

    return (
      <li
        className={toastId}
        ref={propRef}
        role="status"
        aria-atomic="true"
        aria-hidden="false"
        tabIndex={0}
        style={{
          display: 'flex',
          maxHeight: '100vh',
          flexDirection: 'column',
          alignItems: placement.includes('left')
            ? 'flex-start'
            : placement.includes('right')
            ? 'flex-end'
            : 'center',
          ...styles,
          ...closeStyle,
        }}
        {...getItemProps({
          onKeyDown: (e) => {
            // Should useDismiss be used to handle closing with esc?
            if (e.key === 'Enter' || e.key === 'Escape') {
              close(toastId);
            }
          },
          onFocus: () => {
            stop();
          },
          onBlur: () => {
            start();
          },
          onMouseOver: () => {
            stop();
          },
          onMouseLeave: () => {
            start();
          },
        })}
      >
        {children}
      </li>
    );
  }
);
