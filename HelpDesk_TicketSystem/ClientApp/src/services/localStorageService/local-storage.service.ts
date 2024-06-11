import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  setDataInLocalStorage(token: string, userType: string, userId: string, companyId: any, timeZone: string, rememberMe: string, companyLogo: string, name: string, compnanyName: string, isExternalUser : string, primaryColor:string, secondaryColor:string) {
    localStorage.clear();
    localStorage.setItem('token', token);
    localStorage.setItem('loggedInTime', Date.now().toString());
    localStorage.setItem('userType', userType.toUpperCase());
    localStorage.setItem('userId', userId);
    localStorage.setItem('timeZone', (timeZone == null) ? '' : timeZone);
    localStorage.setItem('isRememberMe', rememberMe);
    if (userType.toUpperCase() != 'SUPERADMIN') {
      localStorage.setItem('companyId', companyId.toString());
    }
    localStorage.setItem('companyLogo', (companyLogo == null) ? null : companyLogo)
    localStorage.setItem('name', name)
    localStorage.setItem('companyName', compnanyName)
    localStorage.setItem('isExternalUser', isExternalUser)
    localStorage.setItem('primaryColor', (primaryColor == undefined) ? null : primaryColor);
    localStorage.setItem('secondaryColor', (secondaryColor == undefined) ? null : secondaryColor);
  
  }
}



