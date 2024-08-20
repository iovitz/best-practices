import { Inject, LoggerService } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  path: '/socket/v1',
})
export class SocketV1Gateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @WebSocketServer() server: Server;
  users = 0;

  async handleConnection(client: Socket) {
    this.logger.log(client.id, '开始连接');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(client.id, '取消连接');
  }

  @SubscribeMessage('events')
  async handleEvent(client: Socket, data: string) {
    return data;
  }

  @SubscribeMessage('hello')
  async handleMessage(client: Socket, payload: string) {
    this.logger.log(payload, 'hello');

    client.emit('hello', 'server hello payload');
  }
}
