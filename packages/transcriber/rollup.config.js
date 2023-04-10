import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    commonjs(),
    resolve({
      extensions: ['.js', '.ts']
    }),
    json(),
    sucrase({
      exclude: [
        '../../node_modules/**/**/*',
        'node_modules/**/**/*'
      ],
      transforms: ['typescript']
    })
  ]
};