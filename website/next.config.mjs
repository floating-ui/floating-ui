import {readFileSync} from 'fs';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkSmartypants from 'remark-smartypants';
import visit from 'unist-util-visit';

const replaceVariables = () => async (tree) => {
  let packageVersions = ['^1.0.0', '^1.0.0'];

  try {
    packageVersions = await Promise.all(
      ['core', 'dom'].map((name) =>
        fetch(
          `https://registry.npmjs.org/@floating-ui/${name}/latest`
        )
          .then((res) => res.json())
          .then((res) => res.version)
      )
    );
  } catch (e) {
    //
  }

  visit(tree, 'code', (node) => {
    node.value = node.value
      .replaceAll('__CORE_VERSION__', packageVersions[0])
      .replaceAll('__DOM_VERSION__', packageVersions[1]);
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
