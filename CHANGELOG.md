# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.5.1](https://github.com/mdevils/api-typescript-generator/compare/v2.5.0...v2.5.1) (2024-11-14)


### Bug Fixes

* include API client class name to the operation deprecation error message ([4da7d8b](https://github.com/mdevils/api-typescript-generator/commit/4da7d8bc03a60078faa6148d7a05a3571a13e28b))

## [2.5.0](https://github.com/mdevils/api-typescript-generator/compare/v2.4.24...v2.5.0) (2024-11-14)


### Features

* ability to show warnings in case of deprecated operation calls ([b43904f](https://github.com/mdevils/api-typescript-generator/commit/b43904f3a6e1a3616f4c61233de8499b28e00561))

### [2.4.24](https://github.com/mdevils/api-typescript-generator/compare/v2.4.23...v2.4.24) (2024-09-13)


### Bug Fixes

* improve http error message ([5251169](https://github.com/mdevils/api-typescript-generator/commit/52511696dfa96251b85c441323dd1bbd39c1585d))

### [2.4.23](https://github.com/mdevils/api-typescript-generator/compare/v2.4.22...v2.4.23) (2024-09-10)


### Bug Fixes

* use baseUrl from client config ([569e53d](https://github.com/mdevils/api-typescript-generator/commit/569e53d45a19d0359e1e8270a8e3e1a707693f1c))

### [2.4.22](https://github.com/mdevils/api-typescript-generator/compare/v2.4.21...v2.4.22) (2024-09-10)


### Bug Fixes

* add ability to specify schema names to exportModels ([4a9bfd4](https://github.com/mdevils/api-typescript-generator/commit/4a9bfd43f67c8d3fdc0032de0d93082e89e78fa2))

### [2.4.21](https://github.com/mdevils/api-typescript-generator/compare/v2.4.20...v2.4.21) (2024-08-19)


### Bug Fixes

* ability to customize validation error handling ([dc29ff6](https://github.com/mdevils/api-typescript-generator/commit/dc29ff640e9fefba0d87a4342aa8269346b66fa0))

### [2.4.20](https://github.com/mdevils/api-typescript-generator/compare/v2.4.19...v2.4.20) (2024-07-22)


### Bug Fixes

* parallel generation for multiple sources/targets ([317256a](https://github.com/mdevils/api-typescript-generator/commit/317256a57c0d155f63a19ccbb10db29054bcb904))

### [2.4.19](https://github.com/mdevils/api-typescript-generator/compare/v2.4.18...v2.4.19) (2024-07-22)


### Bug Fixes

* support parameter serialization style / explode ([ff073b5](https://github.com/mdevils/api-typescript-generator/commit/ff073b59e72452fbcf9dd69ba7923d747a254ca5))

### [2.4.18](https://github.com/mdevils/api-typescript-generator/compare/v2.4.17...v2.4.18) (2024-07-05)


### Bug Fixes

* correct fieldPath when generating model jsdoc ([b4f2d10](https://github.com/mdevils/api-typescript-generator/commit/b4f2d104e84f66850ee07ab6b8b2579baa6effcf))

### [2.4.17](https://github.com/mdevils/api-typescript-generator/compare/v2.4.16...v2.4.17) (2024-07-02)


### Bug Fixes

* core files jsdoc generator, add more comments ([ce3e871](https://github.com/mdevils/api-typescript-generator/commit/ce3e871c3f4d36fa2fb6b2d650b828987fa0bde3))

### [2.4.16](https://github.com/mdevils/api-typescript-generator/compare/v2.4.15...v2.4.16) (2024-06-25)


### Bug Fixes

* improve tsdoc compatibility ([565b795](https://github.com/mdevils/api-typescript-generator/commit/565b7952d4d972f366833acbb45fedc7799f6b65))

### [2.4.15](https://github.com/mdevils/api-typescript-generator/compare/v2.4.14...v2.4.15) (2024-06-25)


### Bug Fixes

* format plain jsdoc with tsdoc compatibility ([7d9a345](https://github.com/mdevils/api-typescript-generator/commit/7d9a345cc43d7e6509608005dc46ad018e1de5ef))

### [2.4.14](https://github.com/mdevils/api-typescript-generator/compare/v2.4.13...v2.4.14) (2024-06-25)


### Bug Fixes

* support tsdoc, do not word wrap jsdoc tag values ([7fe243a](https://github.com/mdevils/api-typescript-generator/commit/7fe243a1c85e202a2ed8e2da7fb9ce8d121fca03))

### [2.4.13](https://github.com/mdevils/api-typescript-generator/compare/v2.4.12...v2.4.13) (2024-06-21)


### Bug Fixes

* configure jsdoc generation for API Client Errors, add protected where necessary ([ff1f9f0](https://github.com/mdevils/api-typescript-generator/commit/ff1f9f0ce954fdf0e4f9b9d1a12b0a48a095908e))

### [2.4.12](https://github.com/mdevils/api-typescript-generator/compare/v2.4.11...v2.4.12) (2024-06-20)


### Bug Fixes

* remove sources from the package ([c9f4219](https://github.com/mdevils/api-typescript-generator/commit/c9f4219b32ecfaa34645a1020cdd921fdcd27e3c))

### [2.4.11](https://github.com/mdevils/api-typescript-generator/compare/v2.4.10...v2.4.11) (2024-06-14)


### Bug Fixes

* avoid constructing unused service instances ([c14770c](https://github.com/mdevils/api-typescript-generator/commit/c14770c11f6de7b97a8f013ee3fe0c915593f2a8))

### [2.4.10](https://github.com/mdevils/api-typescript-generator/compare/v2.4.9...v2.4.10) (2024-06-14)


### Bug Fixes

* allow using unbound service methods ([dbf68d9](https://github.com/mdevils/api-typescript-generator/commit/dbf68d9ea0c3afc23ab27268fb72d5282b7cc487))

### [2.4.9](https://github.com/mdevils/api-typescript-generator/compare/v2.4.8...v2.4.9) (2024-06-11)


### Bug Fixes

* default to empty object when all operation arguments are optional ([6421141](https://github.com/mdevils/api-typescript-generator/commit/6421141cecb16887e1566c647b7581ac96e48d65))

### [2.4.8](https://github.com/mdevils/api-typescript-generator/compare/v2.4.7...v2.4.8) (2024-06-07)


### Bug Fixes

* improve type simplification when intersecting ([48791db](https://github.com/mdevils/api-typescript-generator/commit/48791dbdd2573b98ba1118ef80062dc793e2ec51))

### [2.4.7](https://github.com/mdevils/api-typescript-generator/compare/v2.4.6...v2.4.7) (2024-06-07)


### Bug Fixes

* reserved names / keywords in operation arguments ([65b0051](https://github.com/mdevils/api-typescript-generator/commit/65b0051dfaab20e1f8f2e03946e47156336c5f3d))

### [2.4.6](https://github.com/mdevils/api-typescript-generator/compare/v2.4.5...v2.4.6) (2024-06-06)


### Bug Fixes

* parameter name generation ([0497887](https://github.com/mdevils/api-typescript-generator/commit/0497887f1adc7ec626c5aca2b241844bf6641c03))

### [2.4.5](https://github.com/mdevils/api-typescript-generator/compare/v2.4.4...v2.4.5) (2024-06-06)


### Bug Fixes

* improve entity name formatting ([41bc93b](https://github.com/mdevils/api-typescript-generator/commit/41bc93bdf830ba837c3e86a93c9962f09523a4fe))

### [2.4.4](https://github.com/mdevils/api-typescript-generator/compare/v2.4.3...v2.4.4) (2024-06-04)


### Bug Fixes

* fix common validation schema imports ([172bf6d](https://github.com/mdevils/api-typescript-generator/commit/172bf6de3318cd3c13eae7626a38c6bca1439dbc))

### [2.4.3](https://github.com/mdevils/api-typescript-generator/compare/v2.4.2...v2.4.3) (2024-06-04)


### Bug Fixes

* fix core imports ([c5543f3](https://github.com/mdevils/api-typescript-generator/commit/c5543f39c1168acd857681287c40dc10e6eba134))

### [2.4.2](https://github.com/mdevils/api-typescript-generator/compare/v2.4.1...v2.4.2) (2024-06-04)


### Bug Fixes

* format core filenames in core file imports ([18713c3](https://github.com/mdevils/api-typescript-generator/commit/18713c347ed955621f42c9fa32736cee75a5b8cb))

### [2.4.1](https://github.com/mdevils/api-typescript-generator/compare/v2.4.0...v2.4.1) (2024-06-03)


### Bug Fixes

* eslint fix files in memory in case of non-existing files ([4b12932](https://github.com/mdevils/api-typescript-generator/commit/4b129329dc8b7c6029304774d36e07895c84dd9a))

## [2.4.0](https://github.com/mdevils/api-typescript-generator/compare/v2.3.0...v2.4.0) (2024-06-03)


### Features

* ability to specify exact model names for export ([d46ea2b](https://github.com/mdevils/api-typescript-generator/commit/d46ea2bec9e6acd0254cdb982f23c7545012ccf5))

## [2.3.0](https://github.com/mdevils/api-typescript-generator/compare/v2.2.7...v2.3.0) (2024-06-03)


### Features

* allow function/async function config, add more source types, make patch functions async ([639a985](https://github.com/mdevils/api-typescript-generator/commit/639a985bbe8dc6cfa8ee9701d2a511fab219e03f))

### [2.2.7](https://github.com/mdevils/api-typescript-generator/compare/v2.2.6...v2.2.7) (2024-05-28)


### Bug Fixes

* fail in case of fatal eslint error ([84a60c6](https://github.com/mdevils/api-typescript-generator/commit/84a60c6dbf2c0400925c64ab8bca9429fc805a81))

### [2.2.6](https://github.com/mdevils/api-typescript-generator/compare/v2.2.5...v2.2.6) (2024-05-28)


### Bug Fixes

* improve generated files quality ([dccae0e](https://github.com/mdevils/api-typescript-generator/commit/dccae0eb3a438e2bac1955c4c17658c7440ea8d5))

### [2.2.5](https://github.com/mdevils/api-typescript-generator/compare/v2.2.4...v2.2.5) (2024-05-28)


### Bug Fixes

* specify full path to the files for eslint ([efa04fa](https://github.com/mdevils/api-typescript-generator/commit/efa04fafe42276615522ff67ad23488dff61f631))

### [2.2.4](https://github.com/mdevils/api-typescript-generator/compare/v2.2.3...v2.2.4) (2024-05-28)


### Bug Fixes

* fix core build ([ad1e553](https://github.com/mdevils/api-typescript-generator/commit/ad1e55339882e97e3b89977c9a0ef8166eebf79a))

### [2.2.3](https://github.com/mdevils/api-typescript-generator/compare/v2.2.2...v2.2.3) (2024-05-27)


### Bug Fixes

* improve validation error reporting, add zod validation provider tests ([b7c1dab](https://github.com/mdevils/api-typescript-generator/commit/b7c1dabb8cfc073bade9016a58a5b2dc8fcf43c8))

### [2.2.2](https://github.com/mdevils/api-typescript-generator/compare/v2.2.1...v2.2.2) (2024-05-27)


### Bug Fixes

* include common http types ([cea163d](https://github.com/mdevils/api-typescript-generator/commit/cea163d57fd4ec66d2402a08d629c2f762b29224))

### [2.2.1](https://github.com/mdevils/api-typescript-generator/compare/v2.2.0...v2.2.1) (2024-05-24)


### Bug Fixes

* add CommonOpenApiClientGeneratorConfigPostprocess export ([3f6803e](https://github.com/mdevils/api-typescript-generator/commit/3f6803ec8b3a592bfcb3a2d9a1adc38a8b7ef1ef))

## [2.2.0](https://github.com/mdevils/api-typescript-generator/compare/v2.1.7...v2.2.0) (2024-05-24)


### Features

* add eslint formatting, checking generated files ([b0a0f76](https://github.com/mdevils/api-typescript-generator/commit/b0a0f7692659f189e600908236b7264f99472272))

### [2.1.7](https://github.com/mdevils/api-typescript-generator/compare/v2.1.6...v2.1.7) (2024-05-23)


### Bug Fixes

* fix adding missing dependencies for model validation ([b9f7743](https://github.com/mdevils/api-typescript-generator/commit/b9f774384076821b92df04208cd4d7ce42f2ad6f))

### [2.1.6](https://github.com/mdevils/api-typescript-generator/compare/v2.1.5...v2.1.6) (2024-05-23)


### Bug Fixes

* add missing dependencies for model validation ([2876b64](https://github.com/mdevils/api-typescript-generator/commit/2876b64060d7ea615218e7ced4ebc24603339132))

### [2.1.5](https://github.com/mdevils/api-typescript-generator/compare/v2.1.4...v2.1.5) (2024-05-23)


### Bug Fixes

* include generation-related typescript files ([69d314e](https://github.com/mdevils/api-typescript-generator/commit/69d314e0140e93e562111dadf396719e53fd4050))

### [2.1.4](https://github.com/mdevils/api-typescript-generator/compare/v2.1.3...v2.1.4) (2024-05-23)


### Bug Fixes

* improve mediaType condition for validators ([6994c8b](https://github.com/mdevils/api-typescript-generator/commit/6994c8b8600f1c6b84523f0f16dfc37e6682e675))

### [2.1.3](https://github.com/mdevils/api-typescript-generator/compare/v2.1.2...v2.1.3) (2024-05-23)


### Bug Fixes

* fix checking for media types in validation storage ([a062437](https://github.com/mdevils/api-typescript-generator/commit/a062437fcf5beb6948134ea595f49ba0512b9a9e))

### [2.1.2](https://github.com/mdevils/api-typescript-generator/compare/v2.1.1...v2.1.2) (2024-05-21)


### Bug Fixes

* specify import type where necessary ([9facc9c](https://github.com/mdevils/api-typescript-generator/commit/9facc9ce47c463e2a244aede7752afb40c43f43f))

### [2.1.1](https://github.com/mdevils/api-typescript-generator/compare/v2.1.0...v2.1.1) (2024-05-20)


### Bug Fixes

* fix readme example ([87afa15](https://github.com/mdevils/api-typescript-generator/commit/87afa159c59a5343bd762b7ee144673a57af0e1c))

## 2.1.0 (2024-05-20)


### Features

* first public version ([e495c61](https://github.com/mdevils/api-typescript-generator/commit/e495c61821568534e7feee92939d77c74738554d))

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.
