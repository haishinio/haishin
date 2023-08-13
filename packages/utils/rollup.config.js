import cleaner from 'rollup-plugin-cleaner'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import sucrase from '@rollup/plugin-sucrase'
import typescript from '@rollup/plugin-typescript'

const sharedOutputSettings = {
  exports: 'named',
  interop: 'auto'
}

export default {
  input: {
    index: 'src/index.ts'
  },
  output: [
    {
      ...sharedOutputSettings,
      dir: 'dist',
      format: 'cjs',
      chunkFileNames: '[name]-[hash].js',
      entryFileNames: '[name].js'
    },
    {
      ...sharedOutputSettings,
      dir: 'dist',
      format: 'es',
      chunkFileNames: '[name]-[hash].mjs',
      entryFileNames: '[name].mjs'
    }
  ],
  plugins: [
    cleaner({
      targets: ['./dist/']
    }),
    typescript({ outDir: 'dist/types' }),
    copy({
      targets: [{ src: 'types/responses.d.ts', dest: 'dist/types' }]
    }),
    commonjs({
      dynamicRequireRoot: '../../',
      ignoreDynamicRequires: true
    }),
    resolve({
      extensions: ['.js', '.ts']
    }),
    json(),
    sucrase({
      exclude: ['../../node_modules/**/**/*', 'node_modules/**/**/*'],
      transforms: ['typescript']
    })
  ]
}
