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
  chatMessages: ChatMessage[] = [];
  messageToSend = '';
  constructor(private chatService: ChatService) {
    this.hubConnection = this.chatService.getConnection();
    this.hubConnection.on('responseFormClient', (message: string) => {
      this.chatMessages.push({ isIncoming: true, message: message });
    });
  }




  SendMessageToUser(): void {
    if (this.messageToSend != null && this.messageToSend != undefined && this.messageToSend.trim() != '') {

      this.hubConnection.invoke('SendMessageToUser', this.messageToSend).then(() => {
        this.chatMessages.push({ isIncoming: false, message: this.messageToSend });
        this.messageToSend = '';
      })
        .catch(err => console.error(err));
    }
  }

  ngOnDestroy(): void {
    this.chatService.closeConnection('responseFormClient');
  }
}

export interface ChatMessage {
  isIncoming: boolean;
  message: string;
}
