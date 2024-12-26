# Fexios

Library for making AJAX calls based on the fetch API.

## Installation

```bash
npm install fexios
# or
yarn add fexios
# or
pnpm add fexios
```

## Usage

```ts
import { Fexios } from '@jojotique/fexios';

const fexios = new Fexios({
  baseUrl: 'https://server.tld',
});
```

### Options

| Option  | Type   | Description               | Default | Required |
|---------|--------|---------------------------|---------|----------|
| baseUrl | string | Base URL for all requests | `''`    | No       |

### Methods

#### Définitions

```ts
interface Fexios {
  get<D>(url: string, options?: RequestInit): Promise<FexiosResponse<D>>

  post<D>(url: string, data: unknown, options?: RequestInit): Promise<FexiosResponse<D>>

  patch<D>(url: string, data: unknown, options?: RequestInit): Promise<FexiosResponse<D>>

  put<D>(url: string, data: unknown, options?: RequestInit): Promise<FexiosResponse<D>>

  delete<D>(url: string, options?: RequestInit): Promise<FexiosResponse<D>>
}
```

#### Exemple

```ts
import { Fexios } from '@jojotique/fexios';

const fexios = new Fexios({
  baseUrl: 'https://server.tld',
});

const response = await fexios.get('/api/users');

console.log(response.data);
```

#### Options

| Option         | Type                                                                                                                                                                      | Default     |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| body           | ReadableStream / Blob / BufferSource / FormData / URLSearchParams / string / null                                                                                         | null        |
| cache          | "default" / "force-cache" / "no-cache" / "no-store" / "only-if-cached" / "reload"                                                                                         | default     |
| credentials    | "include" / "omit" / "same-origin"                                                                                                                                        | same-origin |
| headers        | [string, string][] / Record<string, string> / Headers                                                                                                                     | {}          |
| integrity      | string                                                                                                                                                                    | null        |
| keepalive      | boolean                                                                                                                                                                   | false       |
| mode           | "cors" / "navigate" / "no-cors" / "same-origin"                                                                                                                           | cors        |
| priority       | "high" / "low" / "medium"                                                                                                                                                 | medium      |
| redirect       | "error" / "follow" / "manual"                                                                                                                                             | follow      |
| referrer       | string                                                                                                                                                                    | ""          |
| referrerPolicy | "no-referrer" / "no-referrer-when-downgrade" / "origin" / "origin-when-cross-origin" / "same-origin" / "strict-origin" / "strict-origin-when-cross-origin" / "unsafe-url" | no-referrer |
| signal         | AbortSignal / null                                                                                                                                                        | null        |

> [!WARNING]
> Only the `body` is required for the `post`, `patch` and `put` methods.

#### With credentials

To add credentials to the request, you can use the `credentials` option.

```ts
import { Fexios } from '@jojotique/fexios';

const fexios = new Fexios({
  baseUrl: 'https://server.tld',
});

const response = await fexios.credentials.get('/api/users');

console.log(response.data);
```

### Response

#### Définitions

```ts
interface FexiosResponse<D> {
  data: D
  headers: FexiosResponseHeaders
  response: Response
  status: Status
  statusText: StatusText
}
```

All `Status` & `StatusText` are defined in
the [HTTP Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) documentation.