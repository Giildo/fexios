import { afterEach, beforeEach, describe, expect, test, vi, type Mock } from 'vitest'
import { Fexios } from '@/Fexios'

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>

interface MakeResponseOptions {
  status?: number
  statusText?: string
  body?: string | null
  headers?: Record<string, string>
}

function makeResponse(options: MakeResponseOptions = {}) {
  const { status = 200, statusText = 'OK', body = null, headers = {} } = options
  const response = new Response(body, { status, statusText, headers })
  response.text = vi.fn<() => Promise<string>>().mockResolvedValue(body ?? '')
  response.json = vi.fn<() => Promise<unknown>>().mockImplementation(async () => JSON.parse(await response.text()))
  return response
}

describe('Fexios', () => {
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

  function lastCall(): [string, RequestInit | undefined] {
    const call = fetchMock.mock.calls.at(-1)
    if (!call) throw new Error("fetch n'a pas été appelé")
    return [call[0], call[1]]
  }

  test('résout un GET 200 avec le corps JSON parsé et les métadonnées de la réponse', async () => {
    const body = { id: 42, name: 'fexios' }
    fetchMock.mockResolvedValue(makeResponse({ body: JSON.stringify(body) }))

    const res = await fexios.get('/users/42')

    expect(res.ok).toBe(true)
    expect(res.data).toEqual(body)
    expect(res.status).toBe(200)
    expect(res.statusText).toBe('OK')
    expect(res.response.code).toBe(200)
    expect(res.response.message).toBe('OK')
  })

  test('série le body en JSON et pose Content-Type sur POST, PUT et PATCH', async () => {
    const body = { title: 'nouveau' }
    fetchMock.mockResolvedValue(makeResponse({ body: '{}' }))

    await fexios.post('/items', body)
    expect(lastCall()).toEqual([
      'https://api.example.com/items',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    ])

    await fexios.put('/items/1', body)
    expect(lastCall()).toEqual([
      'https://api.example.com/items/1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(body),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    ])

    await fexios.patch('/items/1', body)
    expect(lastCall()).toEqual([
      'https://api.example.com/items/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    ])
  })

  test("n'envoie pas de body sur GET et DELETE", async () => {
    fetchMock.mockResolvedValue(makeResponse({ body: '{}' }))

    await fexios.get('/items')
    const [getUrl, getOptions] = lastCall()
    expect(getUrl).toBe('https://api.example.com/items')
    expect(getOptions?.method).toBe('GET')
    expect(getOptions).not.toHaveProperty('body')

    await fexios.delete('/items/1')
    const [deleteUrl, deleteOptions] = lastCall()
    expect(deleteUrl).toBe('https://api.example.com/items/1')
    expect(deleteOptions?.method).toBe('DELETE')
    expect(deleteOptions).not.toHaveProperty('body')
  })

  test('résout un 204 avec data null sans parser le corps', async () => {
    const response = makeResponse({ status: 204, statusText: 'No Content' })
    fetchMock.mockResolvedValue(response)

    const res = await fexios.get('/items/1')

    expect(res.ok).toBe(true)
    expect(res.data).toBeNull()
    expect(res.status).toBe(204)
    expect(res.statusText).toBe('No Content')
    expect(response.json).not.toHaveBeenCalled()
    expect(response.text).not.toHaveBeenCalled()
  })

  test("préfixe l'URL relative par baseUrl et ignore baseUrl pour une URL absolue", async () => {
    fetchMock.mockResolvedValue(makeResponse({ body: '{}' }))

    await fexios.get('/items')
    expect(lastCall()[0]).toBe('https://api.example.com/items')

    await fexios.get('https://autre.example.com/items')
    expect(lastCall()[0]).toBe('https://autre.example.com/items')

    await fexios.get('http://legacy.example.com/items')
    expect(lastCall()[0]).toBe('http://legacy.example.com/items')
  })

  test('pose les headers par défaut sur chaque requête et laisse l\'appel les override', async () => {
    const client = new Fexios({
      baseUrl: 'https://api.example.com',
      headers: { 'X-Token': 'defaut', 'X-Mode': 'lib' },
    })
    fetchMock.mockResolvedValue(makeResponse({ body: '{}' }))

    await client.get('/items')
    expect(lastCall()[1]?.headers).toMatchObject({ 'X-Token': 'defaut', 'X-Mode': 'lib' })

    await client.get('/items', { headers: { 'X-Token': 'appel' } })
    expect(lastCall()[1]?.headers).toMatchObject({ 'X-Token': 'appel', 'X-Mode': 'lib' })
  })

  test('lit le corps via text() quand le modificateur .text est posé', async () => {
    const raw = '<html>brut</html>'
    const response = makeResponse({ body: raw })
    fetchMock.mockResolvedValue(response)

    const res = await fexios.text.get('/page')

    expect(res.ok).toBe(true)
    expect(res.data).toBe(raw)
    expect(response.text).toHaveBeenCalled()
    expect(response.json).not.toHaveBeenCalled()
  })

  test('passe credentials include à fetch quand le modificateur .credentials est posé', async () => {
    fetchMock.mockResolvedValue(makeResponse({ body: '{}' }))

    await fexios.credentials.get('/items')

    expect(lastCall()[1]?.credentials).toBe('include')
  })

  test('ne passe pas credentials à fetch sur une requête banale', async () => {
    fetchMock.mockResolvedValue(makeResponse({ body: '{}' }))

    await fexios.get('/items')

    expect(lastCall()[1]?.credentials).toBeUndefined()
  })

  test('expose les headers de la réponse en conservant les valeurs non numériques en string', async () => {
    fetchMock.mockResolvedValue(
      makeResponse({ body: '{}', headers: { 'X-Powered-By': 'fexios', 'Content-Type': 'application/json' } })
    )

    const res = await fexios.get('/items')

    expect(res.headers['x-powered-by']).toBe('fexios')
    expect(res.headers['content-type']).toBe('application/json')
  })

  test("résout sans throw un 404 avec ok false et le payload d'erreur dans data", async () => {
    const payload = { codeError: 'NOT_FOUND', message: 'Ressource introuvable', status: 404 }
    fetchMock.mockResolvedValue(makeResponse({ status: 404, statusText: 'Not Found', body: JSON.stringify(payload) }))

    const res = await fexios.get('/items/999')

    expect(res.ok).toBe(false)
    expect(res.status).toBe(404)
    expect(res.data).toEqual(payload)
  })

  test("résout sans throw un 500 avec ok false et le payload d'erreur dans data", async () => {
    const payload = { codeError: 'SERVER_ERROR', message: 'Erreur interne', status: 500 }
    fetchMock.mockResolvedValue(
      makeResponse({ status: 500, statusText: 'Internal Server Error', body: JSON.stringify(payload) })
    )

    const res = await fexios.get('/items')

    expect(res.ok).toBe(false)
    expect(res.status).toBe(500)
    expect(res.data).toEqual(payload)
  })

  test('rejette quand fetch refuse (erreur réseau), sans confondre avec une erreur HTTP', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(fexios.get('/items')).rejects.toBeInstanceOf(TypeError)
  })

  test('applique les modificateurs one-shot au prochain appel puis repart propre', async () => {
    fetchMock.mockResolvedValue(makeResponse({ body: '{"id":1}' }))

    const first = await fexios.credentials.text.get('/items')
    expect(lastCall()[1]?.credentials).toBe('include')
    expect(first.data).toBe('{"id":1}')

    const second = await fexios.get('/items')
    expect(lastCall()[1]?.credentials).toBeUndefined()
    expect(second.data).toEqual({ id: 1 })
  })

  test('série le body en {} quand il est undefined ou null sur un POST', async () => {
    fetchMock.mockResolvedValue(makeResponse({ body: '{}' }))

    await fexios.post('/items', undefined)
    expect(lastCall()[1]?.body).toBe('{}')

    await fexios.post('/items', null)
    expect(lastCall()[1]?.body).toBe('{}')
  })

  test("expose le texte brut de l'erreur quand .text est posé sur une réponse 4xx", async () => {
    const raw = 'Not Found — ressource inconnue'
    fetchMock.mockResolvedValue(makeResponse({ status: 404, statusText: 'Not Found', body: raw }))

    const res = await fexios.text.get('/items/999')

    expect(res.ok).toBe(false)
    expect(res.data).toBe(raw)
  })

  test("appelle fetch avec l'URL relative telle quelle quand aucun baseUrl n'est configuré", async () => {
    const client = new Fexios()
    fetchMock.mockResolvedValue(makeResponse({ body: '{}' }))

    await client.get('/items')

    expect(lastCall()[0]).toBe('/items')
  })

  // Limite connue (revue S3nt1n3l 2026-11-24, finding m4) : un 200 à corps vide
  // sans .text fait lever r.json() (SyntaxError) → rejet. Ce test fige le
  // comportement actuel ; à mettre à jour si l'humain corrige le finding.
  test('rejette avec une SyntaxError quand un 200 a un corps vide sans .text', async () => {
    fetchMock.mockResolvedValue(makeResponse({ body: '' }))

    await expect(fexios.get('/items')).rejects.toBeInstanceOf(SyntaxError)
  })

  // Limite connue (revue S3nt1n3l 2026-11-24, finding m2) : accéder au getter
  // .credentials sans appel suivant laisse le flag posé — il s'applique à la
  // requête suivante. Ce test fige le comportement actuel ; à mettre à jour
  // si l'humain corrige le finding.
  test('laisse le flag credentials posé quand le getter est accédé sans appel suivant', async () => {
    fetchMock.mockResolvedValue(makeResponse({ body: '{}' }))

    const client = fexios.credentials

    await client.get('/items')

    expect(lastCall()[1]?.credentials).toBe('include')
  })
})
