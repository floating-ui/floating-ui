import {defineTsdownConfig} from '../../config/index.mts';

export default defineTsdownConfig({
  external: ['@floating-ui/dom', 'react', 'react-dom'],
});
