import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sharedComponent/sidebar/sidebar.component';
import { NavbarComponent } from './sharedComponent/navbar/navbar.component';
import { TicketService } from '../services/ticketServices/ticketservcie.service';
import { AccountService } from '../services/accountServices/account-service.service';
import { AnonymousLayoutComponent } from './sharedComponent/layouts/anonymous-layout/anonymous-layout.component';
import { AuthorizedLayoutComponent } from './sharedComponent/layouts/authorized-layout/authorized-layout.component';
import { RouterModule } from '@angular/router';
import { CommonService } from '../services/commonServcices/common-service.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { APIInterceptor } from '../services/apiInterceptor/api.interceptor';
import { SharedModule } from './sharedComponent/shared.module';
import { CompanyService } from '../services/companyService/company.service';
import { DashboardService } from '../services/dashboardService/dashboard.service';
import { HomepageComponent } from './homepage/homepage.component';
import { ChatService } from '../services/ChatService/chat.service';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { ChatBotComponent } from './sharedComponent/chat-bot/chat-bot.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    AnonymousLayoutComponent,
    AuthorizedLayoutComponent,
    PageNotFoundComponent,
    HomepageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    CommonModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    AccountService,
    TicketService,
    CommonService,
    CompanyService,
    DashboardService,
    ChatService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }

