# Contributing to postcss-px-morph

Thanks for helping improve this project—whether you are reporting a bug, discussing code, submitting a fix, or proposing a feature.

## Development workflow

1. Fork the repo and create your branch from `main`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build:
   ```bash
   npm run build
   ```
4. Run tests (non-watch; required for CI and local verification):
   ```bash
   npm run test:run
   ```
   Note: `npm test` is already an alias of `vitest run` (same as `test:run`). Use `npm run test:watch` only when you want watch mode.
5. Make your changes and add tests.
6. Re-run `npm run build && npm run test:run` before opening a PR.
7. Update docs / CHANGELOG when behavior or public options change.
8. Push and open a Pull Request (see the PR template checklist).

## Code style

- TypeScript for type safety.
- Zero breaking changes unless a major version is intentional: keep default `mode`, keep old APIs (aliases OK), keep hybrid priority (`remProperties` wins over `vwProperties`).
- Prefer clear, self-documenting names over cleverness.

## License

By contributing, you agree that your contributions are licensed under the MIT License.
