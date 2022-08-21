# Lab1 - Echo

In this lab we will build the "hello world" of websocket apps, an echo server
that will simply reply back any text that a client sends to it.

To get started, checkout the `lab1-start` branch:

```bash
git checkout lab1-start
```

> To view a completed version of this lab, checkout the `lab1-complete` branch.

## Required Dependencies

This lab is already set up with all the dependencies you will require, so no
need to install anything additional. However, in order to use websockets with
Angular and NestJS in a new app, a few additional dependencies need to be
installed beyond the basic project setup:

- Angular: `socket-io.client`
- NestJS: `@nestjs/platform-socket.io` and `@nestjs/platform-socket.io`

Visit the [NestJS Websocket guide](https://docs.nestjs.com/websockets/gateways)
for more info.

## Nest Gateway

Let's start off by scaffolding a new gateway in the **server** folder:

```shell title='./server'
nest generate gateway echo
```

This will generate a `EchoGateway` class which looks like:

```ts title=./server/src/echo.gateway.ts
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class EchoGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
```

A gateway is a NestJS abstraction around setting up a realtime communication
socket. They are analogous to controllers for API endpoints. They are JavaScript
classes that are decorated with `@WebSocketGateway()`. Under the hood, NestJS is
using either the [socket-io](https://socket.io/) library (which we use in this
course) or the [ws](https://github.com/websockets/ws) library.

The `@SubscribeMessage()` decorator on a method designates that method as the
handler for an incoming message. You pass in the string of the event name to
listen, which the client also designates when sending a message.

The parameters passed into the method are the socket client and any data that
was sent along with the message. To make the gateway "echo" what was sent it,
instead of returning the hard coded "Hello world!" string, we'll return the
payload instead. Update the method to do so:

```ts title=./server/src/echo.gateway.ts
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class EchoGateway {
  @SubscribeMessage('message')
  //highlight-start
  handleMessage(client: Socket, payload: string): string {
    return payload;
  }
  //highlight-end
}
```

We also updated the method signature to provide the proper types we expect
instead of using `any`.

Lastly, we need to enable the websocket to work with clients on other domains by
enabling CORS. To do so, we can pass in the option to the `@WebSocketGateway()`
decorator:

```ts title=./server/src/echo.gateway.ts
@WebSocketGateway({ cors: true })
```

That's it for the server stuff, let's take a look at the client next.

## Angular

We'll do this demo in the main app component. Open up **app.component.ts** and
add the following import at the top:

```ts title=./client/src/app/app.component.ts
import { io } from 'socket.io-client';
```

The `io` object creates new connection to our server and gives us back a client
of type `Socket` that we can use to send messages to the server.

Next, in the `AppComponent` class, we will create a few variables: a `message`
string that will be bound to the text input, a `returnedResponses` array that
will contain the responses from the server, and the socket-io client. We
initialize the client by calling `io` and passing in the URL of the server.

```ts title=./client/src/app/app.component.ts
export class AppComponent {
  message = '';
  returnedResponses: string[] = [];
  client = io('http://localhost:3000');
}
```

If you were to take a look at the app now, open up dev tools and look at the WS
(for websockets) tab. You will see a connection being established:

![Dev Tools WebSocket](/img/dev-tools-websocket.jpg)

Now it's time to send a message across that connection. Back in the app
component, add the following `sendMessage` method to the class:

```ts title=./client/src/app/app.component.ts
sendMessage() {
  this.client.emit('message', this.message, (msg: string) => {
    this.returnedResponses.push(msg)
  });
}
```

The Socket client `emit` method takes the event name ('message' in our case),
the payload of the event, and a callback. Remember when we returned the payload
from `handleMessage()` in the Nest gateway? That response gets passed back to
the callback.

The next step is updating the app component's template to have a input box and
button to send the message. Replace the welcome message in
**app.componenent.html** with the following:

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

Here we have a input that is bound to `message`, a button that calls `sendMessage` when clicked, and a list for each item currently in the `returnResponses` array.

Now the app echo demo should be fully functional. Give it a try!

![Echo Client Running](/img/echo-client-running.jpg)
