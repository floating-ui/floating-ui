import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/animations/scale-subtle.css';
import 'tippy.js/animations/perspective-subtle.css';

import Tippy from '@tippyjs/react';
import {inlinePositioning} from 'tippy.js';
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import {
  useFloating,
  shift,
  getOverflowAncestors,
} from '@floating-ui/react-dom';
import {ArrowRight, GitHub} from 'react-feather';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';
import Link from 'next/link';
import Head from 'next/head';

import {Chrome} from '../lib/components/Chrome';
import {Floating} from '../lib/components/Floating';
import {Logos} from '../lib/components/Logos';
import {Cards} from '../lib/components/Cards';

import {MINI_SPONSORS, SPONSORS} from '../data';

import Logo from '../assets/logo.svg';
import Text from '../assets/text.svg';

const Reference = forwardRef(({className, children}, ref) => {
  return (
    <button
      ref={ref}
      className={`text-sm z-50 font-bold text-gray-900 bg-gray-50 p-2 w-24 h-24 border-2 border-gray-900 border-dashed cursor-default ${className}`}
    >
      {children}
    </button>
  );
});

function GridItem({title, description, chrome, titleClass}) {
  return (
    <div className="flex flex-col overflow-x-hidden justify-between bg-gray-700 rounded-lg px-4 py-8 sm:p-8">
      <div className="overflow-hidden">
        <h3 className={`text-3xl font-bold mb-2 ${titleClass}`}>
          {title}
        </h3>
        <p className="text-xl mb-6">{description}</p>
      </div>
      <div className="relative items-center bg-gray-800 rounded-lg lg:h-auto">
        {chrome}
      </div>
    </div>
  );
}

