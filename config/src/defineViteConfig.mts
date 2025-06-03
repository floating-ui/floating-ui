import path from 'path';
import {type ViteUserConfig, defineConfig} from 'vitest/config';

// root path of the monorepo
const basePath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../../../',
);

export const defineViteConfig = (config: ViteUserConfig): ViteUserConfig =>
  defineConfig({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        '@floating-ui/react': path.resolve(basePath, 'packages/react/src'),
        '@floating-ui/utils': path.resolve(basePath, 'packages/utils/src'),
        '@floating-ui/devtools': path.resolve(
          basePath,
          'packages/devtools/src',
        ),
        '@floating-ui/core': path.resolve(basePath, 'packages/core/src'),
        '@floating-ui/dom': path.resolve(basePath, 'packages/dom/src'),
        '@floating-ui/react-dom': path.resolve(
          basePath,
          'packages/react-dom/src',
        ),
        '@floating-ui/vue': path.resolve(basePath, 'packages/vue/src'),
      },
    },
    test: {
      globals: true,
      typecheck: {
        tsconfig: './tsconfig.test.json',
      },
      ...config.test,
    },
  });
