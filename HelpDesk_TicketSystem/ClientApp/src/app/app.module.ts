import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './sharedComponent/loader/loader.component';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sharedComponent/sidebar/sidebar.component';
import { NavbarComponent } from './sharedComponent/navbar/navbar.component';
import { TicketService } from '../services/ticketServices/ticketservcie.service';
import { AccountService } from '../services/accountServices/account-service.service';
import { TicketListComponent } from './authorizedView/ticket/ticket-list/ticket-list.component';
import { DashboardComponent } from './authorizedView/dashboard/dashboard.component';
import { AddTicketComponent } from './authorizedView/ticket/add-ticket/add-ticket.component';
import { ViewTicketComponent } from './authorizedView/ticket/view-ticket/view-ticket.component';
import { AddUserComponent } from './authorizedView/userManagement/add-user/add-user.component';
import { UserlistingComponent } from './authorizedView/userManagement/userlisting/userlisting.component';
import { AnonymousLayoutComponent } from './sharedComponent/layouts/anonymous-layout/anonymous-layout.component';
import { AuthorizedLayoutComponent } from './sharedComponent/layouts/authorized-layout/authorized-layout.component';
import { RouterModule } from '@angular/router';
import { CommonService } from '../services/commonServcices/common-service.service';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { APIInterceptor } from '../services/apiInterceptor/api.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoaderComponent,
    DashboardComponent,
    SidebarComponent,
    NavbarComponent,
    TicketListComponent,
    AddTicketComponent,
    ViewTicketComponent,
    AddUserComponent,
    UserlistingComponent,
    AnonymousLayoutComponent,
    AuthorizedLayoutComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    CKEditorModule,
    ToastrModule.forRoot()
  ],
  providers: [AccountService, TicketService, CommonService, {
    provide: HTTP_INTERCEPTORS,
    useClass: APIInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