function Placement() {
  const [placement, setPlacement] = useState('top');

  return (
    <GridItem
      titleClass="text-violet-300"
      title="Placement"
      description="Places your floating element on 12 core positions."
      chrome={
        <Chrome
          label="Click the dots"
          center
          className="grid items-center relative"
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
                    'border-gray-500': placement === p,
                    'border-gray-600': placement !== p,
                    'bg-gray-500': placement === p,
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
                      : '',
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
      titleClass="text-blue-300"
      description="Shifts your floating element to keep it in view."
      chrome={
        <div
          ref={setBoundary}
          className="relative overflow-hidden"
        >
          <Chrome
            label="Scroll the container"
            scrollable
            relative={false}
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
                    elit, in dapibus enim. Aliquam hendrerit
                    iaculis facilisis.
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
      titleClass="text-red-300"
      description="Changes the placement of your floating element to keep it in view."
      chrome={
        <div
          className="relative overflow-hidden"
          ref={setBoundary}
        >
          <Chrome label="Scroll the container" scrollable center>
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
      titleClass="text-green-300"
      description="Changes the size of your floating element to keep it in view."
      chrome={
        <Chrome label="Scroll the container" scrollable center>
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
      titleClass="text-yellow-300"
      description="Dynamically positions an arrow element that is center-aware."
      chrome={
        <div
          ref={setBoundary}
          className="grid lg:col-span-5 relative overflow-hidden"
        >
          <Chrome
            label="Scroll the container"
            scrollable
            relative={false}
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
      description="Position relative to any coordinates, such as your mouse cursor."
      chrome={
        <Chrome label="Move your mouse">
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
              className="bg-gray-500 text-gray-50 font-bold p-4 rounded"
              style={{
                position: 'absolute',
                top: y ?? '',
                left: Math.round(x) ?? '',
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

function HomePage() {
  return (
    <>
      <Head>
        <title>
          Floating UI - Create tooltips, popovers, dropdowns, and
          more
        </title>
      </Head>
      <header className="from-gray-700 to-gray-800 mb-24 overflow-hidden relative pb-48">
        <div className="container pt-16 mx-auto text-center max-w-screen-xl">
          <Logo
            className="mx-auto"
            aria-label="Floating UI logo"
          />
          <div
            className="absolute -z-1 w-full top-[-3rem]"
            style={{
              left: 'calc(-36.9rem + 50vw)',
              width: 1200,
            }}
          >
            <img
              className="select-none"
              src="/floating-ui.jpg"
              width={1167}
              height={648}
            />
          </div>
          <Text className="mx-auto relative top-[2rem]" />

          <div className="flex flex-row justify-center gap-x-4 mt-24">
            <Link href="/docs/getting-started">
              <a
                className="flex items-center gap-2 transition hover:saturate-110 hover:brightness-110 bg-gradient-to-br from-red-300 via-violet-300 to-cyan-400 shadow-lg hover:shadow-xl rounded text-gray-900 px-4 py-3 sm:text-lg font-bold whitespace-nowrap"
                href="/docs/getting-started"
              >
                Get Started <ArrowRight />
              </a>
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
        </div>
      </header>
      <main className="relative -mt-60 sm:-mt-48">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
          <p className="prose text-xl lg:text-2xl text-left">
            Floating UI is a low-level toolkit to create{' '}
            <Tippy
              content={
                <div className="text-lg p-2">
                  A <strong>floating element</strong> is one that
                  floats on top of the UI without disrupting the
                  flow of content, like this one!
                </div>
              }
              theme="light-border"
              aria={{content: 'labelledby'}}
              animation="scale-subtle"
              duration={[450, 125]}
              inlinePositioning={true}
              plugins={[inlinePositioning]}
            >
              <span
                tabIndex={0}
                className="relative text-gray-50"
                style={{
                  textDecorationLine: 'underline',
                  textDecorationStyle: 'wavy',
                  textUnderlineOffset: 4,
                  textDecorationThickness: 1,
                  textDecorationColor:
                    'rgba(255, 255, 255, 0.5)',
                }}
              >
                floating elements
              </span>
            </Tippy>
            . Tooltips, popovers, dropdowns, menus, and more.
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

        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl relative">
          <h2 className="inline-block text-transparent leading-gradient-heading bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-orange-300 text-3xl lg:text-4xl font-bold mt-8 mb-4">
            Light as a feather.
          </h2>
          <p className="prose text-xl lg:text-2xl text-left mb-8">
            The core is only 600 bytes when minified and
            compressed with Brotli. Plus, the architecture is
            super modular, so tree-shaking works like a charm.
          </p>
          <div className="grid items-center py-8 pb-16">
            <div className="flex flex-col text-center text-md sm:text-lg md:text-xl mx-auto pr-4 sm:pr-20 md:pr-40">
              <div className="mb-2 flex gap-2 items-center justify-center">
                <code className="flex-1 text-blue-400 text-right">
                  computePosition
                  <span className="text-blue-200">()</span>
                </code>
                <span className="text-md text-gray-400 text-left [font-variant-numeric:tabular-nums]">
                  <span className="invisible">+</span>0.6 kB
                </span>
              </div>
              {[
                {name: 'shift', size: '0.6 kB'},
                {name: 'limitShift', size: '0.2 kB'},
                {name: 'flip', size: '0.5 kB'},
                {name: 'hide', size: '0.2 kB'},
                {name: 'offset', size: '0.1 kB'},
                {name: 'autoPlacement', size: '0.4 kB'},
                {name: 'size', size: '0.3 kB'},
                {name: 'inline', size: '0.6 kB'},
              ].map(({name, size}) => (
                <div
                  className="mb-2 flex gap-2 items-center justify-center"
                  key={name}
                >
                  <code className="flex-1 text-blue-400 text-right">
                    {name}
                    <span className="text-blue-200">()</span>
                  </code>
                  <span className="text-md text-green-400 text-left [font-variant-numeric:tabular-nums]">
                    +{size}
                  </span>
                </div>
              ))}
              <div className="mb-2 flex gap-3 items-center justify-center">
                <code className="flex-1 text-gray-400 text-right">
                  DOM platform
                </code>
                <span className="text-md text-yellow-400 text-left [font-variant-numeric:tabular-nums]">
                  +1.9 kB
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 md:px-8 mx-auto max-w-screen-xl">
          <h2 className="inline-block text-3xl lg:text-4xl text-gray-200 font-bold mt-8 mb-4">
            Support Floating UI's future.
          </h2>
          <p className="prose text-xl lg:text-2xl text-left mb-8">
            Ongoing work is making Floating UI the best, 100%
            free solution in this space. We are proudly sponsored
            by the following organizations, consider joining them
            on{' '}
            <a
              href="https://opencollective.com/floating-ui"
              rel="noopener noreferrer"
            >
              Open Collective
            </a>
            !
          </p>
          <Cards items={SPONSORS} />
          <Logos items={MINI_SPONSORS} />
        </div>

        {/* <div className="container mx-auto px-4 md:px-8 max-w-screen-xl relative">
          <h2 className="inline-block leading-gradient-heading text-3xl lg:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-pink-400 mt-16">
            Components!
          </h2>
          <p className="prose text-xl lg:text-2xl text-left mb-8">
            The ability to easily craft beautiful and accessible
            tooltips, popovers, dropdowns, and more is in
            development.
          </p>

          <div className="grid lg:grid-cols-2 gap-4">
            <Tooltips />
            <Dropdowns />
            <Popovers />

            <div className="bg-gradient-to-tr from-gray-700 to to-gray-800 rounded-lg px-4 py-8 sm:p-8">
              <h3 className="text-2xl text-gray-50 font-bold mb-4">
                Coming soon
              </h3>
              <p className="text-lg mb-4">
                The{' '}
                <span className="text-gray-50 font-bold">
                  @floating-ui/components
                </span>{' '}
                package is in development. Consider supporting
                the future of this project through sponsorship:
              </p>
              <a
                href="https://opencollective.com/floating-ui"
                className="flex justify-center items-center gap-2 text-lg border-2 border-solid border-pink-300 text-pink-300 rounded px-4 py-2 hover:bg-pink-300 hover:text-gray-900 transition"
              >
                Sponsor <Heart />
              </a>
            </div>
          </div>
        </div> */}

        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl relative">
          <h2 className="inline-block text-3xl lg:text-4xl leading-gradient-heading font-bold mb-4 mt-16">
            Ready to install?
          </h2>
          <p className="prose text-xl lg:text-2xl text-left mb-8">
            Start playing via your package manager or CDN.
          </p>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="border-gray-200 border-2 text-gray-100 rounded-lg py-8 px-12">
              <h3 className="text-2xl font-bold mb-4">
                Package Manager
              </h3>
              <p className="text-lg">
                Install with npm, Yarn, or pnpm.
              </p>
              <Link href="/docs/getting-started">
                <a
                  href="/docs/getting-started"
                  className="text-xl font-bold flex gap-2 items-center mt-4"
                >
                  Get started <ArrowRight />
                </a>
              </Link>
            </div>
            <div className="border-gray-200 border-2 text-gray-100 rounded-lg py-8 px-12">
              <h3 className="text-2xl font-bold mb-4">CDN</h3>
              <p className="text-lg">
                Install with the unpkg or Skypack CDN.
              </p>
              <Link href="/docs/getting-started#cdn">
                <a
                  href="/docs/getting-started#cdn"
                  className="text-xl font-bold flex gap-2 items-center mt-4"
                >
                  Get started <ArrowRight />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-gray-500 bg-gray-1000 mt-16 py-8">
        <div className="flex flex-col gap-3 container mx-auto px-4 max-w-screen-xl">
          <p>© {new Date().getFullYear()} • MIT License</p>
          <p className="text-gray-400">
            Floating UI is the evolution of Popper 2, designed to
            bring the project to a new level.
          </p>
          <p className="text-gray-400">
            Floating shapes in the header are licensed under CC
            BY from{' '}
            <a
              className="text-blue-400"
              href="https://www.figma.com/@killnicole"
            >
              Vic
            </a>{' '}
            and{' '}
            <a
              className="text-blue-400"
              href="https://www.figma.com/@Artstar3d"
            >
              Lisa Star
            </a>
            . Partial modifications were made.
          </p>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
