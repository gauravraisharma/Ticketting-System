import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChatService, ChatUserModel, chatMessage, chatMessageFromClient } from '../service/ChatService/chat.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit, OnDestroy {

  @Input() companyId: string;
  IsChatBot = false;
  IsUserDataSubmited = false;

  chatMessages: ChatMessage[] = [];

  chatForm = this.fb.group({
    name: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    department: ['', [Validators.required]],
  });
  messageToSend: string = '';
  isLoading = false;
  private hubConnection: signalR.HubConnection;

  DDDepartmentList: any = [];
  chatRoomId = '';
  userId = null;
    departmentId = '';
    errorSummary=""
  constructor(private fb: FormBuilder,
    private chatService: ChatService) {
    this.hubConnection = this.chatService.getConnection();

    this.hubConnection.on('responseFormAdmin', this.OnResponseFromAdmin);

  }
  ngOnInit() {

      this.GetDepartmentDDList();
     // this.companyId = '1000';
  }

  OnResponseFromAdmin = (message: string) => {
    this.chatMessages.push({ isIncoming: true, message: message });
  }
  GetDepartmentDDList() {
    this.isLoading = false;
    this.chatService.GetDepartmentDDList().subscribe((response: any) => {
      console.log('GetUserTypeDDList', response)
      this.DDDepartmentList = response;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }

  ChatBotToggle() {
    this.IsChatBot = this.IsChatBot ? false : true
  }
  submitchatForm() {
    if (this.chatForm.valid) {
      let chatData: ChatUserModel = {
        name: this.chatForm.get('name').value,
        email: this.chatForm.get('email').value,
        phoneNumber: parseInt(this.chatForm.get('phoneNumber').value),
        departmentId: this.chatForm.get('department').value,
        companyId: parseInt( this.companyId)
      }
      this.departmentId = this.chatForm.get('department').value;
      this.chatService.SaveChatUserData(chatData).subscribe((response: any) => {
        if (response.status == 'SUCCEED') {
          console.log(response)
          this.chatRoomId = response.chatRoomId.toString();
          this.userId = response.userId;
          this.hubConnection.invoke('joinChatRoom', this.chatRoomId).then(() => {

            this.IsUserDataSubmited = true;
          }).catch((error) => {
              this.TimerErrorSummary(error)
          })

        }
      }, (error) => {
          this.TimerErrorSummary('Something went wrong, We will soon connect with you.')
         
               })

    } else {
        this.chatForm.markAllAsTouched(); 
        this.TimerErrorSummary("Please enter valid data")

      this.isLoading = false;
    }
    }

    TimerErrorSummary(message) {
        this.errorSummary = message;
        setTimeout(() => {
            this.errorSummary = '';
        }, 3000)

    }
  sendMessageToAdmin(): void {
    if (this.messageToSend != null && this.messageToSend != undefined && this.messageToSend.trim() != '') {
      debugger
      let chatmessage: chatMessageFromClient = {
        chatRoomId: this.chatRoomId,
        message: this.messageToSend,
        userId: this.userId,
        companyId: this.companyId,
       departmentId: this.departmentId

      }
      this.hubConnection.invoke('sendMessageToAdmin', chatmessage).then(() => {
        this.chatMessages.push({ isIncoming: false, message: this.messageToSend });
        this.messageToSend = '';
        console.log(this.chatMessages)
      })
        .catch(err => console.error(err));
      }
    else {
        this.TimerErrorSummary('Please enter message')
      }
  }
  ngOnDestroy(): void {
    this.hubConnection.invoke('LeaveChatRoom', this.chatRoomId)
    this.chatService.closeConnection('responseFormAdmin');
  }
}

export interface ChatMessage {
  isIncoming: boolean;
  message: string;
}

