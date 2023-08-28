import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/app.ts'],
  target: 'node16',
  format: ['esm'],
  clean: true,
  bundle: true,
  dts: true,
  splitting: false
})
