import swc from 'unplugin-swc';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defaultExclude, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: ['**/*.e2e.spec.ts', ...defaultExclude],
  },
  plugins: [
    tsConfigPaths(),
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
});
