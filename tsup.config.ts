import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return [
    {
      entry: {
        index: 'src/index.ts',
        config: 'src/config/index.ts',
      },
      outDir: 'lib',
      sourcemap: false,
      clean: true,
      minify: !options.watch,
      dts: true,
      format: ['cjs'],
      target: 'es6',
      treeshake: false,
    },
  ];
});
