import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';
import { ToastrModule } from 'ngx-toastr';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ChatService } from '../service/ChatService/chat.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { APIInterceptor } from '../../apiInterceptor/api.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
  providers: [ChatService, {
    provide: HTTP_INTERCEPTORS,
    useClass: APIInterceptor,
    multi: true
  }],
//  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private injector: Injector) {

  }
  ngDoBootstrap() {
    const element = createCustomElement(AppComponent, { injector: this.injector })
    customElements.define('helpdesk-chatbot', element);
  }
}
