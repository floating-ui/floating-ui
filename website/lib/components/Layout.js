import {DocSearch} from '@docsearch/react';
import {
  autoUpdate,
  FloatingFocusManager as FloatingFocusManagerComponent,
  FloatingPortal as FloatingPortalComponent,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';
import {MDXProvider} from '@mdx-js/react';
import cn from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Fragment, useEffect, useRef, useState} from 'react';
import {ExternalLink, GitHub, Menu} from 'react-feather';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

import Logo from '../../assets/logo.svg';
import Arrow from '../../public/icons/arrow.svg';
import AutoPlacement from '../../public/icons/autoPlacement.svg';
import AutoUpdate from '../../public/icons/autoUpdate.svg';
import Composite from '../../public/icons/Composite.svg';
import ComputePosition from '../../public/icons/computePosition.svg';
import DetectOverflow from '../../public/icons/detectOverflow.svg';
import Flip from '../../public/icons/flip.svg';
import FloatingDelayGroup from '../../public/icons/FloatingDelayGroup.svg';
import FloatingFocusManager from '../../public/icons/FloatingFocusManager.svg';
import FloatingList from '../../public/icons/FloatingList.svg';
import FloatingOverlay from '../../public/icons/FloatingOverlay.svg';
import FloatingPortal from '../../public/icons/FloatingPortal.svg';
import FloatingTree from '../../public/icons/FloatingTree.svg';
import GettingStarted from '../../public/icons/getting-started.svg';
import Hide from '../../public/icons/hide.svg';
import Inline from '../../public/icons/inline.svg';
import Inner from '../../public/icons/inner.svg';
import MagicWand from '../../public/icons/magic-wand.svg';
import Middleware from '../../public/icons/middleware.svg';
import Offset from '../../public/icons/offset.svg';
import Platform from '../../public/icons/platform.svg';
import React from '../../public/icons/react.png';
import Shift from '../../public/icons/shift.svg';
import Size from '../../public/icons/size.svg';
import Tutorial from '../../public/icons/tutorial.svg';
import UseClick from '../../public/icons/useClick.svg';
import UseClientPoint from '../../public/icons/useClientPoint.svg';
import UseDismiss from '../../public/icons/useDismiss.svg';
import UseFloating from '../../public/icons/useFloating.svg';
import UseFocus from '../../public/icons/useFocus.svg';
import UseHover from '../../public/icons/useHover.svg';
import UseInteractions from '../../public/icons/useInteractions.svg';
import UseListNavigation from '../../public/icons/useListNavigation.svg';
import UseRole from '../../public/icons/useRole.svg';
import UseTransition from '../../public/icons/useTransition.svg';
import UseTypeahead from '../../public/icons/useTypeahead.svg';
import VirtualElements from '../../public/icons/virtual-elements.svg';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/Tooltip';
import {Chrome} from './Chrome';
import {CircleImage} from './CircleImage';
import Collapsible from './Collapsible';
import {Floating} from './Floating';
import Navigation from './Navigation';
import Notice from './Notice';
import {SkipNavContent, SkipNavLink} from './ReachSkipNav';
import {Required} from './Required';
import {WordHighlight} from './WordHighlight';

function PackageVersion({package: {name, version}}) {
  return (
    <Tooltip noRest label strategy="fixed">
      <TooltipTrigger asChild>
        <a
          href={`https://npmjs.com/package/@floating-ui/${name}`}
          className="w-fit rounded-md bg-blue-500 px-2 py-1 text-xs font-bold text-white transition-colors hover:bg-blue-400 dark:border dark:border-blue-600 dark:bg-transparent dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}@{version}
        </a>
      </TooltipTrigger>
      <TooltipContent>
        The docs on this page reference the latest version of
        <br />
        <strong>
          @floating-ui/
          {name}
        </strong>
        . Click to view it on npm.
      </TooltipContent>
    </Tooltip>
  );
}

