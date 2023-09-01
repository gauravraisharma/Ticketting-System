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

  GetChartDataByDepartment(userId: string, userType: string ,companyId: number) {
    let url = `${this.apiUrl}Dashboard/GetChartDataByDepartment/${userId}/${userType}/${companyId}`;
      return this.http.get(url);
    }
  GetAllTicketsWithPriority(userId: string, userType: string,companyId: number) {
    let url = `${this.apiUrl}Dashboard/GetAllTicketsWithPriority/${userId}/${userType}/${companyId}`;
    return this.http.get(url);
  }
  GetAllTicketCreated(startDate: string, endDate: string, userId: string, companyId: number) {
    let url = `${this.apiUrl}Dashboard/GetAllTicketCreated/${userId}/${companyId}/${startDate}/${endDate}`;
    return this.http.get(url);
  }
}
