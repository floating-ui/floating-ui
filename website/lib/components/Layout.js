import {DocSearch} from '@docsearch/react';
import {MDXProvider} from '@mdx-js/react';
import cn from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Fragment, memo, useMemo, useRef, useState} from 'react';
import {ExternalLink, Menu} from 'react-feather';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

import Logo from '../../assets/logo.svg';
import Arrow from '../../public/icons/arrow.svg';
import AutoPlacement from '../../public/icons/autoPlacement.svg';
import AutoUpdate from '../../public/icons/autoUpdate.svg';
import ComputePosition from '../../public/icons/computePosition.svg';
import DetectOverflow from '../../public/icons/detectOverflow.svg';
import Flip from '../../public/icons/flip.svg';
import FloatingDelayGroup from '../../public/icons/FloatingDelayGroup.svg';
import FloatingFocusManager from '../../public/icons/FloatingFocusManager.svg';
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
import UseFocus from '../../public/icons/useFocus.svg';
import UseHover from '../../public/icons/useHover.svg';
import UseId from '../../public/icons/useId.svg';
import UseListNavigation from '../../public/icons/useListNavigation.svg';
import UseMergeRefs from '../../public/icons/useMergeRefs.svg';
import UseRole from '../../public/icons/useRole.svg';
import UseTransition from '../../public/icons/useTransition.svg';
import UseTypeahead from '../../public/icons/useTypeahead.svg';
import VirtualElements from '../../public/icons/virtual-elements.svg';
import {Chrome} from './Chrome';
import Collapsible from './Collapsible';
import {Floating} from './Floating';
import Navigation from './Navigation';
import Notice from './Notice';
import {SkipNavContent, SkipNavLink} from './ReachSkipNav';
import {WordHighlight} from './WordHighlight';

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
    url: '/docs/useMergeRefs',
    title: 'useMergeRefs',
    icon: UseMergeRefs,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/useId',
    title: 'useId',
    icon: UseId,
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
    url: '/docs/FloatingDelayGroup',
    title: 'FloatingDelayGroup',
    icon: FloatingDelayGroup,
    depth: 1,
    mono: true,
  },
  {
    url: '/docs/inner',
    title: 'Inner',
    icon: Inner,
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
    url: '/docs/motivation',
    title: 'Motivation',
  },
];

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[\s.]/g, '-')
    .replace(/[.:'"<>!@#$%^&*()[\]]/g, '');

const getStringChildren = (children) => {
  if (Array.isArray(children)) {
    return children
      .map((value) =>
        typeof value === 'string'
          ? value
          : value.props?.children ?? ''
      )
      .join('');
  } else if (typeof children !== 'string') {
    return children.props?.children;
  }

  return children;
};

const linkify = (Tag, headings, pathname) =>
  memo(({children, ...props}) => {
    let stringChildren = getStringChildren(children);

    const url = slugify(
      typeof stringChildren === 'string' ? stringChildren : ''
    );

    if (
      headings.some((heading) => heading.pathname !== pathname)
    ) {
      // Reset the headings store.
      headings.length = 0;
    }

    let id = url;

    const dupeCount = headings.filter(
      ({url: u}) => u === url
    ).length;
    id = dupeCount === 0 ? url : `${url}-${dupeCount}`;

    headings.push({url, pathname});

    return (
      <Tag {...props} id={id}>
        <a href={`#${id}`}>{children}</a>
      </Tag>
    );
  });

const components = {
  Collapsible,
  Floating,
  Chrome,
  Notice,
  WordHighlight,
  h1(props) {
    // Split a camel/PascalCased string into parts. A word break oppportunity
    // element gets inserted after each part.
    const parts = props.children?.split(/(?=[A-Z])/g) ?? '';

    return (
      <h1 {...props}>
        {parts.every((part) => part.length > 1)
          ? parts.map((part) => (
              <Fragment key={part}>
                {part}
                <wbr />
              </Fragment>
            ))
          : props.children}
      </h1>
    );
  },
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

export default function Layout({children}) {
  const {pathname, events, asPath} = useRouter();
  const index = nav.findIndex(({url}) => url === pathname) ?? 0;
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef();
  const activeLinkRef = useRef();
  const [hash, setHash] = useState(
    asPath.slice(asPath.indexOf('#'))
  );

  const displayNavigation = nav[index] != null;

  useIsomorphicLayoutEffect(() => {
    setHash(asPath.slice(asPath.indexOf('#')));
  }, [asPath]);

  useIsomorphicLayoutEffect(() => {
    function onRouteChangeComplete() {
      document.querySelector('#focus-root').focus();
    }

    events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      events.off('routeChangeComplete', onRouteChangeComplete);
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

  const computedComponents = useMemo(() => {
    const headings = [];
    return {
      ...components,
      h2: linkify('h2', headings, pathname),
      h3: linkify('h3', headings, pathname),
      h4: linkify('h4', headings, pathname),
      h5: linkify('h5', headings, pathname),
      h6: linkify('h6', headings, pathname),
    };
  }, [pathname]);

  return (
    <MDXProvider components={computedComponents}>
      <Head>
        <title>{title}</title>
      </Head>
      <SkipNavLink />
      <div className="md:pl-64 lg:px-72 lg:pr-0 xl:px-[22rem] xl:pr-72">
        <div className="container pl-4">
          <button
            aria-label="Open menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(!navOpen)}
            className="fixed top-1 z-10 -mb-8 mt-4 block rounded bg-gray-50 p-3 text-gray-900 shadow md:mt-0 md:hidden"
          >
            <Menu />
          </button>
        </div>
        <nav
          className={cn(
            'fixed top-0 left-0 z-50 h-full w-72 overflow-y-auto overflow-x-hidden bg-gray-50 shadow will-change-transform dark:border-r dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:shadow-none md:block md:w-64 lg:w-72 xl:w-[22rem]',
            {
              hidden: !navOpen,
            }
          )}
          ref={navRef}
        >
          <div className="sticky top-0 -z-1 -mb-[25rem] h-[25rem] w-full bg-light-nav-gradient dark:bg-dark-nav-gradient" />
          <div className="container mx-auto mb-8">
            <div className="sticky top-0 z-10 bg-white/30 pt-2 backdrop-blur-sm dark:bg-transparent">
              <Link href="/">
                <Logo className="mx-auto mt-2 mb-1 h-28 origin-top" />
              </Link>
              <div className="relative mr-4 flex flex-col items-stretch py-4 !pb-0 xl:m-0 xl:px-4 xl:pr-8">
                <DocSearch
                  appId="0E85PIAI2P"
                  indexName="floating-ui"
                  apiKey="51e39a76760916075e22d9b217f4434f"
                />
              </div>
              {navOpen && (
                <button
                  onClick={() => setNavOpen(false)}
                  className="absolute top-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-3xl text-gray-900 shadow"
                  aria-label="Close"
                >
                  <span className="relative top-[-1px]">×</span>
                </button>
              )}
            </div>
            <ul className="mt-4 px-6 text-lg xl:px-12">
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
                            'hover:bg-gray-100':
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
        <aside className="fixed right-0 top-0 hidden w-72 pt-8 [max-height:100vh] xl:block">
          <nav>
            <h4 className="text-md ml-6 text-gray-500">
              On this page
            </h4>
            <ul className="overflow-hidden p-4 pl-2">
              {anchorsComputed
                .filter(({depth}) => depth === 2)
                .map(({url, title}) => (
                  <li key={url}>
                    <Link
                      href={url}
                      className={cn(
                        'block w-full truncate rounded-lg py-1 px-4 text-lg',
                        {
                          'bg-gray-800 font-bold text-gray-50 dark:bg-purple-300/10':
                            hash === url,
                          'hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-purple-300/10 dark:hover:text-gray-50':
                            hash !== url,
                        }
                      )}
                    >
                      {title}
                    </Link>
                    <ul>
                      {anchorsComputed
                        .filter(
                          ({depth, parentTitle}) =>
                            depth === 3 && parentTitle === title
                        )
                        .map(({url, title}) => (
                          <li key={url}>
                            <Link
                              href={url}
                              className={cn(
                                'text-md w-[calc(100% - 1rem)] ml-4 block truncate rounded-tr-md rounded-br-md border-l border-gray-700 py-1 px-4',
                                {
                                  'bg-gray-800 font-bold text-gray-50 dark:bg-purple-300/10 dark:text-gray-100':
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
          </nav>
        </aside>
        <div
          ref={articleRef}
          className="container my-16 mx-auto mt-24 px-4 [outline:0] [max-width:50rem] md:my-0 md:py-8 lg:px-8 lg:py-16"
        >
          <SkipNavContent />
          <article
            className="
              prose-floating prose prose-code:bg-gray-50 prose-code:shadow 
              prose-pre:bg-gray-50 prose-pre:shadow dark:prose-invert
              dark:prose-code:bg-gray-700/70 dark:prose-pre:bg-gray-800 md:prose-md
              lg:prose-lg 
            "
          >
            {children}
          </article>
          {displayNavigation && (
            <Navigation
              back={nav[index - 1]}
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