const middleware = [
  {
    url: '/docs/offset',
    title: 'offset',
    icon: Offset,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/shift',
    title: 'shift',
    icon: Shift,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/flip',
    title: 'flip',
    icon: Flip,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/arrow',
    title: 'arrow',
    icon: Arrow,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/size',
    title: 'size',
    icon: Size,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/autoPlacement',
    title: 'autoPlacement',
    icon: AutoPlacement,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/hide',
    title: 'hide',
    icon: Hide,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/inline',
    title: 'inline',
    icon: Inline,
    depth: 1,
    mono: true,
  },
];

const interactions = [
  {
    url: '/docs/useHover',
    title: 'useHover',
    icon: UseHover,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/useFocus',
    title: 'useFocus',
    icon: UseFocus,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/useClick',
    title: 'useClick',
    icon: UseClick,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/useRole',
    title: 'useRole',
    icon: UseRole,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/useDismiss',
    title: 'useDismiss',
    icon: UseDismiss,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/useListNavigation',
    title: 'useListNavigation',
    icon: UseListNavigation,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/useTypeahead',
    title: 'useTypeahead',
    icon: UseTypeahead,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/useTransition',
    title: 'useTransition',
    icon: UseTransition,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/useClientPoint',
    title: 'useClientPoint',
    icon: UseClientPoint,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/FloatingArrow',
    title: 'FloatingArrow',
    icon: Arrow,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/FloatingFocusManager',
    title: 'FloatingFocusManager',
    icon: FloatingFocusManager,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/FloatingPortal',
    title: 'FloatingPortal',
    icon: FloatingPortal,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/FloatingTree',
    title: 'FloatingTree',
    icon: FloatingTree,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/FloatingOverlay',
    title: 'FloatingOverlay',
    icon: FloatingOverlay,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/FloatingList',
    title: 'FloatingList',
    icon: FloatingList,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/FloatingDelayGroup',
    title: 'FloatingDelayGroup',
    icon: FloatingDelayGroup,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/Composite',
    title: 'Composite',
    icon: Composite,
    depth: 1,
  },
  {
    url: '/docs/inner',
    title: 'Inner',
    icon: Inner,
    depth: 1,
  },
  {
    url: '/docs/react-utils',
    title: 'React Utils',
    icon: MagicWand,
    depth: 1,
  },
];

const nav = [
  {
    url: '/docs/getting-started',
    title: 'Getting Started',
    icon: GettingStarted,
    depth: 0,
  },
  {
    url: '/docs/tutorial',
    title: 'Tutorial',
    icon: Tutorial,
    depth: 0,
  },
  {
    url: '/docs/computePosition',
    title: 'computePosition',
    icon: ComputePosition,
    depth: 0,
    mono: true,
  },
  {
    url: '/docs/autoUpdate',
    title: 'autoUpdate',
    icon: AutoUpdate,
    mono: true,
  },
  {
    url: '/docs/middleware',
    title: 'Middleware',
    icon: Middleware,
    depth: 0,
  },
  ...middleware,
  {
    url: '/docs/detectOverflow',
    title: 'detectOverflow',
    icon: DetectOverflow,
    mono: true,
  },
  {
    url: '/docs/virtual-elements',
    title: 'Virtual Elements',
    icon: VirtualElements,
  },
  {
    url: '/docs/misc',
    title: 'Misc',
    icon: MagicWand,
  },
  {
    url: '/docs/platform',
    title: 'Platform',
    icon: Platform,
  },
  {
    url: '/docs/react',
    title: 'React',
    icon: React.src,
  },
  {
    url: '/docs/react-examples',
    title: 'React Examples',
    depth: 1,
  },
  {
    url: '/docs/tooltip',
    title: 'Tooltip',
    depth: 1,
    hide: true,
  },
  {
    url: '/docs/popover',
    title: 'Popover',
    depth: 1,
    hide: true,
  },
  {
    url: '/docs/dialog',
    title: 'Dialog',
    depth: 1,
    hide: true,
  },
  {
    url: '/docs/useFloating',
    title: 'useFloating',
    depth: 1,
    icon: UseFloating,
  },
  {
    url: '/docs/useInteractions',
    title: 'useInteractions',
    depth: 1,
    icon: UseInteractions,
  },
  ...interactions,
  {
    url: '/docs/custom-hooks',
    title: 'Custom Hooks',
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/react-native',
    title: 'React Native',
  },
  {
    url: '/docs/vue',
    title: 'Vue',
  },
  {
    url: '/docs/migration',
    title: 'Migration',
  },
];

