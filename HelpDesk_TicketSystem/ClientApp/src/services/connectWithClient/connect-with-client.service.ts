import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ConnectWithClientService {

  constructor(private http: HttpClient) {
  }
  apiUrl = environment.apiBaseUrl;

  connectWithClient(clientRequest: ClientRequest): Observable<any> {
    localStorage.clear();
    let url = `${this.apiUrl}ExternalAuthorization/ConnectWithClient`;
    return this.http.post(url, clientRequest);
  }
}
export class ClientRequest {

  accessToken: string = '';
  applicationName: string = '';
  clientHostURL: string = '';
}

