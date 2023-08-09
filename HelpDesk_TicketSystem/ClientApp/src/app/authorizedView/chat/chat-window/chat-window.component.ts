import { Component, OnDestroy } from '@angular/core';
import { ChatService } from '../../../../services/ChatService/chat.service';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnDestroy {

  private hubConnection: signalR.HubConnection;
  messages: string[] = [];
  user: string = 'admin';
  message: string = 'message to users ';

  constructor(private chatService: ChatService) {
    this.hubConnection = this.chatService.getConnection();

    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      console.log(`Received message from ${user}: ${message}`);
    });
  }
   

  

  sendMessage(): void {
    this.hubConnection.invoke('SendMessageToUser', this.message)
      .catch(err => console.error(err));
  }

  ngOnDestroy(): void {
    this.chatService.closeConnection('ReceiveMessage');
  }
}
