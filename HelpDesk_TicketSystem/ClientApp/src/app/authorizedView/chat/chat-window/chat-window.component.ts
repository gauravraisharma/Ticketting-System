import { Component } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  socket: any;
  message: string = '';
  messages: string[] = [];
  
  ngOnInit(): void {
    // Connect to the Socket.IO server
   // this.socket = io('http://localhost:3000');

    // Listen for 'chat message' events
    this.socket.on('chat message', (msg: string) => {
      this.messages.push(msg);
    });
  }

  sendMessage() {
    if (this.message) {
      // Emit a 'chat message' event to the server
      this.socket.emit('chat message', this.message);
      this.message = '';
    }
  }
}
