import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }
  apiUrl = environment.apiBaseUrl;
  auth_token = localStorage.getItem('token');
 
  createTicket(ticket: FormData) {
    debugger
    let url = `${this.apiUrl}Tickets/CreateTicket`;
    return this.http.post(url, ticket);
  }
  AddConversationMessage(conversationMessage: FormData) {
    debugger
    let url = `${this.apiUrl}Tickets/AddConversationMessage`;
    return this.http.post(url, conversationMessage);
  }
  GetTicket(userId: string, companyId: number) {
    let url = `${this.apiUrl}Tickets/GetTicket/${userId}/${companyId}`;
    return this.http.get(url);
  }

  GetTicketDataById(ticketId: number) {
    let url = `${this.apiUrl}Tickets/GetTicketDataById/${ticketId}`;
    return this.http.get(url);
  }

  CloseTicketStatusById(ticketId: number, userId: string, status: string) {
    let url = `${this.apiUrl}Tickets/ChangeTicketStatusById/${ticketId}/${userId}/${status}`;
    return this.http.get(url);
  }

  GetTicketConversationData(ticketId: number) {
    let url = `${this.apiUrl}Tickets/GetTicketConversationDataById/${ticketId}`;
    return this.http.get(url);
  }
 
}

export class ticketModel {
  subject: string = '';
  priority: string = '';
  description: string = '';
  createdBy: string = '';
}
