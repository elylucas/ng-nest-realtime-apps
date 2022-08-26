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
  chatAppData$!: Observable<ChatAppData>;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatAppData$ = this.chatService.getChatAppData();
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

  sendMessage() {
    if (this.message) {
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }

  switchRoom(room: string) {
    this.chatService.switchRoom(room);
  }
}
