import {
  getOverflowAncestors,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import classNames from 'classnames';
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {remToPx} from '../../utils/remToPx';
import {Chrome} from '../Chrome';
import {Floating} from '../Floating';

const Reference = forwardRef(function Reference(
  {className, children},
  ref,
) {
  return (
    <button
      ref={ref}
      className={classNames(
        `z-50 h-24 w-24 cursor-default border-2 border-dashed border-gray-900 bg-gray-50 p-2 text-sm font-bold text-gray-900`,
        className,
      )}
      aria-label="Reference element"
    >
      {children ?? 'Reference'}
    </button>
  );
});

function GridItem({
  title,
  description,
  chrome,
  demoLink,
  hidden,
}) {
  return (
    <div
      className={classNames(
        'relative flex-col justify-between overflow-x-hidden bg-gray-50 px-4 py-8 shadow dark:bg-gray-700 sm:p-8 md:rounded-lg lg:flex',
        {
          hidden: hidden,
        },
      )}
    >
      <div className="overflow-hidden">
        <h3 className="mb-2 text-3xl font-bold">{title}</h3>
        <p className="mb-6 text-xl">{description}</p>
      </div>
      <div className="relative items-center rounded-lg bg-gray-800 shadow-md lg:h-auto">
        {chrome}
      </div>
      <a
        className="absolute right-6 top-6 inline-flex items-center gap-1 border-none font-bold text-rose-600 underline decoration-rose-500/80 decoration-2 underline-offset-4 transition-colors hover:text-gray-1000 hover:decoration-gray-1000 dark:text-rose-300 dark:decoration-rose-300/80 dark:hover:text-gray-50 dark:hover:decoration-gray-50"
        href={demoLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        CodeSandbox
      </a>
    </div>
  );
}

export function Placement() {
  const [placement, setPlacement] = useState('top');

  return (
    <GridItem
      titleClass="text-violet-600 dark:text-violet-300"
      title="Placement"
      description="Places your floating element relative to another element."
      demoLink="https://codesandbox.io/s/lively-waterfall-rbc1pi?file=/src/index.js"
      chrome={
        <Chrome
          label="Click the dots"
          center
          className="relative grid items-center"
          shadow={false}
        >
          {[
            {
              placement: 'top',
              styles: {
                left: 'calc(50% - 10px - 1rem)',
                top: 0,
              },
            },
            {
              placement: 'top-start',
              styles: {
                left: 'calc(50% - 70px - 1rem)',
                top: 0,
              },
            },
            {
              placement: 'top-end',
              styles: {
                left: 'calc(50% + 50px - 1rem)',
                top: 0,
              },
            },
            {
              placement: 'bottom',
              styles: {
                left: 'calc(50% - 10px - 1rem)',
                bottom: 0,
              },
            },
            {
              placement: 'bottom-start',
              styles: {
                left: 'calc(50% - 70px - 1rem)',
                bottom: 0,
              },
            },
            {
              placement: 'bottom-end',
              styles: {
                left: 'calc(50% + 50px - 1rem)',
                bottom: 0,
              },
            },
            {
              placement: 'right',
              styles: {
                top: 'calc(50% - 10px - 1rem)',
                right: 'min(50px, 5%)',
              },
            },
            {
              placement: 'right-start',
              styles: {
                top: 'calc(50% - 70px - 1rem)',
                right: 'min(50px, 5%)',
              },
            },
            {
              placement: 'right-end',
              styles: {
                top: 'calc(50% + 50px - 1rem)',
                right: 'min(50px, 5%)',
              },
            },
            {
              placement: 'left',
              styles: {
                top: 'calc(50% - 10px - 1rem)',
                left: 'min(50px, 5%)',
              },
            },
            {
              placement: 'left-start',
              styles: {
                top: 'calc(50% - 70px - 1rem)',
                left: 'min(50px, 5%)',
              },
            },
            {
              placement: 'left-end',
              styles: {
                top: 'calc(50% + 50px - 1rem)',
                left: 'min(50px, 5%)',
              },
            },
          ].map(({placement: p, styles}) => (
            <button
              key={p}
              className="absolute p-4 transition hover:scale-125 cursor-default"
              style={styles}
              onClick={() => setPlacement(p)}
              aria-label={p}
            >
              <div
                className={classNames(
                  'h-5 w-5 rounded-full border-2 border-solid',
                  {
                    'border-gray-800 bg-gray-800':
                      placement === p,
                    'border-gray-900': placement !== p,
                  },
                )}
              />
            </button>
          ))}
          <Floating
            content={
              <div
                className="text-center text-sm font-bold"
                style={{
                  minWidth:
                    ['top', 'bottom'].includes(
                      placement.split('-')[0],
                    ) && placement.includes('-')
                      ? '8rem'
                      : undefined,
                }}
              >
                {placement}
              </div>
            }
            placement={placement}
            middleware={[{name: 'offset', options: 5}]}
          >
            <Reference />
          </Floating>
        </Chrome>
      }
    />
  );
}

export function Shift() {
  const [boundary, setBoundary] = useState();

  useEffect(() => {
    if (boundary) {
      boundary.firstElementChild.scrollTop = remToPx(200 / 16);
    }
  }, [boundary]);

  return (
    <GridItem
      title="Shift"
      titleClass="text-blue-600 dark:text-blue-300"
      description="Shifts your floating element to keep it in view."
      demoLink="https://codesandbox.io/s/great-lake-5l7m95?file=/src/index.js"
      chrome={
        <div
          ref={setBoundary}
          className="relative overflow-hidden"
        >
          <Chrome
            label="Scroll the container"
            scrollable="y"
            relative={false}
            shadow={false}
          >
            <Floating
              placement="right"
              middleware={[
                {name: 'offset', options: 5},
                {
                  name: 'shift',
                  options: {
                    boundary,
                    rootBoundary: 'document',
                    padding: {
                      top: remToPx(54 / 16),
                      bottom: remToPx(5 / 16),
                    },
                  },
                },
              ]}
              content={
                <div className="grid h-48 w-20 place-items-center text-sm font-bold">
                  Popover
                </div>
              }
            >
              <Reference className="ml-[5%] sm:ml-[33%]" />
            </Floating>
          </Chrome>
        </div>
      }
    />
  );
}

export function Flip() {
  const [boundary, setBoundary] = useState();

  useEffect(() => {
    if (boundary) {
      boundary.firstElementChild.scrollTop = remToPx(275 / 16);
    }
  }, [boundary]);

  return (
    <GridItem
      title="Flip"
      titleClass="text-red-500 dark:text-red-300"
      description="Changes the placement of your floating element to keep it in view."
      demoLink="https://codesandbox.io/s/beautiful-kirch-th1e0j?file=/src/index.js"
      chrome={
        <div
          className="relative overflow-hidden"
          ref={setBoundary}
        >
          <Chrome
            label="Scroll down"
            scrollable="y"
            center
            shadow={false}
          >
            <Floating
              content={
                <span className="text-sm font-bold">
                  Tooltip
                </span>
              }
              placement="top"
              middleware={[
                {name: 'offset', options: 5},
                {
                  name: 'flip',
                  options: {rootBoundary: 'document'},
                },
              ]}
              transition
            >
              <Reference />
            </Floating>
          </Chrome>
        </div>
      }
    />
  );
}

export function Size() {
  return (
    <GridItem
      title="Size"
      titleClass="text-green-500 dark:text-green-300"
      description="Changes the size of your floating element to keep it in view."
      demoLink="https://codesandbox.io/s/focused-hamilton-qez78d?file=/src/index.js"
      chrome={
        <Chrome
          label="Scroll the container"
          scrollable="y"
          center
          shadow={false}
        >
          <Floating
            content={
              <div className="grid items-center text-sm font-bold">
                Dropdown
              </div>
            }
            middleware={[
              {name: 'offset', options: 5},
              {
                name: 'size',
                options: {padding: 8, rootBoundary: 'document'},
              },
            ]}
            tooltipStyle={{
              height: 300,
              overflow: 'hidden',
              maxHeight: 0,
            }}
          >
            <Reference />
          </Floating>
        </Chrome>
      }
    />
  );
}

export function Arrow() {
  const [boundary, setBoundary] = useState();

  return (
    <GridItem
      title="Arrow"
      titleClass="text-yellow-600 dark:text-yellow-300"
      description="Dynamically positions an arrow element that is center-aware."
      demoLink="https://codesandbox.io/s/interesting-wescoff-6e1w5i?file=/src/index.js"
      chrome={
        <div
          ref={setBoundary}
          className="relative grid overflow-hidden lg:col-span-5"
        >
          <Chrome
            label="Scroll the container"
            scrollable="y"
            relative={false}
            shadow={false}
          >
            <Floating
              placement="right"
              content={<div className="h-[12rem] w-24" />}
              middleware={[
                {name: 'offset', options: 16},
                {
                  name: 'shift',
                  options: {
                    boundary,
                    padding: {
                      top: remToPx(54 / 16),
                      bottom: remToPx(5 / 16),
                    },
                    rootBoundary: 'document',
                  },
                },
              ]}
              arrow
              lockedFromArrow
            >
              <Reference className="ml-[5%] md:ml-[33%]" />
            </Floating>
          </Chrome>
        </div>
      }
    />
  );
}

export function Virtual() {
  const [open, setOpen] = useState(false);
  const boundaryRef = useRef();
  const pointerTypeRef = useRef();
  const {x, y, refs, update} = useFloating({
    placement: 'bottom-start',
    strategy: 'fixed',
    middleware: [
      offset({mainAxis: 10, crossAxis: 10}),
      shift({
        crossAxis: true,
        padding: 5,
        rootBoundary: 'document',
      }),
    ],
  });

  const handleMouseMove = useCallback(
    ({clientX, clientY}) => {
      refs.setReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: clientX,
            y: clientY,
            left: clientX,
            top: clientY,
            right: clientX,
            bottom: clientY,
          };
        },
      });
    },
    [refs],
  );

  useEffect(() => {
    const boundary = boundaryRef.current;
    boundary.addEventListener('pointermove', handleMouseMove);

    const parents = getOverflowAncestors(refs.floating.current);
    parents.forEach((parent) => {
      parent.addEventListener('scroll', update);
    });

    function handleWindowScroll() {
      if (pointerTypeRef.current === 'touch') {
        setOpen(false);
      }
    }

    window.addEventListener('scroll', handleWindowScroll);

    return () => {
      boundary.removeEventListener(
        'pointermove',
        handleMouseMove,
      );
      window.removeEventListener('scroll', handleWindowScroll);
      parents.forEach((parent) => {
        parent.removeEventListener('scroll', update);
      });
    };
  }, [refs, update, handleMouseMove]);

  return (
    <GridItem
      title="Virtual"
      titleClass="text-cyan-600 dark:text-cyan-300"
      description="Anchor relative to any coordinates, such as your mouse cursor."
      demoLink="https://codesandbox.io/s/fancy-worker-xkr8xl?file=/src/index.js"
      hidden
      chrome={
        <Chrome label="Move your mouse" shadow={false}>
          <div
            ref={boundaryRef}
            className="h-full"
            onPointerDown={({pointerType}) => {
              pointerTypeRef.current = pointerType;
            }}
            onPointerEnter={(event) => {
              handleMouseMove(event);
              setOpen(true);
            }}
            onMouseLeave={() => {
              setOpen(false);
            }}
          >
            <div
              ref={refs.setFloating}
              className="bg-rose-500 p-2 text-sm font-bold text-gray-50"
              style={{
                position: 'absolute',
                top: y ?? 0,
                left: Math.round(x) ?? 0,
                transform: `scale(${open ? '1' : '0'})`,
                opacity: open ? '1' : '0',
                transition:
                  'transform 0.2s ease, opacity 0.1s ease',
              }}
            >
              Tooltip
            </div>
          </div>
        </Chrome>
      }
    />
  );
}
