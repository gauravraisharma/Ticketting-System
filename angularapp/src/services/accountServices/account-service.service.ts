import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }
  apiUrl ="https://localhost:7287/api/"
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  loginUser(userModel: any) {
    let url = `${this.apiUrl}Account/LoginUser`;
    return this.http.post(url, userModel, this.httpOptions);
  }
  GetTicket() {
    let url = `${this.apiUrl}Tickets`;
    return this.http.get(url,this.httpOptions);
  }

}
