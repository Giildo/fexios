# Response

Every method resolves to a `FexiosResponse<D, E>`, a discriminated union of the
success and error shapes.

```ts
type FexiosResponse<D, E extends ExceptionMessageType = string> = FexiosResponseOK<D> | FexiosResponseError<E>
```

## `FexiosResponseOK<D>`

The success shape.

```ts
interface FexiosResponseOK<D> extends BasicFexiosResponse<D> {
  data: D
  ok: true
}
```

## `FexiosResponseError<E>`

The error shape.

```ts
interface FexiosResponseError<E extends ExceptionMessageType> extends BasicFexiosResponse<null> {
  data: ApiException<E>
  ok: false
}
```

## `BasicFexiosResponse<D>`

The common fields shared by both shapes.

```ts
interface BasicFexiosResponse<D> {
  data: D | ApiException | null
  headers: FexiosResponseHeaders
  ok: boolean
  response: FexiosServerResponse
  status: Status
  statusText: StatusText
}
```

| Field        | Type                        | Description                              |
| ------------ | --------------------------- | ---------------------------------------- |
| `data`       | `D \| ApiException \| null` | The parsed body, or `null` for `204`.    |
| `headers`    | `FexiosResponseHeaders`     | Response headers as a plain object.      |
| `ok`         | `boolean`                   | `true` for 2xx, `false` otherwise.       |
| `response`   | `FexiosServerResponse`      | Normalized `{ code, message }` envelope. |
| `status`     | `Status`                    | The numeric HTTP status code.            |
| `statusText` | `StatusText`                | The HTTP status reason phrase.           |

## `FexiosServerResponse`

A normalized view of the server response.

```ts
interface FexiosServerResponse {
  code: HttpStatusCode
  message: string
}
```

| Field     | Type             | Description                    |
| --------- | ---------------- | ------------------------------ |
| `code`    | `HttpStatusCode` | The status code (200/201/204). |
| `message` | `string`         | The status reason phrase.      |

## `FexiosResponseHeaders`

Response headers as a plain record. Numeric header values are coerced to
`number`.

```ts
type FexiosResponseHeaders = Record<string, string | number>
```

```ts
const res = await fexios.get('/users')
res.headers['Content-Type'] // 'application/json'
res.headers['X-Request-Id'] // 12345 (number)
```

## Narrowing example

```ts
const res = await fexios.get<User>('/users/42')

if (res.ok) {
  const user = res.data // User
} else {
  const err = res.data // ApiException
  console.log(err.status, err.message)
}
```

## Related

- [Types](/api/types) — `ApiException`, `Status`, `StatusText`, and more.
- [Error handling](/guide/errors) — how to work with the error shape.
