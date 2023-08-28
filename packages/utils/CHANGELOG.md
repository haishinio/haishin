# @haishin/utils

## 3.0.0

### Major Changes

- [`a377e46`](https://github.com/tomouchuu/haishin/commit/a377e466d77b50d26fbf0cee3818842e5f4ce457) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Switch from rollup to tsup for building + bundling files. Should be faster and lead to improvements later down the line with watching etc.

### Minor Changes

- [`186c457`](https://github.com/tomouchuu/haishin/commit/186c457b54815759039c5cf151b00cc7d6b8ab97) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Have getDuration be a shared util function for getting a similar duration for all the things that use it

## 2.4.0

### Minor Changes

- [`aad14e8`](https://github.com/tomouchuu/haishin/commit/aad14e8e726c26de5c237c3911e61104c730132d) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Remove rtmp sites helper, adds urlFix fn to modify youtube live urls into a format we can use

## 2.3.0

### Minor Changes

- [`3987f04`](https://github.com/tomouchuu/haishin/commit/3987f04762ef9377d8f23d9e29fc6da5901b4a86) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Switch from uriencoded base64 strings to just plain base32 strings

## 2.2.0

### Minor Changes

- [`808ea7e`](https://github.com/tomouchuu/haishin/commit/808ea7efea13c3eb2af4c18a431364041649a566) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds a new urlUtil object for encoding+decoding urls

## 2.1.2

### Patch Changes

- [`dcfee0d`](https://github.com/tomouchuu/haishin/commit/dcfee0da98b53cfab379a845ca6f1946d7807283) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Makes sure package is in line with eslint+prettier configs

- [`fa415b5`](https://github.com/tomouchuu/haishin/commit/fa415b5a246a8b9ac9b3d86fcb2f27f6db5dd7fb) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Introduce a shared eslint+prettier based on standard to the project

## 2.1.1

### Patch Changes

- [`6958a2e`](https://github.com/tomouchuu/haishin/commit/6958a2e9488b6d7ff13c228652571cbbfeecbba7) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fixes tsconfig for node projects to get correct dist files generated on build

## 2.1.0

### Minor Changes

- [`d8674c5`](https://github.com/tomouchuu/haishin/commit/d8674c5324615802fe8db8bd87272433e13d488b) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Bump all packages to 2.1.0, now changesets work and should trigger releases

### Patch Changes

- [`75cc915`](https://github.com/tomouchuu/haishin/commit/75cc9157c32e348055223c831004db903bba5a6f) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds changesets to the repo for easier releases in the future
