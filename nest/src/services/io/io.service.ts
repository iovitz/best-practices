import { IncomingHttpHeaders } from 'node:http'
import { Injectable } from '@nestjs/common'
import * as superagent from 'superagent'

@Injectable()
export class IoService {
  private client = superagent

  post(url: string, body: Record<string, unknown>, header: IncomingHttpHeaders, type: 'post' | 'put' | 'patch' | 'delete' = 'post') {
    return this.client[type](url).send(body).set(header)
  }

  patch(url: string, body: Record<string, unknown>, header: IncomingHttpHeaders) {
    return this.post(url, body, header, 'patch')
  }

  put(url: string, body: Record<string, unknown>, header: IncomingHttpHeaders) {
    return this.post(url, body, header, 'put')
  }

  delete(url: string, body: Record<string, unknown>, header: IncomingHttpHeaders) {
    return this.post(url, body, header, 'delete')
  }
}
