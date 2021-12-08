const {createRemarkPlugin} = require('@atomiks/mdx-pretty-code');
const fs = require('fs');

const prettyCode = createRemarkPlugin({
  shikiOptions: {
    theme: JSON.parse(
      fs.readFileSync(
        require.resolve('./assets/moonlight-ii.json'),
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
      display: 'block',
      minHeight: '1rem',
      margin: '0 -1.5rem',
      padding: '0 1.5rem',
    });
  },
  onVisitHighlightedLine(node) {
    node.className = 'bg-gray-700';
  },
  onVisitHighlightedWord(node) {
    Object.assign(node.style, {
      backgroundColor: 'rgba(0,0,0,0.25)',
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
            remarkPlugins: [prettyCode],
          },
        },
      ],
    });

    return config;
  },
};
