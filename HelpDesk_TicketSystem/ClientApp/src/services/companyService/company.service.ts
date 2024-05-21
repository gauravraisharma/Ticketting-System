import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { registeredApplicationModel } from '../../app/authorizedView/settings/settings/settings.component';

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
  getCompanyRegisteredApplication(companyId: number) {
    let url = `${this.apiUrl}Company/GetCompanyRegisteredApplication/${companyId}`;
    return this.http.get(url);
  }
  registerCompanyApplication(application: RegisterCompanyApplication) {
    let url = `${this.apiUrl}Company/RegisterCompanyApplication`;
    return this.http.post(url, application);
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

export class RegisterCompanyApplication {
  applicationName: string = '';
  applicationURL: string = '';
  apiEndpoint: string = '';
  companyId: number = null;
}
