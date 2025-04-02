import path from 'node:path';
import react from '@vitejs/plugin-react';
import cssNested from 'postcss-nested';
import {defineViteConfig} from 'config';

// FIXME: seems like vite type definitions are conflicting between vite v4 and v5
// for the moment the workaround is pnpm.override in root package.json to force vite v5
// @storybook/react-vite seems to be using vite v4 but it works fine with vite v5
export default defineViteConfig({
  plugins: [react()],
  build: {
    // minification is discouraged for extensions as the code will be reviewed before publishing
    minify: false,
  },
  define: {
    // This is only used in storybook
    __DEV__: true,
  },
  css: {
    postcss: {
      plugins: [cssNested()],
    },
  },
  resolve: {
    alias: {
      extension: path.resolve(__dirname, './src'),
      '@floating-ui/devtools/package.json': path.resolve(
        '../packages/devtools/package.json',
      ),
    },
  },
});
