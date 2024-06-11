
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Helper {

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
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
  
  }

  loadChatbot() {
    // Check if the chatbot element already exists
    if (!document.querySelector('helpdesk-chatbot')) {
      // Create the chatbot element
      const chatbotElement = document.createElement('helpdesk-chatbot');
      chatbotElement.setAttribute('company-id', '1000');
      document.body.appendChild(chatbotElement);
  
      // Check if the script element already exists
      if (!document.querySelector('script[src="https://helpdesk.techbitsolutions.com/helpdesk-chatbot_v1.js"]')) {
        // Create the script element
        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://helpdesk.techbitsolutions.com/helpdesk-chatbot_v1.js';
        scriptElement.async = true;
        document.body.appendChild(scriptElement);
      }
    }
  }
  // checkLoginStatus() {
  //   var isTokenAvailable = (localStorage.getItem('token') != null && localStorage.getItem('token') != undefined);
  //   var isUserIdAvailable = (localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined);

  //   if (isTokenAvailable && isUserIdAvailable) {
  //     this.isUserLoggedIn = true;
  //   } else {
  //     this.isUserLoggedIn = false;
  //     this.loadChatbot(); // Load chatbot if user is not logged in
  //   }
  // }

}
