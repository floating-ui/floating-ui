import {MDXProvider} from '@mdx-js/react';
import Code from './Code';
import Warning from './Warning';
import Collapsible from './Collapsible';
import Navigation from './Navigation';
import Logo from '../assets/logo.svg';
import Link from 'next/link';
import {useRouter} from 'next/router';
import Head from 'next/head';
import cn from 'classnames';
import {useState, Children} from 'react';
import Tippy from '@tippyjs/react/headless';
import {Menu} from 'react-feather';
import {Chrome} from './Chrome';
import {Floating} from './Floating';
import {SkipNavLink, SkipNavContent} from '@reach/skip-nav';
import '@reach/skip-nav/styles.css';

const nav = [
  {url: '/docs/getting-started', title: 'Getting Started'},
  {url: '/docs/tutorial', title: 'Tutorial'},
  {url: '/docs/computePosition', title: 'computePosition'},
  {url: '/docs/middleware', title: 'Middleware'},
  {url: '/docs/offset', title: 'offset'},
  {url: '/docs/shift', title: 'shift'},
  {url: '/docs/flip', title: 'flip'},
  {url: '/docs/arrow', title: 'arrow'},
  {url: '/docs/size', title: 'size'},
  {url: '/docs/autoPlacement', title: 'autoPlacement'},
  {url: '/docs/hide', title: 'hide'},
  {url: '/docs/detectOverflow', title: 'detectOverflow'},
  {url: '/docs/virtual-elements', title: 'Virtual Elements'},
  {url: '/docs/misc', title: 'Misc'},
  {url: '/docs/platform', title: 'Platform'},
  {url: '/docs/react-dom', title: 'React DOM'},
  {url: '/docs/react-native', title: 'React Native'},
  {url: '/docs/motivation', title: 'Motivation'},
];

const slugify = (str) =>
  str.toLowerCase().replace(/[\s.]/g, '-').replace(/[.:]/g, '');

const linkify =
  (Tag) =>
  ({children, ...props}) => {
    const url = slugify(
      typeof children !== 'string'
        ? children.props.children
        : children
    );
    return (
      <Tag {...props} id={url}>
        <a href={`#${url}`} className="inline-block">
          {children}
        </a>
      </Tag>
    );
  };

const components = {
  pre: (props) => <div {...props} />,
  code: (props) => <Code {...props} />,
  // inlineCode: InlineCode,
  Warning,
  Collapsible,
  Tippy,
  Floating,
  Chrome,
  h2: linkify('h2'),
  h3: linkify('h3'),
  h4: linkify('h4'),
  h5: linkify('h5'),
  h6: linkify('h6'),
  span(props) {
    if (props['data-mdx-pretty-code'] != null) {
      return (
        <code style={{color: props['data-color']}}>
          {props.children.props.children}
        </code>
      );
    }

    return <span {...props} />;
  },
  a(props) {
    if (props.href.startsWith('/')) {
      return (
        <Link {...props}>
          <a {...props} />
        </Link>
      );
    }

    return (
      <a {...props} target="_blank" rel="noreferrer noopener" />
    );
  },
};

export default function Layout({children}) {
  const {pathname} = useRouter();
  const index = nav.findIndex(({url}) => url === pathname) ?? 0;
  const [navOpen, setNavOpen] = useState(false);

  const anchors = Children.toArray(children)
    .filter(
      (child) =>
        child.props?.mdxType &&
        ['h2', 'h3'].includes(child.props.mdxType)
    )
    .map((child) => {
      const url = slugify(
        typeof child.props.children === 'string'
          ? child.props.children
          : child.props.children.props.children
      );
      return {
        url: `#${url}`,
        title: child.props.children,
        depth:
          (child.props?.mdxType &&
            parseInt(child.props.mdxType.replace('h', ''), 0)) ??
          0,
      };
    });

  return (
    <MDXProvider components={components}>
      <Head>
        <title>
          {nav.find(({url}) => url === pathname)?.title ??
            'Docs'}{' '}
          | Floating UI
        </title>
      </Head>
      <SkipNavLink />
      <div className="md:pl-56 lg:pl-72">
        <div className="container pl-4">
          <button
            aria-label="Open menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(!navOpen)}
            className="block -mb-8 mt-4 bg-gray-50 text-gray-900 rounded p-3 md:hidden"
          >
            <Menu />
          </button>
        </div>
        <nav
          className={cn(
            'fixed bg-gray-1000 h-full w-72 md:w-56 lg:w-72 top-0 left-0 overflow-y-auto md:block bg-opacity-90 backdrop-filter backdrop-blur-lg z-50',
            {
              hidden: !navOpen,
            }
          )}
        >
          <div className="container mx-auto mb-8">
            <Link href="/">
              <a href="/">
                <Logo className="h-28 mx-auto mt-4" />
              </a>
            </Link>
            {navOpen && (
              <button
                onClick={() => setNavOpen(false)}
                className="ml-6 my-4 bg-gray-50 text-gray-900 rounded p-2"
              >
                Close
              </button>
            )}
            <ul className="text-lg px-6 lg:px-8">
              {nav.map(({url, title}) => (
                <li key={url}>
                  <Link href={url}>
                    <a
                      href={url}
                      className={cn('block w-full py-1', {
                        'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 font-bold':
                          pathname === url,
                        'hover:text-gray-50': pathname !== url,
                      })}
                    >
                      {title}
                    </a>
                  </Link>
                  <ul>
                    {pathname === url &&
                      anchors
                        .filter(({depth}) => depth === 2)
                        .map(({url, title, depth}) => (
                          <li
                            key={url}
                            className={cn(`text-gray-400`, {
                              'pl-4': depth === 2,
                              'pl-8': depth === 3,
                            })}
                          >
                            <a
                              href={url}
                              className="block w-full truncate"
                            >
                              {title}
                            </a>
                          </li>
                        ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div
          className="container px-4 sm:px-8 my-16 mx-auto"
          style={{maxWidth: '75ch'}}
        >
          <SkipNavContent />
          <article className="prose prose-lg">
            {children}
          </article>
          <Navigation
            back={nav[index - 1]}
            next={nav[index + 1]}
          />
        </div>
      </div>
    </MDXProvider>
  );
}
