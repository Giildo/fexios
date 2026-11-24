# Requests

Fexios exposes one method per HTTP verb:

| Method   | Signature                          | Body |
| -------- | ---------------------------------- | ---- |
| `get`    | `get<D, E>(url, options?)`         | —    |
| `post`   | `post<D, E>(url, body, options?)`  | JSON |
| `patch`  | `patch<D, E>(url, body, options?)` | JSON |
| `put`    | `put<D, E>(url, body, options?)`   | JSON |
| `delete` | `delete<D, E>(url, options?)`      | —    |

All methods return `Promise<FexiosResponse<D, E>>`.

- `D` — the type of the response body on success.
- `E` — the type of the exception message on error (defaults to `string`).

## Body handling

For `post`, `patch` and `put`, the body is serialized with
`JSON.stringify(body ?? {})`. A `null`/`undefined` body becomes `{}`. The
`Content-Type` header is set to `application/json` by default.

```ts
await fexios.post('/items', { name: 'Widget' })
// body sent: '{"name":"Widget"}'
```

`get` and `delete` do not send a body.

## `RequestInit` options

Every method accepts the standard
[`RequestInit`](https://developer.mozilla.org/en-US/docs/Web/API/Request/RequestInit)
as its last argument. The `method` and, for `post`/`patch`/`put`, the `body` are
managed by Fexios — you only pass the rest.

| Option           | Type                                                                                                                                                                               | Default       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `cache`          | `"default" \| "force-cache" \| "no-cache" \| "no-store" \| "only-if-cached" \| "reload"`                                                                                           | `default`     |
| `credentials`    | `"include" \| "omit" \| "same-origin"`                                                                                                                                             | `same-origin` |
| `headers`        | `[string, string][] \| Record<string, string> \| Headers`                                                                                                                          | `{}`          |
| `integrity`      | `string`                                                                                                                                                                           | `null`        |
| `keepalive`      | `boolean`                                                                                                                                                                          | `false`       |
| `mode`           | `"cors" \| "navigate" \| "no-cors" \| "same-origin"`                                                                                                                               | `cors`        |
| `priority`       | `"high" \| "low" \| "medium"`                                                                                                                                                      | `medium`      |
| `redirect`       | `"error" \| "follow" \| "manual"`                                                                                                                                                  | `follow`      |
| `referrer`       | `string`                                                                                                                                                                           | `""`          |
| `referrerPolicy` | `"no-referrer" \| "no-referrer-when-downgrade" \| "origin" \| "origin-when-cross-origin" \| "same-origin" \| "strict-origin" \| "strict-origin-when-cross-origin" \| "unsafe-url"` | `no-referrer` |
| `signal`         | `AbortSignal \| null`                                                                                                                                                              | `null`        |

> [!NOTE]
> `credentials` can be set per request here, or globally for one request via the
> fluent [`.credentials`](/guide/credentials) modifier.

## Examples

### GET

```ts
const users = await fexios.get<User[]>('/users')
```

### POST

```ts
const created = await fexios.post<User, string>('/users', {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
})
```

### PATCH

```ts
await fexios.patch<User, string>('/users/1', { name: 'Ada L.' })
```

### PUT

```ts
await fexios.put<User, string>('/users/1', {
  id: 1,
  name: 'Ada Lovelace',
  email: 'ada@example.com',
})
```

### DELETE

```ts
await fexios.delete<null, string>('/users/1')
```

### Aborting a request

```ts
const controller = new AbortController()

const res = await fexios.get('/slow', { signal: controller.signal })

// later
controller.abort()
```
