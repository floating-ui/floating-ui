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

export type AppearanceTypes = 'error' | 'info' | 'success' | 'warning';
export type Id = string;

type ToastType = {
  id: Id;
  placement: Placement;
  render: () => ReactNode;
};
type ToastsType = Array<ToastType>;

type ContextType = {
  listRef: MutableRefObject<Array<HTMLElement | null>>;
  toasts: ToastsType;
  dismiss: ElementProps;
  toast: (toast: Omit<ToastType, 'id'>) => void;
  close: (toastId: string) => void;
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

  const data = useFloating({
    placement,
    open: true,
  });

  const toast = useCallback(({placement, render}: Omit<ToastType, 'id'>) => {
    setToasts((prev) => [
      ...prev,
      {
        id: generateUEID(),
        placement,
        render,
      },
    ]);
  }, []);

  const close = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const dismiss = useDismiss(data.context);

  return useMemo(
    () => ({
      listRef,
      toasts,
      dismiss,
      toast,
      close,
      ...data,
    }),
    [listRef, toasts, dismiss, toast, close, data]
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
      <ul
        ref={context.refs.setFloating}
        aria-live="polite"
        style={{
          position: context.strategy,
          // TODO: dynamic style from placement prop
          left: '50%',
          transform: 'translateX(-50%)',
          padding: 0,
          margin: 0,
        }}
        {...getFloatingProps({
          role: 'region',
        })}
      >
        {context.toasts.map(({id, render}, index) => (
          <ToastContent
            key={id}
            toastId={id}
            ref={(node) => {
              context.listRef.current[index] = node;
            }}
          >
            {render()}
          </ToastContent>
        ))}
      </ul>
      {children}
    </ToastContext.Provider>
  );
}

type ToastContentProps = {
  toastId: Id;
  isClosable?: boolean;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const ToastContent = forwardRef<HTMLLIElement, ToastContentProps>(
  ({toastId, children}, propRef) => {
    const [timerId, setTimerId] = useState();
    const [isRunning, setIsRunning] = useState(false);
    const {context, close, dismiss} = useToastsContext();
    // auto dismiss timer
    const [remainingTime, setRemainingTime] = useState(5000);
    const [startTime, setStartTime] = useState<number>(0);
    const {getItemProps} = useInteractions([dismiss]);
    const {styles} = useTransitionStyles(context, {
      duration: 300,
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

    const startTimer = () => {
      setIsRunning(true);
      setStartTime(Date.now());
    };

    const stopTimer = () => {
      setIsRunning(false);
      setRemainingTime(
        (remainingTime) => remainingTime - (Date.now() - startTime)
      );
      clearTimeout(timerId);
    };

    useEffect(() => {
      startTimer();
      // fire only once
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (isRunning) {
        const id = setTimeout(() => {
          close(toastId);
          clearTimeout(timerId);
        }, remainingTime);
        // @ts-ignore
        setTimerId(id);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning]);

    return (
      <li
        className={toastId}
        ref={propRef}
        role="status"
        aria-atomic="true"
        aria-hidden="false"
        tabIndex={0}
        style={styles}
        {...getItemProps({
          onKeyDown: (e) => {
            // Should useDismiss be used to handle closing with esc?
            if (e.key === 'Enter' || e.key === 'Escape') {
              close(toastId);
            }
          },
          onFocus: () => {
            stopTimer();
          },
          onBlur: () => {
            startTimer();
          },
          onMouseOver: () => {
            stopTimer();
          },
          onMouseLeave: () => {
            startTimer();
          },
        })}
      >
        {children}
      </li>
    );
  }
);
