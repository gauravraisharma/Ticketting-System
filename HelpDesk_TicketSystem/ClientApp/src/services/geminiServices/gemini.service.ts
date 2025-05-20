import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  apiUrl = environment.apiBaseUrl; // e.g., http://localhost:5000/api/

  constructor(private http: HttpClient) { }

  transformTone(message: string, tone: string): Observable<any> {
    const url = `${this.apiUrl}Gemini/transform`;
    return this.http.post(url, { message, tone });
  }
getSuggestedReply(requestData: { conversationThread: string[], initiatorRole: string }): Observable<any> {
  const url = `${this.apiUrl}Gemini/suggest-reply`;
  return this.http.post(url, requestData);
}
transformPromptedMessage(originalMessage: string, prompt: string,tone:string): Observable<any> {
  const url = `${this.apiUrl}Gemini/transform-prompted-message`;
  return this.http.post(url, { originalMessage, prompt, tone });
}
getConversationSummary(ticketId: number): Observable<{ summary: string }> {
  const url = `${this.apiUrl}Gemini/summary/${ticketId}`;
  return this.http.get<{ summary: string }>(url);
}


}
