import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { chatMessage, ChatService, ChatUser } from '../../../../services/ChatService/chat.service';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../../environments/environment';
import { Observable, Observer } from 'rxjs';
import { Toast, ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainerMessage', { static: false }) scrollContainerMessage: ElementRef;
  @ViewChild('scrollContainerUsers', { static: false }) scrollContainerUsers: ElementRef;

  currentTimeZone: string = localStorage.getItem('timeZone');
  private hubConnection: signalR.HubConnection;
  chatMessages: ChatMessage[] = [];
  messageToSend = '';
  userList: ChatUser[] = [];
  chatRoomId: string = null;
  chatList = [];
  companyId = localStorage.getItem('companyId');
  isLoading = false;
  constructor(
    private chatService: ChatService,
    private toaster: ToastrService,

  ) {
    this.hubConnection = this.chatService.getConnection();
    this.hubConnection.on('responseFormClient', (message: string, chatRoomId: string, companyId: string, departmentId: string) => {
      if (companyId == this.companyId) {
        if (chatRoomId == this.chatRoomId) {
          this.chatMessages.push({
            isIncoming: true, message: message,
            createdOn: this.GetCurrentUtcDateTime().toString()
          });
          this.scrollToBottom();
        }
      }
    });

    this.hubConnection.on('newUserChat', this.GetChatUserDetailsByChatRoomId);

    this.hubConnection.on('NewMessageFromCLient', (chatRoomId: string, companyId: string, departmentId: string) => {
      if (companyId == this.companyId) {
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
          this.userList[userFoundIndex].unReadMessageCount += 1
          this.userList.splice(0, 0, this.userList[userFoundIndex]);
          this.userList.splice(userFoundIndex + 1, 1);
        }
      }
    });
  }

  ngOnInit() {
    this.GetChatUserList();
  }

  GetChatUserDetailsByChatRoomId = (ChatRoomId: number, companyId: number) => {
    if (companyId.toString() == localStorage.getItem('companyId')) {
      this.chatService.GetChatUserDetailsByChatRoomId(ChatRoomId).subscribe((response: ChatUser) => {
        this.userList.unshift(response);
        this.scrollToTop();
      })
    }
  }

  GetChatUserList() {
    this.isLoading = true;
    this.chatService.GetChatUserList(parseInt(this.companyId)).subscribe((response: ChatUser[]) => {
      this.userList = response;
      this.isLoading = false;
    }, (errorn) => {
      this.toaster.error('Something went wrong')
      this.isLoading = false;
    })
  }


  GetCurrentUtcDateTime() {
    return new Date(Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getSeconds(),
      new Date().getMilliseconds()
    ));


  }
  SendMessageToUser(): void {
    if (this.messageToSend != null && this.messageToSend != undefined && this.messageToSend.trim() != '') {
      let chatmessage: chatMessage = {
        chatRoomId: this.chatRoomId.toString(),
        message: this.messageToSend,
        userId: localStorage.getItem('userId')
      }
      this.hubConnection.invoke('SendMessageToUser', chatmessage).then(() => {
        this.chatMessages.push({
          isIncoming: false,
          message: this.messageToSend,
          createdOn: this.GetCurrentUtcDateTime().toString()
        });
        this.messageToSend = '';
        this.scrollToBottom();
      })
        .catch(err => console.error(err));
    }
  }
  chatUserSelected(user: ChatUser) {
    this.isLoading = true;
    if (this.chatRoomId == user.chatRoomId) {
      this.isLoading = false;
      return;
    }
    this.chatService.GetUserChatMessageList(parseInt(user.chatRoomId)).subscribe((response: any) => {
      this.chatMessages = response.map((chat): ChatMessage => {
        return {
          isIncoming: (chat.userType == 'ADMIN') ? false : true,
          message: chat.message,
          createdOn: chat.createdOn
        }
      });
      let userFoundIndex = this.userList.findIndex((userItem) => { return userItem.chatRoomId == user.chatRoomId })
      if (userFoundIndex != -1) {
        this.userList[userFoundIndex].unReadMessageCount = 0
      }
      this.chatRoomId = user.chatRoomId
      this.scrollToBottom();
      this.isLoading = false;
    }, (error) => {
      this.toaster.error("Something went wrong, Please try after sometime.")
      this.isLoading = false;
    })

  }

  scrollToTop(): void {
    const element = this.scrollContainerUsers.nativeElement;
    const duration = 500; // Animation duration in milliseconds

    this.animateScroll(element, 0, duration).subscribe();
  }


  scrollToBottom(): void {
    const element = this.scrollContainerMessage.nativeElement;
    const duration = 500; // Animation duration in milliseconds

    this.animateScroll(element, element.scrollHeight, duration).subscribe();
  }
  animateScroll(element: HTMLElement, to: number, duration: number): Observable<number> {
    const start = element.scrollTop;
    const change = to - start;
    const startTime = performance.now();

    return new Observable((observer: Observer<number>) => {
      const animateScroll = (timestamp: number) => {
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        element.scrollTop = start + change * easedProgress;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          observer.complete();
        }
      };

      requestAnimationFrame(animateScroll);
    });
  }

  ngOnDestroy(): void {
    if (this.chatRoomId != null && this.chatRoomId != undefined && this.chatRoomId != '') {
      this.hubConnection.invoke('LeaveChatRoom', this.chatRoomId.toString())
    }
    this.chatService.closeConnection('responseFormClient');
  }
}

// Easing function for smooth animation
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
export interface ChatMessage {
  isIncoming: boolean;
  message: string;
  createdOn: string
}
