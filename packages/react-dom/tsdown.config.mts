import {defineTsdownConfig} from '../../config/index.mts';

export default defineTsdownConfig({
  external: [
    '@floating-ui/dom',
    '@floating-ui/dom/utils',
    'react',
    'react-dom',
  ],
});
