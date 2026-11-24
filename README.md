# Fexios

> A tiny, type-safe AJAX client built on top of the native `fetch` API.

Fexios wraps `fetch` with a small, ergonomic API: a base URL, default headers,
fluent modifiers for credentials and text responses, and fully typed responses
with first-class error handling. No magic, no throw-on-error — just predictable,
type-safe HTTP.

**[Full documentation →](./docs)**

## Features

- **Native `fetch`** — no XHR, no polyfills. Works in modern browsers and Node ≥ 22.
- **Type-safe responses** — `FexiosResponse<D, E>` unions the success and error shapes.
- **No throw on error** — HTTP errors are returned, not thrown. You stay in control.
- **Fluent modifiers** — `.credentials` and `.text` chain cleanly.
- **Default headers** — set once, applied to every request.
- **Timeout & abort** — per-request `timeout` and `signal` for cancellation.
- **ESM-only** — modern, tree-shakeable, zero runtime dependencies.

## Installation

```bash
npm install @giildo/fexios
# or
yarn add @giildo/fexios
# or
pnpm add @giildo/fexios
```

> [!NOTE]
> Fexios requires **Node.js ≥ 22** and a runtime with native `fetch` support.

## Quick start

```ts
import { Fexios } from '@giildo/fexios'

const fexios = new Fexios({
  baseUrl: 'https://api.example.com',
  headers: { 'X-App': 'my-app' },
})

const users = await fexios.get<User[]>('/users')

if (users.ok) {
  console.log(users.data) // User[]
} else {
  console.log(users.data) // ApiException
}
```

## API overview

### Constructor

```ts
new Fexios(options?: FexiosOptions)
```

| Option    | Type          | Description                             | Default |
| --------- | ------------- | --------------------------------------- | ------- |
| `baseUrl` | `string`      | Base URL prepended to relative paths    | `''`    |
| `headers` | `HeadersInit` | Default headers sent with every request | `{}`    |

### Methods

| Method   | Signature                          | Body |
| -------- | ---------------------------------- | ---- |
| `get`    | `get<D, E>(url, options?)`         | —    |
| `post`   | `post<D, E>(url, body, options?)`  | JSON |
| `patch`  | `patch<D, E>(url, body, options?)` | JSON |
| `put`    | `put<D, E>(url, body, options?)`   | JSON |
| `delete` | `delete<D, E>(url, options?)`      | —    |

Every method accepts the standard
[`RequestInit`](https://developer.mozilla.org/en-US/docs/Web/API/Request/RequestInit)
as its last argument. The `method` and, for `post`/`patch`/`put`, the `body` are
managed by Fexios.

### Fluent modifiers

| Modifier       | Effect                                                |
| -------------- | ----------------------------------------------------- |
| `.credentials` | Send cookies / credentials (`credentials: 'include'`) |
| `.text`        | Return the body as a `string` instead of parsed JSON  |

```ts
const res = await fexios.credentials.text.get('/raw')
```

### Response

Every method resolves to a `FexiosResponse<D, E>`:

```ts
interface FexiosResponse<D, E> {
  data: D | ApiException<E> | null
  headers: Record<string, string>
  ok: boolean
  response: { code: number; message: string }
  status: Status
  statusText: StatusText
}
```

Use `ok` to discriminate between success and error:

```ts
const res = await fexios.get<User>('/users/42')

if (res.ok) {
  const user = res.data // User
} else {
  const err = res.data // ApiException
  console.log(err.status, err.message)
}
```

> [!WARNING]
> Fexios never throws on HTTP errors (4xx/5xx). It resolves with `ok: false`
> and the error payload in `data`. Always check `ok` before using `data`.

## Documentation

The full documentation — installation, configuration, request options, error
handling, and the complete API reference — lives in the
[docs site](./docs).

## License

Released under the [MIT License](https://opensource.org/license/mit).
