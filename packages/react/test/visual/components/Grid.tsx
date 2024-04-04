import {
  FloatingFocusManager,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
} from '@floating-ui/react';
import {useRef, useState} from 'react';

interface Props {
  orientation?: 'horizontal' | 'both';
  loop?: boolean;
}

export const Main = ({orientation = 'horizontal', loop = false}: Props) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const {floatingStyles, refs, context} = useFloating({
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
      onNavigate: setActiveIndex,
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
        <button ref={refs.setReference} {...getReferenceProps()}>
          Reference
        </button>
        {open && (
          <FloatingFocusManager context={context}>
            <div
              role="menu"
              ref={refs.setFloating}
              data-testid="floating"
              className="grid gap-2"
              style={{
                ...floatingStyles,
                gridTemplateColumns: '100px 100px 100px 100px 100px',
                zIndex: 999,
              }}
              {...getFloatingProps()}
            >
              {[...Array(49)].map((_, index) => (
                <button
                  role="option"
                  key={index}
                  aria-selected={activeIndex === index}
                  tabIndex={activeIndex === index ? 0 : -1}
                  disabled={disabledIndices.includes(index)}
                  ref={(node) => {
                    listRef.current[index] = node;
                  }}
                  className="border border-black disabled:opacity-20"
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
