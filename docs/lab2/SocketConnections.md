---
sidebar_position: 2
---

# Socket Connections

SocketIO connection events connect/disconnect

To start, we will work on making a connection to the Nest server and identifying
the user with the app.

## Nest

### Chat Service

update chat service to hold users and chatrooms:

```ts title=./server/src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';

export interface Message {
  user: string;
  content: string;
}

@Injectable()
export class ChatService {
  users: Record<string, string> = {};

  identify(user: string, clientId: string) {
    this.users[user] = clientId;
  }

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
    }
  }
}
```

### Chat Gateway

update chat gateway:

```ts title=./server/src/chat.gateway.ts
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChatService } from './chat/chat.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway {
  constructor(private chatService: ChatService) {}

  @SubscribeMessage('identify')
  async handleIdentify(client: Socket, user: string) {
    this.chatService.identify(user, client.id);
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket) {
    this.chatService.disconnect(client.id);
  }
}
```

## Angular

setup chat service:

```ts title=./client/src/app/chat.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface ChatAppData {
  connected: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private url = 'http://localhost:3000/chat';
  private client: Socket;
  private user: string = '';
  private $connected = new BehaviorSubject(false);

  constructor() {
    this.client = io(this.url, { autoConnect: false });

    this.client.on('connect', () => {
      this.client.emit('identify', this.user);
      this.$connected.next(true);
    });
    this.client.on('disconnect', () => {
      this.$connected.next(false);
    });

    this.user = localStorage.getItem('user') || '';
    if (this.user) {
      this.connect(this.user);
    }
  }

  getChatAppData(): Observable<ChatAppData> {
    const data = combineLatest([this.$connected]).pipe(
      map((value) => {
        const [connected] = value;
        return {
          connected,
        };
      })
    );
    return data;
  }

  connect(user: string) {
    if (this.client.connected) {
      return;
    }
    localStorage.setItem('user', user);
    this.user = user;
    this.client.connect();
  }

  disconnect() {
    localStorage.removeItem('user');
    this.client.disconnect();
    this.user = '';
  }
}
```

setup app component:

```ts title=./client/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatAppData, ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  message = '';
  user = '';
  $chatAppData!: Observable<ChatAppData>;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.$chatAppData = this.chatService.getChatAppData();
  }

  connect() {
    if (this.user) {
      this.chatService.connect(this.user);
    }
  }

  disconnect() {
    this.user = '';
    this.chatService.disconnect();
  }

  sendMessage() {}
}
```

### Update app component html

change lines 1 + 2 to use chatAppData top ng-container to 

```html
<ng-container *ngIf="$chatAppData | async as data">
  <div *ngIf="data.connected; else login">
```

update welcome on line 24 to use user variable

```html
<div class="user">Welcome {{ user }}, Room room</div>
```

Run the app, see it work for connecting/disconnecting