# @haishin/transcriber

## 3.0.0

### Major Changes

- [`c4ca80d`](https://github.com/tomouchuu/haishin/commit/c4ca80db42afeb3f2168e289c531bbfb79dd86c4) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Switch from rollup to tsup for building + bundling files. Should be faster and lead to improvements later down the line with watching etc.

### Minor Changes

- [`186c457`](https://github.com/tomouchuu/haishin/commit/186c457b54815759039c5cf151b00cc7d6b8ab97) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Have getDuration be a shared util function for getting a similar duration for all the things that use it

### Patch Changes

- [`90ea579`](https://github.com/tomouchuu/haishin/commit/90ea57963ce9a5f7967b141663e83cb965d3f58a) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Update to openai package to ^4.0.0

- [`358f429`](https://github.com/tomouchuu/haishin/commit/358f429ce64f32c4373f340ce1da08a85e3e255d) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Update tracesSampleRate to only send half of the tracings to sentry

- Updated dependencies [[`a377e46`](https://github.com/tomouchuu/haishin/commit/a377e466d77b50d26fbf0cee3818842e5f4ce457), [`186c457`](https://github.com/tomouchuu/haishin/commit/186c457b54815759039c5cf151b00cc7d6b8ab97)]:
  - @haishin/utils@3.0.0

## 2.3.1

### Patch Changes

- [`5bb6187`](https://github.com/tomouchuu/haishin/commit/5bb61875531337c05a544c6db9c6ef885a7430ab) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fixes issue where old livestream folders weren't deleted after a stream had finished

## 2.3.0

### Minor Changes

- [`d7cd7cb`](https://github.com/tomouchuu/haishin/commit/d7cd7cb2b53b88f59b675ee63ba38390142ec25e) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds a worker to get the thumbnail every 2mins

### Patch Changes

- Updated dependencies [[`aad14e8`](https://github.com/tomouchuu/haishin/commit/aad14e8e726c26de5c237c3911e61104c730132d)]:
  - @haishin/utils@2.4.0

## 2.2.1

### Patch Changes

- [`a55927e`](https://github.com/tomouchuu/haishin/commit/a55927e77752d19fa1b157105585086fe9c4b25d) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fix paths when splitting uploaded videos

## 2.2.0

### Minor Changes

- [`92f2e7a`](https://github.com/tomouchuu/haishin/commit/92f2e7a1ea5e8c55f8f89320325538f2aeca831c) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Switch to hls for livestreams

### Patch Changes

- Updated dependencies [[`3987f04`](https://github.com/tomouchuu/haishin/commit/3987f04762ef9377d8f23d9e29fc6da5901b4a86)]:
  - @haishin/utils@2.3.0

## 2.1.5

### Patch Changes

- [`2168d57`](https://github.com/tomouchuu/haishin/commit/2168d57ef63d6e98a011884f8e3280181c8b0ca0) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Set sentry to only load on production

## 2.1.4

### Patch Changes

- [`808ea7e`](https://github.com/tomouchuu/haishin/commit/808ea7efea13c3eb2af4c18a431364041649a566) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds a new urlUtil object for encoding+decoding urls

- Updated dependencies [[`808ea7e`](https://github.com/tomouchuu/haishin/commit/808ea7efea13c3eb2af4c18a431364041649a566)]:
  - @haishin/utils@2.2.0

## 2.1.3

### Patch Changes

- [`5f72ea5`](https://github.com/tomouchuu/haishin/commit/5f72ea5df9c91de31a06fd12d41c1ccf6fc5869c) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fixes an error caused by when the base64'd url has '/' etc

## 2.1.2

### Patch Changes

- [`5a1e0b1`](https://github.com/tomouchuu/haishin/commit/5a1e0b1717d9fcc4b3d355fe2c4d21054f53b473) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Update transcriber package to account for new eslint+prettier configs

- [`fa415b5`](https://github.com/tomouchuu/haishin/commit/fa415b5a246a8b9ac9b3d86fcb2f27f6db5dd7fb) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Introduce a shared eslint+prettier based on standard to the project

- Updated dependencies [[`dcfee0d`](https://github.com/tomouchuu/haishin/commit/dcfee0da98b53cfab379a845ca6f1946d7807283), [`fa415b5`](https://github.com/tomouchuu/haishin/commit/fa415b5a246a8b9ac9b3d86fcb2f27f6db5dd7fb)]:
  - @haishin/utils@2.1.2

## 2.1.1

### Patch Changes

- [`6958a2e`](https://github.com/tomouchuu/haishin/commit/6958a2e9488b6d7ff13c228652571cbbfeecbba7) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fixes tsconfig for node projects to get correct dist files generated on build

- Updated dependencies [[`6958a2e`](https://github.com/tomouchuu/haishin/commit/6958a2e9488b6d7ff13c228652571cbbfeecbba7)]:
  - @haishin/utils@2.1.1

## 2.1.0

### Minor Changes

- [`d8674c5`](https://github.com/tomouchuu/haishin/commit/d8674c5324615802fe8db8bd87272433e13d488b) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Bump all packages to 2.1.0, now changesets work and should trigger releases

### Patch Changes

- [`75cc915`](https://github.com/tomouchuu/haishin/commit/75cc9157c32e348055223c831004db903bba5a6f) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds changesets to the repo for easier releases in the future

- Updated dependencies [[`75cc915`](https://github.com/tomouchuu/haishin/commit/75cc9157c32e348055223c831004db903bba5a6f), [`d8674c5`](https://github.com/tomouchuu/haishin/commit/d8674c5324615802fe8db8bd87272433e13d488b)]:
  - @haishin/utils@2.1.0
