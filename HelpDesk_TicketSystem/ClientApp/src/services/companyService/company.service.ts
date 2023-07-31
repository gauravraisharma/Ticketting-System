import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) {
    console.log('environmenttest',environment.test)
  }
  apiUrl = environment.apiBaseUrl;

  registerCompany(userModel: RegisterCompanyUser) {
    let url = `${this.apiUrl}Company/RegisterCompany`;
    return this.http.post(url, userModel);
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
