import {FloatingDelayGroup} from '@floating-ui/react';
import cn from 'classnames';
import Head from 'next/head';
import {useEffect, useRef, useState} from 'react';
import {
  ArrowRight,
  BarChart,
  Edit,
  GitHub,
  Heart,
  Share,
} from 'react-feather';

import Text from '../assets/text.svg';
import {Button} from '../lib/components/Button';
import {Cards} from '../lib/components/Cards';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
} from '../lib/components/Dialog';
import {ComboboxDemo} from '../lib/components/Home/Combobox';
import {
  Menu,
  MenuItem,
} from '../lib/components/Home/DropdownMenu';
import {PopoverDemo} from '../lib/components/Home/Popover';
import {
  Arrow,
  Flip,
  Placement,
  Shift,
  Size,
  Virtual,
} from '../lib/components/Home/PositioningDemos';
import {SelectDemo} from '../lib/components/Home/Select';
import {Link} from '../lib/components/Link';
import {Logos} from '../lib/components/Logos';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../lib/components/Tooltip';
import {useAppContext} from './_app';
import {getTierSponsors} from '../lib/utils/openCollective';

const b64banner =
  'data:image/png;base64,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';

function HomePage({sponsors}) {
  const {pageTransitionStatus} = useAppContext();
  const bannerRef = useRef();
  const logoRef = useRef();

  const [animate, setAnimate] = useState(true);
  const [hideBanner, setHideBanner] = useState(true);
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    bannerRef.current.src = '/floating-ui.jpg';
  }, []);

  useEffect(() => {
    const logo = logoRef.current;
    const io = new IntersectionObserver(([entry]) => {
      setAnimate(entry.isIntersecting);
    });
    io.observe(logo);
    return () => io.disconnect();
  }, []);

  return (
    <div data-fade={pageTransitionStatus}>
      <Head>
        <link rel="preload" as="image" href="/floating-ui.jpg" />
        <title>
          Floating UI - Create tooltips, popovers, dropdowns, and
          more
        </title>
      </Head>
      <header className="font-satoshi relative overflow-hidden bg-gray-900 pb-16">
        <div className="container mx-auto max-w-screen-xl bg-[#202028] pt-16 text-center">
          <svg
            ref={logoRef}
            width="140"
            height="230"
            viewBox="0 0 300 467"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('relative z-10 mx-auto', {
              'animate-float': animate,
            })}
            aria-hidden
          >
            <path
              d="M142 348.5C141 361.167 141.6 390.3 152 405.5C165 424.5 178 456.5 181 464.5"
              stroke="black"
              strokeWidth="5"
              strokeLinecap="round"
              className={cn({
                'animate-string': animate,
              })}
              style={{transformOrigin: '40% 92%'}}
            />
            <path
              d="M140.844 339.077C142.001 337.094 144.867 337.094 146.025 339.077L151.297 348.107C152.465 350.107 151.022 352.62 148.706 352.62H138.162C135.846 352.62 134.404 350.107 135.572 348.107L140.844 339.077Z"
              fill="#AD3A56"
            />
            <path
              d="M300 161.326C300 251.5 220.707 328.146 143.939 343.13C66.6667 329.145 4.0404 244.736 -1.52588e-05 158.329C1.54128e-07 64.93 76.2185 0 154.04 0C231.862 0 300 63.4316 300 161.326Z"
              fill="url(#paint0_radial_201_2)"
            />
            <ellipse
              cx="76.7677"
              cy="184.801"
              rx="25.2525"
              ry="24.9731"
              fill="#CD0031"
              fillOpacity="0.5"
            />
            <ellipse
              cx="214.141"
              cy="184.801"
              rx="25.2525"
              ry="24.9731"
              fill="#CD0031"
              fillOpacity="0.4"
            />
            <ellipse
              cx="191.919"
              cy="163.823"
              rx="13.1313"
              ry="12.986"
              fill="#222222"
            />
            <ellipse
              cx="98.9899"
              cy="163.823"
              rx="13.1313"
              ry="12.986"
              fill="#222222"
            />
            <mask
              id="mask0_201_2"
              style={{maskType: 'alpha'}}
              maskUnits="userSpaceOnUse"
              x="123"
              y="180"
              width="46"
              height="32"
            >
              <path
                d="M123.232 183.805C123.232 182.148 124.575 180.805 126.232 180.805H165.687C167.344 180.805 168.687 182.148 168.687 183.805V208.772C168.687 210.429 167.344 211.772 165.687 211.772H126.232C124.575 211.772 123.232 210.429 123.232 208.772V183.805Z"
                fill="#C4C4C4"
              />
            </mask>
            <g mask="url(#mask0_201_2)">
              <path
                d="M168.687 182.304C168.687 194.717 158.512 204.779 145.96 204.779C133.408 204.779 123.232 194.717 123.232 182.304C123.232 169.891 133.408 159.828 145.96 159.828C158.512 159.828 168.687 169.891 168.687 182.304Z"
                fill="#222222"
              />
            </g>
            <defs>
              <radialGradient
                id="paint0_radial_201_2"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(32.3232 221.761) rotate(-30.6138) scale(283.446 246.147)"
              >
                <stop stopColor="#FF3767" />
                <stop offset="0.807292" stopColor="#F36D76" />
                <stop offset="1" stopColor="#FFE1DA" />
              </radialGradient>
            </defs>
          </svg>

          <div
            className="absolute top-[-3rem] w-full overflow-hidden"
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
              className={`absolute select-none transition-all duration-500 top-0${
                hideBanner ? ' scale-95 opacity-0' : ' scale-100'
              }`}
              width={1167}
              height={648}
              onLoad={() => {
                setHideBanner(false);
              }}
            />
          </div>
          <Text
            className="z-1 relative top-[2rem] mx-auto"
            aria-label="Floating UI text logo"
          />

          <div className="z-1 relative mt-24 flex flex-row justify-center gap-x-4">
            <Link
              href="/docs/getting-started"
              className="hover:saturate-110 flex items-center gap-2 whitespace-nowrap rounded bg-gradient-to-br from-red-300 via-violet-300 to-cyan-400 px-4 py-3 font-bold text-gray-900 shadow-lg transition hover:shadow-xl hover:brightness-110 sm:text-lg"
            >
              Get Started <ArrowRight />
            </Link>
            <a
              href="https://github.com/floating-ui/floating-ui"
              className="flex items-center gap-2 rounded bg-gray-50 px-4 py-3 font-bold text-gray-900 shadow-lg transition hover:shadow-xl sm:text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub /> GitHub
            </a>
          </div>
          <p className="z-1 relative mx-auto mt-16 px-4 text-center text-xl leading-relaxed text-purple-200 dark:prose-invert lg:text-2xl">
            A JavaScript library to position floating elements
            and create interactions for them.
          </p>
        </div>
      </header>
      <main className="relative">
        <div className="font-satoshi container mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-4 mt-12 inline-block bg-gradient-to-br from-rose-400 via-purple-500 to-cyan-500 bg-clip-text py-1 text-3xl font-bold text-transparent dark:mt-0 dark:from-rose-400 dark:via-purple-400 dark:to-cyan-400 lg:mt-16 lg:text-4xl lg:[line-height:3.5rem] dark:lg:mt-4">
            Smart Anchor Positioning
          </h2>
          <p className="prose text-left text-xl dark:prose-invert lg:text-2xl lg:leading-relaxed">
            Anchor a floating element next to another element
            while making sure it stays in view by{' '}
            <strong>avoiding collisions</strong>. This lets you
            position tooltips, popovers, or dropdowns optimally.
          </p>
        </div>
        <div className="container mx-auto grid max-w-screen-xl gap-4 py-10 md:px-4 lg:grid-cols-2">
          <Placement />
          <Shift />
          <Flip />
          <Size />
          <Arrow />
          <Virtual />
        </div>

        <div className="container mx-auto max-w-screen-xl md:p-4">
          <div className="bg-white py-4 mt-8 dark:mb-8 dark:bg-gray-700 w-full md:rounded-2xl text-center shadow">
            <div className="font-satoshi container mx-auto max-w-screen-xl px-4 md:px-8 mb-4 mt-12 lg:mt-16">
              <div className="inline-flex items-center gap-4 mb-4">
                <svg
                  className="relative -top-1"
                  width={17 * 3}
                  height={24 * 3}
                  viewBox="0 0 17 24"
                  fill="currentcolor"
                  aria-hidden
                >
                  <path d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z"></path>
                  <path d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z"></path>
                </svg>
                <h2 className="inline-block py-1 font-extrabold text-6xl">
                  Base UI
                </h2>
              </div>
              <p className="prose text-xl dark:prose-invert lg:text-2xl lg:leading-relaxed mx-auto max-w-screen-md my-4 px-4 text-pretty">
                A new headless React component library built on
                top of Floating UI that provides a set of
                headless floating components (among others) —
                tooltips, popovers, menus, selects, preview
                cards, dialogs, toasts, and more.
              </p>
            </div>
            <div className="container mx-auto mb-12 max-w-screen-xl px-4 md:px-8 lg:mb-16 mt-12">
              <a
                href="https://base-ui.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-gray-900 dark:bg-gray-100 dark:hover:bg-white p-6 font-bold text-gray-50 transition-colors hover:bg-gray-700 sm:text-xl dark:text-gray-900"
              >
                Start using Base UI{' '}
                <ArrowRight
                  className="relative top-[-1px] inline-block"
                  size={20}
                />
              </a>
            </div>
          </div>
        </div>

        <div className="font-satoshi container mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-4 inline-block bg-gradient-to-br from-rose-400 via-purple-500 to-cyan-500 bg-clip-text py-1 text-3xl font-bold text-transparent dark:mt-0 dark:from-rose-400 dark:via-purple-400 dark:to-cyan-400 mt-16 lg:text-4xl lg:[line-height:3.5rem] dark:lg:mt-4">
            Interactions for React
          </h2>
          <p className="prose text-left text-xl dark:prose-invert lg:text-2xl lg:leading-relaxed">
            Build advanced floating components using Floating
            UI's React toolkit of components and hooks.
          </p>
        </div>

        <div className="container mx-auto mb-12 grid max-w-screen-xl gap-4 py-10 dark:text-black sm:grid-cols-2 md:px-4 lg:grid-cols-3">
          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:h-[19rem] sm:rounded-lg md:h-[18rem]">
            <FloatingDelayGroup
              delay={{open: 1000, close: 150}}
              timeoutMs={200}
            >
              <div>
                <h3 className="mb-6 text-3xl font-bold">
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
                    <Button
                      aria-label="Like"
                      className="rounded-full p-3 hover:text-red-500 dark:hover:text-red-300"
                    >
                      <Heart size={26} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Like</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      aria-label="Share"
                      className="rounded-full p-3 hover:text-blue-500 dark:hover:text-blue-300"
                    >
                      <Share size={26} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      aria-label="Stats"
                      className="rounded-full p-3 hover:text-orange-500 dark:hover:text-orange-300"
                    >
                      <BarChart size={26} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Stats</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      aria-label="Edit"
                      className="rounded-full p-3 hover:text-green-500 dark:hover:text-green-300"
                    >
                      <Edit size={26} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
              </div>
            </FloatingDelayGroup>
          </div>

          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:h-[19rem] sm:rounded-lg md:h-[18rem]">
            <div>
              <h3 className="mb-6 text-3xl font-bold">
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
          </div>

          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:h-[19rem] sm:rounded-lg md:h-[18rem]">
            <div>
              <h3 className="mb-6 text-3xl font-bold">
                Select Menus
              </h3>
              <p>
                Floating elements that display a list of options
                to choose from on click.
              </p>
            </div>
            <div className="flex justify-center gap-1">
              <SelectDemo />
            </div>
          </div>

          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:h-[19rem] sm:rounded-lg md:h-[18rem]">
            <div>
              <h3 className="mb-6 text-3xl font-bold">
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
          </div>

          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:h-[19rem] sm:rounded-lg md:h-[18rem]">
            <div>
              <h3 className="mb-6 text-3xl font-bold">
                Dropdown Menus
              </h3>
              <p>
                Floating elements that display a list of buttons
                that perform an action.
              </p>
            </div>
            <div className="flex justify-center gap-1">
              <Menu label="Edit balloon">
                <MenuItem label="Inflate" />
                <MenuItem label="Deflate" />
                <MenuItem label="Tie" disabled />
                <Menu label="Pop with">
                  <MenuItem label="Knife" />
                  <MenuItem label="Pin" />
                  <MenuItem label="Fork" />
                  <MenuItem label="Sword" />
                </Menu>
                <Menu label="Change color to">
                  <MenuItem label="Blue" />
                  <MenuItem label="Red" />
                  <MenuItem label="Green" />
                </Menu>
                <Menu label="Transform">
                  <MenuItem label="Move" />
                  <MenuItem label="Rotate" />
                  <MenuItem label="Resize" />
                </Menu>
              </Menu>
            </div>
          </div>

          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:h-[19rem] sm:rounded-lg md:h-[18rem]">
            <div>
              <h3 className="mb-6 text-3xl font-bold">
                Dialogs
              </h3>
              <p>
                Floating windows overlaid on the UI, rendering
                content underneath them inert.
              </p>
            </div>
            <div className="flex justify-center gap-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Delete balloon</Button>
                </DialogTrigger>
                <DialogContent className="rounded-lg bg-white p-6">
                  <DialogHeading className="mb-2 text-2xl font-bold">
                    Delete balloon
                  </DialogHeading>
                  <DialogDescription>
                    Are you sure you want to delete?
                  </DialogDescription>
                  <div className="mt-4 flex gap-2">
                    <DialogClose className="w-full cursor-default rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600">
                      Confirm
                    </DialogClose>
                    <DialogClose className="w-full cursor-default rounded-lg bg-gray-300 p-2 transition-colors hover:bg-slate-200">
                      Cancel
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="container mx-auto mb-12 max-w-screen-xl px-4 text-center md:px-8 lg:mb-16">
          <Link
            href="/docs/react"
            className="inline-block rounded-md bg-rose-500 p-6 font-bold text-gray-50 transition-colors hover:bg-pink-500 dark:bg-rose-600 sm:text-xl"
          >
            Use Floating UI with React{' '}
            <ArrowRight
              className="relative top-[-1px] inline-block"
              size={20}
            />
          </Link>
        </div>

        <div className="container relative mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-4 mt-12 inline-block bg-gradient-to-br from-rose-400 via-purple-500 to-cyan-500 bg-clip-text py-1 text-3xl font-bold text-transparent dark:mt-0 dark:from-rose-400 dark:via-purple-400 dark:to-cyan-400 lg:mt-16 lg:text-4xl lg:[line-height:3.5rem] dark:lg:mt-4">
            Tree-shakeable & Platform-agnostic
          </h2>
          <p className="font-satoshi prose mb-8 text-left text-xl dark:prose-invert lg:text-2xl lg:leading-relaxed">
            In addition to official bindings for the web, React
            DOM, React Native, and Vue, Floating UI also supports{' '}
            <code className="p-0">
              <span className="text-cyan-600 dark:text-cyan-300">
                &lt;
              </span>
              <span className="text-red-600 dark:text-red-400">
                canvas
              </span>
              <span className="text-cyan-600 dark:text-cyan-300">
                &gt;
              </span>
            </code>
            , and each module is{' '}
            <a
              href="https://bundlejs.com/?q=%40floating-ui%2Fdom&treeshake=%5B%7B%0A++computePosition%2Cshift%2ClimitShift%2Cflip%2Chide%2Coffset%2Carrow%2CautoPlacement%2Csize%2Cinline%2CautoUpdate%0A%7D%5D&config=%7B%22compression%22%3A%22brotli%22%7D"
              className="font-bold text-rose-600 underline decoration-rose-500/80 decoration-2 underline-offset-4 transition-colors hover:text-gray-1000 hover:decoration-gray-1000 dark:text-rose-300 dark:decoration-rose-300/80 dark:hover:text-gray-50 dark:hover:decoration-gray-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              fully tree-shakeable
            </a>{' '}
            by your bundler:
          </p>
          <div className="font-code grid items-center py-8 pb-16">
            <div className="text-md mx-auto flex flex-col pr-4 text-center sm:pr-20 sm:text-lg md:pr-40 md:text-xl">
              <div className="mb-2 flex items-center justify-center gap-2">
                <code className="flex-1 text-right text-blue-600 dark:text-blue-400">
                  computePosition
                  <span className="text-cyan-500 dark:text-cyan-200">
                    ()
                  </span>
                </code>
                <span className="text-md text-left text-gray-600 [font-variant-numeric:tabular-nums] dark:text-gray-400">
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
                  className="mb-2 flex items-center justify-center gap-2"
                  key={name}
                >
                  <code className="flex-1 text-right text-blue-600 dark:text-blue-400">
                    {name}
                    <span className="text-cyan-500 dark:text-cyan-200">
                      ()
                    </span>
                  </code>
                  <span className="text-md text-left text-green-700 [font-variant-numeric:tabular-nums] dark:text-green-400">
                    +{size}
                  </span>
                </div>
              ))}
              <div className="mb-2 flex items-center justify-center gap-3">
                <code className="flex-1 text-right text-gray-600 dark:text-gray-400">
                  DOM platform
                </code>
                <span className="text-md text-left text-yellow-700 [font-variant-numeric:tabular-nums] dark:text-yellow-400">
                  +2.5 kB
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="font-satoshi container mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-4 mt-12 inline-block bg-gradient-to-br from-rose-400 via-purple-500 to-cyan-500 bg-clip-text py-1 text-3xl font-bold text-transparent dark:mt-0 dark:from-rose-400 dark:via-purple-400 dark:to-cyan-400 lg:mt-16 lg:text-4xl lg:[line-height:3.5rem] dark:lg:mt-4">
            Support Floating UI
          </h2>
          <p className="prose mb-8 text-left text-xl dark:prose-invert lg:text-2xl lg:leading-relaxed">
            Floating UI is free and open source, proudly
            sponsored by the following organizations — consider
            joining them on{' '}
            <a
              className="font-bold text-rose-600 underline decoration-rose-500/80 decoration-2 underline-offset-4 transition-colors hover:text-gray-1000 hover:decoration-gray-1000 dark:text-rose-300 dark:decoration-rose-300/80 dark:hover:text-gray-50 dark:hover:decoration-gray-50"
              href="https://opencollective.com/floating-ui"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Collective
            </a>
            .
          </p>
          <Cards items={sponsors.website} />
          <Logos items={sponsors.mini} />
        </div>

        <div className="container relative mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-4 mt-12 inline-block bg-gradient-to-br from-rose-400 via-purple-500 to-cyan-500 bg-clip-text py-1 text-3xl font-bold text-transparent dark:mt-0 dark:from-rose-400 dark:via-purple-400 dark:to-cyan-400 lg:mt-16 lg:text-4xl lg:[line-height:3.5rem] dark:lg:mt-4">
            Install
          </h2>
          <p className="font-satoshi prose mb-8 text-left text-xl dark:prose-invert lg:text-2xl lg:leading-relaxed">
            Start playing via your package manager or CDN.
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-700 dark:text-gray-100">
              <h3 className="mb-4 text-2xl font-bold">
                Package Manager
              </h3>
              <p className="text-lg">
                Install with npm, Yarn, or pnpm.
              </p>
              <Link
                href="/docs/getting-started"
                className="mt-4 flex items-center gap-2 text-xl font-bold text-rose-600 dark:text-rose-300"
              >
                Get started <ArrowRight />
              </Link>
            </div>
            <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-700 dark:text-gray-100">
              <h3 className="mb-4 text-2xl font-bold">CDN</h3>
              <p className="text-lg">
                Install with the jsDelivr CDN.
              </p>
              <Link
                href="/docs/getting-started#cdn"
                className="mt-4 flex items-center gap-2 text-xl font-bold text-rose-600 dark:text-rose-300"
              >
                Get started <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 bg-gray-50 py-8 text-center shadow dark:border-t dark:border-gray-800 dark:bg-transparent dark:text-gray-500">
        <div className="container mx-auto flex max-w-screen-xl flex-col gap-3 px-4">
          <p>
            <strong className="font-semibold">
              © {year && `${year} •`} MIT License
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
              className="font-semibold text-rose-600 dark:text-rose-300"
              href="https://www.figma.com/@killnicole"
            >
              Vic
            </a>{' '}
            and{' '}
            <a
              className="font-semibold text-rose-600 dark:text-rose-300"
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
              className="font-semibold text-rose-600 dark:text-rose-300"
            >
              This site is powered by Netlify
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;

export async function getStaticProps() {
  const sponsors = await Promise.all([
    getTierSponsors('floating-ui', 'Website Sponsor'),
    getTierSponsors('floating-ui', 'Mini Sponsor'),
  ]);

  return {
    props: {
      sponsors: {
        website: sponsors[0],
        mini: sponsors[1],
      },
    },
  };
}
