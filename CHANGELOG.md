# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2026-10-24

### Added
- `convertNegative` option as the preferred alias for controlling negative px conversion
- GitHub issue / PR templates and refreshed CONTRIBUTING
- Minimal Vite demo under `examples/vite-vanilla`
- Keep a Changelog `CHANGELOG.md`
- CI badge in README

### Changed
- Default `exclude` tightened to style-related minified files + `node_modules/**/*` only (removed PostCSS-unreachable `*.min.js` / `*.min.ts` / env patterns, etc.)
- README (zh / en) rewritten: positioning, competitor table, hybrid before/after, recommended `hybridOptions`, FAQ, real defaults
- Vue CLI usage moved to an appendix; Vite / `postcss.config.js` is the primary path

### Deprecated
- `minusPxToMinusMode` — use `convertNegative` instead (still supported; conflicting explicit values prefer `convertNegative` and warn once)

## [1.0.3] - 2026-10-24

### Fixed
- Wildcard property matching in hybrid mode (`font*`, `margin*`, etc.)
- CI hanging when `npm test` ran Vitest in watch mode — `test` / `test:run` now both use `vitest run`

### Added
- `enabled` option to globally disable conversion
- `exports` field and PostCSS 8 plugin marker (`postcss = true`) for object-style config
- CI workflow improvements (PR triggers, Node matrix)

### Changed
- README synced with real defaults and hybrid priority notes

## [1.0.2] - 2026-07

### Changed
- Usage docs and packaging polish

## [1.0.0] - 2026-07

### Added
- Initial stable release: rem / vw / hybrid modes, ignore comments, selector blacklist, mediaQuery control

[1.0.4]: https://github.com/fragrans-maotou/postcss-px-morph/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/fragrans-maotou/postcss-px-morph/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/fragrans-maotou/postcss-px-morph/compare/v1.0.0...v1.0.2
[1.0.0]: https://github.com/fragrans-maotou/postcss-px-morph/releases/tag/v1.0.0
