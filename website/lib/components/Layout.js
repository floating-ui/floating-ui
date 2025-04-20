import {DocSearch} from '@docsearch/react';
import {
  autoUpdate,
  FloatingFocusManager,
  FloatingPortal,
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
import {useRouter} from 'next/router';
import {Fragment, useEffect, useRef, useState} from 'react';
import {
  ChevronDown,
  ExternalLink,
  GitHub,
  Menu,
} from 'react-feather';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

import Logo from '../../assets/logo.svg';
import {useAppContext} from '../../pages/_app';
import ArrowIcon from '../../public/icons/arrow.svg';
import AutoPlacementIcon from '../../public/icons/autoPlacement.svg';
import AutoUpdateIcon from '../../public/icons/autoUpdate.svg';
import CompositeIcon from '../../public/icons/Composite.svg';
import ComputePositionIcon from '../../public/icons/computePosition.svg';
import DetectOverflowIcon from '../../public/icons/detectOverflow.svg';
import FlipIcon from '../../public/icons/flip.svg';
import FloatingDelayGroupIcon from '../../public/icons/FloatingDelayGroup.svg';
import FloatingFocusManagerIcon from '../../public/icons/FloatingFocusManager.svg';
import FloatingListIcon from '../../public/icons/FloatingList.svg';
import FloatingOverlayIcon from '../../public/icons/FloatingOverlay.svg';
import FloatingPortalIcon from '../../public/icons/FloatingPortal.svg';
import FloatingTreeIcon from '../../public/icons/FloatingTree.svg';
import GettingStartedIcon from '../../public/icons/getting-started.svg';
import HideIcon from '../../public/icons/hide.svg';
import InlineIcon from '../../public/icons/inline.svg';
import MagicWandIcon from '../../public/icons/magic-wand.svg';
import MiddlewareIcon from '../../public/icons/middleware.svg';
import OffsetIcon from '../../public/icons/offset.svg';
import PlatformIcon from '../../public/icons/platform.svg';
import ReactIcon from '../../public/icons/react.png'; // This is a PNG, not an SVG
import ShiftIcon from '../../public/icons/shift.svg';
import SizeIcon from '../../public/icons/size.svg';
import TutorialIcon from '../../public/icons/tutorial.svg';
import UseClickIcon from '../../public/icons/useClick.svg';
import UseClientPointIcon from '../../public/icons/useClientPoint.svg';
import UseDismissIcon from '../../public/icons/useDismiss.svg';
import UseFloatingIcon from '../../public/icons/useFloating.svg';
import UseFocusIcon from '../../public/icons/useFocus.svg';
import UseHoverIcon from '../../public/icons/useHover.svg';
import UseInteractionsIcon from '../../public/icons/useInteractions.svg';
import UseListNavigationIcon from '../../public/icons/useListNavigation.svg';
import UseRoleIcon from '../../public/icons/useRole.svg';
import UseTransitionIcon from '../../public/icons/useTransition.svg';
import UseTypeaheadIcon from '../../public/icons/useTypeahead.svg';
import VirtualElementsIcon from '../../public/icons/virtual-elements.svg';
import {getPackageContext} from '../utils/getPackageContext';
import {remToPx} from '../utils/remToPx';
import {Chrome} from './Chrome';
import {CircleImage} from './CircleImage';
import Collapsible from './Collapsible';
import {Floating} from './Floating';
import {Link} from './Link';
import {
  MiddlewareBadge,
  MiddlewareContainer,
} from './MiddlewareBadge';
import Navigation from './Navigation';
import Notice from './Notice';
import {PackageLimited} from './PackageLimited';
import {PackageSelect} from './PackageSelect';
import {PageCard} from './PageCard';
import {SkipNavContent, SkipNavLink} from './ReachSkipNav';
import {Required} from './Required';
import {ShowFor} from './ShowFor';
import {WordHighlight} from './WordHighlight';

const middleware = [
  {
    url: '/docs/offset',
    title: 'offset',
    icon: OffsetIcon,
  },
  {
    url: '/docs/shift',
    title: 'shift',
    icon: ShiftIcon,
  },
  {
    url: '/docs/flip',
    title: 'flip',
    icon: FlipIcon,
  },
  {
    url: '/docs/arrow',
    title: 'arrow',
    icon: ArrowIcon,
  },
  {
    url: '/docs/size',
    title: 'size',
    icon: SizeIcon,
  },
  {
    url: '/docs/autoPlacement',
    title: 'autoPlacement',
    icon: AutoPlacementIcon,
  },
  {
    url: '/docs/hide',
    title: 'hide',
    icon: HideIcon,
  },
  {
    url: '/docs/inline',
    title: 'inline',
    icon: InlineIcon,
  },
].map((item) => {
  item.parent = 'Middleware';
  return item;
});

const interactions = [
  {
    url: '/docs/react-examples',
    title: 'React Examples',
  },
  {
    url: '/docs/tooltip',
    title: 'Tooltip',
    hide: true,
  },
  {
    url: '/docs/popover',
    title: 'Popover',
    hide: true,
  },
  {
    url: '/docs/dialog',
    title: 'Dialog',
    hide: true,
  },
  {
    url: '/docs/useFloating',
    title: 'useFloating',
    icon: UseFloatingIcon,
  },
  {
    url: '/docs/useInteractions',
    title: 'useInteractions',
    icon: UseInteractionsIcon,
  },
  {
    url: '/docs/useHover',
    title: 'useHover',
    icon: UseHoverIcon,
  },
  {
    url: '/docs/useFocus',
    title: 'useFocus',
    icon: UseFocusIcon,
  },
  {
    url: '/docs/useClick',
    title: 'useClick',
    icon: UseClickIcon,
  },
  {
    url: '/docs/useRole',
    title: 'useRole',
    icon: UseRoleIcon,
  },
  {
    url: '/docs/useDismiss',
    title: 'useDismiss',
    icon: UseDismissIcon,
  },
  {
    url: '/docs/useListNavigation',
    title: 'useListNavigation',
    icon: UseListNavigationIcon,
  },
  {
    url: '/docs/useTypeahead',
    title: 'useTypeahead',
    icon: UseTypeaheadIcon,
  },
  {
    url: '/docs/useTransition',
    title: 'useTransition',
    icon: UseTransitionIcon,
  },
  {
    url: '/docs/useClientPoint',
    title: 'useClientPoint',
    icon: UseClientPointIcon,
  },
  {
    url: '/docs/FloatingArrow',
    title: 'FloatingArrow',
    icon: ArrowIcon,
  },
  {
    url: '/docs/FloatingFocusManager',
    title: 'FloatingFocusManager',
    icon: FloatingFocusManagerIcon,
  },
  {
    url: '/docs/FloatingPortal',
    title: 'FloatingPortal',
    icon: FloatingPortalIcon,
  },
  {
    url: '/docs/FloatingTree',
    title: 'FloatingTree',
    icon: FloatingTreeIcon,
  },
  {
    url: '/docs/FloatingOverlay',
    title: 'FloatingOverlay',
    icon: FloatingOverlayIcon,
  },
  {
    url: '/docs/FloatingList',
    title: 'FloatingList',
    icon: FloatingListIcon,
  },
  {
    url: '/docs/FloatingDelayGroup',
    title: 'FloatingDelayGroup',
    icon: FloatingDelayGroupIcon,
  },
  {
    url: '/docs/Composite',
    title: 'Composite',
    icon: CompositeIcon,
  },
  {
    url: '/docs/react-utils',
    title: 'React Utils',
    icon: MagicWandIcon,
  },
  {
    url: '/docs/custom-hooks',
    title: 'Custom Hooks',
  },
].map((item) => {
  item.parent = 'React';
  return item;
});

const nav = [
  {
    url: '/docs/getting-started',
    title: 'Getting Started',
    icon: GettingStartedIcon,
  },
  {
    url: '/docs/tutorial',
    title: 'Tutorial',
    icon: TutorialIcon,
  },
  {
    url: '/docs/computePosition',
    title: 'computePosition',
    icon: ComputePositionIcon,
  },
  {
    url: '/docs/autoUpdate',
    title: 'autoUpdate',
    icon: AutoUpdateIcon,
  },
  {
    url: '/docs/middleware',
    title: 'Middleware',
    icon: MiddlewareIcon,
    collapse: false,
  },
  ...middleware,
  {
    url: '/docs/detectOverflow',
    title: 'detectOverflow',
    icon: DetectOverflowIcon,
  },
  {
    url: '/docs/virtual-elements',
    title: 'Virtual Elements',
    icon: VirtualElementsIcon,
  },
  {
    url: '/docs/misc',
    title: 'Misc',
    icon: MagicWandIcon,
  },
  {
    url: '/docs/platform',
    title: 'Platform',
    icon: PlatformIcon,
  },
  {
    url: '/docs/react',
    title: 'React',
    icon: ReactIcon.src,
    collapse: true,
  },
  ...interactions,
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
  PageCard,
  MiddlewareBadge,
  MiddlewareContainer,
  PackageLimited,
  ShowFor,
  h1: (props) => (
    <h1 {...props}>
      {props.children.split(/(?=[A-Z])/).map((value, index) => (
        <Fragment key={index}>
          {index !== 0 && <wbr />}
          {value}
        </Fragment>
      ))}
    </h1>
  ),
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

function TableOfContents({anchors, hash}) {
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
        <FloatingPortal>
          <div
            className="h-2 w-2 rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow"
            ref={refs.setFloating}
            style={{...floatingStyles, ...styles}}
          />
        </FloatingPortal>
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
                },
              )}
            >
              {title}
            </Link>
            <ul>
              {anchors
                .filter(
                  ({depth, parentTitle}) =>
                    depth === 3 && parentTitle === title,
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
                        },
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

function NavbarItem({
  url,
  title,
  icon: Icon,
  hide,
  activeLinkRef,
  parent,
  collapse,
}) {
  const {pathname} = useRouter();
  const {packageContext} = useAppContext();

  const children = nav.filter(({parent: p}) => p === title);

  const isReactContext = ['react', 'react-dom'].includes(
    packageContext,
  );
  const isReact = title === 'React';
  const shouldCollapse = collapse === true && !isReactContext;

  const [childrenCollapsed, setChildrenCollapsed] =
    useState(shouldCollapse);

  useIsomorphicLayoutEffect(() => {
    if (isReactContext || !shouldCollapse) {
      setChildrenCollapsed(false);
      return;
    }

    const activeChildItem = nav.find(
      ({url: u}) => u === pathname,
    );

    setChildrenCollapsed(
      pathname !== url && activeChildItem?.parent !== title,
    );
  }, [
    shouldCollapse,
    pathname,
    url,
    title,
    parent,
    packageContext,
  ]);

  if (hide) return null;

  return (
    <li
      key={url}
      className="inline-block w-full scroll-mt-[10rem]"
    >
      <Link
        href={url}
        ref={pathname === url ? activeLinkRef : undefined}
        aria-current={pathname === url ? 'page' : undefined}
        aria-expanded={
          shouldCollapse ? !childrenCollapsed : undefined
        }
        className={cn(
          'mx-[-1rem] flex h-12 items-center break-words rounded-lg px-3 dark:hover:text-gray-50',
          {
            'bg-rose-200/40 text-rose-700 hover:bg-pink-100/50 dark:bg-pink-400/10 dark:text-pink-400 dark:hover:bg-pink-400/20':
              pathname === url && !isReact,
            'hover:bg-gray-100/50 dark:hover:bg-purple-300/10':
              pathname !== url,
            'border border-gray-600/10 bg-light-react-gradient bg-clip-padding shadow-lg shadow-cyan-600/10 hover:shadow-blue-900/10 hover:brightness-[0.87] hover:contrast-125 dark:bg-dark-react-gradient dark:shadow-none':
              isReact,
            'text-black dark:text-pink-300 dark:hover:text-pink-300':
              pathname === url && isReact,
            'mr-0 rounded-tl-none rounded-bl-none':
              parent != null,
          },
        )}
      >
        <span className="flex w-full items-center gap-4 py-1">
          {typeof Icon === 'string' ? (
            <img src={Icon} className="h-8 w-8" aria-hidden />
          ) : typeof Icon === 'function' ? (
            <Icon
              aria-hidden
              className={cn({
                'text-gray-600 dark:text-gray-200':
                  pathname !== url,
                'text-rose-700 dark:text-pink-300':
                  pathname === url,
              })}
              width={32}
              height={32}
            />
          ) : null}
          <span
            className={cn('block truncate', {
              'font-bold dark:text-pink-300': pathname === url,
            })}
          >
            {title}
          </span>
        </span>
        <span>
          {children.length > 0 && shouldCollapse && (
            <ChevronDown size={20} />
          )}
        </span>
      </Link>
      <Navbar
        parent={title}
        collapsed={childrenCollapsed}
        activeLinkRef={activeLinkRef}
      />
    </li>
  );
}

function Navbar({activeLinkRef, parent, collapsed}) {
  const ref = useRef(null);
  const items = nav.filter(({parent: p}) => p === parent);
  const [height, setHeight] = useState('auto');
  const naturalHeightRef = useRef(null);
  const [transition, setTransition] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    naturalHeightRef.current = ref.current.scrollHeight;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || !parent) return;
    setHeight(collapsed ? 0 : naturalHeightRef.current);
  }, [collapsed, parent]);

  useIsomorphicLayoutEffect(() => {
    setTimeout(() => setTransition(true));
  }, []);

  if (!items.length) return;

  return (
    <ul
      ref={ref}
      className={cn('flex flex-col overflow-hidden text-lg', {
        'transition-height duration-300': transition,
        'mt-4 px-6 xl:px-10': parent == null,
        'border-l border-solid border-gray-700 pl-4 pr-0':
          parent != null,
      })}
      style={{
        height,
      }}
      inert={collapsed ? '' : undefined}
    >
      {items.map((item) => (
        <NavbarItem
          key={item.url}
          activeLinkRef={activeLinkRef}
          parent={parent}
          {...item}
        />
      ))}
    </ul>
  );
}

