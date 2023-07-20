import { HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class APIInterceptor implements HttpInterceptor {

  auth_token = sessionStorage.getItem('token');
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (this.auth_token == null || this.auth_token == undefined) {
      return next.handle(request); 
    }
    debugger
    var body = request.body;
    if (body instanceof FormData) {
      const formRequest = request.clone({
        headers: new HttpHeaders({
          'Accept': '*/*',
          //'Content-Type': 'multipart/form-data',
          'Authorization': "Bearer " + this.auth_token,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Access-Control-Allow-Headers': 'origin,X-Requested-With,content-type,accept',
          'Access-Control-Allow-Credentials': 'true'
        })
      })
      return next.handle(formRequest);
    }
    const modifiedRequest = request.clone({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.auth_token
      })
    })
    return next.handle(modifiedRequest);
  }
}
