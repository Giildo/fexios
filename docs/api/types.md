# Types

The full set of types exported by Fexios.

## `FexiosOptions`

Constructor options.

```ts
interface FexiosOptions {
  baseUrl?: string
  headers?: HeadersInit
  timeout?: number
}
```

| Field     | Type          | Description                             |
| --------- | ------------- | --------------------------------------- |
| `baseUrl` | `string`      | Base URL prepended to relative paths    |
| `headers` | `HeadersInit` | Default headers sent with every request |
| `timeout` | `number`      | Default request timeout in ms           |

## `FexiosRequestOptions`

Per-request options. It is the standard `RequestInit` extended with a `timeout`.

```ts
type FexiosRequestOptions = RequestInit & { timeout?: number }
```

- `timeout` (ms) — abort the request after this many milliseconds.
- `signal` — standard `RequestInit` field, for manual abort.
- All other `RequestInit` fields are passed through to `fetch`.

> [!NOTE]
> A per-request `timeout` overrides the constructor default. If both `timeout`
> and `signal` are provided, they are combined — the request aborts on whichever
> fires first.

## `ApiException<E>`

The shape of an error body when `ok` is `false`.

```ts
interface ApiException<E extends ExceptionMessageType = ExceptionMessageType> {
  codeError: string
  message: E
  status: HttpStatusCodeError
}
```

| Field       | Type                  | Description                                 |
| ----------- | --------------------- | ------------------------------------------- |
| `codeError` | `string`              | A machine-readable error code               |
| `message`   | `E`                   | The error message (shape controlled by `E`) |
| `status`    | `HttpStatusCodeError` | The HTTP status (400/401/403/404/409/500)   |

## `ExceptionMessageType`

The allowed shapes for `ApiException.message`.

```ts
type ExceptionMessageType = string | Record<string, string> | Array<string> | Array<Record<string, string>>
```

## HTTP status codes

### `HttpStatusCodeError`

Error codes used by `ApiException.status`.

```ts
type HttpStatusCodeError = 400 | 401 | 403 | 404 | 409 | 500
```

### `Status`

The full numeric status union, used by `FexiosResponse.status`.

```ts
type Status = Status100 | Status200 | Status300 | Status400 | Status500
```

| Type        | Values                                                                      |
| ----------- | --------------------------------------------------------------------------- |
| `Status100` | `100 \| 101 \| 102 \| 103`                                                  |
| `Status200` | `200 \| 201 \| 202 \| 203 \| 204 \| 205 \| 206 \| 207 \| 208 \| 226`        |
| `Status300` | `300 \| 301 \| 302 \| 303 \| 304 \| 305 \| 306 \| 307 \| 308`               |
| `Status400` | `400` … `451` (see below)                                                   |
| `Status500` | `500 \| 501 \| 502 \| 503 \| 504 \| 505 \| 506 \| 507 \| 508 \| 510 \| 511` |

`Status400` covers: `400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411,
412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431,
451`.

### `StatusText`

The full reason-phrase union, used by `FexiosResponse.statusText`.

```ts
type StatusText = StatusText100 | StatusText200 | StatusText300 | StatusText400 | StatusText500
```

#### `StatusText100`

```
'Continue' | 'Switching Protocols' | 'Processing' | 'Early Hints'
```

#### `StatusText200`

```
'OK' | 'Created' | 'Accepted' | 'Non-Authoritative Information' | 'No Content'
| 'Reset Content' | 'Partial Content' | 'Multi-Status' | 'Already Reported'
| 'IM Used'
```

#### `StatusText300`

```
'Multiple Choices' | 'Moved Permanently' | 'Found' | 'See Other'
| 'Not Modified' | 'Use Proxy' | 'Switch Proxy' | 'Temporary Redirect'
| 'Permanent Redirect'
```

#### `StatusText400`

```
'Bad Request' | 'Unauthorized' | 'Payment Required' | 'Forbidden' | 'Not Found'
| 'Method Not Allowed' | 'Not Acceptable' | 'Proxy Authentication Required'
| 'Request Timeout' | 'Conflict' | 'Gone' | 'Length Required'
| 'Precondition Failed' | 'Payload Too Large' | 'URI Too Long'
| 'Unsupported Media Type' | 'Range Not Satisfiable' | 'Expectation Failed'
| "I'm a teapot" | 'Misdirected Request' | 'Unprocessable Entity' | 'Locked'
| 'Failed Dependency' | 'Too Early' | 'Upgrade Required'
| 'Precondition Required' | 'Too Many Requests'
| 'Request Header Fields Too Large' | 'Unavailable For Legal Reasons'
```

#### `StatusText500`

```
'Internal Server Error' | 'Not Implemented' | 'Bad Gateway'
| 'Service Unavailable' | 'Gateway Timeout' | 'HTTP Version Not Supported'
| 'Variant Also Negotiates' | 'Insufficient Storage' | 'Loop Detected'
| 'Not Extended' | 'Network Authentication Required'
```

> [!NOTE]
> The full list of status codes and reason phrases follows the
> [HTTP Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
> specification.

## Related

- [Response](/api/response) — how these types appear on a response.
- [Error handling](/guide/errors) — using `ApiException` and `E`.
