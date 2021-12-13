import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/animations/scale-subtle.css';
import 'tippy.js/animations/perspective-subtle.css';

import Tippy from '@tippyjs/react';
import {inlinePositioning} from 'tippy.js';
import {useState} from 'react';
import {Check, ArrowRight, GitHub, Heart} from 'react-feather';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';
import Link from 'next/link';
import Head from 'next/head';
import DropdownExample from '../lib/components/DropdownExample.js';
import cn from 'classnames';
import {StaticCode} from '../lib/components/Code';

import Logo from '../assets/logo.svg';

import Logos from '../lib/components/Logos';
import Cards from '../lib/components/Cards';
import {MINI_SPONSORS, SPONSORS} from '../data';

function Placement() {
  const [placement, setPlacement] = useState('top');

  return (
    <div className="mb-4 grid lg:grid-cols-12 gap-8 bg-gradient-to-r from-blue-800 to-purple-700 rounded-lg px-4 py-8 sm:p-8">
      <div className="lg:col-span-7 overflow-hidden">
        <h3 className="text-2xl text-gray-50 font-bold mb-4">
          Placement
        </h3>
        <p className="text-xl text-blue-200 mb-4">
          Position your floating element on 12 core placements.
        </p>
        <div className="rounded-lg bg-gray-800 p-4 overflow-auto w-full">
          <StaticCode placement={placement} />
        </div>
      </div>
      <div className="grid lg:col-span-5 relative items-center bg-gray-800 rounded-lg h-128 lg:h-auto">
        <div className="text-center">
          {[
            {
              placement: 'top',
              styles: {
                left: 'calc(50% - 10px - 1rem)',
                top: 25,
              },
            },
            {
              placement: 'top-start',
              styles: {
                left: 'calc(50% - 70px - 1rem)',
                top: 25,
              },
            },
            {
              placement: 'top-end',
              styles: {
                left: 'calc(50% + 50px - 1rem)',
                top: 25,
              },
            },
            {
              placement: 'bottom',
              styles: {
                left: 'calc(50% - 10px - 1rem)',
                bottom: 25,
              },
            },
            {
              placement: 'bottom-start',
              styles: {
                left: 'calc(50% - 70px - 1rem)',
                bottom: 25,
              },
            },
            {
              placement: 'bottom-end',
              styles: {
                left: 'calc(50% + 50px - 1rem)',
                bottom: 25,
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
                  ' rounded-full border-2 border-solid border-blue-400',
                  {
                    'bg-blue-400': placement === p,
                  }
                )}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </button>
          ))}
          <Tippy
            placement={placement}
            visible
            content="Tooltip"
            offset={[0, 8]}
            arrow={false}
            theme="light-border"
            popperOptions={{
              modifiers: [
                {
                  name: 'flip',
                  enabled: false,
                },
                {
                  name: 'preventOverflow',
                  enabled: false,
                },
              ],
            }}
          >
            <button className="bg-blue-600 rounded text-md text-gray-50 p-2 sm:w-48 h-48">
              Click the dots
            </button>
          </Tippy>
        </div>
      </div>
    </div>
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
    <div className="mb-4 grid lg:grid-cols-12 gap-8 bg-gradient-to-r from-green-600 to-blue-800 rounded-lg px-4 py-8 sm:p-8 lg:h-[525px]">
      <div className="lg:col-span-7 overflow-hidden">
        <h3 className="text-2xl text-gray-50 font-bold mb-4">
          Shift
        </h3>
        <p className="text-xl text-green-100 mb-4">
          Shift the floating element in view to prevent overflow.
        </p>
        <div className="rounded-lg bg-gray-800 p-4 overflow-auto">
          <StaticCode middleware="shift" placement="right" />
        </div>
      </div>
      <div
        ref={setBoundary}
        className="grid lg:col-span-5 relative overflow-hidden p-2 bg-gray-800 rounded-lg"
      >
        <div className="grid relative items-center bg-gray-800 rounded overflow-auto w-full border-4 border-solid border-red-400 h-[450px] lg:h-auto">
          <div
            style={{
              height: 400,
              width: 1,
            }}
          />
          <div className="text-center">
            <Tippy
              visible={!!boundary}
              placement="right"
              content={
                <div className="px-2 text-center">
                  <div style={{height: 125}}></div>
                  <div>Floating</div>
                  <div>Element</div>
                  <div style={{height: 125}}></div>
                </div>
              }
              offset={[0, 8]}
              appendTo={() => boundary ?? document.body}
              theme="light-border"
              popperOptions={{
                modifiers: [
                  {
                    name: 'preventOverflow',
                    options: {
                      rootBoundary: 'document',
                      padding: 15,
                      tether: false,
                    },
                  },
                ],
              }}
            >
              <button className="bg-blue-600 rounded text-md text-gray-50 p-2">
                Scroll
              </button>
            </Tippy>
          </div>
          <div
            style={{
              height: 400,
              width: 1,
            }}
          />
        </div>
      </div>
    </div>
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
    <div className="mb-4 grid lg:grid-cols-12 gap-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg px-4 py-8 sm:p-8 lg:h-[525px]">
      <div className="grid lg:col-span-7 overflow-hidden">
        <h3 className="text-2xl text-gray-50 font-bold mb-4">
          Flip
        </h3>
        <p className="text-xl text-red-100 mb-4">
          Flip the floating element to the opposite placement to
          prevent overflow.
        </p>
        <div className="rounded-lg bg-gray-800 p-4 overflow-auto mt-auto">
          <StaticCode middleware="flip" placement="top" />
        </div>
      </div>
      <div
        className="grid lg:col-span-5 relative overflow-hidden p-2 bg-gray-800 rounded-lg"
        ref={setBoundary}
      >
        <div className="grid relative items-center bg-gray-800 rounded overflow-auto w-full border-4 border-styled border-red-400 h-[450px] lg:h-auto">
          <div
            style={{
              height: 500,
              width: 1,
            }}
          />
          <div className="text-center">
            <Tippy
              visible
              content={
                <div className="px-4">
                  <div style={{height: 30}}></div>
                  <span>Tooltip</span>
                  <div style={{height: 30}}></div>
                </div>
              }
              offset={[0, 8]}
              appendTo="parent"
              theme="light-border"
              popperOptions={{
                modifiers: [
                  {
                    name: 'preventOverflow',
                    options: {
                      rootBoundary: 'document',
                    },
                  },
                  {
                    name: 'flip',
                    options: {
                      rootBoundary: 'document',
                      padding: 0,
                    },
                  },
                ],
              }}
            >
              <button className="bg-blue-600 rounded text-md text-gray-50 p-2">
                Scroll
              </button>
            </Tippy>
          </div>
          <div
            style={{
              height: 500,
              width: 1,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Popovers() {
  return (
    <div className="grid lg:grid-cols-2 gap-4 bg-gradient-to-tr from-purple-600 to-blue-800 rounded-lg px-4 py-8 sm:p-8">
      <div>
        <h3 className="text-2xl text-gray-50 font-bold mb-4">
          Popovers
        </h3>
        <p className="text-xl text-pink-100 mb-4">
          Floating elements displaying rich HTML content
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid items-center h-full bg-gray-300 py-12 text-gray-900 rounded-lg p-4">
          <div className="text-center">
            <Tippy
              content={
                <div
                  className="text-left"
                  style={{
                    // Fixes shaky text in Chrome...
                    transform: 'rotate(0.001deg)',
                  }}
                >
                  <h3 className="text-lg font-bold p-2">
                    My popover title
                  </h3>
                  <div className="h-px bg-gray-200"></div>
                  <p className="p-2">
                    My long popover description that spans over
                    multiple lines.
                  </p>
                </div>
              }
              theme="light-border"
              animation="scale-subtle"
              trigger="click"
              duration={[250, 150]}
              maxWidth={250}
              aria={{content: 'labelledby'}}
            >
              <button className="text-md bg-blue-600 text-gray-50 hover:bg-blue-700 p-3 transition-colors rounded">
                View explanation
              </button>
            </Tippy>
            <div className="text-gray-500 mt-2">
              Click to open
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dropdowns() {
  return (
    <div className="grid lg:grid-cols-2 gap-4 bg-gradient-to-tr from-blue-600 via-purple-700 to-pink-600 rounded-lg px-4 py-8 sm:p-8">
      <div>
        <h3 className="text-2xl text-gray-50 font-bold mb-4">
          Dropdowns
        </h3>
        <p className="text-xl mb-4 text-pink-100">
          A menu of items and submenus
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid items-center h-full bg-gray-300 py-12 text-gray-900 rounded-lg p-4">
          <div className="text-center">
            <DropdownExample />
            <div className="text-gray-500 mt-2">
              Click to open
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tooltips() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 bg-gradient-to-r from-blue-800 to-purple-700 rounded-lg px-4 py-8 sm:p-8">
      <div>
        <h3 className="text-2xl text-gray-50 font-bold mb-4">
          Tooltips
        </h3>
        <p className="text-xl text-blue-200 mb-4">
          A floating element to describe an element, e.g. button
        </p>
      </div>
      <div className="flex flex-col gap-2 overflow-hidden">
        <div className="grid items-center h-full bg-gray-300 py-12 text-gray-900 rounded-lg">
          <div className="text-center">
            <Tippy content="Add emoji" offset={[0, 8]}>
              <button className="text-2xl">🙂</button>
            </Tippy>
            <div className="text-gray-500">
              Hover, tap, or focus
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Head>
        <title>
          Floating UI - Positioning for tooltips, popovers,
          dropdowns, and more
        </title>
      </Head>
      <header className="from-gray-700 to-gray-800 mb-24 overflow-hidden relative pb-48">
        <div className="container py-16 mx-auto px-4 text-center max-w-screen-xl">
          <Logo
            className="mx-auto"
            aria-label="Floating UI logo"
          />
          <div
            className="absolute -z-1 w-full"
            style={{
              top: '0',
              left: 'calc(-35rem + 50vw)',
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
          <h1 className="text-gray-50 mb-8 text-4xl sm:text-5xl font-bold">
            Floating UI
          </h1>
          <div className="flex flex-row justify-center gap-x-4">
            <Link href="/docs/getting-started">
              <a
                className="flex items-center gap-2 transition hover:saturate-110 hover:brightness-125 bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg hover:shadow-xl rounded text-gray-50 px-4 py-3 sm:text-lg font-bold whitespace-nowrap"
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
        <div className="container mx-auto px-4 max-w-screen-xl">
          <h2 className="inline-block text-3xl leading-gradient-heading lg:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Powerful positioning primitives.
          </h2>
          <p className="prose text-xl lg:text-2xl text-left">
            Position all types of{' '}
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
                className="relative"
                style={{
                  textDecorationLine: 'underline',
                  textDecorationStyle: 'wavy',
                  textUnderlineOffset: 6,
                  textDecorationThickness: 2,
                  textDecorationColor:
                    'rgba(200, 200, 255, 0.25)',
                }}
              >
                floating elements
              </span>
            </Tippy>{' '}
            with full control. Tooltips, popovers, dropdowns,
            menus, and more.
          </p>
        </div>
        <div className="container px-4 py-8 mx-auto max-w-screen-xl">
          <Placement />
          <Shift />
          <Flip />
        </div>

        <div className="container px-4 py-8 mx-auto max-w-screen-xl">
          <h2 className="inline-block text-3xl lg:text-4xl font-bold mt-8 mb-4">
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

        <div className="container mx-auto px-4 max-w-screen-xl relative">
          <h2 className="inline-block text-transparent leading-gradient-heading bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 text-3xl lg:text-4xl font-bold mt-8 mb-4">
            Light as a feather.
          </h2>
          <p className="prose text-xl lg:text-2xl text-left mb-8">
            The core is only 600 bytes when minified and
            compressed with Brotli. Plus, the architecture is
            super modular, so tree-shaking works like a charm.
          </p>
          <div className="grid items-center py-4">
            <div className="flex flex-col text-center text-md sm:text-lg md:text-xl mx-auto pr-4 sm:pr-20 md:pr-40">
              <div className="mb-2 flex gap-2 items-center justify-center">
                <code className="flex-1 text-blue-400 text-right">
                  computePosition
                  <span className="text-blue-200">()</span>
                </code>
                <span className="text-md text-gray-400 text-left">
                  &nbsp; 0.6 kB
                </span>
              </div>
              <div className="mb-2 flex gap-2 items-center justify-center">
                <code className="flex-1 text-blue-400 text-right">
                  shift<span className="text-blue-200">()</span>
                </code>
                <span className="text-md text-green-400 text-left">
                  +0.6 kB
                </span>
              </div>
              <div className="mb-2 flex gap-2 items-center justify-center">
                <code className="flex-1 text-blue-400 text-right">
                  limitShift
                  <span className="text-blue-200">()</span>
                </code>
                <span className="text-md text-green-400 text-left">
                  +0.1 kB
                </span>
              </div>
              <div className="mb-2 flex gap-2 items-center justify-center">
                <code className="flex-1 text-blue-400 text-right">
                  flip<span className="text-blue-200">()</span>
                </code>
                <span className="text-md text-green-400 text-left">
                  +0.5 kB
                </span>
              </div>
              <div className="mb-2 flex gap-2 items-center justify-center">
                <code className="flex-1 text-blue-400 text-right">
                  hide<span className="text-blue-200">()</span>
                </code>
                <span className="text-md text-green-400 text-left">
                  +0.2 kB
                </span>
              </div>
              <div className="mb-2 flex gap-2 items-center justify-center">
                <code className="flex-1 text-blue-400 text-right">
                  arrow<span className="text-blue-200">()</span>
                </code>
                <span className="text-md text-green-400 text-left">
                  +0.2 kB
                </span>
              </div>
              <div className="mb-2 flex gap-2 items-center justify-center">
                <code className="flex-1 text-blue-400 text-right">
                  offset
                  <span className="text-blue-200">()</span>
                </code>
                <span className="text-md text-green-400 text-left">
                  +0.1 kB
                </span>
              </div>
              <div className="mb-2 flex gap-2 items-center justify-center">
                <code className="flex-1 text-blue-400 text-right">
                  size<span className="text-blue-200">()</span>
                </code>
                <span className="text-md text-green-400 text-left">
                  +0.2 kB
                </span>
              </div>
              <div className="mb-2 flex gap-2 items-center justify-center">
                <code className="flex-1 text-blue-400 text-right">
                  autoPlacement
                  <span className="text-blue-200">()</span>
                </code>
                <span className="text-md text-green-400 text-left">
                  +0.4 kB
                </span>
              </div>
              <div className="mb-2 flex gap-3 items-center justify-center">
                <code className="flex-1 text-gray-400 text-right">
                  DOM platform
                </code>
                <span className="text-md text-yellow-400 text-left">
                  +1.9 kB
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-screen-xl relative">
          <h2 className="inline-block leading-gradient-heading text-3xl lg:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400 mt-16">
            Endlessly extensible.
          </h2>
          <p className="prose text-xl lg:text-2xl text-left mb-8">
            The core package exports middleware that cover 99% of
            positioning use cases, but for the remaining 1%, it's
            straightforward to add your own positioning logic.
          </p>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-red-600 to-pink-700 rounded-lg py-6 px-10">
              <h3 className="text-2xl text-gray-50 font-bold mb-4 text-yellow-100">
                Core middleware
              </h3>
              <ul className="text-lg text-pink-100 pl-6 flex flex-col gap-2">
                <li className="relative">
                  <Check
                    className="absolute top-1"
                    style={{left: '-2rem'}}
                  />
                  Instantly importable and usable
                </li>
                <li className="relative">
                  <Check
                    className="absolute top-1"
                    style={{left: '-2rem'}}
                  />
                  Simple and powerful
                </li>
                <li className="relative">
                  <Check
                    className="absolute top-1"
                    style={{left: '-2rem'}}
                  />
                  Customizable through options
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-pink-700 rounded-lg py-6 px-10">
              <h3 className="text-2xl text-gray-50 font-bold mb-4 text-yellow-100">
                Custom middleware
              </h3>
              <ul className="text-lg text-pink-100 pl-6 flex flex-col gap-2">
                <li className="relative">
                  <Check
                    className="absolute top-1"
                    style={{left: '-2rem'}}
                  />
                  Modify positioning coordinates
                </li>
                <li className="relative">
                  <Check
                    className="absolute top-1"
                    style={{left: '-2rem'}}
                  />
                  Add custom data
                </li>
                <li className="relative">
                  <Check
                    className="absolute top-1"
                    style={{left: '-2rem'}}
                  />
                  Add custom behavior
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-screen-xl relative">
          <h2 className="inline-block leading-gradient-heading text-3xl lg:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-red-300 to-green-300 mt-16">
            Components!
          </h2>
          <p className="prose text-xl lg:text-2xl text-left mb-8">
            Higher-level primitives to craft beautiful and
            accessible tooltips, popovers, dropdowns, and more is
            in development.
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
        </div>

        <div className="container mx-auto px-4 max-w-screen-xl relative">
          <h2 className="inline-block text-3xl lg:text-4xl leading-gradient-heading font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-yellow-100 mt-16">
            Ready to install?
          </h2>
          <p className="text-xl lg:text-2xl text-left mb-8">
            Start playing via CDN or your package manager.
          </p>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="border-gray-200 border-2 text-gray-100 rounded-lg py-8 px-12">
              <h3 className="text-2xl font-bold mb-4">
                Package Manager
              </h3>
              <p className="text-lg">
                Install with npm or Yarn.
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
                Install with the unpkg CDN.
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
