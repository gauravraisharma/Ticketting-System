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
  updateUser(user: UpdateApplicationUser) {
    let url = `${this.apiUrl}Account/updateApplicationUser`;
    return this.http.post(url, user);
  }
  getUserList(companyId:number) {
    let url = `${this.apiUrl}Account/GetUserList/${companyId}`;
    return this.http.get(url);
  }
  deleteUser(userId: string) {
    let url = `${this.apiUrl}Account/DeleteUser/${userId}`;
    return this.http.get(url);
  }
  getUserDataById(userId) {
    let url = `${this.apiUrl}Account/getUserDataById/${userId}`;
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
  companyId: number = null;
  userType: string = '';
  createdBy: string = '';
} 
export class UpdateApplicationUser {
  
  userId: string = '';
  firstName: string = '';
  lastName: string = '';
  userName: string = '';
  email: string = '';
  phoneNumber: string = '';
  departmentId: number = null;
  userType: string = '';
  modifiedBy: string = '';
} 
