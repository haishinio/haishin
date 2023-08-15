# @haishin/frontend

## 2.2.5

### Patch Changes

- [`95ac55d`](https://github.com/tomouchuu/haishin/commit/95ac55dbbf72dd5fdc44cfdf98ba3cd9abc8785f) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fixes bugs caused by missing an atob/btoa checks

- [`808ea7e`](https://github.com/tomouchuu/haishin/commit/808ea7efea13c3eb2af4c18a431364041649a566) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds a new urlUtil object for encoding+decoding urls

- Updated dependencies [[`808ea7e`](https://github.com/tomouchuu/haishin/commit/808ea7efea13c3eb2af4c18a431364041649a566)]:
  - @haishin/utils@2.2.0
  - @haishin/transcriber@2.1.4

## 2.2.4

### Patch Changes

- [`5f72ea5`](https://github.com/tomouchuu/haishin/commit/5f72ea5df9c91de31a06fd12d41c1ccf6fc5869c) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fixes an error caused by when the base64'd url has '/' etc

- Updated dependencies [[`5f72ea5`](https://github.com/tomouchuu/haishin/commit/5f72ea5df9c91de31a06fd12d41c1ccf6fc5869c)]:
  - @haishin/transcriber@2.1.3

## 2.2.3

### Patch Changes

- [`9144e5b`](https://github.com/tomouchuu/haishin/commit/9144e5b2e7829ebf198d5b9d8f5d4348f24788f5) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Remove react-player in favour of just normal video for uploaded clips, fixes #70

- [`104903b`](https://github.com/tomouchuu/haishin/commit/104903bf001c0a269933e596e2f01eeb1f011083) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Clean up console error by stoping the render of the StreamPage when no streamUrl is present

## 2.2.2

### Patch Changes

- [`648b250`](https://github.com/tomouchuu/haishin/commit/648b250c218f3c8f9f78e226f01ce0ae7e0da360) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Updates frontend to use eslint+prettier configs

- [`fa415b5`](https://github.com/tomouchuu/haishin/commit/fa415b5a246a8b9ac9b3d86fcb2f27f6db5dd7fb) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Introduce a shared eslint+prettier based on standard to the project

- Updated dependencies [[`dcfee0d`](https://github.com/tomouchuu/haishin/commit/dcfee0da98b53cfab379a845ca6f1946d7807283), [`5a1e0b1`](https://github.com/tomouchuu/haishin/commit/5a1e0b1717d9fcc4b3d355fe2c4d21054f53b473), [`fa415b5`](https://github.com/tomouchuu/haishin/commit/fa415b5a246a8b9ac9b3d86fcb2f27f6db5dd7fb)]:
  - @haishin/utils@2.1.2
  - @haishin/transcriber@2.1.2

## 2.2.1

### Patch Changes

- [`e85d3c0`](https://github.com/tomouchuu/haishin/commit/e85d3c04e80d5e051ed2c582ceb40e2c841ed136) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Updates stream pages to use loading component as a fallback with suspense

- [`9c87ab8`](https://github.com/tomouchuu/haishin/commit/9c87ab8e55babec7ec8e1aa29af763b81e7105d8) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Revert the nextjs update, for whatever reason it causes our start to fail

## 2.2.0

### Minor Changes

- [`b7aaebf`](https://github.com/tomouchuu/haishin/commit/b7aaebfb6ed87b44fce165b14d848ddf2cb69d1b) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds a 404 not found page to catch any 404 errors related to routing

### Patch Changes

- [`3e03671`](https://github.com/tomouchuu/haishin/commit/3e036716cc7fbc84cc9cc0c08e29ac4b1e630d31) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Have stream errors redirect to a stream-error page which at the moment is the 404 page

## 2.1.1

### Patch Changes

- Updated dependencies [[`6958a2e`](https://github.com/tomouchuu/haishin/commit/6958a2e9488b6d7ff13c228652571cbbfeecbba7)]:
  - @haishin/transcriber@2.1.1
  - @haishin/utils@2.1.1

## 2.1.0

### Minor Changes

- [`d8674c5`](https://github.com/tomouchuu/haishin/commit/d8674c5324615802fe8db8bd87272433e13d488b) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Bump all packages to 2.1.0, now changesets work and should trigger releases

### Patch Changes

- [`75cc915`](https://github.com/tomouchuu/haishin/commit/75cc9157c32e348055223c831004db903bba5a6f) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds changesets to the repo for easier releases in the future

- Updated dependencies [[`75cc915`](https://github.com/tomouchuu/haishin/commit/75cc9157c32e348055223c831004db903bba5a6f), [`d8674c5`](https://github.com/tomouchuu/haishin/commit/d8674c5324615802fe8db8bd87272433e13d488b)]:
  - @haishin/transcriber@2.1.0
  - @haishin/utils@2.1.0
