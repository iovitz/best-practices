import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Tracer } from 'src/shared/tracer/tracer'

@WebSocketGateway({
  path: '/ws/v1',
})
export class SocketV1Gateway
implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {
  private readonly tracer = new Tracer(SocketV1Gateway.name)
  constructor() {}

  @WebSocketServer() server: Server
  users = 0

  async handleConnection(client: Socket) {
    this.tracer.info('@Socket connect', { id: client.id })
  }

  async handleDisconnect(client: Socket) {
    this.tracer.info('@Socket disconnect', { id: client.id })
  }

  @SubscribeMessage('events')
  async handleEvent(client: Socket, data: string) {
    return data
  }

  @SubscribeMessage('hello')
  async handleMessage(client: Socket, payload: string) {
    this.tracer.info('socket hello', {
      payload,
    })

    client.emit('hello', 'server hello payload')
  }
}
