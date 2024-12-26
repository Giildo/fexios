import type { FexiosResponse as FexiosResponseInterface, FexiosResponseHeaders, Status, StatusText } from '#/index'

export class FexiosResponse<D> implements FexiosResponseInterface<D> {
  readonly data: D
  readonly headers: FexiosResponseHeaders
  readonly response: Response
  readonly status: Status
  readonly statusText: StatusText

  constructor(data: D, r: Response) {
    this.data = data
    this.headers = {}
    this.response = r
    this.status = r.status as Status
    this.statusText = r.statusText as StatusText

    for (const [key, value] of r.headers.entries()) {
      this.headers[key] = Number.isNaN(Number(value)) ? value : Number(value)
    }
  }
}
