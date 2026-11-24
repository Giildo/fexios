# Configuration

The `Fexios` constructor takes a single optional `FexiosOptions` object.

```ts
interface FexiosOptions {
  baseUrl?: string
  headers?: HeadersInit
}
```

| Option    | Type          | Description                             | Default |
| --------- | ------------- | --------------------------------------- | ------- |
| `baseUrl` | `string`      | Base URL prepended to relative paths    | `''`    |
| `headers` | `HeadersInit` | Default headers sent with every request | `{}`    |

Both options are optional — `new Fexios()` is valid.

## `baseUrl`

`baseUrl` is prepended to every **relative** URL. If a URL already starts with
`http://` or `https://`, it is used as-is and `baseUrl` is ignored for that
request.

```ts
const fexios = new Fexios({ baseUrl: 'https://api.example.com' })

await fexios.get('/users') // https://api.example.com/users
await fexios.get('https://other.tld/users') // https://other.tld/users
```

> [!WARNING]
> `baseUrl` is concatenated directly with the path (`baseUrl + url`). Make sure
> your `baseUrl` ends without a trailing slash and your paths start with one,
> e.g. `baseUrl: 'https://api.example.com'` + `'/users'`.

## `headers`

`headers` are merged into every request. They follow a clear precedence order —
later sources win:

1. `Content-Type: application/json` (set by Fexios)
2. Instance `headers` (from the constructor)
3. Per-request `headers` (from the `RequestInit` argument)

```ts
const fexios = new Fexios({
  headers: { 'X-App': 'my-app', 'Content-Type': 'text/plain' },
})

// 'X-App' is kept, 'Content-Type' is overridden by the per-request value
await fexios.get('/users', { headers: { 'Content-Type': 'application/xml' } })
```

> [!NOTE]
> `HeadersInit` accepts a `Headers` instance, an array of `[string, string]`
> pairs, or a `Record<string, string>`.
