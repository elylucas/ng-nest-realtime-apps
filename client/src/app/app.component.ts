import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  connected = true;
  message = '';
  user = '';

  constructor() {}

  connect() {}

  disconnect() {}

  sendMessage() {}
}
