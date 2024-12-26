import type { FexiosMethods, FexiosOptions } from '#/index'
import { FexiosResponse } from '@/FexiosResponse.ts'

export class Fexios {
  #baseUrl: string = ''
  #withCredentials: boolean = false

  constructor(options: FexiosOptions = {}) {
    this.#baseUrl = options.baseUrl || ''
  }

  get credentials(): this {
    this.#withCredentials = true
    return this
  }

  async get<T>(url: string, options?: RequestInit): Promise<FexiosResponse<T>> {
    return this.#getResponse<T>(await fetch(this.#getUrl(url), this.#getOptions('POST', options)))
  }

  async post<T>(url: string, body: unknown, options?: RequestInit): Promise<FexiosResponse<T>> {
    return this.#getResponse<T>(await fetch(this.#getUrl(url), this.#getOptions('POST', options, body)))
  }

  async patch<T>(url: string, body: unknown, options?: RequestInit): Promise<FexiosResponse<T>> {
    return this.#getResponse<T>(await fetch(this.#getUrl(url), this.#getOptions('PATCH', options, body)))
  }

  async put<T>(url: string, body: unknown, options?: RequestInit): Promise<FexiosResponse<T>> {
    return this.#getResponse<T>(await fetch(this.#getUrl(url), this.#getOptions('PUT', options, body)))
  }

  async delete<T>(url: string, options?: RequestInit): Promise<FexiosResponse<T>> {
    return this.#getResponse<T>(await fetch(this.#getUrl(url), this.#getOptions('DELETE', options)))
  }

  #getOptions(method: FexiosMethods, options?: RequestInit, body?: unknown) {
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
      method,
    }

    if (['POST', 'PUT', 'PATCH'].includes(method)) requestOptions.body = JSON.stringify(body ?? {})
    if (this.#withCredentials) requestOptions.credentials = 'include'

    return requestOptions
  }

  async #getResponse<T>(r: Response): Promise<FexiosResponse<T>> {
    const response = new FexiosResponse(await r.json(), r)
    this.#withCredentials = false
    return response
  }

  #getUrl(url: string): string {
    return url.startsWith('http://') || url.startsWith('https://') ? url : this.#baseUrl + url
  }
}
