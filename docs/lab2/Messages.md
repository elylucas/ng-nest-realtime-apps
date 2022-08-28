---
sidebar_position: 4
---

# Sending Messages

What's a chat app that can't send messages? Not much. So let's fix that.

## Nest

### ChatService

#### Add Messages to Chat Room

We already have the infrastructure to store chat rooms and
messages in the `chatRooms` variable. We only need to add a
method to the service that will add a message to the appropriate chat room. Add
this method to the `ChatService` class:

```ts title=./server/src/chat/chat.service.ts
addMessage(room: string, message: Message) {
  this.chatRooms[room].messages.push(message);
}
```

### ChatGateway

#### Handle Message Events

Add a new event handler to listen for `messageToServer` events:

```ts
@SubscribeMessage('messageToServer')
handleMessageToServer(
  client: Socket,
  data: {
    room: string;
    message: Message;
  },
) {
  this.chatService.addMessage(data.room, data.message);
  client.to(data.room).emit('messageToClient', data.message);
  client.emit('messageToClient', data.message);
}
```

> Message is imported from './chat/chat.service'

To make things a bit easier, we define two different events: `messageToServer`
that gets called when a client sends a message to the server, and
`messageToClient`, when the message is sent out to all the other clients.

This handler listens for `messageToServer`, and adds the new message to the chat
service then broadcasts the message back to the clients with
`messageToClient`.

`client.to()` will send the message to all other clients in the room except for
the current client. Therefore, we send the same message to the current
client with `client.emit()`.

## Angular

### ChatService

#### Add Message Event Listener

In the Angular `ChatService`, we will add a listener for incoming messages. Add
the following in the constructor below the other listeners:

```ts
this.client.on('messageToClient', (message: Message) => {
  const chatRoom = this.chatRoom$.value;
  if (chatRoom) {
    chatRoom.messages.push(message);
    this.chatRoom$.next(chatRoom);
  }
});
```

#### Add sendMessage Method

Next, add the `sendMessage` method, which will emit the `messageToServer` event
and pass along the user's message.

```ts
sendMessage(content: string) {
  const message = {
    user: this.user$.value,
    content
  };
  this.client.emit('messageToServer', {
    room: this.activeRoom$.value,
    message,
  });
}
```

### AppComponent

#### Send Message to Service

Update the current `sendMessage` method that is empty to the following:

```ts
sendMessage() {
  if (this.message) {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }
}
```

This method is bound to the Send button in the UI.

### AppComponent Template

#### Update Messages List

Around line 33, update the div with the class of messages.

Replace:

```html
<div class="messages">
  <ul>
    <li>[user]: message</li>
  </ul>
</div>
```

With:

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

And with that, you should have a fully functioning chat app! Give it a try.


