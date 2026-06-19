import type {
  ApiException,
  BasicFexiosResponse,
  ExceptionMessageType,
  FexiosResponseHeaders,
  FexiosServerResponse,
  HttpStatusCode,
  Status,
  StatusText,
} from '#/index'

export class FexiosResponseImpl<D, E extends ExceptionMessageType = string> implements BasicFexiosResponse<D> {
  readonly data: D | ApiException<E> | null
  readonly headers: FexiosResponseHeaders
  readonly ok: boolean
  readonly response: FexiosServerResponse
  readonly status: Status
  readonly statusText: StatusText

  constructor(data: D | ApiException<E> | null, r: Response) {
    this.data = data
    this.headers = {}
    this.ok = r.ok
    this.response = {
      code: r.status as HttpStatusCode,
      message: r.statusText,
    }
    this.status = r.status as Status
    this.statusText = r.statusText as StatusText

    for (const [key, value] of r.headers.entries()) {
      this.headers[key] = Number.isNaN(Number(value)) ? value : Number(value)
    }
  }
}
