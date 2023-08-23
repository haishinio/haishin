# @haishin/backend

## 2.2.2

### Patch Changes

- Updated dependencies [[`a55927e`](https://github.com/tomouchuu/haishin/commit/a55927e77752d19fa1b157105585086fe9c4b25d)]:
  - @haishin/transcriber@2.2.1

## 2.2.1

### Patch Changes

- [`e50937d`](https://github.com/tomouchuu/haishin/commit/e50937d986e676c8217ec9967de67ec27c9bef98) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Should fix fetch issues by referring to local docker urls

## 2.2.0

### Minor Changes

- [`92f2e7a`](https://github.com/tomouchuu/haishin/commit/92f2e7a1ea5e8c55f8f89320325538f2aeca831c) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Switch to hls for livestreams

### Patch Changes

- [`3cb3a92`](https://github.com/tomouchuu/haishin/commit/3cb3a92e6f3507716ba0b0bef4dffb1456e5adfc) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds new api/stream/[id] route to handle stream specific information

- [`e6118af`](https://github.com/tomouchuu/haishin/commit/e6118afe669cd7e3c5b614d31c99c1be2afabbca) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Update ffmpeg path to have a sensible backup if not defined

- [`247ae11`](https://github.com/tomouchuu/haishin/commit/247ae117dcaf11b6eae7b700c2d6d0031cb7d3c4) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Check for both the file and the size of the file before beginning transcriptions

- Updated dependencies [[`92f2e7a`](https://github.com/tomouchuu/haishin/commit/92f2e7a1ea5e8c55f8f89320325538f2aeca831c)]:
  - @haishin/transcriber@2.2.0

## 2.1.7

### Patch Changes

- [`2168d57`](https://github.com/tomouchuu/haishin/commit/2168d57ef63d6e98a011884f8e3280181c8b0ca0) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Set sentry to only load on production

- [`ad7362d`](https://github.com/tomouchuu/haishin/commit/ad7362d07ed18a00933b4456a6ebf1af12a01db2) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Make use of turbo's remote caching to speed up builds

- Updated dependencies [[`2168d57`](https://github.com/tomouchuu/haishin/commit/2168d57ef63d6e98a011884f8e3280181c8b0ca0)]:
  - @haishin/transcriber@2.1.5

## 2.1.6

### Patch Changes

- Updated dependencies [[`808ea7e`](https://github.com/tomouchuu/haishin/commit/808ea7efea13c3eb2af4c18a431364041649a566)]:
  - @haishin/transcriber@2.1.4

## 2.1.5

### Patch Changes

- Updated dependencies [[`5f72ea5`](https://github.com/tomouchuu/haishin/commit/5f72ea5df9c91de31a06fd12d41c1ccf6fc5869c)]:
  - @haishin/transcriber@2.1.3

## 2.1.4

### Patch Changes

- [`fa415b5`](https://github.com/tomouchuu/haishin/commit/fa415b5a246a8b9ac9b3d86fcb2f27f6db5dd7fb) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Introduce a shared eslint+prettier based on standard to the project

- [`7ef87b3`](https://github.com/tomouchuu/haishin/commit/7ef87b3e1fe3097dbdb0beceba5ec3d357360843) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Updates code to account for new eslint+prettier configs

- Updated dependencies [[`5a1e0b1`](https://github.com/tomouchuu/haishin/commit/5a1e0b1717d9fcc4b3d355fe2c4d21054f53b473), [`fa415b5`](https://github.com/tomouchuu/haishin/commit/fa415b5a246a8b9ac9b3d86fcb2f27f6db5dd7fb)]:
  - @haishin/transcriber@2.1.2

## 2.1.3

### Patch Changes

- [`e61f4ea`](https://github.com/tomouchuu/haishin/commit/e61f4ea9af94c48c8678169046dc6ed2610d2aa0) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fixes stream error incorrectly caused by the userId not being a url

## 2.1.2

### Patch Changes

- [`3e03671`](https://github.com/tomouchuu/haishin/commit/3e036716cc7fbc84cc9cc0c08e29ac4b1e630d31) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Have stream errors redirect to a stream-error page which at the moment is the 404 page

## 2.1.1

### Patch Changes

- [`6958a2e`](https://github.com/tomouchuu/haishin/commit/6958a2e9488b6d7ff13c228652571cbbfeecbba7) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fixes tsconfig for node projects to get correct dist files generated on build

- Updated dependencies [[`6958a2e`](https://github.com/tomouchuu/haishin/commit/6958a2e9488b6d7ff13c228652571cbbfeecbba7)]:
  - @haishin/transcriber@2.1.1

## 2.1.0

### Minor Changes

- [`d8674c5`](https://github.com/tomouchuu/haishin/commit/d8674c5324615802fe8db8bd87272433e13d488b) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Bump all packages to 2.1.0, now changesets work and should trigger releases

### Patch Changes

- [`75cc915`](https://github.com/tomouchuu/haishin/commit/75cc9157c32e348055223c831004db903bba5a6f) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds changesets to the repo for easier releases in the future

- Updated dependencies [[`75cc915`](https://github.com/tomouchuu/haishin/commit/75cc9157c32e348055223c831004db903bba5a6f), [`d8674c5`](https://github.com/tomouchuu/haishin/commit/d8674c5324615802fe8db8bd87272433e13d488b)]:
  - @haishin/transcriber@2.1.0
