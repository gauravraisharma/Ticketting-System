import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection: signalR.HubConnection;
  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.socketUrl + environment.sockeytEndPointNotify) 
      .build();

    this.hubConnection.start().then(() => {
      console.log('SignalR connection started');
    }).catch(err => console.error('Error while starting SignalR connection:', err));
  }

  getConnection(): signalR.HubConnection {
    return this.hubConnection;
  }

  closeConnection(invokedMethod:string) {
    this.hubConnection.off(invokedMethod);
  }
 }
