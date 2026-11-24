# Quick start

## Create an instance

```ts
import { Fexios } from '@giildo/fexios'

const fexios = new Fexios({
  baseUrl: 'https://api.example.com',
  headers: { 'X-App': 'my-app' },
})
```

## Make a request

```ts
const users = await fexios.get<User[]>('/users')
```

The URL is relative to `baseUrl`, so this calls
`https://api.example.com/users`.

## Handle the response

```ts
if (users.ok) {
  console.log(users.data) // User[]
} else {
  console.log(users.data.status) // e.g. 404
  console.log(users.data.message) // the error payload
}
```

## Send a body

`post`, `patch` and `put` take a body that is serialized to JSON automatically:

```ts
const created = await fexios.post<User, string>('/users', {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
})

if (created.ok) {
  console.log(created.data) // User
}
```

## A complete example

```ts
import { Fexios } from '@giildo/fexios'

interface User {
  id: number
  name: string
  email: string
}

const fexios = new Fexios({
  baseUrl: 'https://api.example.com',
  headers: { 'X-App': 'my-app' },
})

async function main() {
  const list = await fexios.get<User[]>('/users')

  if (!list.ok) {
    console.error('Failed to load users', list.data)
    return
  }

  console.log(list.data.map((u) => u.name))
}

main()
```

## Next steps

- [Configuration](/guide/configuration)
- [Requests](/guide/requests)
- [Error handling](/guide/errors)
