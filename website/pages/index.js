import {
  autoUpdate,
  flip,
  FloatingDelayGroup,
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  getOverflowAncestors,
  offset,
  safePolygon,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTransitionStyles,
  useTypeahead,
} from '@floating-ui/react';
import classNames from 'classnames';
import cn from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import {
  Children,
  cloneElement,
  isValidElement,
  useId,
} from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ArrowRight,
  BarChart,
  Check,
  ChevronRight,
  Edit,
  GitHub,
  Heart,
  Share,
} from 'react-feather';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

import Logo from '../assets/logo.svg';
import Text from '../assets/text.svg';
import {MINI_SPONSORS, SPONSORS} from '../data';
import {Button} from '../lib/components/Button';
import {Cards} from '../lib/components/Cards';
import {Chrome} from '../lib/components/Chrome';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
} from '../lib/components/Dialog';
import {Floating} from '../lib/components/Floating';
import {Logos} from '../lib/components/Logos';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '../lib/components/Popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../lib/components/Tooltip';

const b64banner =
  'data:image/jpeg;base64,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UGdQc2VudW0AAAAAUGdQcwAAAABQZ1BDAAAAAExlZnRVbnRGI1JsdAAAAAAAAAAAAAAAAFRvcCBVbnRGI1JsdAAAAAAAAAAAAAAAAFNjbCBVbnRGI1ByY0BZAAAAAAAAAAAAEGNyb3BXaGVuUHJpbnRpbmdib29sAAAAAA5jcm9wUmVjdEJvdHRvbWxvbmcAAAAAAAAADGNyb3BSZWN0TGVmdGxvbmcAAAAAAAAADWNyb3BSZWN0UmlnaHRsb25nAAAAAAAAAAtjcm9wUmVjdFRvcGxvbmcAAAAAADhCSU0D7QAAAAAAEABIAAAAAQACAEgAAAABAAI4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAFo4QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAI4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQAAAAAAAACAAM4QklNBAIAAAAAAAgAAAAAAAAAADhCSU0EMAAAAAAABAEBAQE4QklNBC0AAAAAAAYAAQAAAAc4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADSQAAAAYAAAAAAAAAAAAAADMAAABkAAAACgBVAG4AdABpAHQAbABlAGQALQAxAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAABkAAAAMwAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABAAAAAAAAbnVsbAAAAAIAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAAA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PSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wMy0zMFQyMjoxNTozMSsxMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wMy0zMFQyMjoxNTozMSsxMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDMtMzBUMjI6MTU6MzErMTE6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzkwNjVjYWYtMGM0ZC00MDQwLTliODAtNWQyMTU0MDFlNGY2IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NDk1NmU5ODctZDdmMy1mNzQxLTgxMTAtYTZiODFlNjk3Y2UwIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Y2Y4MTU0MzctM2FkYS00Nzk3LTgzOTgtMGRhYjJhMGEyOGQxIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iRGlzcGxheSIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjZjgxNTQzNy0zYWRhLTQ3OTctODM5OC0wZGFiMmEwYTI4ZDEiIHN0RXZ0OndoZW49IjIwMjItMDMtMzBUMjI6MTU6MzErMTE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjOTA2NWNhZi0wYzRkLTQwNDAtOWI4MC01ZDIxNTQwMWU0ZjYiIHN0RXZ0OndoZW49IjIwMjItMDMtMzBUMjI6MTU6MzErMTE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8cmRmOkJhZz4gPHJkZjpsaT41QkJFODFFOTJGMUQwQTZDQTVEREQwMEE4NzNFNkIwMDwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+IQCElDQ19QUk9G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';

const Reference = forwardRef(({className, children}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        `text-sm z-50 font-bold text-gray-900 bg-gray-50 p-2 w-24 h-24 border-2 border-gray-900 border-dashed cursor-default`,
        className
      )}
      aria-label="Reference element"
    >
      {children}
    </button>
  );
});

