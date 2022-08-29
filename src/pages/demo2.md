## Chat App Demo

## Part 1 - Setup & Connections

### Scaffolding

scaffold nest pieces

```bash title=./server
nest g service chat
nest g gateway chat
```

scaffold ng pieces

```bash title=./client
ng g service chat
```

### Nest

#### Create ChatService

update chat service:

```ts title=./server/src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  users: Record<string, string> = {};

  identify(user: string, clientId: string) {
    this.users[user] = clientId;
  }

  disconnect(clientId: string) {
    //look up user by clientId:
    const users = Object.keys(this.users);
    let userToRemove = '';
    users.forEach((user) => {
      if (this.users[user] === clientId) {
        userToRemove = user;
        return;
      }
    });
    if (userToRemove) {
      delete this.users[userToRemove];
    }
    return userToRemove;
  }
}
```

#### Update ChatGateway

update `@WebsockeGateway` to use cors:

```ts title=./server/src/echo.gateway.ts
@WebSocketGateway({ namespace: 'chat', cors: true })
```

remove `handleMessage`

inject chatService

```ts title=./server/src/echo.gateway.ts
constructor(private chatService: ChatService) {}
```

add `identify`/`disconnect` handlers

```ts title=./server/src/echo.gateway.ts
@SubscribeMessage('identify')
async handleIdentify(client: Socket, user: string) {
  this.chatService.identify(user, client.id);
}

@SubscribeMessage('disconnect')
async handleDisconnect(client: Socket) {
  this.chatService.disconnect(client.id);
}
```

### Angular

#### Create ChatService

update chat service to following:

```ts title=./client/src/app/chat.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

export interface ChatAppData {
  connected: boolean;
  user: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private connected$ = new BehaviorSubject(false);
  private user$ = new BehaviorSubject('');

  constructor() {}

  getChatAppData(): Observable<ChatAppData> {
    const data = combineLatest([this.connected$, this.user$]).pipe(
      map((value) => {
        const [connected, user] = value;
        return {
          connected,
          user,
        };
      })
    );
    return data;
  }
}
```

add members:

```ts title=./client/src/app/chat.service.ts
private url = 'http://localhost:3000/chat';
private client: Socket;
```

update constructor

```ts title=./client/src/app/chat.service.ts
constructor() {
    this.client = io(this.url, { autoConnect: false });

    this.client.on('connect', () => {
      this.client.emit('identify', this.user$.value);
      this.connected$.next(true);
    });
    this.client.on('disconnect', () => {
      this.connected$.next(false);
    });

    const user = localStorage.getItem('user') || '';
    if (user) {
      this.connect(user);
    }
  }
```

add `connect`/`disconnect` methods

```ts title=./client/src/app/chat.service.ts
connect(user: string) {
  if (this.client.connected) {
    return;
  }
  localStorage.setItem('user', user);
  this.user$.next(user);
  this.client.connect();
}

disconnect() {
  localStorage.removeItem('user');
  this.client.disconnect();
  this.user$.next('');
}
```

#### Update AppComponent

add `chatAddData$` member:

```ts title=./client/src/app/app.component.ts
chatAppData$!: Observable<ChatAppData>;
```

update ctor:

```ts title=./client/src/app/app.component.ts
constructor(private chatService: ChatService) {}
```

add `ngOnInit`/`connect`/`disconnect` methods

```ts title=./client/src/app/app.component.ts
ngOnInit(): void {
  //highlight-next-line
  this.chatAppData$ = this.chatService.getChatAppData();
}

//highlight-start
connect() {
  if (this.user) {
    this.chatService.connect(this.user);
  }
}

disconnect() {
  this.user = '';
  this.chatService.disconnect();
}
//highlight-end
```

#### Update Template

update `ng-container`

```html title=./client/src/app/app.component.html
<ng-container *ngIf="chatAppData$ | async as data"></ng-container>
```

update div

```html title=./client/src/app/app.component.html
<div *ngIf="data.connected; else login"></div>
```

update hard coded user

```html title=./client/src/app/app.component.html
<div class="user">Welcome {{ data.user }}, Room room</div>
```

## Part 2 - Joining Rooms

### Nest

#### Update ChatService

add interfaces

```ts title=./server/src/chat/chat.service.ts
export interface Message {
  user: string;
  content: string;
}

export interface ChatRoom {
  users: string[];
  messages: Message[];
}
```

store chatroom data

```ts title=./server/src/chat/chat.service.ts
chatRooms: Record<string, ChatRoom> = {
  General: { users: [], messages: [] },
  Angular: { users: [], messages: [] },
  NestJS: { users: [], messages: [] },
};
```

add `joinRoom`/`leaveRoom` methods

```ts title=./server/src/chat/chat.service.ts
joinRoom(room: string, user: string) {
  this.chatRooms[room].users.push(user);
  // sort the users alphabetically
  this.chatRooms[room].users.sort((a, b) => {
    return a.toLowerCase() >= b.toLowerCase() ? 1 : -1;
  });
}

leaveRoom(room: string, user: string) {
  this.chatRooms[room].users = this.chatRooms[room].users.filter(
    (u) => u !== user,
  );
}
```

add `getChatRoom`/`getChatRooms` methods

```ts title=./server/src/chat/chat.service.ts
getChatRoom(room: string) {
  return this.chatRooms[room];
}

getChatRooms() {
  const keys = Object.keys(this.chatRooms);
  return keys;
}
```

remove users from room upon disconnection (right underneath
`delete this.users[userToRemove]`)

```ts title=./server/src/chat/chat.service.ts
// remove user from any joined rooms
const rooms = Object.keys(this.chatRooms);
rooms.forEach((room) => {
  this.leaveRoom(room, userToRemove);
});
```

