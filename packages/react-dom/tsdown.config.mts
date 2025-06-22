import {defineTsdownConfig} from '../../config/index.mts';

export default defineTsdownConfig({
  external: [
    '@floating-ui/dom',
    '@floating-ui/dom/utils',
    '@floating-ui/core/utils',
    'react',
    'react-dom',
  ],
});
