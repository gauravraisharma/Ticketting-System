import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection: signalR.HubConnection;
  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.socketUrl + environment.sockeytEndPointNotify,{
        withCredentials: false // Configure withCredentials here
      }) 
      .build();

    this.hubConnection.start().then(() => {
      console.log('connected with hub')
    }).catch(err => console.error('Error while starting SignalR connection:', err));
  }

  apiUrl = environment.apiBaseUrl;

  getConnection(): signalR.HubConnection {
    return this.hubConnection;
  }

  closeConnection(invokedMethod:string) {
    this.hubConnection.off(invokedMethod);
  }

  SaveChatUserData(chatUserdata: ChatUserModel) {
    let url = `${this.apiUrl}Chat/RegisterChatUser`;
    return this.http.post(url, chatUserdata);
  }
  GetChatUserList() {
    let url = `${this.apiUrl}Chat/GetChatUsers`;
    return this.http.get(url);
  }
  GetUserChatMessageList(ChatRoomId:number) {
    let url = `${this.apiUrl}Chat/GetChatByRoomId/${ChatRoomId}`;
    return this.http.get(url);
  }

  GetChatUserDetailsByChatRoomId(ChatRoomId: number) {
    let url = `${this.apiUrl}Chat/GetChatUserDetailsByChatRoomId/${ChatRoomId}`;
    return this.http.get(url);
  }
  GetDepartmentDDList() {
    let url = `${this.apiUrl}Account/GetDepartmentListDD`;
    return this.http.get(url);
  }
 }


export interface chatMessage {
  message: string;
  chatRoomId: string;
  userId: string;
}
export interface chatMessageFromClient {
  message: string;
  chatRoomId: string;
  userId: string;
  companyId: string;
  departmentId: string;
}
export interface ChatUserModel {
  name: string;
  phoneNumber: number;
  email: string;
  departmentId: string;
  companyId:number
}
export interface ChatUser {
  chatUserId: string;
  chatUserName: string;
  phoneNumber: number;
  email: string;
  departmentId: string;
  chatRoomId: string;
  unReadMessageCount: number;
}
