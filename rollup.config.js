
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  {
    input: './sticky-events.js',
    output: {
      name: 'stickyEvents',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      resolve(),
      commonjs(),
      terser(),
    ]
  },
  {
    input: './sticky-events.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
];
