import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private isVisible = new BehaviorSubject<boolean>(true);

  isVisible$ = this.isVisible.asObservable();

  setVisibility(visible: boolean): void {
    localStorage.setItem('chatbotVisible', JSON.stringify(visible));
    this.isVisible.next(visible);
  }

  getVisibility(): boolean {
    const visibility = localStorage.getItem('chatbotVisible');
    return visibility ? JSON.parse(visibility) : true;
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
 
}



