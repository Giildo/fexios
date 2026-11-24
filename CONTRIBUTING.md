# Contributing to Fexios

Thanks for wanting to contribute! This doc is the quick reference for getting
your PR merged without a round of "please fix this".

## Prerequisites

- **Node.js ≥ 22** (native `fetch` required)
- **pnpm** (the project uses pnpm workspaces)

## Setup

```sh
pnpm install
```

That's it. No build step needed for development.

## Development commands

| Command              | What it does                        |
| -------------------- | ----------------------------------- |
| `pnpm dev`           | Start the Vite dev server           |
| `pnpm test:unit`     | Run unit tests (Vitest, watch mode) |
| `pnpm test:unit:run` | Run unit tests once (CI mode)       |
| `pnpm type-check`    | TypeScript type-check only          |
| `pnpm lint`          | Lint (oxlint + ESLint)              |
| `pnpm format`        | Format (oxfmt)                      |
| `pnpm build`         | Type-check + production build       |
| `pnpm docs:dev`      | Start the VitePress docs dev server |

> [!tip]
> Run `pnpm check` (lint + format) before committing. Lefthook pre-commit
> hooks will catch most issues, but it's faster to fix them yourself.

## Code conventions

These are non-negotiable — PRs that violate them will be asked to change:

- **TypeScript strict** — no `any`, no unnecessary `as` casts.
- **ESM-only** — no CommonJS, no `require()`.
- **Zero runtime dependencies** — everything goes in `devDependencies`.
  The published package has **no** `dependencies`.
- **No throw on HTTP errors** — 4xx/5xx responses are _returned_ (as
  `FexiosResponse` with `ok: false`), never thrown. Only network-level
  failures (e.g. offline) throw. This is the core design principle.
- **Discriminated union** — `FexiosResponse<D, E>` is discriminated by `ok`.
  Don't break the narrowing.

## Testing conventions

- **Deterministic tests** — stub `fetch` (via `vi.stubGlobal` or similar).
  No real network calls, no `sleep()`, no flaky timing.
- **`test()` over `it()`** — project preference.
- **Fixtures** — use inline or local fixture data, not external files.
- **Coverage** — aim to cover the behavior you're changing. If you add a
  branch, test both sides.

## Commit messages

We use [gitmoji](https://gitmoji.dev) with a scope:

```
<emoji> (scope): imperative message

Optional body explaining why, if not obvious.
```

- `<emoji>` — a single Unicode gitmoji (e.g. `✨`, `🐛`, `♻️`, `📝`, `🧪`).
- `(scope)` — the part of the codebase affected (e.g. `api`, `types`,
  `docs`, `build`, `deps`, `tests`).
- Message — imperative, lowercase, < 72 chars, no trailing period.
- **Language** — header and body are **always in English**.

Examples:

```
✨ (api): add timeout option to request
🐛 (types): fix FexiosResponse narrowing on error branch
📝 (docs): clarify credentials modifier behavior
```

## Pull request process

1. Fork the repo and create a feature branch from `develop`.
2. Make your changes. Keep them focused — one concern per PR.
3. Run the full check suite locally:
   ```sh
   pnpm type-check && pnpm lint && pnpm test:unit:run
   ```
4. Open a PR against `develop` with a clear description of what and why.
5. Address review feedback promptly.

> [!note]
> Breaking changes to the public API (anything exported from `src/index.ts`
> or `types/index.d.ts`) require discussion before implementation. Open an
> issue first if you're unsure.

## License

By contributing, you agree that your contributions will be licensed under
the [GNU Lesser General Public License v3.0](LICENSE) (or any later version).
