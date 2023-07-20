import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {
    console.log('environmenttest',environment.test)
  }
  apiUrl = environment.apiBaseUrl;
 
  loginUser(userModel: any) {
    let url = `${this.apiUrl}Account/LoginUser`;
    return this.http.post(url, userModel);
  }
  createUser(user: ApplicationUser) {
    let url = `${this.apiUrl}Account/CreateApplicationUser`;
    return this.http.post(url, user);
  }
  getUserList() {
    let url = `${this.apiUrl}Account/GetUserList`;
    return this.http.get(url);
  }

}
export class ApplicationUser {
  
  firstName: string = '';
  lastName: string = '';
  userName: string = '';
  email: string = '';
  phoneNumber: string = '';
  password: string = "";
  departmentId: number = null;
  userType: string = '';
  createdBy: string = '';
} 
