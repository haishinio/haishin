# @haishin/backend

## 4.0.0

### Major Changes

- [`57daefb`](https://github.com/haishinio/haishin/commit/57daefb0993dd75e9e3283555cdd15a699942d21) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Switch from workers to using a redis based queue system

### Patch Changes

- [`94e775f`](https://github.com/haishinio/haishin/commit/94e775f889c9f10315a1ba1c37539c2a9e20ddb3) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Remove stream length cap on other environments aside from faker

- [`a0a3ef3`](https://github.com/haishinio/haishin/commit/a0a3ef31505045d105ee6e95b61d229c527df269) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fix backups path and ensure consistent variable namings for folders

- [`7478295`](https://github.com/haishinio/haishin/commit/74782954842a52596de3afabe24a1830644a6a62) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fix stream info path

- [`409562d`](https://github.com/haishinio/haishin/commit/409562d6f821476fbee8db7cc62654d4fed08162) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Change simulataneous jobs to 5 at a time

## 3.0.3

### Patch Changes

- [`c41f197`](https://github.com/haishinio/haishin/commit/c41f197f0c00c34d499a9f5b72fea5c55bbb0696) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Add terminates when the workers close just to be sure

- [`6813437`](https://github.com/haishinio/haishin/commit/6813437d1896bb53d688a4b60695319dc86af2ab) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fix stream files static paths

- [`48fdd42`](https://github.com/haishinio/haishin/commit/48fdd42efa7d3d1052eeee4a9d18dc887a03cc32) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Remove the enforced timelimit on streams

- [`78808f3`](https://github.com/haishinio/haishin/commit/78808f3d77c4a5d83fbc6516510df898f6671f26) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Clean up and update READMEs for all projects

- Updated dependencies [[`9aa9df8`](https://github.com/haishinio/haishin/commit/9aa9df8c0ed5e883d38c2b3fa20484233342562e), [`78808f3`](https://github.com/haishinio/haishin/commit/78808f3d77c4a5d83fbc6516510df898f6671f26)]:
  - @haishin/utils@3.1.1

## 3.0.2

### Patch Changes

- [`cbdac9b`](https://github.com/tomouchuu/haishin/commit/cbdac9b9bfe901b9308cf44c5c775e4834fdf404) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fix issues with setup plugin

## 3.0.1

### Patch Changes

- [`75f9007`](https://github.com/tomouchuu/haishin/commit/75f900783de130d32b84a746ca118f136e516acb) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds reset route

- [`c6d6533`](https://github.com/tomouchuu/haishin/commit/c6d6533a2ab95dad3dc13c1642efaaae2e165e98) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Adds small cleanup backup route(s) to clean the backups dir

- [`880c6de`](https://github.com/tomouchuu/haishin/commit/880c6de35529efc96eecfeff737dadf1dcc407f1) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Stream routes can now return viewers

## 3.0.0

### Major Changes

- [#99](https://github.com/tomouchuu/haishin/pull/99) [`16ba0d0`](https://github.com/tomouchuu/haishin/commit/16ba0d0995d55f9d710717bb65b7455a108f0b88) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Move from express+node-media-server+socket.io to bun+elysia

### Patch Changes

- Updated dependencies [[`4baf9cf`](https://github.com/tomouchuu/haishin/commit/4baf9cf06bf7d329b1af2117bbee19f531e482de)]:
  - @haishin/utils@3.1.0

## 2.3.5

### Patch Changes

- Updated dependencies [[`4e9ee83`](https://github.com/tomouchuu/haishin/commit/4e9ee83d1b746ae4b9eaee8ff8c25dadb1159307)]:
  - @haishin/transcriber@3.0.5

## 2.3.4

### Patch Changes

- Updated dependencies [[`89041fb`](https://github.com/tomouchuu/haishin/commit/89041fb46220732861d59ba591bf72c7c7a49ca9), [`084c0ae`](https://github.com/tomouchuu/haishin/commit/084c0ae089b5350923d2f2f8fc0c4252cf128e4d)]:
  - @haishin/transcriber@3.0.4

## 2.3.3

### Patch Changes

- Updated dependencies [[`08970dd`](https://github.com/tomouchuu/haishin/commit/08970dd994393981085eb047fa6fb4f4aa84d88b), [`d380417`](https://github.com/tomouchuu/haishin/commit/d380417bea0085e51cc32b2e06afa8f4ac08334f)]:
  - @haishin/transcriber@3.0.3

## 2.3.2

### Patch Changes

- Updated dependencies [[`e02060f`](https://github.com/tomouchuu/haishin/commit/e02060f35e6b04d21b0c9abd59c3e99d94919d12)]:
  - @haishin/transcriber@3.0.2

## 2.3.1

### Patch Changes

- [`f1ea55f`](https://github.com/tomouchuu/haishin/commit/f1ea55f81ff288f5041737b22313f8e279e423fd) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Builds the backend server so it can be used by plain old node in the docker image

- Updated dependencies [[`c3a0719`](https://github.com/tomouchuu/haishin/commit/c3a0719950c7dd272e4b27aa70f15b3f8a5c8c4a)]:
  - @haishin/transcriber@3.0.1

## 2.3.0

### Minor Changes

- [`fb1e8a9`](https://github.com/tomouchuu/haishin/commit/fb1e8a9141f204a843a1fc7ed8d1d5d70aa85e2a) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Switch from node-dev/ts-node to tsx for backend dev/faker/starting

### Patch Changes

- [`a4a156a`](https://github.com/tomouchuu/haishin/commit/a4a156a45091fc6932961b01e6dd2bd062e930eb) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Add some sentry integrations to the backend that should enable better logging here

- [`358f429`](https://github.com/tomouchuu/haishin/commit/358f429ce64f32c4373f340ce1da08a85e3e255d) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Update tracesSampleRate to only send half of the tracings to sentry

- Updated dependencies [[`90ea579`](https://github.com/tomouchuu/haishin/commit/90ea57963ce9a5f7967b141663e83cb965d3f58a), [`358f429`](https://github.com/tomouchuu/haishin/commit/358f429ce64f32c4373f340ce1da08a85e3e255d), [`c4ca80d`](https://github.com/tomouchuu/haishin/commit/c4ca80db42afeb3f2168e289c531bbfb79dd86c4), [`186c457`](https://github.com/tomouchuu/haishin/commit/186c457b54815759039c5cf151b00cc7d6b8ab97)]:
  - @haishin/transcriber@3.0.0

## 2.2.4

### Patch Changes

- [`5ee34b1`](https://github.com/tomouchuu/haishin/commit/5ee34b1bc25c89a5fc42dc73f9a58f68c83bab90) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Fixes backend transmuxing from rtmp to hls

- Updated dependencies [[`5bb6187`](https://github.com/tomouchuu/haishin/commit/5bb61875531337c05a544c6db9c6ef885a7430ab)]:
  - @haishin/transcriber@2.3.1

## 2.2.3

### Patch Changes

- [`fda9e2f`](https://github.com/tomouchuu/haishin/commit/fda9e2fa5628108dfd69788b4f0d4ffc13b418e1) Thanks [@tomouchuu](https://github.com/tomouchuu)! - Keep hls files rather than deleting on stream end

- Updated dependencies [[`d7cd7cb`](https://github.com/tomouchuu/haishin/commit/d7cd7cb2b53b88f59b675ee63ba38390142ec25e)]:
  - @haishin/transcriber@2.3.0

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
