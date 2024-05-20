
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Helper {

  setDataInLocalStorage(token: string, userType: string, userId: string, companyId: any, timeZone: string, rememberMe: string) {
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

  }
}
