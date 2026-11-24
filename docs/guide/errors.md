# Error handling

Fexios **never throws** on an HTTP error status (4xx/5xx). A failed request
resolves to a `FexiosResponse` with `ok: false` and the error payload in
`data`. This keeps the control flow explicit — you decide what an error means
for your app.

## The response shape

The result of every method is a discriminated union:

```ts
type FexiosResponse<D, E> = FexiosResponseOK<D> | FexiosResponseError<E>
```

- `FexiosResponseOK<D>` — `ok: true`, `data: D`.
- `FexiosResponseError<E>` — `ok: false`, `data: ApiException<E>`.

Narrowing on `ok` gives you the exact type of `data` in each branch.

## Checking `ok`

```ts
const res = await fexios.get<User>('/users/42')

if (res.ok) {
  const user = res.data // User
} else {
  const err = res.data // ApiException
  console.log(err.status) // 404
  console.log(err.message) // the error payload
}
```

## The `ApiException` shape

On error, `data` is typed as `ApiException<E>`:

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

> [!NOTE]
> `ApiException` describes the **shape of the error body your server returns**.
> Fexios does not construct it — it parses whatever the server sends and types
> it as `ApiException<E>` when `ok` is `false`.

## The `E` generic: exception message shape

The second generic `E` (default `string`) controls the type of
`ApiException.message`. It accepts any of these shapes:

```ts
type ExceptionMessageType = string | Record<string, string> | Array<string> | Array<Record<string, string>>
```

Pick the one that matches your API's error format:

### A single string

```ts
const res = await fexios.get<User, string>('/users/42')

if (!res.ok) {
  console.log(res.data.message) // "User not found"
}
```

### A record of fields

```ts
const res = await fexios.get<User, Record<string, string>>('/users/42')

if (!res.ok) {
  console.log(res.data.message.email) // "already taken"
}
```

### An array of messages

```ts
const res = await fexios.post<Item, Array<string>>('/items', item)

if (!res.ok) {
  res.data.message.forEach((msg) => console.log(msg))
}
```

### An array of records

```ts
const res = await fexios.post<Item, Array<Record<string, string>>>('/items', item)

if (!res.ok) {
  res.data.message.forEach((field) => console.log(field.name, field.reason))
}
```

## Best practices

- **Always check `ok`** before using `data` on a success path.
- **Type the error** with the `E` generic so `data.message` is precise.
- **Handle `204`** — a `204 No Content` response has `data: null` and `ok: true`.
- **Don't wrap in `try/catch` for HTTP errors** — they are not thrown. Use
  `try/catch` only for network-level failures (e.g. the request itself fails).

> [!TIP]
> A small helper keeps call sites tidy:
>
> ```ts
> function unwrap<D, E extends ExceptionMessageType>(res: FexiosResponse<D, E>): D {
>   if (!res.ok) throw new Error(res.data.message as string)
>   return res.data
> }
>
> const user = unwrap(await fexios.get<User>('/users/42'))
> ```
