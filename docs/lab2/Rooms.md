---
sidebar_position: 3
---

# Joining and Leaving Rooms

## Nest

### Update Chat Service

Add ChatRoom interface at top:

```ts
export interface ChatRoom {
  users: string[];
  messages: Message[];
}
```

Add a record to hold chat rooms in class below users member:

```ts
chatRooms: Record<string, ChatRoom> = {
  General: { users: [], messages: [] },
  Angular: { users: [], messages: [] },
  NestJS: { users: [], messages: [] },
};
```

Add joinRoom/leaveRoom/getChatRoom/getRooms methods to class:

```ts
joinRoom(room: string, user: string) {
  this.chatRooms[room].users.push(user);
  this.chatRooms[room].users.sort((a, b) => {
    return a.toLowerCase() >= b.toLowerCase() ? 1 : -1;
  });
}

leaveRoom(room: string, user: string) {
  this.chatRooms[room].users = this.chatRooms[room].users.filter(
    (u) => u !== user,
  );
}

getChatRoom(room: string) {
  return this.chatRooms[room];
}

getRooms() {
  const keys = Object.keys(this.chatRooms);
  return keys;
}
```

update disconnect to remove users from rooms and return the user

```ts
disconnect(clientId: string) {
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
    //highlight-start
    // remove user from any joined rooms
    const rooms = Object.keys(this.chatRooms);
    rooms.forEach((room) => {
      this.leaveRoom(room, userToRemove);
    });
    //highlight-end
  }
  //highlight-next-line
  return userToRemove;
}
```

### Update chat gateway

When client identifies, return list of rooms as some initial data it will need:

```ts
@SubscribeMessage('identify')
async handleIdentify(client: Socket, user: string) {
  this.chatService.identify(user, client.id);
  //highlight-next-line
  return this.chatService.getRooms();
}
```

add handleJoinRoom/handleLeaveRoom methods:

```ts
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

update disconnect method to emit user left room

```ts
@SubscribeMessage('disconnect')
async handleDisconnect(client: Socket) {
  //highlight-start
  const user = this.chatService.disconnect(client.id);
  client.broadcast.emit('userLeft', user);
  //highlight-end
}
```

## Angular

### Update chat service

add Message & ChatRoom interface to top:

```ts
export interface Message {
  user: string;
  content: string;
}

export interface ChatRoom {
  users: string[];
  messages: Message[];
}
```

add activeRoom, chatRoom, and rooms to ChatApp data interface:

```ts
export interface ChatAppData {
  //highlight-next-line
  activeRoom: string;
  //highlight-next-line
  chatRoom: ChatRoom;
  connected: boolean;
  //highlight-next-line
  rooms: string[];
}
```

add $activeRoom, $chatRoom and $rooms members

```ts
private $activeRoom = new BehaviorSubject('General');
private $chatRoom = new BehaviorSubject<ChatRoom>({
  users: [],
  messages: [],
});
private $rooms = new BehaviorSubject<string[]>([]);
```

update `getChatAppData` to include new data:

```ts
getChatAppData(): Observable<ChatAppData> {
  const data = combineLatest([
    this.$activeRoom,
    this.$chatRoom,
    this.$connected,
    this.$rooms,
    this.$user,
  ]).pipe(
    map((value) => {
      const [activeRoom, chatRoom, connected, rooms, user] = value;
      return {
        activeRoom,
        chatRoom,
        connected,
        rooms,
        user,
      };
    })
  );
  return data;
}
```

add callback to identify method to get the list of rooms and set them

```ts
this.client.on('connect', () => {
  //highlight-start
  this.client.emit('identify', this.$user.value, (rooms: string[]) => {
    this.$rooms.next(rooms);
  });
  //highlight-end
  this.$connected.next(true);
});
```

add userJoined/userLeft socket listeners in constructor:

```ts
this.client.on('userJoined', (user: string) => {
  const chatRoom = this.$chatRoom.value;
  if (chatRoom) {
    chatRoom.users.push(user);
    chatRoom.users.sort((a, b) => {
      return a.toLowerCase() >= b.toLowerCase() ? 1 : -1;
    });
    this.$chatRoom.next(chatRoom);
  }
});
this.client.on('userLeft', (user: string) => {
  const chatRoom = this.$chatRoom.value;
  if (chatRoom) {
    chatRoom.users = chatRoom.users.filter((u) => u !== user);
    this.$chatRoom.next(chatRoom);
  }
});
```

add joinRoom/leaveRoom/switchRoom methods:

```ts
joinRoom(room: string) {
  this.client.emit(
    'joinRoom',
    { user: this.$user.value, room },
    (chatRoom: ChatRoom) => {
      this.$chatRoom.next(chatRoom);
    }
  );
}

leaveRoom(room: string) {
  this.client.emit('leaveRoom', { user: this.$user.value, room });
}

switchRoom(room: string) {
  const activeRoom = this.$activeRoom.value;
  this.leaveRoom(activeRoom);
  this.joinRoom(room);
  this.$activeRoom.next(room);
}
```

in connect, add a call to join room

```ts
connect(user: string) {
  if (this.client.connected) {
    return;
  }
  localStorage.setItem('user', user);
  this.$user.next(user);
  this.client.connect();
  //highlight-next-line
  this.joinRoom(this.$activeRoom.value);
}
```

in disconnect, add call to leave room:

```ts
disconnect() {
  localStorage.removeItem('user');
  //highlight-next-line
  this.leaveRoom(this.$activeRoom.value);
  this.client.disconnect();
  this.$user.next('');
}
```

### Update app component

add switchRoom method:

```ts
switchRoom(room: string) {
  this.chatService.switchRoom(room);
}
```

### update app component html

switch out roooms li with new one:

```html
<li
  [ngClass]="{ active: data.activeRoom === room }"
  (click)="switchRoom(room)"
  *ngFor="let room of data.rooms"
>
  {{ room }}
</li>
```

replace hard coded room name with activeroom:

```html
<div class="user">Welcome {{ user }}, Room {{ data.activeRoom }}</div>
```

replace users li with new one:

```html
<li *ngFor="let user of data.chatRoom.users">{{ user }}</li>
```

now you can switch between rooms and see users entering/leaving rooms
