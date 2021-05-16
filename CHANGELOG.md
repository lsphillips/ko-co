# Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.1] (2021-05-16)

### Changed

- Removed unnecessary files from the package making it more lightweight.

## [1.5.0] (2021-05-15)

### Added

- Introduced an ESM version of this module that will be used when being imported using `import`.

### Updated

- This module is now transpiled using Babel.
- The UMD version of this module now exposes itself using the name `koco` instead of `KoCo`.

## [1.4.0] (2019-04-30)

### Added

- Introduced a browser entry point that is ES5 compatible and minified.

## [1.3.0] (2018-12-06)

### Added

- Introduced documentation to the Typescript type definitons.

## [1.2.1] (2018-02-07)

### Fixed

- The `konamicode` event now fires even when the user has their caps lock enabled.

## [1.2.0] (2018-01-31)

### Changed

- Updated `KoCo.addSupportForTheKonamiCode()` to return a function that will remove support for the Konami Code.

## [1.1.0] (2018-01-02)

### Changed

- Updated the `konamicode` event so it is now cancelable.

## [1.0.0] (2017-05-16)

The initial public release.
