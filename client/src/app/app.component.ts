import { Component } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  message = '';
  returnedResponses: string[] = [];
  client = io('http://localhost:3000');

  constructor() {

  }

  sendMessage() {
    this.client.emit('message', this.message, (msg: string) => {
      this.returnedResponses.push(msg)
    });
  }
}
