export type Status100 = 100 | 101 | 102 | 103
export type Status200 = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
export type Status300 = 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308
export type Status400 =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
export type Status500 = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511
export type Status = Status100 | Status200 | Status300 | Status400 | Status500

export type StatusText100 = 'Continue' | 'Switching Protocols' | 'Processing' | 'Early Hints'
export type StatusText200 =
  | 'OK'
  | 'Created'
  | 'Accepted'
  | 'Non-Authoritative Information'
  | 'No Content'
  | 'Reset Content'
  | 'Partial Content'
  | 'Multi-Status'
  | 'Already Reported'
  | 'IM Used'
export type StatusText300 =
  | 'Multiple Choices'
  | 'Moved Permanently'
  | 'Found'
  | 'See Other'
  | 'Not Modified'
  | 'Use Proxy'
  | 'Switch Proxy'
  | 'Temporary Redirect'
  | 'Permanent Redirect'
export type StatusText400 =
  | 'Bad Request'
  | 'Unauthorized'
  | 'Payment Required'
  | 'Forbidden'
  | 'Not Found'
  | 'Method Not Allowed'
  | 'Not Acceptable'
  | 'Proxy Authentication Required'
  | 'Request Timeout'
  | 'Conflict'
  | 'Gone'
  | 'Length Required'
  | 'Precondition Failed'
  | 'Payload Too Large'
  | 'URI Too Long'
  | 'Unsupported Media Type'
  | 'Range Not Satisfiable'
  | 'Expectation Failed'
  | "I'm a teapot"
  | 'Misdirected Request'
  | 'Unprocessable Entity'
  | 'Locked'
  | 'Failed Dependency'
  | 'Too Early'
  | 'Upgrade Required'
  | 'Precondition Required'
  | 'Too Many Requests'
  | 'Request Header Fields Too Large'
  | 'Unavailable For Legal Reasons'
export type StatusText500 =
  | 'Internal Server Error'
  | 'Not Implemented'
  | 'Bad Gateway'
  | 'Service Unavailable'
  | 'Gateway Timeout'
  | 'HTTP Version Not Supported'
  | 'Variant Also Negotiates'
  | 'Insufficient Storage'
  | 'Loop Detected'
  | 'Not Extended'
  | 'Network Authentication Required'
export type StatusText = StatusText100 | StatusText200 | StatusText300 | StatusText400 | StatusText500

export type FexiosMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface FexiosOptions {
  baseUrl?: string
}

export type FexiosResponseHeaders = Record<string, string | number>

export class FexiosResponse<D> {
  data: D
  headers: FexiosResponseHeaders
  response: Response
  status: Status
  statusText: StatusText
}

export class Fexios {
  credentials: this

  constructor(options: FexiosOptions)

  get<D>(url: string, options?: RequestInit): Promise<FexiosResponse<D>>

  post<D>(url: string, data: unknown, options?: RequestInit): Promise<FexiosResponse<D>>

  patch<D>(url: string, data: unknown, options?: RequestInit): Promise<FexiosResponse<D>>

  put<D>(url: string, data: unknown, options?: RequestInit): Promise<FexiosResponse<D>>

  delete<D>(url: string, options?: RequestInit): Promise<FexiosResponse<D>>
}
