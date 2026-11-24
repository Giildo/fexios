import { afterEach, beforeEach, describe, expect, expectTypeOf, test, vi, type Mock } from 'vitest'
import { Fexios } from '@/Fexios'
import { FexiosResponseImpl } from '@/FexiosResponse'
import type { ApiException } from '#/index'

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>

interface User {
  id: number
  name: string
}

describe('FexiosResponse', () => {
  let fetchMock: Mock<FetchFn>
  let fexios: Fexios

  beforeEach(() => {
    fetchMock = vi.fn<FetchFn>()
    vi.stubGlobal('fetch', fetchMock)
    fexios = new Fexios({ baseUrl: 'https://api.example.com' })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('conserve les headers de réponse en string', () => {
    const r = new Response(null, {
      status: 200,
      headers: { 'X-Content-Length': '1234', 'X-Request-Id': 'abc-123' },
    })

    const res = new FexiosResponseImpl<Record<string, unknown>>({}, r)

    expect(res.headers['x-content-length']).toBe('1234')
    expect(res.headers['x-request-id']).toBe('abc-123')
  })

  test('narrows data vers D quand ok est true et vers ApiException<E> quand ok est false', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 200, statusText: 'OK' }))

    const res = await fexios.get<User, string>('/users/1')

    expect(res.ok).toBe(true)

    if (res.ok) {
      expectTypeOf(res.data).toEqualTypeOf<User>()
    } else {
      expectTypeOf(res.data).toEqualTypeOf<ApiException<string>>()
    }
  })
})
