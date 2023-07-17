import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './sharedComponent/loader/loader.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sharedComponent/sidebar/sidebar.component';
import { NavbarComponent } from './sharedComponent/navbar/navbar.component';
import { TicketListComponent } from './ticket/ticket-list/ticket-list.component';
import { AddTicketComponent } from './ticket/add-ticket/add-ticket.component';
import { ViewTicketComponent } from './ticket/view-ticket/view-ticket.component';
import { TicketService } from '../services/ticketServices/ticketservcie.service';
import { AccountService } from '../services/accountServices/account-service.service';

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
    ViewTicketComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot()
  ],
  providers: [AccountService, TicketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
