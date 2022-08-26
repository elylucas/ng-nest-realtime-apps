import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Message {
  user: string;
  content: string;
}

export interface ChatRoom {
  users: string[];
  messages: Message[];
}

export interface ChatAppData {
  activeRoom: string;
  chatRoom: ChatRoom;
  connected: boolean;
  rooms: string[];
  user: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private url = 'http://localhost:3000/chat';
  private client: Socket;
  private connected$ = new BehaviorSubject(false);
  private user$ = new BehaviorSubject('');
  private activeRoom$ = new BehaviorSubject('General');
  private chatRoom$ = new BehaviorSubject<ChatRoom>({
    users: [],
    messages: [],
  });
  private rooms$ = new BehaviorSubject<string[]>([]);

  constructor() {
    this.client = io(this.url, { autoConnect: false });

    this.client.on('connect', () => {
      this.client.emit('identify', this.user$.value, (rooms: string[]) => {
        this.rooms$.next(rooms);
      });
      this.connected$.next(true);
    });
    this.client.on('disconnect', () => {
      this.connected$.next(false);
    });
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
    this.client.on('messageToClient', (message: Message) => {
      const chatRoom = this.chatRoom$.value;
      if (chatRoom) {
        chatRoom.messages.push(message);
        this.chatRoom$.next(chatRoom);
      }
    });

    const user = localStorage.getItem('user') || '';
    if (user) {
      this.connect(user);
    }
  }

  connect(user: string) {
    if (this.client.connected) {
      return;
    }
    localStorage.setItem('user', user);
    this.user$.next(user);
    this.client.connect();
    this.joinRoom(this.activeRoom$.value);
  }

  disconnect() {
    localStorage.removeItem('user');
    this.leaveRoom(this.activeRoom$.value);
    this.client.disconnect();
    this.user$.next('');
  }

  getChatAppData(): Observable<ChatAppData> {
    const data = combineLatest([
      this.activeRoom$,
      this.chatRoom$,
      this.connected$,
      this.rooms$,
      this.user$,
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

  sendMessage(content: string) {
    const message = {
      user: this.user$.value,
      content,
    };
    this.client.emit('messageToServer', {
      room: this.activeRoom$.value,
      message,
    });
  }
}
