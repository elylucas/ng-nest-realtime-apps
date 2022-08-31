## Echo Client Demo

## Nest Gateway

```shell title='./server'
nest generate gateway echo
```



update `handleMessage` to add types to params and return payload

```ts title=./server/src/echo.gateway.ts
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class EchoGateway {
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): string {
    return payload;
  }
}
```

## Angular

### AppComponent

- import socket.io-client

```ts title=./client/src/app/app.component.ts
import { io } from 'socket.io-client';
```

create class members

```ts title=./client/src/app/app.component.ts
export class AppComponent {
  message = '';
  returnedResponses: string[] = [];
  socket = io('http://localhost:3000');
}
```

add sendmessage:

```ts title=./client/src/app/app.component.ts
sendMessage() {
  this.socket.emit('message', this.message, (msg: string) => {
    this.returnedResponses.push(msg)
  });
}
```

update template:

```html title=./client/src/app/app.component.html
<div>
  <label
    >Message
    <input type="text" name="messasge" [(ngModel)]="message" />
  </label>
  <button type="button" (click)="sendMessage()">Send</button>
  <ul>
    <li *ngFor="let message of returnedResponses">{{ message }}</li>
  </ul>
</div>
```