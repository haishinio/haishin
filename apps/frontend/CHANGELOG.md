# @haishin/frontend

## 3.1.1

### Patch Changes

- [`1780b79`](https://github.com/tomouchuu/haishin/commit/1780b79fd267088f143d2682380d310c480c2c78) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fix linting error due to removal of isRtmp from stream-page

- [`0e883c4`](https://github.com/tomouchuu/haishin/commit/0e883c4ce9f7a8260d0af348482e167a3bd78b76) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Also "fix" frontend's eslint config by removing unneeded next extend

## 3.1.0

### Minor Changes

- [`f9c38f6`](https://github.com/tomouchuu/haishin/commit/f9c38f63c217ae46565c5de0c1a3182bd138633a) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Thumbnails + start time introduced to the current streams section

### Patch Changes

- [`4759041`](https://github.com/tomouchuu/haishin/commit/475904167adc0b6fc6bf3d3955a50cf4a91eb5b3) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Clean up of isRtmp and add poster image

- Updated dependencies [[`aad14e8`](https://github.com/tomouchuu/haishin/commit/aad14e8e726c26de5c237c3911e61104c730132d), [`d7cd7cb`](https://github.com/tomouchuu/haishin/commit/d7cd7cb2b53b88f59b675ee63ba38390142ec25e)]:
  - @haishin/utils@2.4.0
  - @haishin/transcriber@2.3.0

## 3.0.2

### Patch Changes

- Updated dependencies [[`a55927e`](https://github.com/tomouchuu/haishin/commit/a55927e77752d19fa1b157105585086fe9c4b25d)]:
  - @haishin/transcriber@2.2.1

## 3.0.1

### Patch Changes

- [`e50937d`](https://github.com/tomouchuu/haishin/commit/e50937d986e676c8217ec9967de67ec27c9bef98) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Should fix fetch issues by referring to local docker urls

## 3.0.0

### Major Changes

- [`92f2e7a`](https://github.com/tomouchuu/haishin/commit/92f2e7a1ea5e8c55f8f89320325538f2aeca831c) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Switch to hls for livestreams

### Minor Changes

- [`3cb3a92`](https://github.com/tomouchuu/haishin/commit/3cb3a92e6f3507716ba0b0bef4dffb1456e5adfc) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds new api/stream/[id] route to handle stream specific information

- [`6c2a66c`](https://github.com/tomouchuu/haishin/commit/6c2a66c10f64fce77fba9bd8a2ba21a8890028f4) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Switch to the custom video player for uploads too

- [`688f7c4`](https://github.com/tomouchuu/haishin/commit/688f7c4b13b8910d8bd42774f2937c2712c27311) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Move api/stream/[url] to api/upload/[url] to prepare for new api/stream/[id] route to power better information for the livestream page

### Patch Changes

- [`51f2203`](https://github.com/tomouchuu/haishin/commit/51f2203b5acbf29a75da629c562e659b45a7a7dd) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Make use of the new stream info endpoint and pass down as props

- [`d44b06c`](https://github.com/tomouchuu/haishin/commit/d44b06c767107f6369427e991880a987dcc54fe7) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Update return types for react elements

- [`9254166`](https://github.com/tomouchuu/haishin/commit/9254166a97a127434223f5ee94e797a2f2c7b6ce) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Refactor current streams to use the useStream hook

- [`015d69c`](https://github.com/tomouchuu/haishin/commit/015d69c63a0b909d2dfbdd2daade0f523b948572) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Improve look of loading component by vertically+horizontally centering

- [`e9b8e5a`](https://github.com/tomouchuu/haishin/commit/e9b8e5a47bb3d10f082248e3620d14f9e0f2cc28) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds metadata for the pages, just simple titles, descriptions for now

- [`601a678`](https://github.com/tomouchuu/haishin/commit/601a67810cff9a2d51a75a70d7d891713de4ec79) Thanks [@tomouchuu](https://github.com/tomouchuu)! - No longer need initial duration to be passed down the prop chain

- Updated dependencies [[`3987f04`](https://github.com/tomouchuu/haishin/commit/3987f04762ef9377d8f23d9e29fc6da5901b4a86), [`92f2e7a`](https://github.com/tomouchuu/haishin/commit/92f2e7a1ea5e8c55f8f89320325538f2aeca831c)]:
  - @haishin/utils@2.3.0
  - @haishin/transcriber@2.2.0

## 2.2.8

### Patch Changes

- [`62aa801`](https://github.com/tomouchuu/haishin/commit/62aa8017a6977fd6a08b33945a8731e48b409415) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Remove logging for the stream route, now the correct url has been passed

## 2.2.7

### Patch Changes

- [`c0db054`](https://github.com/tomouchuu/haishin/commit/c0db054e4c8c9e6b5e30f21b341c6bc62590d42d) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Log the api/stream endpoint to work out what's happening

## 2.2.6

### Patch Changes

- [`2168d57`](https://github.com/tomouchuu/haishin/commit/2168d57ef63d6e98a011884f8e3280181c8b0ca0) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Set sentry to only load on production

- [`ad7362d`](https://github.com/tomouchuu/haishin/commit/ad7362d07ed18a00933b4456a6ebf1af12a01db2) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Make use of turbo's remote caching to speed up builds

- [`60732cc`](https://github.com/tomouchuu/haishin/commit/60732cc33572f2c884f86b1043c2a9f6c8ef54af) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Rather than calling the backend directly, call the frontend's api so we can then change/modify the data as we see fit

- [`1506329`](https://github.com/tomouchuu/haishin/commit/150632921991818df8ca51c751f234fd194ecaf8) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds link back to homepage on the not-found/stream-error page

- [`a7ffdab`](https://github.com/tomouchuu/haishin/commit/a7ffdab91d5899bf47a1ad037be40678733fb656) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Have a proper ended stream message and disconnect from socket channel when over

- Updated dependencies [[`2168d57`](https://github.com/tomouchuu/haishin/commit/2168d57ef63d6e98a011884f8e3280181c8b0ca0)]:
  - @haishin/transcriber@2.1.5

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
