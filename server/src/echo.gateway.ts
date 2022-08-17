import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EchoGateway {
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): string {
    return payload;
  }
}
