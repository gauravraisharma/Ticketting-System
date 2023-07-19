import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) { }
  apiUrl = "https://localhost:7287/api/"
  auth_token = sessionStorage.getItem('token');
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.auth_token
    })
  };

  GetUserTypeDDList() {
    let url = `${this.apiUrl}Account/GetUserTypeListDD`;
    return this.http.get(url, this.httpOptions);
  }
  GetDepartmentDDList() {
    let url = `${this.apiUrl}Account/GetDepartmentListDD`;
    return this.http.get(url, this.httpOptions);
  }
  GetTotalDashboardCounts(userId: string) {
    let url = `${this.apiUrl}Tickets/GetTotalTicketCount/${userId}`;
    return this.http.get(url, this.httpOptions);
  }
}
