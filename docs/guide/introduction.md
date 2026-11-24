# Introduction

Fexios is a small, type-safe AJAX client built directly on top of the native
[`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) API. It adds
just enough structure to make HTTP calls predictable and type-safe, without
hiding what `fetch` actually does.

Think of it as a thin, opinionated layer over `fetch`: you get a base URL,
default headers, a few fluent modifiers, and a response object that TypeScript
understands end to end.

## Why Fexios

Plain `fetch` is powerful but leaves a lot to you:

- It resolves on **any** HTTP status, so a `404` looks the same as a `200`
  unless you check `response.ok`.
- It returns an opaque `Response` — you have to call `.json()`, `.text()`, etc.
  yourself.
- It has no notion of a base URL or shared headers.

Fexios fills those gaps with a minimal surface:

| Concern            | Plain `fetch`           | Fexios                                |
| ------------------ | ----------------------- | ------------------------------------- |
| Base URL           | Manual string concat    | `baseUrl` option                      |
| Shared headers     | Repeated per request    | `headers` option                      |
| Body serialization | Manual `JSON.stringify` | Automatic for `post`/`patch`/`put`    |
| Response shape     | Opaque `Response`       | Typed `FexiosResponse<D, E>`          |
| Error handling     | You check `ok` yourself | Typed `ok` + `ApiException` in `data` |

## Core design decisions

### No throw on error

Fexios **never throws** on an HTTP error status (4xx/5xx). A failed request
resolves to a `FexiosResponse` with `ok: false` and the error payload in
`data`. This keeps the control flow explicit and predictable — you decide what
an error means for your app.

```ts
const res = await fexios.get<User>('/users/42')

if (!res.ok) {
  // res.data is an ApiException here
  return
}

// res.data is a User here
```

### Typed responses

Every method is generic over the response shape `D` and the exception message
shape `E`. The result is a discriminated union:

```ts
type FexiosResponse<D, E> = FexiosResponseOK<D> | FexiosResponseError<E>
```

Narrowing on `ok` gives you the exact type of `data` in each branch.

### Fluent modifiers

Two read-only getters act as one-shot modifiers that apply to the **next**
request only, then reset themselves:

- `.credentials` — send cookies / credentials.
- `.text` — return the body as a `string` instead of parsed JSON.

```ts
const res = await fexios.credentials.text.get('/raw')
```

## Next steps

- [Installation](/guide/installation)
- [Quick start](/guide/quick-start)
