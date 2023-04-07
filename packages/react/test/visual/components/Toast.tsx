import {
  ElementProps,
  ExtendedRefs,
  inner,
  Placement,
  ReferenceType,
  useDismiss,
  useFloating,
  UseFloatingReturn,
  useInteractions,
  useListNavigation,
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
type Options = {
  appearance?: AppearanceTypes;
  autoDismiss?: boolean;
  id?: Id;
  onDismiss?: (id: Id) => void;
  [key: string]: any;
};

type AddToast = (
  content: ReactNode,
  options?: Options,
  callback?: (id: string) => void
) => void;

type ToastType = Options & {
  appearance: AppearanceTypes;
  content: ReactNode;
  id: Id;
};
type ToastsType = Array<ToastType>;

type ContextType = {
  listRef: MutableRefObject<Array<HTMLElement | null>>;
  index: number | null;
  toasts: ToastsType;
  dismiss: ElementProps;
  setIndex: (index: number) => void;
  listNavigation: ElementProps;
  addToast: AddToast;
  removeToast: (toastId: string) => void;
  refs: ExtendedRefs<ReferenceType>;
  autoDismissTimeout: number;
} & UseFloatingReturn;

export const Main = () => (
  <ToastProvider>
    <Component />
  </ToastProvider>
);

const Component = () => {
  const {addToast} = useToastsContext();

  const handleClick = (text: string, options: Options) => () => {
    addToast(text, options);
  };

  return (
    <ToastProvider>
      <>
        <h1 className="text-5xl font-bold mb-8">Toast</h1>
        <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
          <Button onClick={handleClick('info', {appearance: 'info'})}>
            Add Toast
          </Button>
          <Button
            onClick={handleClick('info', {
              appearance: 'info',
              autoDismiss: true,
            })}
          >
            Add Toast autoDismiss
          </Button>
          <Button
            onClick={handleClick('error', {
              appearance: 'error',
              autoDismiss: true,
            })}
          >
            Add Error Toast autoDismiss
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

const getColor = (appearance?: AppearanceTypes) => {
  switch (appearance) {
    case 'info':
      return '#CDF0FE';
    case 'success':
      return '#ECFCD3';
    case 'error':
      return '#FFE2E5';
    case 'warning':
      return '#FEFACF';
    default:
      return '#ffffff';
  }
};

const getCountDownColor = (appearance?: AppearanceTypes) => {
  switch (appearance) {
    case 'info':
      return '#00B4D8';
    case 'success':
      return '#5CB85C';
    case 'error':
      return '#D9534F';
    case 'warning':
      return '#F0AD4E';
    default:
      return '#ffffff';
  }
};

export function useToasts({placement = 'bottom'}: {placement?: Placement}) {
  const [index, setIndex] = useState<number | null>(0);
  const [toasts, setToasts] = useState<ToastsType>([]);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const data = useFloating({
    placement,
    open: true,
    middleware: [
      inner({
        listRef,
        index: index ?? 0,
      }),
    ],
  });

  const addToast: AddToast = useCallback((content, options) => {
    const id = options?.id ?? generateUEID();
    const newToast = {id, content, ...options} as ToastType;
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const dismiss = useDismiss(data.context);
  const listNavigation = useListNavigation(data.context, {
    listRef,
    activeIndex: index,
    onNavigate: setIndex,
    enabled: false,
  });

  return useMemo(
    () => ({
      listRef,
      index,
      toasts,
      dismiss,
      listNavigation,
      setIndex,
      addToast,
      removeToast,
      ...data,
    }),
    [
      listRef,
      index,
      toasts,
      dismiss,
      listNavigation,
      setIndex,
      addToast,
      removeToast,
      data,
    ]
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

export function ToastProvider({
  placement,
  autoDismissTimeout = 3000,
  children,
}: {
  placement?: Placement;
  autoDismissTimeout?: number;
  children: ReactNode;
}) {
  const context = useToasts({placement});
  const {getFloatingProps} = useInteractions([
    context.dismiss,
    context.listNavigation,
  ]);

  return (
    <ToastContext.Provider value={{...context, autoDismissTimeout}}>
      <ul
        ref={context.refs.setFloating}
        // role="region"
        aria-live="polite"
        style={{
          position: context.strategy,
          // TODO: dynamic style from placement prop
          left: '50%',
          transform: 'translateX(-50%)',
          // remove default ul padding, margin
          padding: 0,
          margin: 0,
        }}
        {...getFloatingProps({
          role: 'region',
        })}
      >
        {context.toasts.map(({id, content, appearance, autoDismiss}, index) => (
          <ToastElement
            key={id}
            toastId={id}
            appearance={appearance}
            autoDismiss={autoDismiss}
            ref={(node) => {
              context.listRef.current[index] = node;
            }}
          >
            {content}
          </ToastElement>
        ))}
      </ul>
      {children}
    </ToastContext.Provider>
  );
}

type ToastContentProps = {
  toastId: string;
  appearance?: AppearanceTypes;
  autoDismiss?: boolean;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const ToastElement = forwardRef<HTMLLIElement, ToastContentProps>(
  ({toastId, appearance, autoDismiss, children}, propRef) => {
    const [timerId, setTimerId] = useState();
    const [isRunning, setIsRunning] = useState(false);
    const {context, removeToast, autoDismissTimeout, dismiss, listNavigation} =
      useToastsContext();
    const [remainingTime, setRemainingTime] = useState(autoDismissTimeout);
    const [startTime, setStartTime] = useState<number>(0);
    const {getItemProps} = useInteractions([dismiss, listNavigation]);
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
      if (autoDismiss) {
        startTimer();
      }
      // fire only once
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (isRunning) {
        const id = setTimeout(() => {
          removeToast(toastId);
          clearTimeout(timerId);
        }, remainingTime);
        // @ts-ignore
        setTimerId(id);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning]);

    // style for auto dismiss progress bar animation
    useEffect(() => {
      if (autoDismiss && !document.getElementById('autoDismissStyle')) {
        const style = document.createElement('style');
        Object.assign(style, {
          id: 'autoDismissStyle',
          innerHTML: `@keyframes autoDismiss {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }`,
        });
        document.head.appendChild(style);
      }
    });

    return (
      <li
        className={toastId}
        ref={propRef}
        role="status"
        aria-atomic="true"
        aria-hidden="false"
        tabIndex={0}
        style={{
          width: '300px',
          backgroundColor: getColor(appearance),
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: 8,
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
          display: 'flex',
          ...styles,
        }}
        {...getItemProps({
          onKeyDown: (e) => {
            // Should useDismiss be used to handle closing with esc?
            if (e.key === 'Enter' || e.key === 'Escape') {
              removeToast(toastId);
            }
          },
          onFocus: () => {
            if (autoDismiss) {
              stopTimer();
            }
          },
          onBlur: () => {
            if (autoDismiss) {
              startTimer();
            }
          },
          onMouseOver: () => {
            if (autoDismiss) {
              stopTimer();
            }
          },
          onMouseLeave: () => {
            if (autoDismiss) {
              startTimer();
            }
          },
        })}
      >
        {children}
        <div
          style={{position: 'absolute', right: '10px', cursor: 'pointer'}}
          onClick={() => {
            removeToast(toastId);
          }}
        >
          {/* TODO: svg icon */}×
        </div>
        <div
          style={{
            animation: `autoDismiss ${autoDismissTimeout}ms linear`,
            backgroundColor: getCountDownColor(appearance),
            position: 'absolute',
            height: '3px',
            width: 0,
            top: 0,
            left: 0,
            opacity: autoDismiss ? 1 : 0,
            animationPlayState: isRunning ? 'running' : 'paused',
          }}
        />
      </li>
    );
  }
);
