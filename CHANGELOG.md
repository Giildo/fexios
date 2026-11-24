# Changelog

All notable changes to the fexios library.

## 2.1.1 — 2026-11-24

### 📝 Documentation

- Add a `CONTRIBUTING.md` covering prerequisites, dev commands, code
  conventions, testing conventions, commit format, and PR process.
- Link the live docs site (`https://jojotique.gitlab.io/libs/fexios/`)
  from the README.

### 🔧 Chores

- Fix the VitePress `base` for GitLab Pages: the group is already in the
  domain, so the path prefix is `/libs/fexios/` instead of the full
  `CI_PROJECT_PATH`.

## 2.1.0 — 2026-11-24

### ✨ Features

- Allow combining the `.credentials` and `.text` one-shot modifiers: they are
  now orthogonal, so `fexios.credentials.text.get(...)` sends credentials AND
  returns the body as a string.

### 📝 Documentation

- Add the LGPL-3.0 license (full text in `LICENSE`, `package.json` license set
  to `LGPL-3.0-or-later`).
- Document the full release process in AGENTS.md.

### ⬆️ Dependencies

- Bump knip (6.42.1 → 6.48.0) and typescript-eslint (8.73.0 → 8.74.0).

## 2.0.0 — 2026-11-24

### ✨ Features

- Add a request timeout option (`timeout` in `FexiosOptions` and per-request, implemented with `AbortSignal.timeout` + `AbortSignal.any`).

### ♻️ Refactoring

- **BREAKING** — Address baseline review findings: response `code` is now a `number`, headers are normalized, public types are cleaned up.

### 🐛 Bug Fixes

- The `.credentials` and `.text` one-shot modifiers are now mutually exclusive: setting one clears the other.
- A `200` (or any non-204) response with an empty body now resolves to `data: null` instead of throwing a `SyntaxError`.

### 📝 Documentation

- Add the VitePress documentation site and rewrite the README.
- Add AGENTS.md and the dependency audit.
- Document the test delegation convention.

### ⬆️ Dependencies

- Audit and align dependencies.

### 🔧 Chores

- Align project configuration.
- Fix the lefthook lint hook failing on ignored files.

### 🧪 Build

- Add Stryker mutation testing.

### ✅ Tests

- Add baseline unit tests for the fexios client.

### 👷 CI

- Add a GitLab Pages pipeline for the docs site.

## 1.1.4 — 2026-06-19

### 🔥 Removals

- Remove leftover test code from `index.ts`.

## 1.1.3 — 2026-06-19

### 🐛 Bug Fixes

- Fix the export file name.

## 1.1.2 — 2026-06-19

### 📝 Documentation

- Rename the README.

## 1.1.1 — 2026-06-19

### 📝 Documentation

- Fix the README.

## 1.1.0 — 2026-06-19

### ✨ Features

- Add headers support in the Fexios constructor.

### ⬆️ Dependencies

- Upgrade the project and remove the workspace.

### 🔧 Chores

- Update the ESLint configuration.

## 1.0.0 — 2025-02-18

### ✨ Features

- Add a middleware to load text responses.

### 🐛 Bug Fixes

- Fix a 204 no content error.

### ⬆️ Dependencies

- Upgrade dependencies.

### 🔧 Chores

- Add a `build-only` script.
- Configure the entry file in the Vite config.

## Initial — 2024-12-28

### ✨ Features

- Create the Fexios object.
- Add `ok` in the response.