export default function Layout({children, className}) {
  const {pathname, events, asPath} = useRouter();
  const index = nav.findIndex(({url}) => url === pathname) ?? 0;
  const [navOpen, setNavOpen] = useState(false);
  const [anchors, setAnchors] = useState([]);
  const activeLinkRef = useRef(null);
  const articleRef = useRef();
  const [hash, setHash] = useState(
    asPath.slice(asPath.indexOf('#')),
  );
  const [year, setYear] = useState(null);

  const {
    setPackageContext,
    pageTransitionStatus,
    articleTransitionStatus,
    isPackageTooltipTouched,
  } = useAppContext();

  const displayNavigation = nav[index] != null;

  useIsomorphicLayoutEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useIsomorphicLayoutEffect(() => {
    setHash(asPath.slice(asPath.indexOf('#')));
  }, [asPath]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isPackageTooltipTouched) {
        setPackageContext(
          getPackageContext(asPath.toLowerCase()),
        );
      }
    });
    return () => clearTimeout(timeout);
  }, [asPath, setPackageContext, isPackageTooltipTouched]);

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
  const NavWrapper = isDrawer ? FloatingFocusManager : Fragment;
  const wrapperProps = isDrawer
    ? {context, modal: false, initialFocus: refs.floating}
    : {};

  useIsomorphicLayoutEffect(() => {
    if (isDrawer && !isMounted) return;
    if (!refs.floating.current) return;
    if (!activeLinkRef.current) return;

    const scrollTop = refs.floating.current.scrollTop;
    const linkRect =
      activeLinkRef.current.getBoundingClientRect();
    const linkTop = linkRect.top;
    const linkBottom = linkTop + linkRect.height;
    const height = refs.floating.current.clientHeight;

    // Only scroll if it's not in view
    if (
      linkBottom <= 0 ||
      linkTop >= scrollTop + height - remToPx(10)
    ) {
      requestAnimationFrame(() => {
        activeLinkRef.current.scrollIntoView({block: 'center'});
      });
    }
  }, [asPath, isDrawer, isMounted]);

  useIsomorphicLayoutEffect(() => {
    function onHashChange() {
      setHash(window.location.hash);
    }

    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [events, pathname]);

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
        data-fade={pageTransitionStatus}
      >
        <NavWrapper {...wrapperProps}>
          <nav
            ref={refs.setFloating}
            className={cn(
              'fixed top-0 left-0 z-50 h-full w-[min(90%,20rem)] overflow-y-auto overflow-x-hidden bg-gray-50 font-variable shadow-lg outline-none will-change-transform motion-reduce:!transition-none dark:border-r dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:shadow-none md:block md:w-64 md:!transform-none md:shadow lg:w-72 xl:w-[22rem]',
              {hidden: !isMounted},
            )}
            style={styles}
            {...getFloatingProps()}
          >
            <div className="sticky top-0 -z-1 -mb-[25rem] h-[25rem] w-full bg-light-nav-gradient dark:bg-dark-nav-gradient" />
            <div className="container mx-auto mb-8">
              <div
                className="sticky top-[7.5rem] z-10 -mb-[2rem] h-[2rem] w-full backdrop-blur-[2px]"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(0deg, transparent 0%, rgb(0 0 0) 0.4rem)',
                }}
              />
              <div
                className="sticky top-[8.5rem] z-10 -mb-[1rem] h-[1rem] w-full backdrop-blur-[1.5px]"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(0deg, transparent 0%, rgb(0 0 0) 0.3rem)',
                }}
              />
              <div
                className="sticky top-[9rem] z-10 -mb-[0.75rem] h-[0.75rem] w-full backdrop-blur-[1px]"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(0deg, transparent 0%, rgb(0 0 0) 0.2rem)',
                }}
              />
              <div
                className="absolute top-[9.375rem] z-10 -mb-[0.5rem] h-[0.5rem] w-full backdrop-blur-[0.5px]"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(0deg, transparent 0%, rgb(0 0 0) 0.3rem)',
                }}
              />
              <div
                className="sticky top-0 z-10 p-2 backdrop-blur-[3px] dark:bg-transparent"
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
              <Navbar activeLinkRef={activeLinkRef} />
            </div>
          </nav>
        </NavWrapper>
        <nav className="fixed top-0 z-20 w-full bg-gray-75/90 px-4 py-3 backdrop-blur-lg backdrop-saturate-150 dark:bg-gray-900/90 sm:px-6 md:py-4 lg:px-8 lg:py-2">
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
                className="hidden items-center gap-1 md:flex"
                href="https://github.com/floating-ui/floating-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="grid h-6 w-6 place-items-center rounded-full text-black dark:text-gray-200">
                  <GitHub size={16} />
                </div>
                GitHub
              </a>
              <PackageSelect />
            </div>
          </div>
        </nav>
        <div data-fade={articleTransitionStatus}>
          <div id="floating-container" />
          <aside className="fixed right-0 top-0 hidden min-w-[15rem] max-w-[15rem] overflow-y-auto pt-12 [max-height:100vh] xl:block 2xl:min-w-[18rem] 2xl:max-w-[20rem]">
            <nav>
              <h4 className="text-md ml-6 mb-1 text-gray-500">
                On this page
              </h4>
              <TableOfContents
                anchors={anchorsComputed}
                hash={hash}
              />
            </nav>
          </aside>
          <div
            ref={articleRef}
            className="container my-24 mx-auto mt-24 px-4 [outline:0] [max-width:50rem] sm:px-6 md:my-0 md:py-20 lg:px-8 lg:py-24"
          >
            <SkipNavContent />
            <article
              className="
              prose max-w-full prose-a:font-bold 
              prose-code:bg-gray-50 prose-code:shadow prose-pre:bg-gray-50
              prose-pre:shadow dark:prose-invert
              dark:prose-code:bg-gray-700 dark:prose-code:text-[#c8d3f5] dark:prose-pre:bg-gray-800 md:prose-md
              lg:prose-lg
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
      </div>
      <footer className="py-8 px-4 text-center text-gray-500 md:pl-64 lg:px-72 lg:pr-0 xl:px-[22rem] xl:pr-72">
        <p>© {year && `${year} •`} MIT License</p>
        <p className="mt-4 text-sm">
          Icons made by{' '}
          <a
            className="text-blue-600 dark:text-blue-400 underline"
            href="https://www.zwicon.com/cheatsheet.html"
          >
            zwoelf
          </a>{' '}
          and{' '}
          <a
            className="text-blue-600 dark:text-blue-400 underline"
            href="https://www.flaticon.com"
          >
            Freepik
          </a>
        </p>
      </footer>
    </MDXProvider>
  );
}
