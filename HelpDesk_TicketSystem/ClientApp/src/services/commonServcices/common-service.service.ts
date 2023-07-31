import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) { }
  apiUrl = environment.apiBaseUrl;


  GetUserTypeDDList() {
    let url = `${this.apiUrl}Account/GetUserTypeListDD`;
    return this.http.get(url);
  }
  GetDepartmentDDList() {
    let url = `${this.apiUrl}Account/GetDepartmentListDD`;
    return this.http.get(url);
  }
  GetTotalDashboardCounts(userId: string,companyId:number) {
    let url = `${this.apiUrl}Tickets/GetTotalTicketCount/${userId}/${companyId}`;
    return this.http.get(url);
  }
}
