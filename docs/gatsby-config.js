const { UNPKG_CDN_URL, VERSION_RANGE } = require('./variables');

module.exports = {
  siteMetadata: {
    title: `Popper`,
    description: `Positioning tooltips and popovers is difficult. Popper is here to help! Popper is the de facto standard to position tooltips and popovers in modern web applications.`,
    author: `@FezVrasta`,
    image: '/images/popper-og-image.jpg',
    siteUrl: 'https://popper.js.org',
  },
  plugins: [
    `gatsby-plugin-root-import`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-75790772-1',
        respectDNT: true,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          default: require.resolve('./src/components/Layout.js'),
          landing: require.resolve('./src/components/Landing.js'),
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-find-replace`,
            options: {
              replacements: {
                __VERSION_RANGE__: VERSION_RANGE,
                __UNPKG_CDN_URL__: UNPKG_CDN_URL,
              },
              prefix: false,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: `gatsby-link-icon`,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1035,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
            },
          },
        ],
        plugins: [
          `gatsby-remark-images`,
          `gatsby-remark-prismjs`,
          `@pauliescanlon/gatsby-mdx-routes`,
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Luckiest+Guy`],
        display: 'block',
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Popper`,
        short_name: `Popper`,
        start_url: `/`,
        background_color: `#FFFFFF`,
        theme_color: `#C83B50`,
        display: `minimal-ui`,
        icon: `src/images/popper-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-redirect-from',
      options: {
        query: 'allMdx',
      },
    },
    'gatsby-plugin-meta-redirect',
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
