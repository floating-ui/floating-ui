import {readFileSync} from 'fs';
import NpmApi from 'npm-api';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkSmartypants from 'remark-smartypants';
import visit from 'unist-util-visit';

const replaceVariables = () => async (tree) => {
  let pkgs = [];
  try {
    const npm = new NpmApi();
    pkgs = await Promise.all([
      npm.repo('@floating-ui/core').package(),
      npm.repo('@floating-ui/dom').package(),
    ]);
  } catch (e) {
    pkgs = [{version: 'latest'}, {version: 'latest'}];
  }

  visit(tree, 'code', (node) => {
    node.value = node.value
      .replaceAll('__CORE_VERSION__', pkgs[0].version)
      .replaceAll('__DOM_VERSION__', pkgs[1].version);
  });
};

const rehypePrettyCodeOptions = {
  theme: {
    dark: JSON.parse(
      readFileSync(
        new URL(
          './assets/floating-ui-theme.json',
          import.meta.url
        )
      )
    ),
    light: JSON.parse(
      readFileSync(
        new URL(
          './assets/floating-ui-light-theme.json',
          import.meta.url
        )
      )
    ),
  },
  tokensMap: {
    objectKey: 'meta.object-literal.key',
    function: 'entity.name.function',
    param: 'variable.parameter',
    const: 'variable.other.constant',
    class: 'support.class',
  },
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{type: 'text', value: ' '}];
    }
    node.properties.className = ['line'];
  },
  onVisitHighlightedLine(node) {
    node.properties.className = ['line', 'line--highlighted'];
  },
  onVisitHighlightedWord(node, id) {
    node.properties.className = ['word'];

    if (id) {
      // If the word spans across syntax boundaries (e.g. punctuation), remove
      // colors from the child nodes.
      if (node.properties['data-rehype-pretty-code-wrapper']) {
        node.children.forEach((childNode) => {
          childNode.properties.style = '';
        });
      }

      node.properties.style = '';
      node.properties['data-word-id'] = id;
    }
  },
};

export default {
  swcMinify: false,
  experimental: {esmExternals: true, scrollRestoration: true},
  pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.(js|ts)x?$/],
      },

      use: ['@svgr/webpack'],
    });

    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        // The default `babel-loader` used by Next:
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          /** @type {import('@mdx-js/loader').Options} */
          options: {
            providerImportSource: '@mdx-js/react',
            remarkPlugins: [replaceVariables, remarkSmartypants],
            rehypePlugins: [
              [rehypePrettyCode, rehypePrettyCodeOptions],
            ],
          },
        },
      ],
    });

    return config;
  },
};
