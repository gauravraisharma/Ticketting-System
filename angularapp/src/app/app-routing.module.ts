
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TicketListComponent } from './ticket/ticket-list/ticket-list.component';
import { AddTicketComponent } from './ticket/add-ticket/add-ticket.component';
import { ViewTicketComponent } from './ticket/view-ticket/view-ticket.component';
import { authguardGuard } from '../services/AuthGuard/authguard.guard';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch:'full'
  },
  {
    path: 'login',
    component: LoginPageComponent,
     canActivate: [authguardGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authguardGuard]
  },
  {
    path: 'ticket',
    component: TicketListComponent,
    canActivate: [authguardGuard]
  },
  {
    path: 'addTicket',
    component: AddTicketComponent,
    canActivate: [authguardGuard]
  },
  {
    path: 'viewTicket/:id',
    component: ViewTicketComponent,
    canActivate: [authguardGuard]
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
