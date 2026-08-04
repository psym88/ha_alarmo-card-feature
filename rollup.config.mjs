import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const plugins = [
  nodeResolve(),
  typescript({ noEmit: false }),
  terser({
    ecma: 2022,
    compress: { passes: 3 },
    format: { comments: false },
    module: true,
  }),
];

export default [
  {
    input: 'src/alarmo-card-feature.ts',
    output: {
      file: 'dist/alarmo-card-feature.js',
      format: 'es',
      sourcemap: false,
      inlineDynamicImports: true,
    },
    plugins: [...plugins],
  },
];
