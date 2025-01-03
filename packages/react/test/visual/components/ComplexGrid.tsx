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
  rtl?: boolean;
}

/*
 * Grid diagram for reference:
 * Disabled indices marked with ()
 *
 * (0)  (1)  (1)  (2)  (3)  (4)  (5)
 * (6)   7    8   (9)  10   11   12
 * 13  (14)  15   16   17   18   19
 * 20   20   21   21   21   21   21
 * 20   20   22  (23) (23) (23)  24
 * 25   26   27   28   29   29   30
 * 31   32   33   34   29   29  (35)
 * 36   36
 */

export const Main = ({
  orientation = 'horizontal',
  loop = false,
  rtl = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const {floatingStyles, refs, context} = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
  });

  const disabledIndices = [0, 1, 2, 3, 4, 5, 6, 9, 14, 23, 35];

  const itemSizes = Array.from(Array(37), () => ({width: 1, height: 1}));
  itemSizes[1].width = 2;
  itemSizes[20].width = 2;
  itemSizes[20].height = 2;
  itemSizes[21].width = 5;
  itemSizes[23].width = 3;
  itemSizes[29].width = 2;
  itemSizes[29].height = 2;
  itemSizes[36].width = 2;

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useClick(context),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      cols: 7,
      orientation,
      loop,
      rtl,
      openOnArrowKeyDown: false,
      disabledIndices,
      itemSizes,
    }),
    useDismiss(context),
  ]);

  return (
    <>
      <h1>Complex Grid</h1>
      <div className="container">
        <button ref={refs.setReference} {...getReferenceProps()}>
          Reference
        </button>
        {open && (
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              data-testid="floating"
              className="grid gap-2"
              style={{
                ...floatingStyles,
                display: 'grid',
                gridTemplateColumns:
                  '100px 100px 100px 100px 100px 100px 100px',
                zIndex: 999,
              }}
              {...getFloatingProps()}
            >
              {[...Array(37)].map((_, index) => (
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
                  style={{
                    gridRow: `span ${itemSizes[index].height}`,
                    gridColumn: `span ${itemSizes[index].width}`,
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
