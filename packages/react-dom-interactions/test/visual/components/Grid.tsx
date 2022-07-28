import {
  useFloating,
  useInteractions,
  FloatingFocusManager,
  useClick,
  useDismiss,
  useListNavigation,
} from '@floating-ui/react-dom-interactions';
import {useRef, useState} from 'react';

interface Props {
  orientation?: 'horizontal' | 'both';
  loop?: boolean;
}

export const Main = ({orientation = 'horizontal', loop = false}: Props) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const {x, y, reference, floating, strategy, context} = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
  });

  const disabledIndices = [0, 1, 2, 3, 4, 5, 6, 7, 10, 15, 45, 48];

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useClick(context),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: open ? setActiveIndex : undefined,
      cols: 5,
      orientation,
      loop,
      openOnArrowKeyDown: false,
      disabledIndices,
    }),
    useDismiss(context),
  ]);

  return (
    <>
      <h1>Grid</h1>
      <div className="container">
        <button ref={reference} {...getReferenceProps()}>
          Reference
        </button>
        {open && (
          <FloatingFocusManager context={context}>
            <div
              ref={floating}
              data-testid="floating"
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 100px 100px 100px 100px',
                position: strategy,
                left: x ?? 0,
                top: y ?? 0,
                zIndex: 999,
              }}
              {...getFloatingProps()}
            >
              {[...Array(49)].map((_, index) => (
                <button
                  role="option"
                  key={index}
                  tabIndex={-1}
                  disabled={disabledIndices.includes(index)}
                  ref={(node) => {
                    listRef.current[index] = node;
                  }}
                  {...getItemProps()}
                >
                  Item {index}
                </button>
              ))}
            </div>
          </FloatingFocusManager>
        )}
      </div>
    </>
  );
};