function Heading({level, children, ...props}) {
  const Tag = `h${level}`;
  return (
    <Tag {...props}>
      <a href={`#${props.id}`}>{children}</a>
    </Tag>
  );
}

const components = {
  Collapsible,
  Floating,
  Chrome,
  Notice,
  WordHighlight,
  CircleImage,
  Required,
  h2: (props) => <Heading level={2} {...props} />,
  h3: (props) => <Heading level={3} {...props} />,
  h4: (props) => <Heading level={4} {...props} />,
  h5: (props) => <Heading level={5} {...props} />,
  h6: (props) => <Heading level={6} {...props} />,
  a(props) {
    const className =
      'transition-colors inline-flex items-center border-none underline ' +
      'underline-offset-4 text-rose-600 dark:text-rose-300 hover:text-gray-1000 dark:hover:text-gray-50 ' +
      'decoration-rose-500/80 dark:decoration-rose-300/70 ' +
      'hover:decoration-gray-1000 dark:hover:decoration-gray-50 decoration-1 group';

    if (props.href.startsWith('/')) {
      return (
        <Link {...props} className={className}>
          <span>{props.children}</span>
        </Link>
      );
    }

    return (
      <a
        {...props}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
      >
        <span>{props.children}</span>
        <ExternalLink
          className="ml-1 h-5 w-5 text-gray-800 dark:text-gray-400"
          aria-label="Opens in new tab"
        />
      </a>
    );
  },
};

