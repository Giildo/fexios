import type { FexiosMethods, FexiosOptions } from '#/index'
import { FexiosResponse } from '@/FexiosResponse.ts'
import type { ApiException, ExceptionMessageType } from '@jojotique/server'

export class Fexios {
  #baseUrl: string = ''
  #isTextData: boolean = false
  #withCredentials: boolean = false

  constructor(options: FexiosOptions = {}) {
    this.#baseUrl = options.baseUrl || ''
  }

  get credentials(): this {
    this.#withCredentials = true
    return this
  }

  get text(): this {
    this.#isTextData = true
    return this
  }

  async get<D, E extends ExceptionMessageType = string>(
    url: string,
    options?: RequestInit,
  ): Promise<FexiosResponse<D, E>> {
    return this.#getResponse<D, E>(await fetch(this.#getUrl(url), this.#getOptions('GET', options)))
  }

  async post<D, E extends ExceptionMessageType = string>(
    url: string,
    body: unknown,
    options?: RequestInit,
  ): Promise<FexiosResponse<D, E>> {
    return this.#getResponse<D, E>(await fetch(this.#getUrl(url), this.#getOptions('POST', options, body)))
  }

  async patch<D, E extends ExceptionMessageType = string>(
    url: string,
    body: unknown,
    options?: RequestInit,
  ): Promise<FexiosResponse<D, E>> {
    return this.#getResponse<D, E>(await fetch(this.#getUrl(url), this.#getOptions('PATCH', options, body)))
  }

  async put<D, E extends ExceptionMessageType = string>(
    url: string,
    body: unknown,
    options?: RequestInit,
  ): Promise<FexiosResponse<D, E>> {
    return this.#getResponse<D, E>(await fetch(this.#getUrl(url), this.#getOptions('PUT', options, body)))
  }

  async delete<D, E extends ExceptionMessageType = string>(
    url: string,
    options?: RequestInit,
  ): Promise<FexiosResponse<D, E>> {
    return this.#getResponse<D, E>(await fetch(this.#getUrl(url), this.#getOptions('DELETE', options)))
  }

  #getOptions(method: FexiosMethods, options?: RequestInit, body?: unknown) {
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      method,
    }

    if (['POST', 'PUT', 'PATCH'].includes(method)) requestOptions.body = JSON.stringify(body ?? {})
    if (this.#withCredentials) requestOptions.credentials = 'include'

    return requestOptions
  }

  #reset(): void {
    this.#withCredentials = false
    this.#isTextData = false
  }

  async #getResponse<D, E extends ExceptionMessageType = string>(r: Response): Promise<FexiosResponse<D, E>> {
    let data: D | ApiException<E> | null = null
    if (r.status !== 204) {
      data = this.#isTextData ? ((await r.text()) as unknown as D) : await r.json()
    }

    const response = new FexiosResponse<D, E>(data, r)
    this.#reset()
    return response
  }

  #getUrl(url: string): string {
    return url.startsWith('http://') || url.startsWith('https://') ? url : this.#baseUrl + url
  }
}
