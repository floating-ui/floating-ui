import {FloatingDelayGroup} from '@floating-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {
  ArrowRight,
  BarChart,
  Edit,
  GitHub,
  Heart,
  Share,
} from 'react-feather';

import Logo from '../assets/logo.svg';
import Text from '../assets/text.svg';
import {MINI_SPONSORS, SPONSORS} from '../data';
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
import {Logos} from '../lib/components/Logos';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../lib/components/Tooltip';

const b64banner =
  'data:image/jpeg;base64,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UGdQc2VudW0AAAAAUGdQcwAAAABQZ1BDAAAAAExlZnRVbnRGI1JsdAAAAAAAAAAAAAAAAFRvcCBVbnRGI1JsdAAAAAAAAAAAAAAAAFNjbCBVbnRGI1ByY0BZAAAAAAAAAAAAEGNyb3BXaGVuUHJpbnRpbmdib29sAAAAAA5jcm9wUmVjdEJvdHRvbWxvbmcAAAAAAAAADGNyb3BSZWN0TGVmdGxvbmcAAAAAAAAADWNyb3BSZWN0UmlnaHRsb25nAAAAAAAAAAtjcm9wUmVjdFRvcGxvbmcAAAAAADhCSU0D7QAAAAAAEABIAAAAAQACAEgAAAABAAI4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAFo4QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAI4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQAAAAAAAACAAM4QklNBAIAAAAAAAgAAAAAAAAAADhCSU0EMAAAAAAABAEBAQE4QklNBC0AAAAAAAYAAQAAAAc4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADSQAAAAYAAAAAAAAAAAAAADMAAABkAAAACgBVAG4AdABpAHQAbABlAGQALQAxAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAABkAAAAMwAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABAAAAAAAAbnVsbAAAAAIAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAAA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PSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wMy0zMFQyMjoxNTozMSsxMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wMy0zMFQyMjoxNTozMSsxMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDMtMzBUMjI6MTU6MzErMTE6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzkwNjVjYWYtMGM0ZC00MDQwLTliODAtNWQyMTU0MDFlNGY2IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NDk1NmU5ODctZDdmMy1mNzQxLTgxMTAtYTZiODFlNjk3Y2UwIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Y2Y4MTU0MzctM2FkYS00Nzk3LTgzOTgtMGRhYjJhMGEyOGQxIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iRGlzcGxheSIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjZjgxNTQzNy0zYWRhLTQ3OTctODM5OC0wZGFiMmEwYTI4ZDEiIHN0RXZ0OndoZW49IjIwMjItMDMtMzBUMjI6MTU6MzErMTE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjOTA2NWNhZi0wYzRkLTQwNDAtOWI4MC01ZDIxNTQwMWU0ZjYiIHN0RXZ0OndoZW49IjIwMjItMDMtMzBUMjI6MTU6MzErMTE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8cmRmOkJhZz4gPHJkZjpsaT41QkJFODFFOTJGMUQwQTZDQTVEREQwMEE4NzNFNkIwMDwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+IQCElDQ19QUk9G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';

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
      <header className="relative mb-12 overflow-hidden bg-gray-900 from-gray-700 to-gray-800 pb-16">
        <div className="container mx-auto max-w-screen-xl pt-16 text-center">
          <Logo
            className="mx-auto"
            aria-label="Floating UI logo (a cute smiling red balloon)"
            style={{position: 'relative', zIndex: 1}}
          />
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
          <p className="z-1 prose relative mx-auto mt-16 px-4 text-center text-xl text-gray-100 dark:prose-invert lg:text-2xl lg:leading-relaxed">
            A JavaScript library to position{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  tabIndex={0}
                  // VoiceOver
                  role="button"
                  className="relative text-gray-100 decoration-gray-150"
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
                <div className="p-2 text-lg">
                  A <strong>floating element</strong> is one that
                  floats on top of the UI without disrupting the
                  flow of content, like this one!
                </div>
              </TooltipContent>
            </Tooltip>{' '}
            and create interactions for them.
          </p>
        </div>
      </header>
      <main className="relative">
        <div className="container mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="leading-gradient-heading my-4 inline-block bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent dark:-mt-4 dark:from-rose-400 dark:to-pink-400 lg:text-4xl">
            Advanced anchor positioning.
          </h2>
          <p className="prose text-left text-xl dark:prose-invert lg:text-2xl lg:leading-relaxed">
            Anchor a floating element next to another element
            while making sure it stays in view by{' '}
            <strong>avoiding collisions</strong>. This lets you
            position tooltips, popovers, or dropdowns optimally.
          </p>
        </div>
        <div className="container mx-auto grid max-w-screen-xl gap-4 py-8 md:px-4 lg:grid-cols-2">
          <Placement />
          <Shift />
          <Flip />
          <Size />
          <Arrow />
          <Virtual />
        </div>

        <div className="container mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="leading-gradient-heading mt-16 mb-4 inline-block bg-gradient-to-r from-cyan-500 to-pink-400 bg-clip-text text-3xl font-bold text-transparent dark:from-cyan-400 dark:to-pink-400 lg:text-4xl">
            Interactions for React.
          </h2>
          <p className="prose text-left text-xl dark:prose-invert lg:text-2xl lg:leading-relaxed">
            Build your own floating UI components with React.
            From simple tooltips to select menus, you have full
            control while ensuring{' '}
            <strong>fully accessible</strong> UI experiences.
          </p>
        </div>

        <div className="container mx-auto mb-12 grid max-w-screen-xl gap-4 py-8 dark:text-black sm:grid-cols-2 md:px-4 lg:grid-cols-3">
          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:rounded-lg">
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

          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:rounded-lg">
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

          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:rounded-lg">
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

          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:rounded-lg">
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

          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:rounded-lg">
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

          <div className="flex h-[18rem] flex-col justify-between bg-white p-10 text-center shadow dark:bg-gray-700 dark:text-gray-100 sm:rounded-lg">
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

        <div className="container mx-auto mb-16 max-w-screen-xl px-4 text-center md:px-8">
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
          <h2 className="leading-gradient-heading mt-16 mb-4 inline-block bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-500 dark:to-teal-400 lg:text-4xl">
            Modern, tree-shakeable modules.
          </h2>
          <p className="prose mb-8 text-left text-xl dark:prose-invert lg:text-2xl lg:leading-relaxed">
            This positioning toolkit has a platform-agnostic 0.6
            kB core (minified + Brotli compressed), with official
            bindings for the web, React DOM, React Native, and
            Vue.
          </p>
          <p className="prose mb-8 text-left text-xl dark:prose-invert lg:text-2xl">
            Each module is{' '}
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
          <div className="grid items-center py-8 pb-16">
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

        <div className="container mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mt-8 mb-4 inline-block text-3xl font-bold dark:text-gray-50 lg:text-4xl">
            Support Floating UI!
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
          <Cards items={SPONSORS} />
          <Logos items={MINI_SPONSORS} />
        </div>

        <div className="container relative mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="leading-gradient-heading mb-4 mt-16 inline-block text-3xl font-bold dark:text-gray-50 lg:text-4xl">
            Ready to install?
          </h2>
          <p className="prose mb-8 text-left text-xl dark:prose-invert lg:text-2xl lg:leading-relaxed">
            Start playing via your package manager or CDN.
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border py-8 px-12 dark:border-gray-200 dark:text-gray-100">
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
            <div className="rounded-lg border py-8 px-12 dark:border-gray-200 dark:text-gray-100">
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

      <footer className="mt-16 bg-gray-50 py-8 text-center dark:bg-gray-1000 dark:text-gray-500">
        <div className="container mx-auto flex max-w-screen-xl flex-col gap-3 px-4">
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
              className="font-bold text-rose-600 dark:text-rose-300"
              href="https://www.figma.com/@killnicole"
            >
              Vic
            </a>{' '}
            and{' '}
            <a
              className="font-bold text-rose-600 dark:text-rose-300"
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
              className="font-bold text-rose-600 dark:text-rose-300"
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
