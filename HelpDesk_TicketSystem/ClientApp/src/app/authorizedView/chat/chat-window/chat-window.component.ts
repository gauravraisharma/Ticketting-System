import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  constructor(private socket: Socket) { }

  ngOnInit() {
    this.socket.connect();
    this.socket.emit('join', { room: 'your-room-name' });

    this.socket.on('message', (data) => {
      console.log('Received message:', data);
    });
  }

  sendMessage() {
    this.socket.emit('message', { text: 'Hello from Angular' });
  }
}
