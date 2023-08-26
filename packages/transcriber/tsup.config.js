import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'glob'
import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: Object.fromEntries(
      globSync('src/**/*.ts').map((file) => [
        // This remove `src/` as well as the file extension from each
        // file, so e.g. src/nested/foo.js becomes nested/foo
        path.relative(
          'src',
          file.slice(0, file.length - path.extname(file).length)
        ),
        // This expands the relative paths to absolute paths, so e.g.
        // src/nested/foo becomes /project/src/nested/foo.js
        fileURLToPath(new URL(file, import.meta.url))
      ])
    ),
    format: ['esm'],
    target: 'node16',
    dts: true,
    splitting: true,
    clean: true,
    cjsInterop: true,
    shims: true,
    sourcemap: process.argv.includes('--dev'),
    watch: options.watch
  }
})