function SideNavList({anchors, hash}) {
  const isTopLevelAnchor = anchors
    .filter(({depth}) => depth === 2)
    .find(({url}) => hash === url);
  const isSecondLevelAnchor = anchors
    .filter(({depth}) => depth === 3)
    .find(({url}) => hash === url);
  const renderCircle = isTopLevelAnchor || isSecondLevelAnchor;

  const {floatingStyles, refs, context} = useFloating({
    open: renderCircle,
    placement: 'left',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    transform: false,
    middleware: [
      offset({
        mainAxis: isTopLevelAnchor ? -2 : 13,
        crossAxis: 1,
      }),
    ],
  });

  const {isMounted, styles} = useTransitionStyles(context, {
    initial: {
      transform: 'scale(0) translateX(50px)',
    },
  });

  return (
    <ul className="overflow-hidden px-2 pt-1 pb-8">
      {isMounted && (
        <FloatingPortalComponent>
          <div
            className="h-2 w-2 rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow"
            ref={refs.setFloating}
            style={{...floatingStyles, ...styles}}
          />
        </FloatingPortalComponent>
      )}
      {anchors
        .filter(({depth}) => depth === 2)
        .map(({url, title}) => (
          <li key={url}>
            <Link
              ref={hash === url ? refs.setReference : null}
              href={url}
              className={cn(
                'block w-full truncate rounded-lg py-1 px-4',
                {
                  'font-bold hover:bg-gray-100 dark:hover:bg-purple-300/10':
                    hash === url,
                  'hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-purple-300/10 dark:hover:text-gray-50':
                    hash !== url,
                }
              )}
            >
              {title}
            </Link>
            <ul>
              {anchors
                .filter(
                  ({depth, parentTitle}) =>
                    depth === 3 && parentTitle === title
                )
                .map(({url, title}) => (
                  <li key={url}>
                    <Link
                      ref={
                        hash === url ? refs.setReference : null
                      }
                      href={url}
                      className={cn(
                        'text-md ml-4 block truncate rounded-tr-md rounded-br-md border-l border-gray-700 py-1 px-4',
                        {
                          'font-bold hover:bg-gray-100 dark:hover:bg-purple-300/10':
                            hash === url,
                          'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-purple-300/10 dark:hover:text-gray-50':
                            hash !== url,
                        }
                      )}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
            </ul>
          </li>
        ))}
    </ul>
  );
}

const initialPackages = [
  {name: 'core', version: 'latest'},
  {name: 'dom', version: 'latest'},
  {name: 'react', version: 'latest'},
  {name: 'react-dom', version: 'latest'},
  {name: 'react-native', version: 'latest'},
  {name: 'vue', version: 'latest'},
];

export default function Layout({children, className}) {
  const {pathname, events, asPath} = useRouter();
  const index = nav.findIndex(({url}) => url === pathname) ?? 0;
  const [navOpen, setNavOpen] = useState(false);
  const activeLinkRef = useRef();
  const [hash, setHash] = useState(
    asPath.slice(asPath.indexOf('#'))
  );
  const [packages, setPackages] = useState(initialPackages);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        const packageResults = await Promise.all(
          initialPackages.map(({name}) =>
            fetch(
              `https://registry.npmjs.org/@floating-ui/${name}/latest`
            ).then((res) => res.json())
          )
        );

        if (!ignore) {
          setPackages(
            packageResults.map((pkg, index) => ({
              name: initialPackages[index].name,
              version: pkg.version,
            }))
          );
        }
      } catch (e) {
        //
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  const displayNavigation = nav[index] != null;

  useIsomorphicLayoutEffect(() => {
    setHash(asPath.slice(asPath.indexOf('#')));
  }, [asPath]);

  useIsomorphicLayoutEffect(() => {
    function onRouteChangeComplete() {
      document.querySelector('#focus-root').focus();
    }

    function onHashChange() {
      setHash(window.location.hash);
    }

    events.on('routeChangeComplete', onRouteChangeComplete);
    window.addEventListener('hashchange', onHashChange);

    return () => {
      events.off('routeChangeComplete', onRouteChangeComplete);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [events, pathname]);

  const articleRef = useRef();
  const [anchors, setAnchors] = useState([]);

  useIsomorphicLayoutEffect(() => {
    const localAnchors = [];
    articleRef.current
      .querySelectorAll('h2,h3')
      .forEach((node) => {
        localAnchors.push({
          depth: node.tagName === 'H2' ? 2 : 3,
          title: node.textContent,
          url: `#${node.id}`,
        });
      });

    setAnchors(localAnchors);
    setNavOpen(false);
  }, [pathname]);

  let currentParentIndex = null;
  const anchorsComputed = anchors.map((node, index) => {
    if (node.depth === 3) {
      if (currentParentIndex === null) {
        currentParentIndex = index - 1;
      }

      return {
        ...node,
        parentTitle: anchors[currentParentIndex]?.title,
      };
    } else if (node.depth === 2) {
      currentParentIndex = null;
      return node;
    }
  });

  const title = `${
    nav.find(({url}) => url === pathname)?.title ?? 'Docs'
  } | Floating UI`;

  const activeTitle =
    nav.find(({url}) => url === pathname)?.title ?? '';

  const isReactDOMPage =
    activeTitle === 'React' || activeTitle === 'useFloating';
  const isDOMOnlyPage = activeTitle === 'autoUpdate';
  const isNoPage = activeTitle === 'Getting Started';
  const isReactPage =
    activeTitle.includes('React') ||
    activeTitle.startsWith('use') ||
    activeTitle.startsWith('Floating') ||
    [
      'Inner',
      'Custom Hooks',
      'Composite',
      'Tooltip',
      'Popover',
      'Dialog',
    ].includes(activeTitle);
  const isReactNativePage = activeTitle.includes('React Native');
  const isVuePage = activeTitle.includes('Vue');
  const isVanillaPage =
    !isReactPage &&
    !isReactNativePage &&
    !isVuePage &&
    !isDOMOnlyPage &&
    !isNoPage;

  let firstVersionIndex = null;
  let secondVersionIndex = null;

  if (isDOMOnlyPage) {
    firstVersionIndex = 1;
    secondVersionIndex = null;
  } else if (isReactDOMPage) {
    firstVersionIndex = 3;
    secondVersionIndex = 2;
  } else if (isReactNativePage) {
    firstVersionIndex = 4;
  } else if (isReactPage) {
    firstVersionIndex = 2;
  } else if (isVanillaPage) {
    firstVersionIndex = 0;
    secondVersionIndex = 1;
  } else if (isVuePage) {
    firstVersionIndex = 5;
  }

  const {refs, context} = useFloating({
    open: navOpen,
    onOpenChange: setNavOpen,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const {getReferenceProps, getFloatingProps} = useInteractions([
    click,
    dismiss,
  ]);

  const {isMounted, styles} = useTransitionStyles(context, {
    duration: {open: 400, close: 100},
    initial: {
      transform: 'translateX(-100%)',
    },
    common: {
      transitionTimingFunction: navOpen
        ? 'cubic-bezier(0.22, 1, 0.36, 1)'
        : 'ease-in',
    },
  });

  const isDrawer =
    navOpen && window.matchMedia('(max-width: 768px)').matches;
  const NavWrapper = isDrawer
    ? FloatingFocusManagerComponent
    : Fragment;
  const wrapperProps = isDrawer
    ? {context, modal: false, initialFocus: refs.floating}
    : {};

  return (
    <MDXProvider components={components}>
      <Head>
        <title>{title}</title>
      </Head>
      <SkipNavLink />
      <svg width="0" height="0">
        <defs>
          <clipPath
            id="squircle"
            clipPathUnits="objectBoundingBox"
          >
            <path d="M .5,0 C .1,0 0,.1 0,.5 0,.9 .1,1 .5,1 .9,1 1,.9 1,.5 1,.1 .9,0 .5,0 Z" />
          </clipPath>
        </defs>
      </svg>
      <div
        className={`md:pl-64 lg:px-72 lg:pr-0 xl:px-[22rem] xl:pr-[15rem] 2xl:pr-72 ${className}`}
      >
        <NavWrapper {...wrapperProps}>
          <nav
            ref={refs.setFloating}
            className={cn(
              'fixed top-0 left-0 z-50 h-full w-[min(90%,20rem)] overflow-y-auto overflow-x-hidden bg-gray-50 font-variable shadow-lg outline-none will-change-transform motion-reduce:!transition-none dark:border-r dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:shadow-none md:block md:w-64 md:!transform-none md:shadow lg:w-72 xl:w-[22rem]',
              {hidden: !isMounted}
            )}
            style={styles}
            {...getFloatingProps()}
          >
            <div className="sticky top-0 -z-1 -mb-[25rem] h-[25rem] w-full bg-light-nav-gradient dark:bg-dark-nav-gradient" />
            <div className="container mx-auto mb-8">
              <div
                className="sticky top-0 z-10 p-2 backdrop-blur-sm dark:bg-transparent"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(0deg, transparent 0%, rgb(0 0 0) 1rem)',
                }}
              >
                <Link href="/">
                  <Logo className="mx-auto mt-2 mb-1 h-28 origin-top" />
                </Link>
                {navOpen && (
                  <button
                    onClick={() => setNavOpen(false)}
                    className="absolute top-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-3xl text-gray-900 shadow md:hidden"
                    aria-label="Close"
                  >
                    <span className="relative top-[-1px]">
                      ×
                    </span>
                  </button>
                )}
              </div>
              <ul className="mt-4 px-6 text-lg xl:px-10">
                {nav.map(
                  ({url, title, icon: Icon, depth, hide}) =>
                    !hide && (
                      <li
                        key={url}
                        ref={
                          pathname === url
                            ? activeLinkRef
                            : undefined
                        }
                        className={cn('inline-block w-full', {
                          'pl-4': depth === 1,
                          'border-l border-solid border-gray-700':
                            depth === 1,
                        })}
                      >
                        <Link
                          href={url}
                          className={cn(
                            'mx-[-1rem] block break-words rounded-lg px-3 py-1 transition duration-200 hover:duration-75 dark:hover:bg-purple-200/20 dark:hover:text-gray-50',
                            {
                              'bg-gray-800 text-gray-50 hover:bg-gray-700 dark:bg-purple-200/10 dark:text-gray-100/90':
                                pathname === url,
                              'hover:bg-gray-100/50':
                                pathname !== url,
                              'rounded-tl-none rounded-bl-none':
                                depth > 0,
                            }
                          )}
                        >
                          <span className="flex w-full items-center gap-4 py-1">
                            {typeof Icon === 'string' ? (
                              <img
                                src={Icon}
                                className="h-8 w-8"
                                aria-hidden
                              />
                            ) : typeof Icon === 'function' ? (
                              <Icon
                                aria-hidden
                                width={32}
                                height={32}
                              />
                            ) : null}
                            <span
                              className={cn('block truncate', {
                                'font-bold text-white':
                                  pathname === url,
                              })}
                            >
                              {title}
                            </span>
                          </span>
                        </Link>
                      </li>
                    )
                )}
              </ul>
            </div>
          </nav>
        </NavWrapper>
        <aside className="fixed right-0 top-0 hidden min-w-[15rem] max-w-[15rem] overflow-y-auto pt-12 [max-height:100vh] xl:block 2xl:min-w-[18rem] 2xl:max-w-[20rem]">
          <nav>
            <h4 className="text-md ml-6 mb-1 text-gray-500">
              On this page
            </h4>
            <SideNavList anchors={anchorsComputed} hash={hash} />
          </nav>
        </aside>
        <nav className="fixed top-0 z-10 w-full bg-gray-75/70 px-4 py-3 backdrop-blur-sm backdrop-saturate-150 dark:bg-gray-900/70 sm:px-6 md:py-4 lg:px-8 lg:py-2">
          <div className="flex items-center justify-between">
            <button
              ref={refs.setReference}
              aria-label="Open menu"
              aria-expanded={navOpen}
              className="block rounded bg-gray-50 p-3 text-gray-900 shadow md:mt-0 md:hidden"
              {...getReferenceProps()}
            >
              <Menu />
            </button>
            <div className="ml-4 flex min-w-0 items-center justify-end gap-4 md:ml-0 md:mr-0 md:flex-row md:justify-start md:pl-0">
              <DocSearch
                appId="0E85PIAI2P"
                indexName="floating-ui"
                apiKey="51e39a76760916075e22d9b217f4434f"
              />
              <a
                className="flex items-center gap-1"
                href="https://github.com/floating-ui/floating-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="grid h-6 w-6 place-items-center rounded-full text-black dark:text-gray-200">
                  <GitHub size={16} />
                </div>
                GitHub
              </a>
              {firstVersionIndex != null && (
                <>
                  <div className="hidden flex-wrap gap-2 pl-1 lg:flex">
                    {firstVersionIndex !== null && (
                      <PackageVersion
                        package={packages[firstVersionIndex]}
                      />
                    )}
                    {secondVersionIndex !== null && (
                      <PackageVersion
                        package={packages[secondVersionIndex]}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
        <div
          ref={articleRef}
          className="container my-24 mx-auto mt-24 px-4 [outline:0] [max-width:50rem] sm:px-6 md:my-0 md:py-20 lg:px-8 lg:py-24"
        >
          <SkipNavContent />
          <article
            className="
              prose-floating prose max-w-full prose-code:bg-gray-50 
              prose-code:shadow prose-pre:bg-gray-50 prose-pre:shadow
              dark:prose-invert dark:prose-code:bg-gray-700
              dark:prose-code:text-[#c8d3f5] dark:prose-pre:bg-gray-800 md:prose-md lg:prose-lg
            "
          >
            {children}
          </article>
          {displayNavigation && (
            <Navigation
              prev={nav[index - 1]}
              next={nav[index + 1]}
            />
          )}
        </div>
      </div>
      <footer className="py-8 px-4 text-center text-gray-500 md:pl-64 lg:px-72 lg:pr-0 xl:px-[22rem] xl:pr-72">
        <p>© {new Date().getFullYear()} • MIT License</p>
        <p className="mt-4 text-sm">
          Icons made by{' '}
          <a
            className="text-blue-600 dark:text-blue-400"
            href="https://www.zwicon.com/cheatsheet.html"
          >
            zwoelf
          </a>{' '}
          and{' '}
          <a
            className="text-blue-600 dark:text-blue-400"
            href="https://www.flaticon.com"
          >
            Freepik
          </a>
        </p>
      </footer>
    </MDXProvider>
  );
}