#### Update ChatGateway

return rooms after identify (right underneath `this.chatService.indentify()`

```ts title=./server/src/chat.gateway.ts
return this.chatService.getChatRooms();
```

add `joinRoom`/`leaveRoom` handlers

```ts title=./server/src/chat.gateway.ts
@SubscribeMessage('joinRoom')
handleJoinRoom(client: Socket, data: { user: string; room: string }) {
  this.chatService.joinRoom(data.room, data.user);
  client.join(data.room);
  client.to(data.room).emit('userJoined', data.user);
  return this.chatService.getChatRoom(data.room);
}

@SubscribeMessage('leaveRoom')
handleLeaveRoom(client: Socket, data: { user: string; room: string }) {
  this.chatService.leaveRoom(data.room, data.user);
  client.leave(data.room);
  client.to(data.room).emit('userLeft', data.user);
}
```

update `handleDisconnect` method (replace contents)

```ts title=./server/src/chat.gateway.ts
const user = this.chatService.disconnect(client.id);
client.broadcast.emit('userLeft', user);
```

### Angular

#### Update ChatService

```ts title=./client/src/app/chat.service.ts
export interface Message {
  user: string;
  content: string;
}

export interface ChatRoom {
  users: string[];
  messages: Message[];
}
```

update `ChatAppData` interface

```ts title=./client/src/app/chat.service.ts
export interface ChatAppData {
  //highlight-next-line
  activeRoom: string;
  //highlight-next-line
  chatRoom: ChatRoom;
  connected: boolean;
  //highlight-next-line
  rooms: string[];
  user: string;
}
```

add new observables after `$users` var

```ts title=./client/src/app/chat.service.ts
private activeRoom$ = new BehaviorSubject('General');
private chatRoom$ = new BehaviorSubject<ChatRoom>({
  users: [],
  messages: [],
});
private rooms$ = new BehaviorSubject<string[]>([]);
```

replace `getChatAppData` with:

```ts title=./client/src/app/chat.service.ts
getChatAppData(): Observable<ChatAppData> {
  const data = combineLatest([
    //highlight-next-line
    this.activeRoom$,
    //highlight-next-line
    this.chatRoom$,
    this.connected$,
    //highlight-next-line
    this.rooms$,
    this.user$,
  ]).pipe(
    map((value) => {
      //highlight-next-line
      const [activeRoom, chatRoom, connected, rooms, user] = value;
      return {
        //highlight-next-line
        activeRoom,
        //highlight-next-line
        chatRoom,
        connected,
        //highlight-next-line
        rooms,
        user,
      };
    })
  );
  return data;
}
```

replace `identify` emit in the `connect` callback in the ctor:

```ts title=./client/src/app/chat.service.ts
this.client.emit('identify', this.user$.value, (rooms: string[]) => {
  this.rooms$.next(rooms);
});
```

add new event listeners after the others in the ctor

```ts title=./client/src/app/chat.service.ts
this.client.on('userJoined', (user: string) => {
  const chatRoom = this.chatRoom$.value;
  if (chatRoom) {
    chatRoom.users.push(user);
    // Sort the users alphabetically
    chatRoom.users.sort((a, b) => {
      return a.toLowerCase() >= b.toLowerCase() ? 1 : -1;
    });
    this.chatRoom$.next(chatRoom);
  }
});
this.client.on('userLeft', (user: string) => {
  const chatRoom = this.chatRoom$.value;
  if (chatRoom) {
    chatRoom.users = chatRoom.users.filter((u) => u !== user);
    this.chatRoom$.next(chatRoom);
  }
});
```

add methods to `joinRoom`/`leaveRoom`/`switchRoom`

```ts title=./client/src/app/chat.service.ts
private joinRoom(room: string) {
  this.client.emit(
    'joinRoom',
    { user: this.user$.value, room },
    (chatRoom: ChatRoom) => {
      this.chatRoom$.next(chatRoom);
    }
  );
}

private leaveRoom(room: string) {
  this.client.emit('leaveRoom', { user: this.user$.value, room });
}

switchRoom(room: string) {
  const activeRoom = this.activeRoom$.value;
  this.leaveRoom(activeRoom);
  this.joinRoom(room);
  this.activeRoom$.next(room);
}
```

add call to `joinRoom` in `connect` method (after `client.connect`)

```ts title=./client/src/app/chat.service.ts
this.joinRoom(this.activeRoom$.value);
```

add call to `leaveRoom` in `disconnect` method (before call to
`this.client.disconnect`)

```ts title=./client/src/app/chat.service.ts
this.leaveRoom(this.activeRoom$.value);
```

#### Update AppComponent

add `switchRoom` method

```ts title=./client/src/app/app.component.ts
switchRoom(room: string) {
  this.chatService.switchRoom(room);
}
```

#### Update Template

around line 7, update room list

```html title=./client/src/app/app.component.html
<ul>
  <li
    [ngClass]="{ active: data.activeRoom === room }"
    (click)="switchRoom(room)"
    *ngFor="let room of data.rooms"
  >
    {{ room }}
  </li>
</ul>
```

update user list around line 20

```html title=./client/src/app/app.component.html
<ul>
  <li *ngFor="let user of data.chatRoom.users">{{ user }}</li>
</ul>
```

update welcome section with real room name around line 30

```html title=./client/src/app/app.component.html
<div class="user">Welcome {{ user }}, Room {{ data.activeRoom }}</div>
```

```ts
//joining
socket.join('angular');
//send message to room
{socket|server}.to('angular').emit('message', 'hello ng peeps!');
//leaving
socket.leave('angular');
```
