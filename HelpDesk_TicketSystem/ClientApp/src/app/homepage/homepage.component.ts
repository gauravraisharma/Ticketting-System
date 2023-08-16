import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';  
import { chatMessage, ChatService, ChatUserModel } from '../../services/ChatService/chat.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/commonServcices/common-service.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {

  IsChatBot = true;
  IsUserDataSubmited = false;

  chatMessages: ChatMessage[] = [];

  chatForm = this.fb.group({
    name: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    department: ['', [Validators.required]],
  });
  messageToSend: string = '';
  isLoading = false;
  private hubConnection: signalR.HubConnection;
  DDDepartmentList: any = [];
  chatRoomId = '1110111';
  userId = null;

  constructor(private router: Router,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private commonService:CommonService,
    private meta: Meta,  private chatService: ChatService) {
    this.hubConnection = this.chatService.getConnection();

    this.hubConnection.on('responseFormAdmin', this.OnResponseFromAdmin);
   
  }

  ngOnInit() {
    this.addMetaTags();
    this.GetDepartmentDDList();
   
  }

  OnResponseFromAdmin=(message: string)=> {
    this.chatMessages.push({ isIncoming: true, message: message });
}
  GetDepartmentDDList() {
    this.isLoading = false;
    this.commonService.GetDepartmentDDList().subscribe((response: any) => {
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
        departmentId: this.chatForm.get('department').value
      }
      this.chatService.SaveChatUserData(chatData).subscribe((response: any) => {
        if (response.status == 'SUCCEED') {
          console.log(response)
          this.chatRoomId = response.chatRoomId.toString();
          this.userId = response.userId;
          this.hubConnection.invoke('joinChatRoom', this.chatRoomId).then(() => {

            this.IsUserDataSubmited = true;
          }).catch((error) => {
            this.toaster.error(error);
          })

        }
      }, (error) => {

        this.toaster.error('Something went wrong, We will soon connect with you.')
      })
   
    } else {
      this.toaster.error("Please enter valid data");
      this.isLoading = false;
    }
  }
  sendMessageToAdmin(): void {
    if (this.messageToSend != null && this.messageToSend != undefined && this.messageToSend.trim() != '') {
      debugger
      let chatmessage: chatMessage = {
        chatRoomId:this.chatRoomId,
        message:this.messageToSend,
        userId: this.userId
      }
      this.hubConnection.invoke('sendMessageToAdmin', chatmessage).then(() => {
        this.chatMessages.push({ isIncoming: false, message: this.messageToSend });
        this.messageToSend = '';
        console.log(this.chatMessages)
      })
        .catch(err => console.error(err));
    }
  }

  gotoLoginPage() {
    this.router.navigate(['user-authenticaton/login'])
  }

  gotoSignUpPage() {
    this.router.navigate(['user-authenticaton/signup'])
  }


  addMetaTags() {
    this.meta.addTag({ name: 'description', content: 'Helps Industries to handle their customer support with a automatic ticketing management system' });
    this.meta.addTag({ name: 'og:title', content: 'HelpDesk - Techbit Solutions' });
    this.meta.addTag({ name: 'og:image', content: 'https://helpdesk.techbitsolutions.com/assets/images/online-communication.gif' });
    this.meta.addTag({ name: 'og:description', content: 'Helps Industries to handle their customer support with a automatic ticketing management system' });
    this.meta.addTag({ name: 'og:url', content: 'https://helpdesk.techbitsolutions.com/' });

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
export interface DDList {
  id: string;
  lable: string;
}
