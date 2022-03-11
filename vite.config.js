import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const roots = {
  interactions: './packages/react-dom-interactions/test/visual',
  dom: './packages/dom/test/visual',
};

// https://vitejs.dev/config/
export default defineConfig({
  root: roots[process.env.VITE_ENV],
  plugins: [react()],
  server: {
    port: 1234,
  },
  resolve: {
    alias: {
      '@floating-ui/core': '@floating-ui/core/src/index.ts',
      '@floating-ui/dom': '@floating-ui/dom/src/index.ts',
      '@floating-ui/react-dom': '@floating-ui/react-dom/src/index.ts',
      '@floating-ui/react-dom-interactions':
        '@floating-ui/react-dom-interactions/src/index.ts',
    },
  },
  define: {
    __DEV__: 'true',
  },
});