function GridItem({
  title,
  description,
  chrome,
  titleClass,
  demoLink,
}) {
  return (
    <div className="flex flex-col overflow-x-hidden shadow justify-between bg-gray-50 dark:bg-gray-700 md:rounded-lg px-4 py-8 sm:p-8 relative">
      <div className="overflow-hidden">
        <h3 className={`text-3xl font-bold mb-2 ${titleClass}`}>
          {title}
        </h3>
        <p className="text-xl mb-6">{description}</p>
      </div>
      <div className="relative items-center bg-gray-800 rounded-lg lg:h-auto shadow-md">
        {chrome}
      </div>
      <a
        className="transition-colors inline-flex items-center gap-1 border-none underline underline-offset-4 font-bold text-rose-500 hover:text-gray-1000 decoration-rose-500/80 hover:decoration-gray-1000 dark:text-rose-300 dark:hover:text-gray-50 dark:decoration-rose-300/80 dark:hover:decoration-gray-50 decoration-2 absolute right-6 top-6"
        href={demoLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        CodeSandbox
      </a>
    </div>
  );
}

function Placement() {
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
          className="grid items-center relative"
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
              className="p-4 absolute transition hover:scale-125"
              style={styles}
              onClick={() => setPlacement(p)}
              aria-label={p}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 border-solid',
                  {
                    'border-gray-800': placement === p,
                    'border-gray-900': placement !== p,
                    'bg-gray-800': placement === p,
                  }
                )}
              />
            </button>
          ))}
          <Floating
            content={
              <div
                className="font-bold text-center"
                style={{
                  minWidth:
                    ['top', 'bottom'].includes(
                      placement.split('-')[0]
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

function Shift() {
  const [boundary, setBoundary] = useState();

  useIsomorphicLayoutEffect(() => {
    if (boundary) {
      boundary.firstElementChild.scrollTop = 200;
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
                    padding: {top: 54, bottom: 5},
                  },
                },
              ]}
              content={
                <div className="w-24">
                  <h3 className="font-bold text-xl">Popover</h3>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Nullam vitae pellentesque
                    elit, in dapibus enim.
                  </p>
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

function Flip() {
  const [boundary, setBoundary] = useState();

  useIsomorphicLayoutEffect(() => {
    if (boundary) {
      boundary.firstElementChild.scrollTop = 275;
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
            label="Scroll up"
            scrollable="y"
            center
            shadow={false}
          >
            <Floating
              content={<strong>Tooltip</strong>}
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

function Size() {
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
              <div className="grid items-center font-bold">
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

function Arrow() {
  const [boundary, setBoundary] = useState();

  return (
    <GridItem
      title="Arrow"
      titleClass="text-yellow-500 dark:text-yellow-300"
      description="Dynamically positions an arrow element that is center-aware."
      demoLink="https://codesandbox.io/s/interesting-wescoff-6e1w5i?file=/src/index.js"
      chrome={
        <div
          ref={setBoundary}
          className="grid lg:col-span-5 relative overflow-hidden"
        >
          <Chrome
            label="Scroll the container"
            scrollable="y"
            relative={false}
            shadow={false}
          >
            <Floating
              placement="right"
              content={<div className="w-24 h-[18.3rem]" />}
              middleware={[
                {name: 'offset', options: 16},
                {
                  name: 'shift',
                  options: {
                    boundary,
                    padding: {
                      top: 54,
                      bottom: 5,
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

function Virtual() {
  const [open, setOpen] = useState(false);
  const boundaryRef = useRef();
  const {x, y, reference, floating, refs, update} = useFloating({
    placement: 'top',
    middleware: [
      shift({
        crossAxis: true,
        padding: 5,
        rootBoundary: 'document',
      }),
    ],
  });

  const handleMouseMove = useCallback(
    ({clientX, clientY}) => {
      reference({
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
    [reference]
  );

  useEffect(() => {
    const boundary = boundaryRef.current;
    boundary.addEventListener('mousemove', handleMouseMove);

    const parents = getOverflowAncestors(refs.floating.current);
    parents.forEach((parent) => {
      parent.addEventListener('scroll', update);
    });

    return () => {
      boundary.removeEventListener('mousemove', handleMouseMove);
      parents.forEach((parent) => {
        parent.removeEventListener('scroll', update);
      });
    };
  }, [reference, refs.floating, update, handleMouseMove]);

  return (
    <GridItem
      title="Virtual"
      description="Anchor relative to any coordinates, such as your mouse cursor."
      demoLink="https://codesandbox.io/s/fancy-worker-xkr8xl?file=/src/index.js"
      chrome={
        <Chrome label="Move your mouse" shadow={false}>
          <div
            ref={boundaryRef}
            className="h-full"
            onMouseEnter={(event) => {
              handleMouseMove(event);
              setOpen(true);
            }}
            onMouseLeave={() => setOpen(false)}
          >
            <div
              ref={floating}
              className="bg-gray-800 text-gray-50 font-bold p-4 rounded"
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

function PopoverDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('Balloon name');
  const [editName, setEditName] = useState(name);

  return (
    <div className="flex items-center gap-2 h-14">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            className="bg-transparent dark:bg-transparent data-[state=open]:bg-gray-100/50 dark:data-[state=open]:bg-gray-600 flex gap-2 items-center"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={`${name} - Edit`}
          >
            <span className="text-lg font-bold">{name}</span>
            <Edit size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-lg bg-white dark:text-black bg-clip-padding border border-gray-900/10 shadow-lg shadow-blue-900/10 p-4">
          <h2 className="text-lg font-bold mb-2">Edit name</h2>
          <div className="flex items-center gap-2">
            <input
              className="py-1 px-2 border border-gray-600 dark:bg-white focus:border-blue-500 outline-none rounded"
              value={editName}
              onChange={(event) =>
                setEditName(event.target.value)
              }
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setName(editName);
                  setIsOpen(false);
                }
              }}
            />
            <PopoverClose
              aria-label="Confirm"
              className="py-1 text-sm"
              onClick={() => {
                setName(editName);
              }}
            >
              <Check />
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const options = [
  'Red',
  'Orange',
  'Yellow',
  'Green',
  'Cyan',
  'Blue',
  'Purple',
  'Pink',
  'Maroon',
  'Black',
  'White',
];

function ColorSwatch({color}) {
  return (
    <div
      aria-hidden
      className="rounded-full w-4 h-4 border border-black/50 bg-clip-padding"
      style={{background: color}}
    />
  );
}

function SelectDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const {x, y, strategy, refs, context} = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      size({
        apply({rects, elements, availableHeight}) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(200, availableHeight)}px`,
            width: `${rects.reference.width}px`,
          });
        },
        padding: 50,
      }),
      flip({
        padding: 50,
        fallbackStrategy: 'initialPlacement',
      }),
    ],
  });

  const listRef = useRef([]);
  const listContentRef = useRef(options);

  const click = useClick(context, {event: 'mousedown'});
  const dismiss = useDismiss(context);
  const role = useRole(context, {role: 'listbox'});
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    // This is a large list, allow looping.
    loop: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: listContentRef,
    activeIndex,
    selectedIndex,
    onMatch: isOpen ? setActiveIndex : setSelectedIndex,
  });

  const {getReferenceProps, getFloatingProps, getItemProps} =
    useInteractions([click, dismiss, role, listNav, typeahead]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    setIsOpen(false);
  };

  const selectedItemLabel =
    selectedIndex !== null ? options[selectedIndex] : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label
        className="flex flex-col items-center font-bold text-md"
        id="select-label"
      >
        Select balloon color
      </label>
      <Button
        ref={refs.setReference}
        aria-labelledby={
          selectedItemLabel ? undefined : 'select-label'
        }
        aria-label={`${selectedItemLabel} selected`}
        aria-autocomplete="none"
        data-open={isOpen ? '' : undefined}
        className="flex items-center gap-2 bg-gray-100/75 rounded w-[10rem]"
        {...getReferenceProps()}
        // The default role for the reference using a "listbox"
        // is a "combobox", but Safari has a bug with VoiceOver
        // where it cuts off letters when announcing the button's
        // content when it has that role.
        // This overrides the one from the props above.
        role={undefined}
      >
        <ColorSwatch
          color={selectedItemLabel?.toLocaleLowerCase()}
        />
        {selectedItemLabel || 'Select...'}
      </Button>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            className="bg-white/80 dark:bg-gray-600/80 shadow-lg max-h-[20rem] overflow-y-auto rounded-lg border border-slate-900/5 bg-clip-padding outline-none p-1 backdrop-blur-lg"
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
            {...getFloatingProps()}
          >
            {options.map((value, i) => (
              <div
                key={value}
                ref={(node) => {
                  listRef.current[i] = node;
                }}
                role="option"
                tabIndex={i === activeIndex ? 0 : -1}
                aria-selected={
                  i === selectedIndex && i === activeIndex
                }
                className={classNames(
                  'flex gap-2 items-center p-2 rounded outline-none cursor-default scroll-my-1',
                  {
                    'bg-cyan-200 dark:bg-blue-500 dark:text-white':
                      i === activeIndex,
                  }
                )}
                {...getItemProps({
                  // Handle pointer select.
                  onClick() {
                    handleSelect(i);
                  },
                  // Handle keyboard select.
                  onKeyDown(event) {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSelect(i);
                    }

                    // Only if not using typeahead.
                    if (
                      event.key === ' ' &&
                      !context.dataRef.current.typing
                    ) {
                      event.preventDefault();
                      handleSelect(i);
                    }
                  },
                })}
              >
                <ColorSwatch color={options[i]?.toLowerCase()} />
                {value}
                <span aria-hidden className="absolute right-4">
                  {i === selectedIndex ? (
                    <Check width={20} height={20} />
                  ) : (
                    ''
                  )}
                </span>
              </div>
            ))}
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
}

const fruits = [
  'Alfalfa Sprouts',
  'Apple',
  'Apricot',
  'Artichoke',
  'Asian Pear',
  'Asparagus',
  'Atemoya',
  'Avocado',
  'Bamboo Shoots',
  'Banana',
  'Bean Sprouts',
  'Beans',
  'Beets',
  'Belgian Endive',
  'Bell Peppers',
  'Bitter Melon',
  'Blackberries',
  'Blueberries',
  'Bok Choy',
  'Boniato',
  'Boysenberries',
  'Broccoflower',
  'Broccoli',
  'Brussels Sprouts',
  'Cabbage',
  'Cactus Pear',
  'Cantaloupe',
  'Carambola',
  'Carrots',
  'Casaba Melon',
  'Cauliflower',
  'Celery',
  'Chayote',
  'Cherimoya',
  'Cherries',
  'Coconuts',
  'Collard Greens',
  'Corn',
  'Cranberries',
  'Cucumber',
  'Dates',
  'Dried Plums',
  'Eggplant',
  'Endive',
  'Escarole',
  'Feijoa',
  'Fennel',
  'Figs',
  'Garlic',
  'Gooseberries',
  'Grapefruit',
  'Grapes',
  'Green Beans',
  'Green Onions',
  'Greens',
  'Guava',
  'Hominy',
  'Honeydew Melon',
  'Horned Melon',
  'Iceberg Lettuce',
  'Jerusalem Artichoke',
  'Jicama',
  'Kale',
  'Kiwifruit',
  'Kohlrabi',
  'Kumquat',
  'Leeks',
  'Lemons',
  'Lettuce',
  'Lima Beans',
  'Limes',
  'Longan',
  'Loquat',
  'Lychee',
  'Madarins',
  'Malanga',
  'Mandarin Oranges',
  'Mangos',
  'Mulberries',
  'Mushrooms',
  'Napa',
  'Nectarines',
  'Okra',
  'Onion',
  'Oranges',
  'Papayas',
  'Parsnip',
  'Passion Fruit',
  'Peaches',
  'Pears',
  'Peas',
  'Peppers',
  'Persimmons',
  'Pineapple',
  'Plantains',
  'Plums',
  'Pomegranate',
  'Potatoes',
  'Prickly Pear',
  'Prunes',
  'Pummelo',
  'Pumpkin',
  'Quince',
  'Radicchio',
  'Radishes',
  'Raisins',
  'Raspberries',
  'Red Cabbage',
  'Rhubarb',
  'Romaine Lettuce',
  'Rutabaga',
  'Shallots',
  'Snow Peas',
  'Spinach',
  'Sprouts',
  'Squash',
  'Strawberries',
  'String Beans',
  'Sweet Potato',
  'Tangelo',
  'Tangerines',
  'Tomatillo',
  'Tomato',
  'Turnip',
  'Ugli Fruit',
  'Water Chestnuts',
  'Watercress',
  'Watermelon',
  'Waxed Beans',
  'Yams',
  'Yellow Squash',
  'Yuca/Cassava',
  'Zucchini Squash',
];

const Item = forwardRef(({children, active, ...rest}, ref) => {
  const id = useId();
  return (
    <div
      ref={ref}
      className={classNames(
        'p-2 cursor-default rounded-md scroll-my-1',
        {
          'bg-blue-500 text-white': active,
        }
      )}
      role="option"
      id={id}
      aria-selected={active}
      {...rest}
    >
      {children}
    </div>
  );
});

function ComboboxDemo() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  const listRef = useRef([]);

  const {x, y, strategy, context, refs} = useFloating({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(5),
      size({
        apply({rects, elements, availableHeight}) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(200, availableHeight)}px`,
            width: `${rects.reference.width}px`,
          });
        },
        padding: 50,
      }),
      flip({
        padding: 50,
        fallbackStrategy: 'initialPlacement',
      }),
    ],
  });

  const {getReferenceProps, getFloatingProps, getItemProps} =
    useInteractions([
      useRole(context, {role: 'listbox'}),
      useDismiss(context),
      useListNavigation(context, {
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        loop: true,
        allowEscape: true,
      }),
    ]);

  function onChange(event) {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  const items = fruits.filter((item) =>
    item.toLowerCase().startsWith(inputValue.toLowerCase())
  );

  return (
    <>
      <input
        ref={refs.setReference}
        value={inputValue}
        className="border-2 p-2 rounded border-gray-300 dark:border-gray-500 focus:border-blue-500 outline-none dark:bg-gray-600"
        placeholder="Enter balloon fruit"
        aria-autocomplete="list"
        aria-labelledby={
          open && items.length === 0
            ? 'combobox-no-results'
            : undefined
        }
        {...getReferenceProps({
          onChange,
          onKeyDown(event) {
            if (
              event.key === 'Enter' &&
              activeIndex != null &&
              items[activeIndex]
            ) {
              setInputValue(items[activeIndex]);
              setActiveIndex(null);
              setOpen(false);
            }
          },
        })}
      />
      {open && (
        <FloatingFocusManager
          context={context}
          initialFocus={-1}
          visuallyHiddenDismiss
        >
          <div
            ref={refs.setFloating}
            className="bg-white/80 dark:bg-gray-600/80 text-left shadow-lg max-h-[20rem] overflow-y-auto rounded-lg border border-slate-900/5 bg-clip-padding outline-none p-1 backdrop-blur-lg z-10"
            {...getFloatingProps({
              style: {
                position: strategy,
                left: x ?? 0,
                top: y ?? 0,
              },
            })}
          >
            {items.length === 0 && (
              <p
                className="m-2"
                id="combobox-no-results"
                role="region"
                aria-atomic="true"
                aria-live="assertive"
              >
                No fruits found.
              </p>
            )}
            {items.map((item, index) => (
              <Item
                {...getItemProps({
                  key: item,
                  ref(node) {
                    listRef.current[index] = node;
                  },
                  onClick() {
                    setInputValue(item);
                    setOpen(false);
                    refs.domReference.current?.focus();
                  },
                })}
                active={activeIndex === index}
              >
                {item}
              </Item>
            ))}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}

export const MenuItem = forwardRef(
  ({label, disabled, ...props}, ref) => {
    return (
      <button
        type="button"
        {...props}
        className={classNames(
          'cursor-default text-left flex py-2 px-3 focus:bg-blue-500 focus:text-white outline-none rounded',
          {
            'opacity-40': disabled,
          }
        )}
        ref={ref}
        role="menuitem"
        disabled={disabled}
      >
        {label}
      </button>
    );
  }
);

export const MenuComponent = forwardRef(
  ({children, label, ...props}, forwardedRef) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [allowHover, setAllowHover] = useState(false);
    const [hasFocusInside, setHasFocusInside] = useState(false);

    const listItemsRef = useRef([]);
    const listContentRef = useRef([]);

    useEffect(() => {
      const strings = [];
      Children.forEach(children, (child) => {
        if (isValidElement(child)) {
          strings.push(
            child.props.label && !child.props.disabled
              ? child.props.label
              : null
          );
        }
      });
      listContentRef.current = strings;
    });

    const tree = useFloatingTree();
    const nodeId = useFloatingNodeId();
    const parentId = useFloatingParentNodeId();
    const isNested = parentId != null;

    const {x, y, strategy, refs, context} = useFloating({
      nodeId,
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: isNested ? 'right-start' : 'bottom-start',
      middleware: [
        offset({
          mainAxis: isNested ? 0 : 4,
          alignmentAxis: isNested ? -4 : 0,
        }),
        flip(),
        shift(),
      ],
      whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, {
      enabled: isNested && allowHover,
      delay: {open: 75},
      handleClose: safePolygon({
        restMs: 25,
        blockPointerEvents: true,
      }),
    });
    const click = useClick(context, {
      event: 'mousedown',
      toggle: !isNested || !allowHover,
      ignoreMouse: isNested,
    });
    const role = useRole(context, {role: 'menu'});
    const dismiss = useDismiss(context, {bubbles: true});
    const listNavigation = useListNavigation(context, {
      listRef: listItemsRef,
      activeIndex,
      nested: isNested,
      onNavigate: setActiveIndex,
    });
    const typeahead = useTypeahead(context, {
      listRef: listContentRef,
      onMatch: isOpen ? setActiveIndex : undefined,
      activeIndex,
    });

    const {getReferenceProps, getFloatingProps, getItemProps} =
      useInteractions([
        hover,
        click,
        role,
        dismiss,
        listNavigation,
        typeahead,
      ]);

    // Event emitter allows you to communicate across tree components.
    // This effect closes all menus when an item gets clicked anywhere
    // in the tree.
    useEffect(() => {
      if (!tree) return;

      function handleTreeClick() {
        setIsOpen(false);
      }

      function onSubMenuOpen(event) {
        if (
          event.nodeId !== nodeId &&
          event.parentId === parentId
        ) {
          setIsOpen(false);
        }
      }

      tree.events.on('click', handleTreeClick);
      tree.events.on('menuopen', onSubMenuOpen);

      return () => {
        tree.events.off('click', handleTreeClick);
        tree.events.off('menuopen', onSubMenuOpen);
      };
    }, [tree, nodeId, parentId]);

    useEffect(() => {
      if (isOpen && tree) {
        tree.events.emit('menuopen', {parentId, nodeId});
      }
    }, [tree, isOpen, nodeId, parentId]);

    // Determine if "hover" logic can run based on the modality of input. This
    // prevents unwanted focus synchronization as menus open and close with
    // keyboard navigation and the cursor is resting on the menu.
    useEffect(() => {
      function onPointerMove({pointerType}) {
        if (pointerType !== 'touch') {
          setAllowHover(true);
        }
      }

      function onKeyDown() {
        setAllowHover(false);
      }

      window.addEventListener('pointermove', onPointerMove, {
        once: true,
        capture: true,
      });
      window.addEventListener('keydown', onKeyDown, true);
      return () => {
        window.removeEventListener(
          'pointermove',
          onPointerMove,
          {
            capture: true,
          }
        );
        window.removeEventListener('keydown', onKeyDown, true);
      };
    }, [allowHover]);

    const {isMounted, styles} = useTransitionStyles(context, {
      duration: 100,
    });

    const referenceRef = useMergeRefs([
      refs.setReference,
      forwardedRef,
    ]);
    const referenceProps = getReferenceProps({
      ...props,
      onFocus(event) {
        props.onFocus?.(event);
        setHasFocusInside(false);
      },
      onClick(event) {
        event.stopPropagation();
      },
      ...(isNested && {
        // Indicates this is a nested <Menu /> acting as a <MenuItem />.
        role: 'menuitem',
      }),
    });

    return (
      <FloatingNode id={nodeId}>
        <button
          ref={referenceRef}
          data-open={isOpen ? '' : undefined}
          {...referenceProps}
          className={classNames(
            'cursor-default text-left flex gap-4 justify-between items-center rounded py-2 px-3',
            {
              'transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-600 data-[open]:bg-gray-100/50 dark:data-[open]:bg-gray-600':
                !isNested,
              'focus:bg-blue-500 focus:text-white outline-none':
                isNested,
              'bg-blue-500 text-white':
                isOpen && isNested && !hasFocusInside,
              'bg-gray-500/20 dark:bg-gray-700 rounded py-1 px-2':
                isNested && isOpen && hasFocusInside,
            }
          )}
        >
          {label}{' '}
          {isNested && (
            <span aria-hidden className="ml-4">
              <ChevronRight size={16} />
            </span>
          )}
        </button>
        <FloatingPortal>
          {isMounted && (
            <FloatingFocusManager
              context={context}
              // Prevent outside content interference.
              modal={false}
              // Only initially focus the root floating menu.
              initialFocus={isNested ? -1 : 0}
              // Only return focus to the root menu's reference when menus close.
              returnFocus={!isNested}
            >
              <div
                ref={refs.setFloating}
                className="flex flex-col rounded bg-white/80 dark:bg-gray-600/80 backdrop-blur-lg shadow-lg outline-none p-1 border border-slate-900/10 bg-clip-padding"
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  width: 'max-content',
                  ...styles,
                }}
                {...getFloatingProps()}
              >
                {Children.map(
                  children,
                  (child, index) =>
                    isValidElement(child) &&
                    cloneElement(
                      child,
                      getItemProps({
                        tabIndex: activeIndex === index ? 0 : -1,
                        ref(node) {
                          listItemsRef.current[index] = node;
                        },
                        onClick(event) {
                          child.props.onClick?.(event);
                          tree?.events.emit('click');
                        },
                        onFocus(event) {
                          child.props.onFocus?.(event);
                          setHasFocusInside(true);
                        },
                        // Allow focus synchronization if the cursor did not move.
                        onMouseEnter() {
                          if (allowHover && isOpen) {
                            setActiveIndex(index);
                          }
                        },
                      })
                    )
                )}
              </div>
            </FloatingFocusManager>
          )}
        </FloatingPortal>
      </FloatingNode>
    );
  }
);

export const Menu = forwardRef((props, ref) => {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} ref={ref} />
      </FloatingTree>
    );
  }

  return <MenuComponent {...props} ref={ref} />;
});

function HomePage() {
  const bannerRef = useRef();
  const [hideBanner, setHideBanner] = useState(true);

  useEffect(() => {
    bannerRef.current.src = '/floating-ui.jpg';
  }, []);

  return (
    <>
      <Head>
        <link rel="preload" as="image" href="/floating-ui.jpg" />
        <title>
          Floating UI - Create tooltips, popovers, dropdowns, and
          more
        </title>
      </Head>
      <header className="from-gray-700 to-gray-800 mb-12 overflow-hidden relative pb-16 bg-gray-900">
        <div className="container pt-16 mx-auto text-center max-w-screen-xl">
          <Logo
            className="mx-auto"
            aria-label="Floating UI logo (a cute smiling red balloon)"
            style={{position: 'relative', zIndex: 1}}
          />
          <div
            className="absolute w-full top-[-3rem] overflow-hidden"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'max-content',
            }}
          >
            <img
              role="presentation"
              className="select-none"
              src={b64banner}
              width={1167}
              height={648}
            />
            <img
              role="presentation"
              ref={bannerRef}
              className={`transition-all duration-500 select-none absolute top-0${
                hideBanner ? ' opacity-0 scale-95' : ' scale-100'
              }`}
              width={1167}
              height={648}
              onLoad={() => {
                setHideBanner(false);
              }}
            />
          </div>
          <Text
            className="mx-auto relative top-[2rem] z-1"
            aria-label="Floating UI text logo"
          />

          <div className="flex flex-row justify-center gap-x-4 mt-24 z-1 relative">
            <Link
              href="/docs/getting-started"
              className="flex items-center gap-2 transition hover:saturate-110 hover:brightness-110 bg-gradient-to-br from-red-300 via-violet-300 to-cyan-400 shadow-lg hover:shadow-xl rounded text-gray-900 px-4 py-3 sm:text-lg font-bold whitespace-nowrap"
            >
              Get Started <ArrowRight />
            </Link>
            <a
              href="https://github.com/floating-ui/floating-ui"
              className="flex transition hover:shadow-xl items-center gap-2 bg-gray-50 rounded text-gray-900 px-4 py-3 sm:text-lg shadow-lg font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub /> GitHub
            </a>
          </div>
          <p className="relative z-1 mx-auto text-center mt-16 text-gray-100 prose dark:prose-invert text-xl lg:text-2xl lg:leading-relaxed px-4">
            A JavaScript library to{' '}
            <strong className="text-white">position</strong>{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  tabIndex={0}
                  // VoiceOver
                  role="button"
                  className="relative decoration-gray-150 text-gray-100"
                  style={{
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'wavy',
                    textUnderlineOffset: 6,
                    textDecorationThickness: 1,
                  }}
                >
                  floating elements
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-lg p-2">
                  A <strong>floating element</strong> is one that
                  floats on top of the UI without disrupting the
                  flow of content, like this one!
                </div>
              </TooltipContent>
            </Tooltip>{' '}
            and create{' '}
            <strong className="text-white">interactions</strong>{' '}
            for them.
          </p>
        </div>
      </header>
      <main className="relative">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
          <h2 className="inline-block text-transparent leading-gradient-heading bg-clip-text bg-gradient-to-r from-rose-500 dark:from-rose-400 to-pink-500 dark:to-pink-400 text-3xl lg:text-4xl font-bold my-4 dark:-mt-4">
            Advanced anchor positioning.
          </h2>
          <p className="prose dark:prose-invert text-xl lg:text-2xl text-left lg:leading-relaxed">
            Anchor a floating element next to another element
            while making sure it stays in view by{' '}
            <strong>avoiding collisions</strong>. This lets you
            position tooltips, popovers, or dropdowns optimally.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-4 container md:px-4 py-8 mx-auto max-w-screen-xl">
          <Placement />
          <Shift />
          <Flip />
          <Size />
          <Arrow />
          <Virtual />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
          <h2 className="inline-block text-transparent leading-gradient-heading bg-clip-text bg-gradient-to-r from-cyan-500 dark:from-cyan-400 to-pink-400 dark:to-pink-400 text-3xl lg:text-4xl font-bold mt-16 mb-4">
            Interactions for React.
          </h2>
          <p className="prose dark:prose-invert text-xl lg:text-2xl text-left lg:leading-relaxed">
            Build your own floating UI components with React.
            From simple tooltips to select menus, you have full
            control while ensuring{' '}
            <strong>fully accessible</strong> UI experiences.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 container md:px-4 py-8 mx-auto max-w-screen-xl mb-12 dark:text-black">
          <div className="bg-white dark:bg-gray-700 dark:text-gray-100 p-10 sm:rounded-lg shadow text-center flex flex-col justify-between h-[18rem]">
            <FloatingDelayGroup
              delay={{open: 1000, close: 150}}
              timeoutMs={200}
            >
              <div>
                <h3 className="text-3xl font-bold mb-6">
                  Tooltips
                </h3>
                <p>
                  Floating elements that display information
                  related to an anchor element on hover or focus.
                </p>
              </div>
              <div className="flex justify-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="p-3 hover:text-red-500 dark:hover:text-red-300 rounded-full">
                      <Heart size={26} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Like</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="p-3 hover:text-blue-500 dark:hover:text-blue-300 rounded-full">
                      <Share size={26} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="p-3 hover:text-orange-500 dark:hover:text-orange-300 rounded-full">
                      <BarChart size={26} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Stats</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="p-3 hover:text-green-500 dark:hover:text-green-300 rounded-full">
                      <Edit size={26} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
              </div>
            </FloatingDelayGroup>
          </div>

          <div className="bg-white dark:bg-gray-700 dark:text-gray-100 p-10 sm:rounded-lg shadow text-center flex flex-col justify-between h-[18rem]">
            <FloatingDelayGroup delay={{open: 1000, close: 100}}>
              <div>
                <h3 className="text-3xl font-bold mb-6">
                  Popovers
                </h3>
                <p>
                  Floating elements that display an anchored
                  interactive dialog on click.
                </p>
              </div>
              <div className="flex justify-center gap-1">
                <PopoverDemo />
              </div>
            </FloatingDelayGroup>
          </div>

          <div className="bg-white dark:bg-gray-700 dark:text-gray-100 p-10 sm:rounded-lg shadow text-center flex flex-col justify-between h-[18rem]">
            <FloatingDelayGroup delay={{open: 1000, close: 100}}>
              <div>
                <h3 className="text-3xl font-bold mb-6">
                  Select Menus
                </h3>
                <p>
                  Floating elements that display a list of
                  options to choose from on click.
                </p>
              </div>
              <div className="flex justify-center gap-1">
                <SelectDemo />
              </div>
            </FloatingDelayGroup>
          </div>

          <div className="bg-white dark:bg-gray-700 dark:text-gray-100 p-10 sm:rounded-lg shadow text-center flex flex-col justify-between h-[18rem]">
            <FloatingDelayGroup delay={{open: 1000, close: 100}}>
              <div>
                <h3 className="text-3xl font-bold mb-6">
                  Comboboxes
                </h3>
                <p>
                  Floating elements that combine an input and a
                  list of searchable options to choose from.
                </p>
              </div>
              <div className="flex justify-center gap-1">
                <ComboboxDemo />
              </div>
            </FloatingDelayGroup>
          </div>

          <div className="bg-white dark:bg-gray-700 dark:text-gray-100 p-10 sm:rounded-lg shadow text-center flex flex-col justify-between h-[18rem]">
            <FloatingDelayGroup delay={{open: 1000, close: 100}}>
              <div>
                <h3 className="text-3xl font-bold mb-6">
                  Dropdown Menus
                </h3>
                <p>
                  Floating elements that display a list of
                  buttons that perform an action.
                </p>
              </div>
              <div className="flex justify-center gap-1">
                <Menu label="Edit balloon">
                  <MenuItem label="Undo" />
                  <MenuItem label="Redo" />
                  <MenuItem label="Copy" disabled />
                  <Menu label="Text transform">
                    <MenuItem label="UPPERCASE" />
                    <MenuItem label="lowercase" />
                    <MenuItem label="camelCase" />
                    <MenuItem label="PascalCase" />
                    <MenuItem label="snake_case" />
                    <MenuItem label="kebab-case" />
                  </Menu>
                  <Menu label="Find">
                    <MenuItem label="Find" />
                    <MenuItem label="Find Next" />
                    <MenuItem label="Find Previous" />
                  </Menu>
                </Menu>
              </div>
            </FloatingDelayGroup>
          </div>

          <div className="bg-white dark:bg-gray-700 dark:text-gray-100 p-10 sm:rounded-lg shadow text-center flex flex-col justify-between h-[18rem]">
            <FloatingDelayGroup delay={{open: 1000, close: 100}}>
              <div>
                <h3 className="text-3xl font-bold mb-6">
                  Dialogs
                </h3>
                <p>
                  A floating modal window overlaid on the UI,
                  rendering the content underneath inert.
                </p>
              </div>
              <div className="flex justify-center gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Delete balloon</Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white p-6 rounded-lg">
                    <DialogHeading className="text-2xl font-bold mb-2">
                      Delete balloon
                    </DialogHeading>
                    <DialogDescription>
                      Are you sure you want to delete?
                    </DialogDescription>
                    <div className="flex gap-2 mt-4">
                      <DialogClose className="cursor-default transition-colors w-full rounded-lg bg-red-500 hover:bg-red-600 text-white p-2">
                        Confirm
                      </DialogClose>
                      <DialogClose className="cursor-default transition-colors w-full rounded-lg bg-gray-300 hover:bg-slate-200 p-2">
                        Cancel
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </FloatingDelayGroup>
          </div>
        </div>

        <div className="container text-center mx-auto px-4 md:px-8 max-w-screen-xl mb-24">
          <Link
            href="/docs/react"
            className="inline-block transition-colors bg-rose-500 dark:bg-rose-600 hover:bg-pink-500 text-gray-50 p-6 rounded-md font-bold sm:text-xl"
          >
            Use Floating UI with React{' '}
            <ArrowRight
              className="inline-block relative top-[-1px]"
              size={20}
            />
          </Link>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl relative">
          <h2 className="inline-block text-transparent leading-gradient-heading bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500 dark:from-blue-500 dark:to-teal-400 text-3xl lg:text-4xl font-bold mt-16 mb-4">
            Modern, tree-shakeable modules.
          </h2>
          <p className="prose dark:prose-invert text-xl lg:text-2xl text-left mb-8 lg:leading-relaxed">
            This positioning toolkit has a platform-agnostic 0.6
            kB core (minified + Brotli compressed), with official
            bindings for the web, React DOM, React Native, and
            Vue.
          </p>
          <p className="prose dark:prose-invert text-xl lg:text-2xl text-left mb-8">
            Each module is{' '}
            <a
              href="https://bundlejs.com/?q=%40floating-ui%2Fdom&treeshake=%5B%7B%0A++computePosition%2Cshift%2ClimitShift%2Cflip%2Chide%2Coffset%2Carrow%2CautoPlacement%2Csize%2Cinline%2CautoUpdate%0A%7D%5D&config=%7B%22compression%22%3A%22brotli%22%7D"
              className="transition-colors underline underline-offset-4 font-bold text-rose-500 dark:text-rose-300 hover:text-gray-1000 decoration-rose-500/80 dark:decoration-rose-300/80 hover:decoration-gray-1000 dark:hover:text-gray-50 dark:hover:decoration-gray-50 decoration-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              fully tree-shakeable
            </a>{' '}
            by your bundler:
          </p>
          <div className="grid items-center py-8 pb-16">
            <div className="flex flex-col text-center text-md sm:text-lg md:text-xl mx-auto pr-4 sm:pr-20 md:pr-40">
              <div className="mb-2 flex gap-2 items-center justify-center">
                <code className="flex-1 text-blue-600 dark:text-blue-400 text-right">
                  computePosition
                  <span className="text-cyan-500 dark:text-cyan-200">
                    ()
                  </span>
                </code>
                <span className="text-md text-gray-600 dark:text-gray-400 text-left [font-variant-numeric:tabular-nums]">
                  <span className="invisible">+</span>0.6 kB
                </span>
              </div>
              {[
                {name: 'shift', size: '0.6 kB'},
                {name: 'limitShift', size: '0.2 kB'},
                {name: 'flip', size: '0.8 kB'},
                {name: 'hide', size: '0.2 kB'},
                {name: 'offset', size: '0.1 kB'},
                {name: 'arrow', size: '0.5 kB'},
                {name: 'autoPlacement', size: '0.4 kB'},
                {name: 'size', size: '0.3 kB'},
                {name: 'inline', size: '0.6 kB'},
                {name: 'autoUpdate', size: '0.3 kB'},
              ].map(({name, size}) => (
                <div
                  className="mb-2 flex gap-2 items-center justify-center"
                  key={name}
                >
                  <code className="flex-1 text-blue-600 dark:text-blue-400 text-right">
                    {name}
                    <span className="text-cyan-500 dark:text-cyan-200">
                      ()
                    </span>
                  </code>
                  <span className="text-md text-green-600 dark:text-green-400 text-left [font-variant-numeric:tabular-nums]">
                    +{size}
                  </span>
                </div>
              ))}
              <div className="mb-2 flex gap-3 items-center justify-center">
                <code className="flex-1 text-gray-600 dark:text-gray-400 text-right">
                  DOM platform
                </code>
                <span className="text-md text-yellow-600 dark:text-yellow-400 text-left [font-variant-numeric:tabular-nums]">
                  +2.5 kB
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 md:px-8 mx-auto max-w-screen-xl">
          <h2 className="inline-block text-3xl lg:text-4xl dark:text-gray-50 font-bold mt-8 mb-4">
            Support Floating UI!
          </h2>
          <p className="prose dark:prose-invert text-xl lg:text-2xl text-left mb-8 lg:leading-relaxed">
            Floating UI is free and open source, proudly
            sponsored by the following organizations — consider
            joining them on{' '}
            <a
              className="transition-colors underline underline-offset-4 font-bold text-rose-500 dark:text-rose-300 hover:text-gray-1000 decoration-rose-500/80 dark:decoration-rose-300/80 hover:decoration-gray-1000 dark:hover:text-gray-50 dark:hover:decoration-gray-50 decoration-2"
              href="https://opencollective.com/floating-ui"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Collective
            </a>
            .
          </p>
          <Cards items={SPONSORS} />
          <Logos items={MINI_SPONSORS} />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl relative">
          <h2 className="inline-block text-3xl lg:text-4xl dark:text-gray-50 leading-gradient-heading font-bold mb-4 mt-16">
            Ready to install?
          </h2>
          <p className="prose dark:prose-invert text-xl lg:text-2xl text-left mb-8 lg:leading-relaxed">
            Start playing via your package manager or CDN.
          </p>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="border dark:border-gray-200 dark:text-gray-100 rounded-lg py-8 px-12">
              <h3 className="text-2xl font-bold mb-4">
                Package Manager
              </h3>
              <p className="text-lg">
                Install with npm, Yarn, or pnpm.
              </p>
              <Link
                href="/docs/getting-started"
                className="text-xl font-bold flex gap-2 items-center mt-4 text-rose-500 dark:text-rose-300"
              >
                Get started <ArrowRight />
              </Link>
            </div>
            <div className="border dark:border-gray-200 dark:text-gray-100 rounded-lg py-8 px-12">
              <h3 className="text-2xl font-bold mb-4">CDN</h3>
              <p className="text-lg">
                Install with the jsDelivr CDN.
              </p>
              <Link
                href="/docs/getting-started#cdn"
                className="text-xl font-bold flex gap-2 items-center mt-4 text-rose-500 dark:text-rose-300"
              >
                Get started <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center dark:text-gray-500 bg-gray-50 dark:bg-gray-1000 mt-16 py-8">
        <div className="flex flex-col gap-3 container mx-auto px-4 max-w-screen-xl">
          <p>
            <strong>
              © {new Date().getFullYear()} • MIT License
            </strong>
          </p>
          <p className="dark:text-gray-400">
            Floating UI is the evolution of Popper 2, designed to
            bring the project to a new level.
          </p>
          <p className="dark:text-gray-400">
            Floating shapes in the header are licensed under CC
            BY from{' '}
            <a
              className="font-bold text-rose-500 dark:text-rose-300"
              href="https://www.figma.com/@killnicole"
            >
              Vic
            </a>{' '}
            and{' '}
            <a
              className="font-bold text-rose-500 dark:text-rose-300"
              href="https://www.figma.com/@Artstar3d"
            >
              Lisa Star
            </a>
            . Partial modifications were made.
          </p>
          <p>
            <a
              href="https://www.netlify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-rose-500 dark:text-rose-300"
            >
              This site is powered by Netlify
            </a>
            .
          </p>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
