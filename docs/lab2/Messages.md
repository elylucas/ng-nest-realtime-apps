---
sidebar_position: 4
---

# Messaging

## Nest

### Chat Service

add addMessage to class:

```ts
addMessage(room: string, message: Message) {
  this.chatRooms[room].messages.push(message);
}
```

### Chat Gateway

add Socket server reference:

```ts
@WebSocketServer() server: Server;
```

> `@WebSocketServer` is imported from '@nestjs/websockets' and `Server` is
> imported from 'socket.io'

add handleMessageToServer method:

```ts
@SubscribeMessage('messageToServer')
handleMessageToServer(
  @MessageBody()
  data: {
    room: string;
    message: Message;
  },
) {
  this.chatService.addMessage(data.room, data.message);
  this.server.to(data.room).emit('messageToClient', data.message);
}
```

point out MessageBody, this.server.to (sending to room)

## Angular

### Chat Service

listen for messageToClient event in ctor below other listeners:

```ts
this.client.on('messageToClient', (message: Message) => {
  const chatRoom = this.$chatRoom.value;
  if (chatRoom) {
    chatRoom.messages.push(message);
    this.$chatRoom.next(chatRoom);
  }
});
```

add sendMessage method to class:

```ts
sendMessage(content: string) {
  const message = {
    user: this.$user.value,
    content
  };
  this.client.emit('messageToServer', {
    room: this.$activeRoom.value,
    message,
  });
}
```

### app component

replace empty sendMessage with new one:

```ts
sendMessage() {
  if (this.message) {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }
}
```

### app component html

replace the div tag with the class 'messages' with:

```html
<div
  *ngIf="data.chatRoom.messages.length > 0; else noMessages"
  class="messages"
>
  <ul>
    <li *ngFor="let message of data.chatRoom.messages">
      [{{ message.user }}]: {{ message.content }}
    </li>
  </ul>
</div>
```
