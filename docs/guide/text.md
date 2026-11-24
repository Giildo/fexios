# Text responses

By default, Fexios parses the response body as **JSON**. When the endpoint
returns plain text (or any non-JSON payload), use the fluent `.text` modifier
to get the raw body as a `string`.

```ts
const raw = await fexios.text.get('/raw')

if (raw.ok) {
  console.log(raw.data) // string
}
```

## How it works

`.text` is a read-only getter that flips an internal flag and returns `this`,
so it can be chained before a method call:

```ts
fexios.text.get('/export')
```

The flag is **reset after each request**, so it only applies to the next call:

```ts
await fexios.text.get('/raw') // data is a string
await fexios.get('/json') // data is parsed JSON
```

## When to use it

- The endpoint returns `text/plain`, `text/csv`, or another non-JSON format.
- You want the raw body string and will parse it yourself.
- The response is empty or not valid JSON.

> [!NOTE]
> For a `204 No Content` response, `data` is `null` regardless of whether
> `.text` is used — there is no body to read.

## Combining with `.credentials`

The modifiers stack in any order:

```ts
const res = await fexios.credentials.text.get('/private/raw')
```
