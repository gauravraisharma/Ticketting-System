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
  createUser(user: ApplicationUser) {
    let url = `${this.apiUrl}Account/CreateApplicationUser`;
    return this.http.post(url, user,this.httpOptions);
  }
  getUserList() {
    let url = `${this.apiUrl}Account/GetUserList`;
    return this.http.get(url,this.httpOptions);
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
