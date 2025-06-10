import {defineTsdownConfig} from '../../config/index.mts';

export default defineTsdownConfig({
  external: [
    '@floating-ui/react-dom',
    '@floating-ui/core/utils',
    '@floating-ui/dom/utils',
    'tabbable',
    'react',
    'react-dom',
  ],
});
