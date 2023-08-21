import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {
  }
  apiUrl = environment.apiBaseUrl;

  GetCompanyCount() {
    let url = `${this.apiUrl}Dashboard/GetCompanyCount`;
    return this.http.get(url);
  }

    GetUserAndTicketCount(userId: string, companyId: number) {
      let url = `${this.apiUrl}Dashboard/GetUserAndTicketCount/${userId}/${companyId}`;
      return this.http.get(url);
    }
  GetAllTicketsWithPriority(userId: string, companyId: number) {
    let url = `${this.apiUrl}Dashboard/GetAllTicketsWithPriority/${userId}/${companyId}`;
    return this.http.get(url);
  }
}
