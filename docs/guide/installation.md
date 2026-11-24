# Installation

## Requirements

- **Node.js ≥ 22** (or any modern browser with native `fetch`).
- A module system that supports **ESM**. Fexios is ESM-only — there is no
  CommonJS build.

## Package managers

```bash
npm install @giildo/fexios
```

```bash
yarn add @giildo/fexios
```

```bash
pnpm add @giildo/fexios
```

## TypeScript

Fexios ships its own type declarations. No extra setup is needed — the types
are picked up automatically from the package's `exports` map.

```ts
import { Fexios } from '@giildo/fexios'
```

> [!NOTE]
> The package exposes a single entry point (`.`) that resolves to
> `./dist/fexios.js` for `import` and `./dist/index.d.ts` for types.

## Verify the install

```ts
import { Fexios } from '@giildo/fexios'

const fexios = new Fexios({ baseUrl: 'https://api.example.com' })
console.log(typeof fexios.get) // 'function'
```
