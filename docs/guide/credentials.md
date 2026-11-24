# Credentials

By default, `fetch` does **not** send cookies or authentication information
across origins. To include credentials, use the fluent `.credentials` modifier.

```ts
const response = await fexios.credentials.get('/api/users')
```

This sets `credentials: 'include'` on the request.

## How it works

`.credentials` is a read-only getter that flips an internal flag and returns
`this`, so it can be chained before a method call:

```ts
fexios.credentials.get('/me')
```

The flag is **reset after each request**, so it only applies to the next call:

```ts
await fexios.credentials.get('/me') // sends credentials
await fexios.get('/public') // does NOT send credentials
```

> [!WARNING]
> `.credentials` is a one-shot modifier. It does not change the instance
> permanently — each request starts clean.

## Security notes

- `credentials: 'include'` sends cookies for cross-origin requests. The server
  must respond with `Access-Control-Allow-Credentials: true` and a specific
  `Access-Control-Allow-Origin` (not `*`).
- Only enable it when the endpoint actually requires cookies or an
  authentication token carried in a cookie.

## Alternative: per-request option

You can also set `credentials` directly in the `RequestInit` argument:

```ts
await fexios.get('/me', { credentials: 'include' })
```

Both approaches are equivalent; the modifier is just more concise.
