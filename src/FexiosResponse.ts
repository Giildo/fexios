import type { FexiosResponse as FexiosResponseInterface, FexiosResponseHeaders, Status, StatusText } from '#/index'
import type { ApiException } from '@jojotique/server'

export class FexiosResponse<D> implements FexiosResponseInterface<D> {
  readonly data: D | ApiException
  readonly headers: FexiosResponseHeaders
  readonly ok: boolean
  readonly response: Response
  readonly status: Status
  readonly statusText: StatusText

  constructor(data: D | ApiException, r: Response) {
    this.data = data
    this.headers = {}
    this.ok = r.ok
    this.response = { ...r }
    this.status = r.status as Status
    this.statusText = r.statusText as StatusText

    for (const [key, value] of r.headers.entries()) {
      this.headers[key] = Number.isNaN(Number(value)) ? value : Number(value)
    }
  }
}
