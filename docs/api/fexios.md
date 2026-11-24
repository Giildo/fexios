# `Fexios`

The main class. Import it from the package root:

```ts
import { Fexios } from '@giildo/fexios'
```

## Constructor

```ts
new Fexios(options?: FexiosOptions)
```

| Parameter | Type            | Description             |
| --------- | --------------- | ----------------------- |
| `options` | `FexiosOptions` | Optional configuration. |

```ts
interface FexiosOptions {
  baseUrl?: string
  headers?: HeadersInit
}
```

## Properties

### `credentials`

```ts
readonly credentials: this
```

A one-shot modifier that sets `credentials: 'include'` on the next request.
Returns `this` for chaining. The flag is reset after the request.

```ts
await fexios.credentials.get('/me')
```

### `text`

```ts
readonly text: this
```

A one-shot modifier that returns the next response body as a `string` instead
of parsed JSON. Returns `this` for chaining. The flag is reset after the
request.

```ts
await fexios.text.get('/raw')
```

## Methods

All methods return `Promise<FexiosResponse<D, E>>`.

- `D` — the type of the response body on success.
- `E` — the type of the exception message on error (defaults to `string`).

### `get`

```ts
get<D, E extends ExceptionMessageType = string>(
  url: string,
  options?: RequestInit
): Promise<FexiosResponse<D, E>>
```

### `post`

```ts
post<D, E extends ExceptionMessageType = string>(
  url: string,
  body: unknown,
  options?: RequestInit
): Promise<FexiosResponse<D, E>>
```

The `body` is serialized with `JSON.stringify(body ?? {})`.

### `patch`

```ts
patch<D, E extends ExceptionMessageType = string>(
  url: string,
  body: unknown,
  options?: RequestInit
): Promise<FexiosResponse<D, E>>
```

The `body` is serialized with `JSON.stringify(body ?? {})`.

### `put`

```ts
put<D, E extends ExceptionMessageType = string>(
  url: string,
  body: unknown,
  options?: RequestInit
): Promise<FexiosResponse<D, E>>
```

The `body` is serialized with `JSON.stringify(body ?? {})`.

### `delete`

```ts
delete<D, E extends ExceptionMessageType = string>(
  url: string,
  options?: RequestInit
): Promise<FexiosResponse<D, E>>
```

## Related

- [Response](/api/response) — the `FexiosResponse` shape.
- [Types](/api/types) — `ApiException`, `Status`, `StatusText`, and more.
