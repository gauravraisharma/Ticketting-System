import { Component, OnDestroy, OnInit } from '@angular/core';
import { chatMessage, ChatService, ChatUser } from '../../../../services/ChatService/chat.service';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, OnDestroy {

  private hubConnection: signalR.HubConnection;
  chatMessages: ChatMessage[] = [];
  messageToSend = '';
  userList: ChatUser[] = [];
  chatRoomId: string = null;
  chatList = [];
  constructor(private chatService: ChatService) {
    debugger
    this.hubConnection = this.chatService.getConnection();
    this.hubConnection.on('responseFormClient', (message: string) => {
      this.chatMessages.push({ isIncoming: true, message: message });
    });

    this.hubConnection.on('newUserChat', this.GetChatUserDetailsByChatRoomId);

    this.hubConnection.on('NewMessageFromCLient', (chatRoomId: string) => {
      //Check if chatroom is already present or not
      let userFoundIndex = this.userList.findIndex((user) => { return user.chatRoomId == chatRoomId })

      //if not  hit the api to get new users data
      if (userFoundIndex == -1) {

      }
      //if present increase the count 
      else {
        if (this.chatRoomId == chatRoomId) {
          return;
        }
        this.userList[userFoundIndex].unReadMessageCount+=1
      }
    });
  }

  ngOnInit() {
    this.GetChatUserList();
  }


  GetChatUserDetailsByChatRoomId =(ChatRoomId: number) => {
  this.chatService.GetChatUserDetailsByChatRoomId(ChatRoomId).subscribe((response: ChatUser) => {

    console.log('response', response)
    this.userList.push(response);
    console.log(' this.userList', this.userList)
  })
}

  GetChatUserList() {
    this.chatService.GetChatUserList().subscribe((response: ChatUser[]) => {
      this.userList = response;
    })
  } 



  SendMessageToUser(): void {
    if (this.messageToSend != null && this.messageToSend != undefined && this.messageToSend.trim() != '') {
      let chatmessage: chatMessage = {
        chatRoomId: this.chatRoomId.toString(),
        message: this.messageToSend,
        userId: localStorage.getItem('userId')
      }
      this.hubConnection.invoke('SendMessageToUser', chatmessage).then(() => {
        this.chatMessages.push({ isIncoming: false, message: this.messageToSend });
        this.messageToSend = '';
      })
        .catch(err => console.error(err));
    }
  }
  chatUserSelected(user: ChatUser) {
    if (this.chatRoomId == user.chatRoomId) {
      return;
    }
    this.chatService.GetUserChatMessageList(parseInt(user.chatRoomId)).subscribe((response: any) => {
      this.chatMessages = response.map((chat): ChatMessage => {
        return {
          isIncoming:(chat.userType == 'ADMIN') ? false : true,
          message:chat.message
        }
      });
      let userFoundIndex = this.userList.findIndex((userItem) => { return userItem.chatRoomId == user.chatRoomId })
      if (userFoundIndex != -1) {
        this.userList[userFoundIndex].unReadMessageCount = 0
      }
      this.chatRoomId = user.chatRoomId
    })
  }

  ngOnDestroy(): void {
    this.hubConnection.invoke('LeaveChatRoom', this.chatRoomId)
    this.chatService.closeConnection('responseFormClient');
  }
}

export interface ChatMessage {
  isIncoming: boolean;
  message: string;
}
