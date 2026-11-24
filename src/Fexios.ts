import { FexiosResponseImpl } from '@/FexiosResponse.ts'
import type { ApiException, ExceptionMessageType, FexiosOptions, FexiosRequestOptions, FexiosResponse } from '#/index'

type FexiosMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export class Fexios {
  readonly #baseUrl: string
  readonly #headers: HeadersInit
  readonly #timeout: number | undefined

  #isTextData: boolean = false
  #withCredentials: boolean = false

  constructor(options: FexiosOptions = {}) {
    this.#baseUrl = options.baseUrl || ''
    this.#headers = options.headers || {}
    this.#timeout = options.timeout
  }

  get credentials(): this {
    this.#withCredentials = true
    this.#isTextData = false
    return this
  }

  get text(): this {
    this.#isTextData = true
    this.#withCredentials = false
    return this
  }

  async get<D, E extends ExceptionMessageType = string>(
    url: string,
    options?: FexiosRequestOptions
  ): Promise<FexiosResponse<D, E>> {
    return this.#getResponse<D, E>(await fetch(this.#getUrl(url), this.#getOptions('GET', options)))
  }

  async post<D, E extends ExceptionMessageType = string>(
    url: string,
    body: unknown,
    options?: FexiosRequestOptions
  ): Promise<FexiosResponse<D, E>> {
    return this.#getResponse<D, E>(await fetch(this.#getUrl(url), this.#getOptions('POST', options, body)))
  }

  async patch<D, E extends ExceptionMessageType = string>(
    url: string,
    body: unknown,
    options?: FexiosRequestOptions
  ): Promise<FexiosResponse<D, E>> {
    return this.#getResponse<D, E>(await fetch(this.#getUrl(url), this.#getOptions('PATCH', options, body)))
  }

  async put<D, E extends ExceptionMessageType = string>(
    url: string,
    body: unknown,
    options?: FexiosRequestOptions
  ): Promise<FexiosResponse<D, E>> {
    return this.#getResponse<D, E>(await fetch(this.#getUrl(url), this.#getOptions('PUT', options, body)))
  }

  async delete<D, E extends ExceptionMessageType = string>(
    url: string,
    options?: FexiosRequestOptions
  ): Promise<FexiosResponse<D, E>> {
    return this.#getResponse<D, E>(await fetch(this.#getUrl(url), this.#getOptions('DELETE', options)))
  }

  #getOptions(method: FexiosMethods, options?: FexiosRequestOptions, body?: unknown) {
    const { timeout, ...rest } = options ?? {}
    const requestOptions: RequestInit = {
      ...rest,
      headers: {
        ...(method === 'GET' || method === 'DELETE' ? {} : { 'Content-Type': 'application/json' }),
        ...this.#headers,
        ...rest.headers,
      },
      method,
    }

    if (['POST', 'PUT', 'PATCH'].includes(method)) requestOptions.body = JSON.stringify(body ?? {})
    if (this.#withCredentials) requestOptions.credentials = 'include'

    const effectiveTimeout = timeout ?? this.#timeout
    if (effectiveTimeout != null) {
      requestOptions.signal = rest.signal
        ? AbortSignal.any([AbortSignal.timeout(effectiveTimeout), rest.signal])
        : AbortSignal.timeout(effectiveTimeout)
    }

    return requestOptions
  }

  #reset(): void {
    this.#withCredentials = false
    this.#isTextData = false
  }

  async #getResponse<D, E extends ExceptionMessageType = string>(r: Response): Promise<FexiosResponse<D, E>> {
    let data: D | ApiException<E> | null = null
    if (r.status !== 204) {
      const text = await r.text()
      if (text !== '') {
        data = this.#isTextData ? (text as unknown as D) : (JSON.parse(text) as D)
      }
    }

    const response = new FexiosResponseImpl<D, E>(data, r)
    this.#reset()
    return response as FexiosResponse<D, E>
  }

  #getUrl(url: string): string {
    return url.startsWith('http://') || url.startsWith('https://') ? url : this.#baseUrl + url
  }
}
