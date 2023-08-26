import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    // format: ['esm', 'cjs'],
    format: ['esm'],
    target: 'node16',
    dts: true,
    splitting: true,
    clean: true,
    sourcemap: process.argv.includes('--dev'),
    watch: options.watch
  }
})
