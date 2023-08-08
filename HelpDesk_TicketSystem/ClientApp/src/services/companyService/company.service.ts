import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) {
  }
  apiUrl = environment.apiBaseUrl;

  registerCompany(userModel: RegisterCompanyUser) {
    let url = `${this.apiUrl}Company/RegisterCompany`;
    return this.http.post(url, userModel);
  }
  getCompaany() {
    let url = `${this.apiUrl}Company/GetCompany`;
    return this.http.get(url);
  }
  updateTimeZone(timeZoneModel: UpdateTimeZone) {
    let url = `${this.apiUrl}Company/UpdateTimeZone`;
    return this.http.post(url, timeZoneModel);
  }
 
}
export class RegisterCompanyUser {

  firstName: string = '';
  lastName: string = '';
  userName: string = '';
  companyName: string = '';
  email: string = '';
  phoneNumber: string = '';
  password: string = "";
}
export class UpdateTimeZone {
  companyId: number = null;
  timeZone: string = '';
}
