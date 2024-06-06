import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private defaultLogo: string = '../../assets/images/Logo-White@1x.png';
  private logoUrl = new BehaviorSubject<string>(this.defaultLogo);

  constructor(private http: HttpClient) {
    const companyLogo = localStorage.getItem('companyLogo');
    if (companyLogo && companyLogo !== 'null') {
      this.logoUrl.next(companyLogo);
    }
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
  uploadCompanyLogo(companyLogo: FormData) {
    let url = `${this.apiUrl}Company/UploadCompanyLogo`;
    return this.http.post(url, companyLogo);

  }
  observeCompanyLogoChange(): Observable<string> {
    return this.logoUrl.asObservable();
  }

  updateCompanyLogo(newValue: string): void {
    localStorage.setItem('companyLogo', newValue);
    this.logoUrl.next(newValue);
  }
  deleteApplication(id: number) {
    let url = `${this.apiUrl}Company/DeleteApplication/${id}`;
    return this.http.delete(url);
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
