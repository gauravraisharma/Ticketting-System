import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from '../../../services/ChatService/chat.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {
  IsChatBot = true;
  IsUserDataSubmited = true;
  chatMessages = [{
    isIncoming: true,
    message:'message from admin '
  }, {
    isIncoming: false,
    message:'message from user'
    }];
  isLoading = false;
  chatForm = this.fb.group({
    name: ['', [Validators.required]],
    phoneNumber: [''],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
 
  });
  messageToSend: string = '';
  private hubConnection: signalR.HubConnection;

  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private chatService: ChatService) {
    this.hubConnection = this.chatService.getConnection();
    this.hubConnection.on('responseFormAdmin', (message: string) => {
      console.log(`Received message from ${message}`);
    });
  }
 
  ChatBotToggle() {
    this.IsChatBot = this.IsChatBot?false:true
  }

 
}

