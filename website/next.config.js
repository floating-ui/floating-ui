const {createRemarkPlugin} = require('@atomiks/mdx-pretty-code');
const fs = require('fs');
const visit = require('unist-util-visit');
const corePkg = require('../packages/core/package.json');
const domPkg = require('../packages/dom/package.json');

const replaceVariables = () => (tree) => {
  visit(tree, 'code', (node) => {
    node.value = node.value
      .replace('__CORE_VERSION__', corePkg.version)
      .replace('__DOM_VERSION__', domPkg.version);
  });
};

const prettyCode = createRemarkPlugin({
  shikiOptions: {
    theme: JSON.parse(
      fs.readFileSync(
        require.resolve('./assets/floating-ui-theme.json'),
        'utf-8'
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
    Object.assign(node.style, {
      minHeight: '1rem',
      margin: '0 -1.5rem',
      padding: '0 1.5rem',
    });
  },
  onVisitHighlightedLine(node) {
    node.className = 'line bg-gray-800';
  },
  onVisitHighlightedWord(node) {
    Object.assign(node.style, {
      backgroundColor: 'rgba(200,200,255,0.15)',
      padding: '0.25rem',
      borderRadius: '0.25rem',
    });
  },
});

module.exports = {
  swcMinify: false,
  experimental: {esmExternals: true},
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
            remarkPlugins: [replaceVariables, prettyCode],
          },
        },
      ],
    });

    return config;
  },
};
