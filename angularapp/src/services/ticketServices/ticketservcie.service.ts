import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }
  apiUrl = "https://localhost:7287/api/"
  auth_token = sessionStorage.getItem('token');
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
       'Authorization': "Bearer "+this.auth_token
    })
  };
  createTicket(ticket: FormData) {
    debugger
    let url = `${this.apiUrl}Tickets/CreateTicket`;
    return this.http.post(url, ticket, {
      headers: new HttpHeaders({
        'Accept':'*/*',
        //'Content-Type': 'multipart/form-data',
        'Authorization': "Bearer " + this.auth_token,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'origin,X-Requested-With,content-type,accept',
        'Access-Control-Allow-Credentials': 'true' 
      })
    });
  }
  AddConversationMessage(conversationMessage: FormData) {
    debugger
    let url = `${this.apiUrl}Tickets/AddConversationMessage`;
    return this.http.post(url, conversationMessage, {
      headers: new HttpHeaders({
        'Accept':'*/*',
        //'Content-Type': 'multipart/form-data',
        'Authorization': "Bearer " + this.auth_token,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'origin,X-Requested-With,content-type,accept',
        'Access-Control-Allow-Credentials': 'true' 
      })
    });
  }
  GetTicket(userId:string) {
    let url = `${this.apiUrl}Tickets/GetTicket/${userId}`;
    return this.http.get(url, this.httpOptions);
  }

  GetTicketDataById(ticketId: number) {
    let url = `${this.apiUrl}Tickets/GetTicketDataById/${ticketId}`;
    return this.http.get(url, this.httpOptions);
  }

  CloseTicketStatusById(ticketId: number, userId: string, status: string) {
    let url = `${this.apiUrl}Tickets/ChangeTicketStatusById/${ticketId}/${userId}/${status}`;
    return this.http.get(url, this.httpOptions);
  }

  GetTicketConversationData(ticketId: number) {
    let url = `${this.apiUrl}Tickets/GetTicketConversationDataById/${ticketId}`;
    return this.http.get(url, this.httpOptions);
  }
  GetTotalTicketCount(userId:string) {
    let url = `${this.apiUrl}Tickets/GetTotalTicketCount/${userId}`;
    return this.http.get(url, this.httpOptions);
  }
}

export class ticketModel {
  subject: string = '';
  priority: string = '';
  description: string = '';
  createdBy: string = '';
}
